import type { ResolvedJobConfig } from '../config/models';
import type { WatchHandle, WatcherFactory } from '../core/ports';

export class SerialJobWatcher {
  private handle?: WatchHandle;
  private timer?: ReturnType<typeof setTimeout>;
  private queue = Promise.resolve();

  constructor(
    private readonly watchers: WatcherFactory,
    private readonly job: ResolvedJobConfig,
    private readonly ignored: (path: string) => boolean,
    private readonly run: () => Promise<void>,
    private readonly fail: (error: unknown) => void,
  ) {}

  async start(): Promise<void> {
    this.handle = this.watchers.watch(this.job.inputDirs, { ignored: this.ignored });
    this.handle.onEvent(() => this.schedule());
    this.handle.onError(this.fail);
    await this.handle.ready();
  }

  async close(): Promise<void> {
    if (this.timer) clearTimeout(this.timer);
    await this.queue;
    await this.handle?.close();
  }

  private schedule(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.queue = this.queue.then(this.run).catch(this.fail);
    }, 50);
  }
}
