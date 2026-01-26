#!/usr/bin/env node

import { join } from 'path';
import { existsSync } from 'fs';
import { pathToFileURL } from 'url';

import chokidar from 'chokidar';
import { ConsoleLogger, RealFileSystemAdapter, RealModuleResolver, ScannerFacade } from '../src';

// CLI flags
const verbose = process.argv.includes('--verbose');
const watchMode = process.argv.includes('--watch');
const ignoreMissingIcons = process.argv.includes('--ignore-missing');

const logger = new ConsoleLogger();
const scanner = new ScannerFacade(new RealFileSystemAdapter(), new RealModuleResolver(), logger);

async function run() {
  let fileConfig = {};
  const configPath = join(process.cwd(), 'ng-icons-manager.config.mjs');

  if (existsSync(configPath)) {
    try {
      // Use pathToFileURL to ensure Windows compatibility for dynamic imports
      const module = await import(pathToFileURL(configPath).href);
      fileConfig = module.default || {};
      if (verbose) {
        logger.log(`Loaded config from ${configPath}`);
      }
    } catch (e) {
      console.error(`Failed to load config from ${configPath}: ${e.message}`);
    }
  }

  const result = await scanner.scanAndCopy(
    {
      verbose,
      watchMode,
    },
    fileConfig,
  );

  const hasErrorsInSingleRunWithoutIgnoringErrors = result.errors.length > 0 && !watchMode && !ignoreMissingIcons;
  if (hasErrorsInSingleRunWithoutIgnoringErrors) {
    process.exit(1);
  }
}

async function main() {
  if (verbose) {
    logger.log(`ng-icons-manager cwd: "${process.cwd()}"`);
  }

  await run();

  if (!watchMode) return;

  logger.log('ng-icons-manager watching...');
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
        logger.log(`Changes detected in ${changedPath}`);
      }
      await run();
    });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
