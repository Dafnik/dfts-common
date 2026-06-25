import { CliApplication } from '../cli/cli-application';
import { CliReporter } from '../cli/cli-reporter';
import { WatchCoordinator, type ManagerFactory } from '../cli/watch-coordinator';
import { ConfigLoader } from '../config/config-loader';
import type { ResolvedManagerConfig } from '../config/models';
import { ConfigValidator } from '../config/config-validator';
import { OutputPathPolicy } from '../config/output-path-policy';
import { IconManager } from '../core/icon-manager';
import { IconOutput } from '../core/icon-output';
import { IconParser } from '../core/icon-parser';
import { IconResolver } from '../core/icon-resolver';
import { IconScanner } from '../core/icon-scanner';
import { ChokidarWatcherFactory } from './chokidar-watcher';
import { ConsoleLogger } from './console-logger';
import { NativeConfigImporter } from './native-config-importer';
import { NodeFileSystem } from './node-file-system';
import { NodeModuleLoader } from './node-module-loader';
import { SetupCommand } from '../cli/setup-command';

export function createCliApplication(): CliApplication {
  const fs = new NodeFileSystem();
  const logger = new ConsoleLogger();
  const paths = new OutputPathPolicy(fs);
  const configs = new ConfigLoader(fs, new NativeConfigImporter(), new ConfigValidator(), paths);
  const managers: ManagerFactory = (config) => createManager(config, fs, paths);
  const reporter = new CliReporter(logger);
  const watch = new WatchCoordinator(new ChokidarWatcherFactory(), configs, managers, logger, reporter);
  const setup = new SetupCommand(fs, logger);
  return new CliApplication(configs, managers, watch, setup, logger, reporter);
}

function createManager(config: ResolvedManagerConfig, fs: NodeFileSystem, paths: OutputPathPolicy): IconManager {
  return new IconManager(
    config,
    paths,
    new IconScanner(fs, new IconParser()),
    new IconResolver(new NodeModuleLoader(config.configDir)),
    new IconOutput(fs, paths),
  );
}
