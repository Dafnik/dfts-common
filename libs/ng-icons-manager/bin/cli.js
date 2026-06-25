#!/usr/bin/env node

import { createCliApplication } from '../src/internal/infrastructure/create-cli-application';

const abort = new AbortController();
const stop = () => abort.abort();
process.once('SIGINT', stop);
process.once('SIGTERM', stop);

createCliApplication()
  .run(process.argv.slice(2), process.cwd(), abort.signal)
  .then((code) => {
    process.exitCode = code;
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    process.off('SIGINT', stop);
    process.off('SIGTERM', stop);
  });
