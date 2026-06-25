type MaterialIconPackage = '@ng-icons/material-icons' | '@ng-icons/material-symbols';

export interface PackagePreferences {
  mat?: MaterialIconPackage;
}

export interface NgIconsManagerDefaults {
  include?: string[];
  exclude?: string[];
}

export interface NgIconsManagerJobConfig extends NgIconsManagerDefaults {
  inputDirs: string[];
  outputDir: string;
  packagePreferences?: PackagePreferences;
}

export interface NgIconsManagerConfig {
  defaults?: NgIconsManagerDefaults;
  jobs: Record<string, NgIconsManagerJobConfig>;
}

export function defineConfig<const T extends NgIconsManagerConfig>(config: T): T {
  return config;
}
