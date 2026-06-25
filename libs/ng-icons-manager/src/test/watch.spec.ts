import { join } from 'node:path';
import { vi } from 'vitest';

import { CliReporter } from '../internal/cli/cli-reporter';
import { SerialJobWatcher } from '../internal/cli/serial-job-watcher';
import { WatchCoordinator, type ManagerFactory } from '../internal/cli/watch-coordinator';
import { ConfigLoader } from '../internal/config/config-loader';
import type { ResolvedJobConfig } from '../internal/config/models';
import { ConfigValidator } from '../internal/config/config-validator';
import { OutputPathPolicy } from '../internal/config/output-path-policy';
import { IconManager } from '../internal/core/icon-manager';
import { IconOutput } from '../internal/core/icon-output';
import { IconParser } from '../internal/core/icon-parser';
import { IconResolver } from '../internal/core/icon-resolver';
import { IconScanner } from '../internal/core/icon-scanner';
import { FakeConfigImporter, FakeFileSystem, FakeLogger, FakeModuleLoader, FakeWatcherFactory } from './fakes';

describe('serial job watcher', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('debounces events and serializes updates', async () => {
    const watchers = new FakeWatcherFactory();
    const first = deferred();
    const second = deferred();
    const run = vi.fn().mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
    const fail = vi.fn();
    const watcher = new SerialJobWatcher(watchers, job('/workspace/src', '/workspace/icons'), () => false, run, fail);
    await watcher.start();

    watchers.handles[0].emit();
    watchers.handles[0].emit();
    vi.advanceTimersByTime(50);
    await flushPromises();
    expect(run).toHaveBeenCalledTimes(1);

    watchers.handles[0].emit();
    vi.advanceTimersByTime(50);
    await flushPromises();
    expect(run).toHaveBeenCalledTimes(1);

    first.resolve();
    await flushPromises();
    expect(run).toHaveBeenCalledTimes(2);

    second.resolve();
    await watcher.close();
    expect(fail).not.toHaveBeenCalled();
  });

  it('reports a rejected update without poisoning cleanup', async () => {
    const watchers = new FakeWatcherFactory();
    const fail = vi.fn();
    const watcher = new SerialJobWatcher(
      watchers,
      job('/workspace/src', '/workspace/icons'),
      () => false,
      () => Promise.reject(new Error('update failed')),
      fail,
    );
    await watcher.start();

    watchers.handles[0].emit();
    vi.advanceTimersByTime(50);
    await flushPromises();

    expect(fail).toHaveBeenCalledWith(expect.objectContaining({ message: 'update failed' }));
    await expect(watcher.close()).resolves.toBeUndefined();
  });
});

describe('watch coordinator', () => {
  const root = join('/', 'workspace');
  const configPath = join(root, 'ng-icons-manager.config.mts');
  const source = join(root, 'src');
  const sourceFile = join(source, 'app.html');
  let fs: FakeFileSystem;
  let importer: FakeConfigImporter;
  let configs: ConfigLoader;
  let watchers: FakeWatcherFactory;
  let logger: FakeLogger;
  let modules: FakeModuleLoader;
  let managers: ManagerFactory;

  beforeEach(() => {
    vi.useFakeTimers();
    fs = new FakeFileSystem();
    fs.directory(source);
    fs.writeFile(configPath, 'config');
    fs.writeFile(sourceFile, '<ng-icon name="bootstrapAlarm" />');
    fs.globResults.set(source, [sourceFile]);
    importer = new FakeConfigImporter();
    const paths = new OutputPathPolicy(fs);
    configs = new ConfigLoader(fs, importer, new ConfigValidator(), paths);
    watchers = new FakeWatcherFactory();
    logger = new FakeLogger();
    modules = new FakeModuleLoader();
    modules.modules.set('@ng-icons/bootstrap-icons', { bootstrapAlarm: '<svg>alarm</svg>' });
    managers = (config) =>
      new IconManager(config, paths, new IconScanner(fs, new IconParser()), new IconResolver(modules), new IconOutput(fs, paths));
  });

  afterEach(() => vi.useRealTimers());

  it('reconciles a valid config reload and preserves the obsolete output', async () => {
    importer.value = configModule('public/old-icons');
    const initial = await configs.load(configPath);
    const abort = new AbortController();
    const completion = coordinator().run(initial, [], false, abort.signal);
    await flushPromises();
    const oldIcon = join(root, 'public/old-icons/bootstrapAlarm.svg');
    expect(fs.readFile(oldIcon)).toBe('<svg>alarm</svg>');

    importer.value = configModule('public/new-icons');
    watchers.handles[0].emit();
    await vi.advanceTimersByTimeAsync(50);
    await flushPromises();

    expect(fs.readFile(oldIcon)).toBe('<svg>alarm</svg>');
    expect(fs.readFile(join(root, 'public/new-icons/bootstrapAlarm.svg'))).toBe('<svg>alarm</svg>');
    expect(watchers.handles[1].closed).toBe(true);

    abort.abort();
    await expect(completion).resolves.toBe(0);
  });

  it('terminates on an invalid reload without modifying existing output', async () => {
    importer.value = configModule('public/icons');
    const initial = await configs.load(configPath);
    const completion = coordinator().run(initial, [], false, new AbortController().signal);
    await flushPromises();
    const icon = join(root, 'public/icons/bootstrapAlarm.svg');
    expect(fs.exists(icon)).toBe(true);

    importer.value = { default: { jobs: {} } };
    watchers.handles[0].emit();
    await vi.advanceTimersByTimeAsync(50);
    await flushPromises();

    await expect(completion).resolves.toBe(1);
    expect(fs.readFile(icon)).toBe('<svg>alarm</svg>');
    expect(watchers.handles.every(({ closed }) => closed)).toBe(true);
  });

  it('does not register a job watcher after shutdown starts during watcher readiness', async () => {
    importer.value = configModule('public/icons');
    const initial = await configs.load(configPath);
    const jobReady = deferred();
    watchers.readyPromises.push(Promise.resolve(), jobReady.promise);
    const abort = new AbortController();
    const completion = coordinator().run(initial, [], false, abort.signal);
    await flushPromises();

    abort.abort();
    jobReady.resolve();
    await flushPromises();

    await expect(completion).resolves.toBe(0);
    expect(watchers.handles).toHaveLength(2);
    expect(watchers.handles.every(({ closed }) => closed)).toBe(true);
    expect(logger.infos).not.toContain('Watching 1 ng-icons-manager job(s)');
  });

  function coordinator(): WatchCoordinator {
    return new WatchCoordinator(watchers, configs, managers, logger, new CliReporter(logger));
  }
});

function job(inputDir: string, outputDir: string): ResolvedJobConfig {
  return {
    name: 'app',
    inputDirs: [inputDir],
    outputDir,
    include: ['**/*.{html,ts}'],
    exclude: [],
    packagePreferences: {},
  };
}

function configModule(outputDir: string): Record<string, unknown> {
  return { default: { jobs: { app: { inputDirs: ['src'], outputDir } } } };
}

function deferred(): { promise: Promise<void>; resolve: () => void } {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

async function flushPromises(): Promise<void> {
  for (let index = 0; index < 10; index += 1) await Promise.resolve();
}
