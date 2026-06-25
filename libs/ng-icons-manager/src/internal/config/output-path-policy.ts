import { dirname, isAbsolute, parse, relative, resolve, sep } from 'node:path';

import { ConfigError, errorMessage, type ReadIssue } from '../core/issues';
import type { FileSystem } from '../core/ports';
import type { ResolvedJobConfig, ResolvedManagerConfig, ValidatedManagerConfig } from './models';

export class OutputPathPolicy {
  constructor(private readonly fs: FileSystem) {}

  resolve(configPath: string, config: ValidatedManagerConfig): ResolvedManagerConfig {
    const configDir = this.fs.realPath(dirname(configPath));
    const jobs = Object.fromEntries(
      Object.entries(config.jobs).map(([name, job]) => [
        name,
        {
          ...job,
          inputDirs: job.inputDirs.map((path) => resolve(configDir, path)),
          outputDir: resolve(configDir, job.outputDir),
        },
      ]),
    );

    const resolved = { configDir, configPath: resolve(configPath), jobs };
    this.validateAll(resolved);
    return resolved;
  }

  validateInputs(config: ResolvedManagerConfig, job: ResolvedJobConfig): ReadIssue[] {
    return job.inputDirs.flatMap((inputDir): ReadIssue[] => {
      try {
        if (inputDir !== config.configDir && !descendant(config.configDir, inputDir)) {
          throw new ConfigError(`Input directory must stay inside the config directory: ${inputDir}`);
        }
        this.noSymlink(config.configDir, inputDir, `Job "${job.name}" input directory`);
        if (!this.fs.exists(inputDir) || !this.fs.isDirectory(inputDir)) {
          throw new ConfigError(`Input directory must reference an existing directory: ${inputDir}`);
        }
        const realInput = this.fs.realPath(inputDir);
        if (realInput !== config.configDir && !descendant(config.configDir, realInput)) {
          throw new ConfigError(`Input directory must stay inside the config directory: ${inputDir}`);
        }
        return [];
      } catch (error) {
        return [{ kind: 'read', path: inputDir, message: errorMessage(error) }];
      }
    });
  }

  assertSafe(config: ResolvedManagerConfig, job: ResolvedJobConfig): void {
    if (!descendant(config.configDir, job.outputDir) || job.outputDir === parse(job.outputDir).root) {
      throw new ConfigError(`Job "${job.name}" outputDir cannot be a filesystem or config root`);
    }
    this.noSymlink(config.configDir, job.outputDir, `Job "${job.name}" outputDir`);

    const allJobs = Object.values(config.jobs);
    for (const inputDir of allJobs.flatMap(({ inputDirs }) => inputDirs)) {
      if (sameOrAncestor(job.outputDir, inputDir)) {
        throw new ConfigError(`Job "${job.name}" outputDir cannot equal or contain an input directory`);
      }
    }
    for (const other of allJobs) {
      if (other.name === job.name) continue;
      if (sameOrAncestor(job.outputDir, other.outputDir) || sameOrAncestor(other.outputDir, job.outputDir)) {
        throw new ConfigError('Job output directories cannot be equal or nested');
      }
    }
  }

  private validateAll(config: ResolvedManagerConfig): void {
    for (const job of Object.values(config.jobs)) this.assertSafe(config, job);
  }

  private noSymlink(root: string, target: string, label: string): void {
    let current = root;
    for (const segment of relative(root, target).split(sep).filter(Boolean)) {
      current = resolve(current, segment);
      if (!this.fs.exists(current)) return;
      if (this.fs.isSymbolicLink(current)) throw new ConfigError(`${label} must not traverse a symbolic link: ${current}`);
    }
  }
}

function descendant(parent: string, child: string): boolean {
  const path = relative(parent, child);
  return path.length > 0 && path !== '..' && !path.startsWith(`..${sep}`) && !isAbsolute(path);
}

function sameOrAncestor(parent: string, child: string): boolean {
  return parent === child || descendant(parent, child);
}
