import chokidar, { type FSWatcher } from 'chokidar';

import type { WatchHandle, WatchOptions, WatcherFactory } from '../core/ports';

export class ChokidarWatcherFactory implements WatcherFactory {
  watch(paths: string | string[], options: WatchOptions = {}): WatchHandle {
    return new ChokidarWatchHandle(
      chokidar.watch(paths, {
        followSymlinks: false,
        ignoreInitial: true,
        ignored: options.ignored,
      }),
    );
  }
}

class ChokidarWatchHandle implements WatchHandle {
  private readonly readyPromise: Promise<void>;

  constructor(private readonly watcher: FSWatcher) {
    this.readyPromise = new Promise((resolve) => watcher.once('ready', resolve));
  }

  onEvent(listener: () => void): void {
    this.watcher.on('all', listener);
  }

  onError(listener: (error: unknown) => void): void {
    this.watcher.on('error', listener);
  }

  ready(): Promise<void> {
    return this.readyPromise;
  }

  close(): Promise<void> {
    return this.watcher.close();
  }
}
