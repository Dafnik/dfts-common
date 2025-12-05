import { DEFAULT_CONFIG } from '../config/defaults';
import { FileSystemAdapter, Logger, ModuleResolver, ScanResult } from '../types';
import { IconCache } from './cache.service';
import { IconScanner } from './icon-scanner';

interface ScannerRunOptions {
  verbose?: boolean;
  watchMode?: boolean;
  ignoreMissingIcons?: boolean;
}

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

  async scanAndCopy(options: ScannerRunOptions): Promise<ScanResult> {
    const config = { ...DEFAULT_CONFIG, ...options };
    const result = this.scanner.scanFiles(config.srcGlob, config.iconRegex);

    if (config.verbose) {
      this.logger.log(`📦 Found ${result.usedIcons.size} icons: ${[...result.usedIcons].join(', ')}`);
    }

    // Prepare output folder on non-watch runs
    if (!config.watchMode) {
      if (this.fs.exists(config.outDir)) this.fs.removeDirectory(config.outDir);
      this.fs.createDirectory(config.outDir);
    }

    const { toAdd, toRemove } = this.cache.diff(result.usedIcons);
    const writeErrors = await this.syncIcons(toAdd, toRemove, config);

    this.cache.icons = result.usedIcons;

    return { usedIcons: result.usedIcons, errors: [...result.errors, ...writeErrors] };
  }

  private async syncIcons(toAdd: Set<string>, toRemove: Set<string>, config: typeof DEFAULT_CONFIG & ScannerRunOptions): Promise<string[]> {
    const errors: string[] = [];

    // Remove old icons
    for (const icon of toRemove) {
      try {
        this.fs.removeFile(`${config.outDir}/${icon}.svg`);
        if (config.verbose) {
          this.logger.log(`🗑 Removed ${icon}.svg`);
        }
      } catch (err) {
        errors.push(`Failed to remove ${icon}: ${err}`);
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
        if (config.verbose) {
          this.logger.log(`✔ Wrote ${icon}.svg`);
        }
      } catch (err) {
        errors.push(`Failed to load ${icon} from ${pkg}: ${err}`);
      }
    }

    return errors;
  }
}
