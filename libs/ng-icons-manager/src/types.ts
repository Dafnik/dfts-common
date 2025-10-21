// types.ts
export interface FileSystemAdapter {
  readFile(path: string): string;
  writeFile(path: string, content: string): void;
  removeFile(path: string): void;
  removeDirectory(path: string): void;
  createDirectory(path: string): void;
  glob(pattern: string): string[];
  exists(path: string): boolean;
}

export interface ModuleResolver {
  resolve(packageName: string): Promise<Record<string, string>>;
}

export interface Logger {
  log(message: string): void;
  error(message: string): void;
}

export interface IconScannerConfig {
  srcGlob: string;
  outDir: string;
  iconRegex: RegExp;
  iconMap: Record<string, string>;
  verbose: boolean;
  watchMode: boolean;
  ignoreMissingIcons: boolean;
}

export interface ScanResult {
  usedIcons: Set<string>;
  errors: string[];
}
