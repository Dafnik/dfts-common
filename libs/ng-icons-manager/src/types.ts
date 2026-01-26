// types.ts
export interface FileSystemAdapter {
  readFile(path: string): string;
  writeFile(path: string, content: string): void;
  removeFile(path: string): void;
  removeDirectory(path: string): void;
  createDirectory(path: string): void;
  glob(pattern: string): string[];
  exists(path: string): boolean;
  readDirectory(path: string): string[];
}

export interface ModuleResolver {
  resolve(packageName: string): Promise<Record<string, string>>;
}

export interface Logger {
  log(message: string): void;
  error(message: string): void;
}

export interface IconScannerConfig {
  srcDirs: string[];
  outDir: string;
  iconMap: Record<string, string>;
}

export interface IconScannerRunOptions {
  verbose?: boolean;
  watchMode?: boolean;
}

export interface ScanResult {
  usedIcons: Set<string>;
  errors: string[];
}
