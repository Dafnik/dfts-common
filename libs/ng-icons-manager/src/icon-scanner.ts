import { FileSystemAdapter, IconScannerConfig, Logger, ModuleResolver, ScanResult } from './types';

export class IconScanner {
  constructor(
    private fs: FileSystemAdapter,
    private moduleResolver: ModuleResolver,
    private logger: Logger,
    public cachedIcons: Set<string> | undefined = undefined,
  ) {}

  private config!: IconScannerConfig;

  async scanAndCopy(config: IconScannerConfig): Promise<ScanResult> {
    this.config = config;

    const scanResult = this.scanFiles();

    if (this.config.verbose) {
      this.logger.log(`📦 Used icons: ${[...scanResult.usedIcons].join(', ')}`);
    }

    const isFirstWatchRun = this.config.watchMode && this.cachedIcons === undefined;

    this.setupOutputDirectory(isFirstWatchRun);

    if (!this.config.watchMode) {
      const writeResultErrors = await this.writeIconsBulk(scanResult.usedIcons);
      return {
        usedIcons: scanResult.usedIcons,
        errors: [...scanResult.errors, ...writeResultErrors],
      };
    }

    if (isFirstWatchRun) {
      const writeResultErrors = await this.writeIconsBulk(scanResult.usedIcons);
      this.cachedIcons = new Set(scanResult.usedIcons);
      return {
        usedIcons: scanResult.usedIcons,
        errors: [...scanResult.errors, ...writeResultErrors],
      };
    }

    const writeResultErrors = await this.handleIncrementalUpdate(scanResult.usedIcons);
    return {
      usedIcons: scanResult.usedIcons,
      errors: [...scanResult.errors, ...writeResultErrors],
    };
  }

  private scanFiles(): ScanResult {
    const files = this.fs.glob(this.config.srcGlob);
    const usedIcons = new Set<string>();
    const errors: string[] = [];

    for (const file of files) {
      try {
        const content = this.fs.readFile(file);
        const isHtmlFile = file.endsWith('.html');

        // Extract icons from comments
        const commentedIcons = this.extractIconsFromComments(content, isHtmlFile);
        commentedIcons.forEach((icon) => usedIcons.add(icon));

        // Extract icons from regular content
        let match: RegExpExecArray | null;
        const regex = new RegExp(this.config.iconRegex);

        while ((match = regex.exec(content)) !== null) {
          usedIcons.add(match[1]);
        }
      } catch (error) {
        errors.push(`Failed to read file ${file}: ${error}`);
      }
    }

    return { usedIcons, errors };
  }

  private extractIconsFromComments(content: string, isHtmlFile: boolean): Set<string> {
    const icons = new Set<string>();

    if (isHtmlFile) {
      // Extract HTML comments: <!-- i(...) -->
      const htmlCommentRegex = /<!--\s*([\s\S]*?)\s*-->/g;
      let match: RegExpExecArray | null;

      while ((match = htmlCommentRegex.exec(content)) !== null) {
        this.extractIconsFromCommentContent(match[1], icons);
      }
    } else {
      // Extract TypeScript/JavaScript comments: /** i(...) */ or /* i(...) */
      const tsCommentRegex = /\/\*\*?([\s\S]*?)\*\//g;
      let match: RegExpExecArray | null;

      while ((match = tsCommentRegex.exec(content)) !== null) {
        this.extractIconsFromCommentContent(match[1], icons);
      }
    }

    return icons;
  }

  private extractIconsFromCommentContent(content: string, icons: Set<string>): void {
    // Match i(icon1, icon2, ...) patterns
    const iconCallRegex = /i\(([^)]+)\)/g;
    let match: RegExpExecArray | null;

    while ((match = iconCallRegex.exec(content)) !== null) {
      // Split by comma and trim whitespace
      const iconNames = match[1]
        .split(',')
        .map((name) => name.trim())
        .filter(Boolean);

      iconNames.forEach((icon) => icons.add(icon));
    }
  }

  private setupOutputDirectory(isFirstWatchRun: boolean): void {
    if (!this.config.watchMode || isFirstWatchRun) {
      if (this.fs.exists(this.config.outDir)) {
        this.fs.removeDirectory(this.config.outDir);
      }
      this.fs.createDirectory(this.config.outDir);
    } else {
      this.fs.createDirectory(this.config.outDir);
    }
  }

  private async handleIncrementalUpdate(usedIcons: Set<string>): Promise<string[]> {
    const toAdd = this.diff(usedIcons, this.cachedIcons!);
    const toRemove = this.diff(this.cachedIcons!, usedIcons);

    if (this.config.verbose) {
      this.logger.log(`🔁 Diff — add: ${toAdd.size}, remove: ${toRemove.size}`);
    }

    const errors: string[] = [];

    // Remove unused icons
    for (const icon of toRemove) {
      try {
        this.fs.removeFile(`${this.config.outDir}/${icon}.svg`);
        if (this.config.verbose) {
          this.logger.log(`🗑 Removed ${icon}.svg`);
        }
      } catch (error) {
        errors.push(`Failed to remove ${icon}.svg: ${error}`);
      }
    }

    // Add new icons
    const addResultErrors = await this.writeIconsBulk(toAdd);
    errors.push(...addResultErrors);

    this.cachedIcons = new Set(usedIcons);

    return errors;
  }

  private async writeIconsBulk(icons: Set<string>): Promise<string[]> {
    const errors: string[] = [];

    for (const icon of icons) {
      const prefix = icon.match(/^[a-z]+/)?.[0];
      const pkg = prefix ? this.config.iconMap[prefix] : undefined;

      if (!pkg) {
        const error = `Package "${prefix}" not found`;
        errors.push(error);
        this.logger.error(`❌ ${error}`);

        continue;
      }

      try {
        const mod = await this.moduleResolver.resolve(pkg);
        const svg = mod[icon];

        if (!svg) {
          const error = `Icon "${icon}" not found in ${pkg}`;
          errors.push(error);
          this.logger.error(`❌ ${error}`);

          continue;
        }

        this.fs.writeFile(`${this.config.outDir}/${icon}.svg`, svg);

        if (this.config.verbose) {
          this.logger.log(`✔ Wrote ${icon}.svg`);
        }
      } catch (error) {
        const errorMsg = `Failed to import ${icon} from ${pkg}: ${error}`;
        errors.push(errorMsg);
        this.logger.error(`❌ ${errorMsg}`);
      }
    }

    return errors;
  }

  private diff(a: Set<string>, b: Set<string>): Set<string> {
    const result = new Set<string>();
    for (const item of a) {
      if (!b.has(item)) {
        result.add(item);
      }
    }
    return result;
  }

  resetCache(): void {
    this.cachedIcons = undefined;
  }
}
