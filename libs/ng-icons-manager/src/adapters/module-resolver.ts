import { createRequire } from 'module';

import type { ModuleResolver } from '../types';

export class RealModuleResolver implements ModuleResolver {
  private cjsRequire = createRequire(import.meta.url);

  async resolve(packageName: string): Promise<Record<string, string>> {
    const resolved = this.cjsRequire.resolve(packageName, {
      paths: [process.cwd()],
    });
    return await import(resolved);
  }
}
