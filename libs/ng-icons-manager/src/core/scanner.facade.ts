import { DEFAULT_CONFIG } from '../config';
import { FileSystemAdapter, IconScannerConfig, IconScannerRunOptions, Logger, ModuleResolver, ScanResult } from '../types';
import { IconCache } from './cache.service';
import { IconScanner } from './icon-scanner';

export class ScannerFacade {
  private cache = new IconCache();
  private scanner: IconScanner;

  constructor(
    private fs: FileSystemAdapter,
    private resolver: ModuleResolver,
    private logger: Logger,
  ) {
    this.scanner = new IconScanner(fs);
  }

  resetCache(): void {
    this.cache.clear();
  }

  async scanAndCopy(options: IconScannerRunOptions, _config?: IconScannerConfig): Promise<ScanResult> {
    const config = { ...DEFAULT_CONFIG, ..._config };

    const result = this.scanner.scanFiles(config.srcDirs);

    if (options.verbose) {
      this.logger.log(`Found ${result.usedIcons.size} icons: ${[...result.usedIcons].join(', ')}`);
    }

    // Prepare output folder on non-watch runs
    if (!options.watchMode) {
      if (this.fs.exists(config.outDir)) this.fs.removeDirectory(config.outDir);
      this.fs.createDirectory(config.outDir);
    }

    if (this.cache.icons.size === 0) {
      const existingIcons = this.fs.readDirectory(config.outDir);
      this.cache.icons = new Set(existingIcons);
    }

    const { toAdd, toRemove } = this.cache.diff(result.usedIcons);
    const writeErrors = await this.syncIcons(toAdd, toRemove, options, config);

    this.cache.icons = result.usedIcons;

    return { usedIcons: result.usedIcons, errors: [...result.errors, ...writeErrors] };
  }

  private async syncIcons(
    toAdd: Set<string>,
    toRemove: Set<string>,
    runOptions: IconScannerRunOptions,
    config: IconScannerConfig,
  ): Promise<string[]> {
    const errors: string[] = [];

    // Remove old icons
    for (const icon of toRemove) {
      try {
        this.fs.removeFile(`${config.outDir}/${icon}.svg`);
        if (runOptions.verbose) {
          this.logger.log(`Removed ${icon}.svg`);
        }
      } catch (err) {
        const msg = `Failed to remove ${icon}: ${err}`;
        this.logger.error(msg);
        errors.push(msg);
      }
    }

    // Add new icons
    for (const icon of toAdd) {
      const prefix = icon.match(/^[a-z]+/)?.[0];
      const pkg = prefix ? config.iconMap[prefix] : undefined;
      if (!pkg) {
        const msg = `Package not found for icon: ${icon}`;
        this.logger.error(msg);
        errors.push(msg);
        continue;
      }
      try {
        const mod = await this.resolver.resolve(pkg);
        const svg = mod[icon];
        if (!svg) {
          const msg = `Icon "${icon}" missing in package ${pkg}`;
          this.logger.error(msg);
          errors.push(msg);
          continue;
        }
        this.fs.writeFile(`${config.outDir}/${icon}.svg`, svg);
        if (runOptions.verbose) {
          this.logger.log(`Wrote ${icon}.svg`);
        }
      } catch (err) {
        const msg = `Failed to load ${icon} from ${pkg}: ${err}`;
        this.logger.log(msg);
        errors.push(msg);
      }
    }

    return errors;
  }
}
