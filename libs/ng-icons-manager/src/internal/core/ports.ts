export interface DirectoryEntry {
  name: string;
  isFile: boolean;
}

export interface GlobOptions {
  cwd: string;
  ignore: string[];
}

export interface FileSystem {
  exists(path: string): boolean;
  isDirectory(path: string): boolean;
  isSymbolicLink(path: string): boolean;
  realPath(path: string): string;
  readFile(path: string): string;
  writeFile(path: string, content: string): void;
  readDirectory(path: string): DirectoryEntry[];
  createDirectory(path: string): void;
  remove(path: string): void;
  glob(patterns: string[], options: GlobOptions): Promise<string[]>;
}

export interface ModuleLoader {
  load(specifier: string): Promise<Record<string, unknown>>;
}

export interface ConfigModuleImporter {
  importFile(path: string, cacheBust: boolean): Promise<Record<string, unknown>>;
}

export interface Logger {
  info(message: string): void;
  error(message: string): void;
}

export interface WatchOptions {
  ignored?: (path: string) => boolean;
}

export interface WatchHandle {
  onEvent(listener: () => void): void;
  onError(listener: (error: unknown) => void): void;
  ready(): Promise<void>;
  close(): Promise<void>;
}

export interface WatcherFactory {
  watch(paths: string | string[], options?: WatchOptions): WatchHandle;
}
