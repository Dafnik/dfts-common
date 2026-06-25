import { relative, sep } from 'node:path';

import type { ResolvedJobConfig } from '../config/models';
import { errorMessage, type ReadIssue } from './issues';
import { IconParser } from './icon-parser';
import type { FileSystem } from './ports';

export interface ScanResult {
  icons: Set<string>;
  issues: ReadIssue[];
}

export class IconScanner {
  constructor(
    private readonly fs: FileSystem,
    private readonly parser: IconParser,
  ) {}

  scan(job: ResolvedJobConfig, outputDirs: string[]): ScanResult {
    const { files, issues } = this.files(job, outputDirs);
    const icons = new Set<string>();

    for (const file of files) {
      try {
        if (this.fs.isSymbolicLink(file)) continue;
        this.parser.parse(this.fs.readFile(file)).forEach((icon) => icons.add(icon));
      } catch (error) {
        issues.push({ kind: 'read', path: file, message: `Failed to read ${file}: ${errorMessage(error)}` });
      }
    }
    return { icons, issues };
  }

  private files(job: ResolvedJobConfig, outputDirs: string[]): { files: Set<string>; issues: ReadIssue[] } {
    const files = new Set<string>();
    const issues: ReadIssue[] = [];
    for (const inputDir of job.inputDirs) {
      const ignoredOutputs = outputDirs
        .map((outputDir) => relative(inputDir, outputDir))
        .filter((path) => path.length > 0 && path !== '..' && !path.startsWith(`..${sep}`))
        .map((path) => `${path.split(sep).join('/')}/**`);
      try {
        this.fs.glob(job.include, { cwd: inputDir, ignore: [...job.exclude, ...ignoredOutputs] }).forEach((file) => files.add(file));
      } catch (error) {
        issues.push({ kind: 'read', path: inputDir, message: `Failed to scan ${inputDir}: ${errorMessage(error)}` });
      }
    }
    return { files, issues };
  }
}
