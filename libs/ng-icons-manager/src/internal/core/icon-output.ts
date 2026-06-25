import { join } from 'node:path';

import type { ResolvedJobConfig, ResolvedManagerConfig } from '../config/models';
import { OutputPathPolicy } from '../config/output-path-policy';
import type { FileSystem } from './ports';

export class IconOutput {
  constructor(
    private readonly fs: FileSystem,
    private readonly paths: OutputPathPolicy,
  ) {}

  synchronize(config: ResolvedManagerConfig, job: ResolvedJobConfig, icons: ReadonlyMap<string, string>, fullReplace: boolean): void {
    for (const icon of icons.keys()) {
      if (!/^[A-Za-z_$][\w$]*$/.test(icon)) throw new Error(`Invalid icon export name: ${icon}`);
    }
    this.paths.assertSafe(config, job);
    if (fullReplace) this.replace(job.outputDir, icons);
    else this.incremental(job.outputDir, icons);
  }

  private replace(outputDir: string, icons: ReadonlyMap<string, string>): void {
    if (this.fs.exists(outputDir)) this.fs.remove(outputDir);
    this.fs.createDirectory(outputDir);
    this.write(outputDir, icons);
  }

  private incremental(outputDir: string, icons: ReadonlyMap<string, string>): void {
    this.fs.createDirectory(outputDir);
    const desired = new Set([...icons.keys()].map((icon) => `${icon}.svg`));
    for (const entry of this.fs.readDirectory(outputDir)) {
      if (!entry.isFile || !desired.has(entry.name)) this.fs.remove(join(outputDir, entry.name));
    }
    for (const [icon, svg] of icons) {
      const path = join(outputDir, `${icon}.svg`);
      if (!this.fs.exists(path) || this.fs.readFile(path) !== svg) this.fs.writeFile(path, svg);
    }
  }

  private write(outputDir: string, icons: ReadonlyMap<string, string>): void {
    for (const [icon, svg] of icons) this.fs.writeFile(join(outputDir, `${icon}.svg`), svg);
  }
}
