#!/usr/bin/env node
const chokidar = require('chokidar');

const { scanAndCopy } = require('../src/index');

const watchMode = process.argv.includes('--watch');
const verbose = process.argv.includes('--verbose');
const ignoreMissingIcons = process.argv.includes('--ignore-missing');
const cwd = process.cwd();

async function run() {
  await scanAndCopy(verbose, watchMode, ignoreMissingIcons);
}

async function main() {
  if (verbose) {
    console.log(`🏠 ng-icons-manager cwd: "${cwd}"`);
  }

  await run();

  if (!watchMode) {
    return;
  }
  console.log('👀 ng-icons-manager watching...');

  chokidar
    .watch('.', {
      ignored: (path, stats) => {
        if (path.includes('node_modules') || path.includes('.angular') || path.includes('dist')) return true;

        if (stats?.isFile()) return !/\.(html|ts)$/.test(path);

        return false;
      },
      cwd: process.cwd(),
      ignoreInitial: true,
    })
    .on('all', async (_, path) => {
      if (verbose) {
        console.log(`👀 Changes in ${path}`);
      }
      await run();
    });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
