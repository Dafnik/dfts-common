import { createRequire } from 'node:module';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { ModuleNotFoundError } from '../core/issues';
import type { ModuleLoader } from '../core/ports';

const NOT_FOUND_CODES = new Set(['MODULE_NOT_FOUND', 'ERR_PACKAGE_PATH_NOT_EXPORTED']);

export class NodeModuleLoader implements ModuleLoader {
  private readonly require;

  constructor(baseDir: string) {
    this.require = createRequire(join(baseDir, 'package.json'));
  }

  async load(specifier: string): Promise<Record<string, unknown>> {
    let path: string;
    try {
      path = this.require.resolve(specifier);
    } catch (error) {
      if (hasCode(error) && NOT_FOUND_CODES.has(error.code)) throw new ModuleNotFoundError(specifier);
      throw error;
    }
    return import(pathToFileURL(path).href);
  }
}

function hasCode(error: unknown): error is Error & { code: string } {
  return error instanceof Error && 'code' in error && typeof error.code === 'string';
}
