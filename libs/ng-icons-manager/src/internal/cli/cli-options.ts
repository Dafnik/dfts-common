import { extname } from 'node:path';
import { parseArgs } from 'node:util';

const CONFIG_EXTENSIONS = new Set(['.mts', '.mjs']);

export type CliOptions = RunCliOptions | SetupCliOptions;

export interface RunCliOptions {
  command: 'run';
  configPath?: string;
  jobs: string[];
  watch: boolean;
  verbose: boolean;
  ignoreMissing: boolean;
}

export interface SetupCliOptions {
  command: 'setup';
  configPath?: string;
  preset?: string;
  listPresets: boolean;
  force: boolean;
}

export function parseCliOptions(args: string[]): CliOptions {
  const { values, tokens, positionals } = parseArgs({
    args,
    allowPositionals: true,
    strict: true,
    tokens: true,
    options: {
      config: { type: 'string' },
      job: { type: 'string', multiple: true },
      watch: { type: 'boolean' },
      verbose: { type: 'boolean' },
      'ignore-missing': { type: 'boolean' },
      preset: { type: 'string' },
      'list-presets': { type: 'boolean' },
      force: { type: 'boolean' },
    },
  });

  once(tokens, 'config');
  once(tokens, 'preset');
  const config = stringValue(values, 'config');
  if (config && !CONFIG_EXTENSIONS.has(extname(config))) throw new Error('--config requires a .mts or .mjs file');

  if (positionals.length === 0) return runOptions(values);
  if (positionals.length === 1 && positionals[0] === 'setup') return setupOptions(values);
  throw new Error(`Unknown command: ${positionals.join(' ')}`);
}

function runOptions(values: ParsedValues): RunCliOptions {
  const watch = booleanValue(values, 'watch');
  const ignoreMissing = booleanValue(values, 'ignore-missing');
  if (stringValue(values, 'preset')) throw new Error('--preset can only be used with setup');
  if (booleanValue(values, 'list-presets')) throw new Error('--list-presets can only be used with setup');
  if (booleanValue(values, 'force')) throw new Error('--force can only be used with setup');
  if (watch && ignoreMissing) throw new Error('--ignore-missing cannot be used with --watch');

  return {
    command: 'run',
    configPath: stringValue(values, 'config'),
    jobs: [...new Set(stringArrayValue(values, 'job'))],
    watch,
    verbose: booleanValue(values, 'verbose'),
    ignoreMissing,
  };
}

function setupOptions(values: ParsedValues): SetupCliOptions {
  const preset = stringValue(values, 'preset');
  const listPresets = booleanValue(values, 'list-presets');
  if (stringArrayValue(values, 'job').length) throw new Error('--job cannot be used with setup');
  if (booleanValue(values, 'watch')) throw new Error('--watch cannot be used with setup');
  if (booleanValue(values, 'verbose')) throw new Error('--verbose cannot be used with setup');
  if (booleanValue(values, 'ignore-missing')) throw new Error('--ignore-missing cannot be used with setup');
  if (preset && listPresets) throw new Error('--preset cannot be used with --list-presets');

  return {
    command: 'setup',
    configPath: stringValue(values, 'config'),
    preset,
    listPresets,
    force: booleanValue(values, 'force'),
  };
}

function once(tokens: ReturnType<typeof parseArgs>['tokens'], name: string): void {
  const matches = tokens?.filter((token) => token.kind === 'option' && token.name === name) ?? [];
  if (matches.length > 1) {
    throw new Error(`--${name} may only be supplied once`);
  }
}

function stringValue(values: ParsedValues, name: string): string | undefined {
  const value = values[name];
  return typeof value === 'string' ? value : undefined;
}

function booleanValue(values: ParsedValues, name: string): boolean {
  const value = values[name];
  return typeof value === 'boolean' ? value : false;
}

function stringArrayValue(values: ParsedValues, name: string): string[] {
  const value = values[name];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

type ParsedValues = ReturnType<typeof parseArgs>['values'];
