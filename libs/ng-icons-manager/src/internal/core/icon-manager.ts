import type { ResolvedJobConfig, ResolvedManagerConfig } from '../config/models';
import { OutputPathPolicy } from '../config/output-path-policy';
import { errorMessage, type JobIssue, type WriteIssue } from './issues';
import { IconOutput } from './icon-output';
import { IconResolver } from './icon-resolver';
import { IconScanner } from './icon-scanner';

export interface JobRunOptions {
  fullReplace: boolean;
  ignoreMissing: boolean;
}

export interface JobRunResult {
  job: string;
  success: boolean;
  iconCount: number;
  issues: JobIssue[];
}

export class IconManager {
  constructor(
    private readonly config: ResolvedManagerConfig,
    private readonly paths: OutputPathPolicy,
    private readonly scanner: IconScanner,
    private readonly resolver: IconResolver,
    private readonly output: IconOutput,
  ) {}

  async run(job: ResolvedJobConfig, options: JobRunOptions): Promise<JobRunResult> {
    const inputIssues = this.paths.validateInputs(this.config, job);
    if (inputIssues.length > 0) return result(job.name, 0, inputIssues);

    const outputDirs = Object.values(this.config.jobs).map(({ outputDir }) => outputDir);
    const scan = this.scanner.scan(job, outputDirs);
    const resolution = await this.resolver.resolve(scan.icons, job.packagePreferences);
    const issues: JobIssue[] = [...scan.issues, ...resolution.issues];

    if (issues.some((issue) => issue.kind !== 'missing' || !options.ignoreMissing)) {
      return result(job.name, resolution.icons.size, issues);
    }

    try {
      this.output.synchronize(this.config, job, resolution.icons, options.fullReplace);
    } catch (error) {
      const issue: WriteIssue = {
        kind: 'write',
        path: job.outputDir,
        message: `Failed to update ${job.outputDir}: ${errorMessage(error)}`,
      };
      issues.push(issue);
    }
    return result(job.name, resolution.icons.size, issues, options.ignoreMissing);
  }
}

function result(job: string, iconCount: number, issues: JobIssue[], ignoreMissing = false): JobRunResult {
  return {
    job,
    iconCount,
    issues,
    success: !issues.some((issue) => issue.kind !== 'missing' || !ignoreMissing),
  };
}
