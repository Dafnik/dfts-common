import { extname, resolve } from 'node:path';

import { ConfigError, errorMessage } from '../core/issues';
import type { ConfigModuleImporter, FileSystem } from '../core/ports';
import type { ResolvedManagerConfig } from './models';
import { ConfigValidator } from './config-validator';
import { OutputPathPolicy } from './output-path-policy';

export class ConfigLoader {
  constructor(
    private readonly fs: FileSystem,
    private readonly importer: ConfigModuleImporter,
    private readonly validator: ConfigValidator,
    private readonly paths: OutputPathPolicy,
  ) {}

  async load(configPath: string, cacheBust = false): Promise<ResolvedManagerConfig> {
    const absolute = resolve(configPath);
    if (extname(absolute) !== '.mjs') throw new ConfigError(`Config file must use the .mjs extension: ${absolute}`);
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
