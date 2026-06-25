import { pathToFileURL } from 'node:url';

import type { ConfigModuleImporter } from '../core/ports';

export class NativeConfigImporter implements ConfigModuleImporter {
  importFile(path: string, cacheBust: boolean): Promise<Record<string, unknown>> {
    const url = pathToFileURL(path).href;
    return import(cacheBust ? `${url}?t=${Date.now()}` : url);
  }
}
