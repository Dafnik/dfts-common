import { join, resolve } from 'node:path';

import { ConfigLoader } from '../config/config-loader';
import type { ResolvedJobConfig, ResolvedManagerConfig } from '../config/models';
import type { IconManager, JobRunResult } from '../core/icon-manager';
import { errorMessage } from '../core/issues';
import type { Logger } from '../core/ports';
import { parseCliOptions, type RunCliOptions } from './cli-options';
import { CliReporter } from './cli-reporter';
import { SetupCommand } from './setup-command';
import { WatchCoordinator, type ManagerFactory } from './watch-coordinator';

export class CliApplication {
  constructor(
    private readonly configs: ConfigLoader,
    private readonly managers: ManagerFactory,
    private readonly watch: WatchCoordinator,
    private readonly setup: SetupCommand,
    private readonly logger: Logger,
    private readonly reporter: CliReporter,
  ) {}

  async run(args: string[], cwd: string, signal: AbortSignal): Promise<number> {
    try {
      const options = parseCliOptions(args);
      const configPath = options.configPath ? resolve(cwd, options.configPath) : join(cwd, 'ng-icons-manager.config.mjs');
      if (options.command === 'setup') {
        if (options.listPresets) this.setup.listPresets();
        else {
          if (!options.preset) throw new Error('setup requires --preset <name> or --list-presets');
          this.setup.run(configPath, options.preset, options.force);
        }
        return 0;
      }

      const config = await this.configs.load(configPath);
      this.jobs(config, options.jobs);

      if (options.verbose) this.logger.info(`Loaded config from ${config.configPath}`);
      if (options.watch) return this.watch.run(config, options.jobs, options.verbose, signal);
      return this.once(config, options);
    } catch (error) {
      this.logger.error(errorMessage(error));
      return 1;
    }
  }

  private async once(config: ResolvedManagerConfig, options: RunCliOptions): Promise<number> {
    const manager = this.managers(config);
    const results = await Promise.all(this.jobs(config, options.jobs).map((job) => this.runJob(manager, job, options)));
    return results.every(({ success }) => success) ? 0 : 1;
  }

  private async runJob(manager: IconManager, job: ResolvedJobConfig, options: RunCliOptions): Promise<JobRunResult> {
    const result = await manager.run(job, { fullReplace: true, ignoreMissing: options.ignoreMissing });
    this.reporter.report(result, options.ignoreMissing, options.verbose);
    return result;
  }

  private jobs(config: ResolvedManagerConfig, names: string[]): ResolvedJobConfig[] {
    if (names.length === 0) return Object.values(config.jobs);
    return names.map((name) => {
      const job = config.jobs[name];
      if (!job) throw new Error(`Unknown job: ${name}`);
      return job;
    });
  }
}
