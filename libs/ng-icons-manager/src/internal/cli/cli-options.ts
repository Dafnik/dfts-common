import { extname } from 'node:path';
import { parseArgs } from 'node:util';

export interface CliOptions {
  configPath?: string;
  jobs: string[];
  watch: boolean;
  verbose: boolean;
  ignoreMissing: boolean;
}

export function parseCliOptions(args: string[]): CliOptions {
  const { values, tokens } = parseArgs({
    args,
    allowPositionals: false,
    strict: true,
    tokens: true,
    options: {
      config: { type: 'string' },
      job: { type: 'string', multiple: true },
      watch: { type: 'boolean' },
      verbose: { type: 'boolean' },
      'ignore-missing': { type: 'boolean' },
    },
  });

  if (tokens.filter((token) => token.kind === 'option' && token.name === 'config').length > 1) {
    throw new Error('--config may only be supplied once');
  }
  if (values.config && extname(values.config) !== '.mjs') throw new Error('--config requires a .mjs file');
  if (values.watch && values['ignore-missing']) throw new Error('--ignore-missing cannot be used with --watch');

  return {
    configPath: values.config,
    jobs: [...new Set(values.job ?? [])],
    watch: values.watch ?? false,
    verbose: values.verbose ?? false,
    ignoreMissing: values['ignore-missing'] ?? false,
  };
}
