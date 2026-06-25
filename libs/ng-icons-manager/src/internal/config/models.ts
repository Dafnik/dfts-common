import type { PackagePreferences } from '../../index';

export interface ValidatedJobConfig {
  name: string;
  inputDirs: string[];
  outputDir: string;
  include: string[];
  exclude: string[];
  packagePreferences: PackagePreferences;
}

export interface ValidatedManagerConfig {
  jobs: Record<string, ValidatedJobConfig>;
}

export type ResolvedJobConfig = ValidatedJobConfig;

export interface ResolvedManagerConfig {
  configDir: string;
  configPath: string;
  jobs: Record<string, ResolvedJobConfig>;
}
