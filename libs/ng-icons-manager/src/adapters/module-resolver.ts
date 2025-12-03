import type { ModuleResolver } from '../types';

export class RealModuleResolver implements ModuleResolver {
  async resolve(packageName: string): Promise<Record<string, string>> {
    const resolved = require.resolve(packageName, {
      paths: [process.cwd()],
    });
    return await import(resolved);
  }
}
