import { isAbsolute, relative, resolve, sep } from 'node:path';

import { ConfigLoader } from '../config/config-loader';
import type { ResolvedJobConfig, ResolvedManagerConfig } from '../config/models';
import type { IconManager } from '../core/icon-manager';
import { errorMessage } from '../core/issues';
import type { Logger, WatchHandle, WatcherFactory } from '../core/ports';
import { CliReporter } from './cli-reporter';
import { SerialJobWatcher } from './serial-job-watcher';

export type ManagerFactory = (config: ResolvedManagerConfig) => IconManager;
export class WatchCoordinator {
  private config!: ResolvedManagerConfig;
  private configWatcher?: WatchHandle;
  private jobWatchers = new Map<string, SerialJobWatcher>();
  private reloadTimer?: ReturnType<typeof setTimeout>;
  private reloadQueue = Promise.resolve();
  private finished = false;
  private finishRun?: (code: number) => void;

  constructor(
    private readonly watchers: WatcherFactory,
    private readonly configs: ConfigLoader,
    private readonly managers: ManagerFactory,
    private readonly logger: Logger,
    private readonly reporter: CliReporter,
  ) {}

  async run(config: ResolvedManagerConfig, selectedJobs: string[], verbose: boolean, signal: AbortSignal): Promise<number> {
    const completion = new Promise<number>((resolveRun) => {
      this.finishRun = resolveRun;
    });
    this.config = config;
    signal.addEventListener('abort', () => void this.finish(0), { once: true });

    try {
      this.selected(this.config, selectedJobs);
      this.configWatcher = this.watchers.watch(config.configPath);
      this.configWatcher.onEvent(() => this.scheduleReload(selectedJobs, verbose));
      this.configWatcher.onError((error) => void this.finish(1, `Config watch error: ${errorMessage(error)}`));
      await this.configWatcher.ready();
      await this.apply(config, selectedJobs, verbose);
      if (signal.aborted) await this.finish(0);
    } catch (error) {
      await this.finish(1, errorMessage(error));
    }
    return completion;
  }

  private async apply(config: ResolvedManagerConfig, selectedJobs: string[], verbose: boolean): Promise<void> {
    const jobs = this.selected(config, selectedJobs);
    await this.closeJobs();
    this.config = config;
    const manager = this.managers(config);

    for (const job of jobs) {
      this.reporter.report(await manager.run(job, { fullReplace: true, ignoreMissing: false }), false, verbose);
      const watcher = new SerialJobWatcher(
        this.watchers,
        job,
        (path) => this.ignored(path, job),
        async () => this.reporter.report(await manager.run(job, { fullReplace: false, ignoreMissing: false }), false, verbose),
        (error) => void this.finish(1, `[${job.name}] Watch error: ${errorMessage(error)}`),
      );
      await watcher.start();
      this.jobWatchers.set(job.name, watcher);
    }
    this.logger.info(`Watching ${this.jobWatchers.size} ng-icons-manager job(s)`);
  }

  private scheduleReload(selectedJobs: string[], verbose: boolean): void {
    if (this.reloadTimer) clearTimeout(this.reloadTimer);
    this.reloadTimer = setTimeout(() => {
      this.reloadQueue = this.reloadQueue
        .then(async () => this.apply(await this.configs.load(this.config.configPath, true), selectedJobs, verbose))
        .catch((error: unknown) => this.finish(1, errorMessage(error)));
    }, 50);
  }

  private selected(config: ResolvedManagerConfig, names: string[]): ResolvedJobConfig[] {
    if (names.length === 0) return Object.values(config.jobs);
    return names.map((name) => {
      const job = config.jobs[name];
      if (!job) throw new Error(`Unknown job: ${name}`);
      return job;
    });
  }

  private ignored(path: string, job: ResolvedJobConfig): boolean {
    const absolute = isAbsolute(path) ? path : resolve(path);
    if (hiddenBelowInput(absolute, job.inputDirs)) return true;
    return Object.values(this.config.jobs).some(({ outputDir }) => sameOrBelow(outputDir, absolute));
  }

  private async finish(code: number, message?: string): Promise<void> {
    if (this.finished) return;
    this.finished = true;
    if (message) this.logger.error(message);
    if (this.reloadTimer) clearTimeout(this.reloadTimer);
    await this.closeJobs();
    await this.configWatcher?.close();
    this.finishRun?.(code);
  }

  private async closeJobs(): Promise<void> {
    await Promise.all([...this.jobWatchers.values()].map((watcher) => watcher.close()));
    this.jobWatchers.clear();
  }
}

function hiddenBelowInput(path: string, inputDirs: string[]): boolean {
  return inputDirs.some((inputDir) => {
    const child = relative(inputDir, path);
    return child.length > 0 && child !== '..' && !child.startsWith(`..${sep}`) && child.split(sep).some((part) => part.startsWith('.'));
  });
}

function sameOrBelow(parent: string, child: string): boolean {
  const path = relative(parent, child);
  return path === '' || (path !== '..' && !path.startsWith(`..${sep}`) && !isAbsolute(path));
}
