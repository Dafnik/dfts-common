#!/usr/bin/env node

const chokidar = require('chokidar');

const { ConsoleLogger } = require('../src/adapters/console-logger');
const { RealFileSystemAdapter } = require('../src/adapters/fs-adapter');
const { RealModuleResolver } = require('../src/adapters/module-resolver');
const { ScannerFacade } = require('../src/core/scanner.facade');

// CLI flags
const verbose = process.argv.includes('--verbose');
const watchMode = process.argv.includes('--watch');
const ignoreMissingIcons = process.argv.includes('--ignore-missing');

const logger = new ConsoleLogger();
const scanner = new ScannerFacade(new RealFileSystemAdapter(), new RealModuleResolver(), logger);

async function run() {
  const result = await scanner.scanAndCopy({
    verbose,
    watchMode,
    ignoreMissingIcons,
  });

  if (result.errors.length && !watchMode && !ignoreMissingIcons) {
    process.exit(1);
  }
}

async function main() {
  if (verbose) {
    logger.log(`🏠 ng-icons-manager cwd: "${process.cwd()}"`);
  }

  await run();

  if (!watchMode) return;

  logger.log('👀 ng-icons-manager watching...');
  chokidar
    .watch('.', {
      cwd: process.cwd(),
      ignoreInitial: true,
      ignored: (path, stats) =>
        path.includes('node_modules') ||
        path.includes('.angular') ||
        path.includes('dist') ||
        (stats?.isFile() && !/\.(html|ts)$/.test(path)),
    })
    .on('all', async (_, changedPath) => {
      if (verbose) {
        logger.log(`👀 Changes detected in ${changedPath}`);
      }
      await run();
    });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
