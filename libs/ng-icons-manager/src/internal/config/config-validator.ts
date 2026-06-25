import { isAbsolute, win32 } from 'node:path';

import type { NgIconsManagerDefaults, PackagePreferences } from '../../index';
import { ConfigError } from '../core/issues';
import type { ValidatedJobConfig, ValidatedManagerConfig } from './models';

const DEFAULT_INCLUDE = ['**/*.{html,ts}'];
const DEFAULT_EXCLUDE: string[] = [];
const CONFIG_KEYS = new Set(['defaults', 'jobs']);
const DEFAULT_KEYS = new Set(['include', 'exclude']);
const JOB_KEYS = new Set(['inputDirs', 'outputDir', 'include', 'exclude', 'packagePreferences']);
const PREFERENCE_KEYS = new Set(['mat']);
const MATERIAL_PACKAGES = new Set(['@ng-icons/material-icons', '@ng-icons/material-symbols']);

export class ConfigValidator {
  validate(value: unknown): ValidatedManagerConfig {
    const config = object(value, 'config');
    knownKeys(config, CONFIG_KEYS, 'config');

    const defaults = this.defaults(config['defaults']);
    const jobsValue = object(config['jobs'], 'config.jobs');
    const entries = Object.entries(jobsValue);
    if (entries.length === 0) throw new ConfigError('config.jobs must contain at least one named job');

    const jobs = Object.fromEntries(entries.map(([name, job]) => [name, this.job(name, job, defaults)]));
    return { jobs };
  }

  private defaults(value: unknown): Required<NgIconsManagerDefaults> {
    if (value === undefined) return { include: [...DEFAULT_INCLUDE], exclude: [...DEFAULT_EXCLUDE] };

    const defaults = object(value, 'config.defaults');
    knownKeys(defaults, DEFAULT_KEYS, 'config.defaults');
    return {
      include: globs(defaults['include'], 'config.defaults.include', DEFAULT_INCLUDE),
      exclude: globs(defaults['exclude'], 'config.defaults.exclude', DEFAULT_EXCLUDE),
    };
  }

  private job(name: string, value: unknown, defaults: Required<NgIconsManagerDefaults>): ValidatedJobConfig {
    if (name.trim().length === 0) throw new ConfigError('Job names must not be empty');

    const label = `config.jobs.${name}`;
    const job = object(value, label);
    knownKeys(job, JOB_KEYS, label);

    return {
      name,
      inputDirs: nonEmptyStrings(job['inputDirs'], `${label}.inputDirs`),
      outputDir: relativePath(job['outputDir'], `${label}.outputDir`),
      include: globs(job['include'], `${label}.include`, defaults.include),
      exclude: globs(job['exclude'], `${label}.exclude`, defaults.exclude),
      packagePreferences: preferences(job['packagePreferences'], `${label}.packagePreferences`),
    };
  }
}

function preferences(value: unknown, label: string): PackagePreferences {
  if (value === undefined) return {};

  const result = object(value, label);
  knownKeys(result, PREFERENCE_KEYS, label);
  const mat = result['mat'];
  if (mat !== undefined && (typeof mat !== 'string' || !MATERIAL_PACKAGES.has(mat))) {
    throw new ConfigError(`${label}.mat must be "@ng-icons/material-icons" or "@ng-icons/material-symbols"`);
  }
  return mat === undefined ? {} : { mat: mat as PackagePreferences['mat'] };
}

function globs(value: unknown, label: string, fallback: string[]): string[] {
  if (value === undefined) return [...fallback];
  const result = strings(value, label);
  for (const pattern of result) relativePath(pattern, label, 'glob');
  return result;
}

function nonEmptyStrings(value: unknown, label: string): string[] {
  const result = strings(value, label);
  if (result.length === 0) throw new ConfigError(`${label} must be a non-empty array`);
  return result.map((path, index) => relativePath(path, `${label}[${index}]`));
}

function strings(value: unknown, label: string): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    throw new ConfigError(`${label} must be an array of strings`);
  }
  return [...value];
}

function relativePath(value: unknown, label: string, noun = 'path'): string {
  if (
    typeof value !== 'string' ||
    value.length === 0 ||
    isAbsolute(value) ||
    win32.isAbsolute(value) ||
    value.split(/[\\/]/).includes('..')
  ) {
    throw new ConfigError(`${label} contains an invalid relative ${noun}`);
  }
  return value;
}

function object(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new ConfigError(`${label} must be an object`);
  }
  return value as Record<string, unknown>;
}

function knownKeys(value: Record<string, unknown>, allowed: Set<string>, label: string): void {
  const unknown = Object.keys(value).filter((key) => !allowed.has(key));
  if (unknown.length > 0) throw new ConfigError(`${label} contains unknown properties: ${unknown.join(', ')}`);
}
