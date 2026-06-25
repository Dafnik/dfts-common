import { extname, resolve } from 'node:path';

import { ConfigError, errorMessage } from '../core/issues';
import type { ConfigModuleImporter, FileSystem } from '../core/ports';
import type { ResolvedManagerConfig } from './models';
import { ConfigValidator } from './config-validator';
import { OutputPathPolicy } from './output-path-policy';

export const DEFAULT_CONFIG_FILE = 'ng-icons-manager.config.mts';
export const FALLBACK_CONFIG_FILE = 'ng-icons-manager.config.mjs';

const CONFIG_EXTENSIONS = new Set(['.mts', '.mjs']);
const CONFIG_EXTENSION_LABEL = '.mts or .mjs';

export class ConfigLoader {
  constructor(
    private readonly fs: FileSystem,
    private readonly importer: ConfigModuleImporter,
    private readonly validator: ConfigValidator,
    private readonly paths: OutputPathPolicy,
  ) {}

  defaultRunPath(cwd: string): string {
    const primary = resolve(cwd, DEFAULT_CONFIG_FILE);
    if (this.fs.exists(primary)) return primary;

    const fallback = resolve(cwd, FALLBACK_CONFIG_FILE);
    if (this.fs.exists(fallback)) return fallback;

    return primary;
  }

  defaultSetupPath(cwd: string): string {
    return resolve(cwd, DEFAULT_CONFIG_FILE);
  }

  async load(configPath: string, cacheBust = false): Promise<ResolvedManagerConfig> {
    const absolute = resolve(configPath);
    if (!CONFIG_EXTENSIONS.has(extname(absolute))) {
      throw new ConfigError(`Config file must use the ${CONFIG_EXTENSION_LABEL} extension: ${absolute}`);
    }
    if (!this.fs.exists(absolute)) throw new ConfigError(`Config file not found: ${absolute}`);
    if (this.fs.isSymbolicLink(absolute)) throw new ConfigError(`Config file must not be a symbolic link: ${absolute}`);

    let module: Record<string, unknown>;
    try {
      module = await this.importer.importFile(absolute, cacheBust);
    } catch (error) {
      throw new ConfigError(`Failed to load config ${absolute}: ${errorMessage(error)}`);
    }
    return this.paths.resolve(absolute, this.validator.validate(module['default']));
  }
}
