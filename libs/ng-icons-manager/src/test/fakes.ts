import { dirname, sep } from 'node:path';

import { ModuleNotFoundError } from '../internal/core/issues';
import type {
  ConfigModuleImporter,
  DirectoryEntry,
  FileSystem,
  GlobOptions,
  Logger,
  ModuleLoader,
  WatchHandle,
  WatchOptions,
  WatcherFactory,
} from '../internal/core/ports';

export class FakeFileSystem implements FileSystem {
  readonly files = new Map<string, string>();
  readonly directories = new Set<string>();
  readonly symlinks = new Set<string>();
  readonly globCalls: Array<{ patterns: string[]; options: GlobOptions }> = [];
  readonly globResults = new Map<string, string[]>();
  readonly globErrors = new Map<string, Error>();

  exists(path: string): boolean {
    return this.files.has(path) || this.directories.has(path) || this.symlinks.has(path);
  }

  isDirectory(path: string): boolean {
    return this.directories.has(path);
  }

  isSymbolicLink(path: string): boolean {
    return this.symlinks.has(path);
  }

  realPath(path: string): string {
    return path;
  }

  readFile(path: string): string {
    const content = this.files.get(path);
    if (content === undefined) throw new Error(`File not found: ${path}`);
    return content;
  }

  writeFile(path: string, content: string): void {
    this.directory(dirname(path));
    this.files.set(path, content);
  }

  readDirectory(path: string): DirectoryEntry[] {
    const prefix = `${path}${sep}`;
    const entries = new Map<string, DirectoryEntry>();
    for (const file of this.files.keys()) {
      if (!file.startsWith(prefix)) continue;
      const name = file.slice(prefix.length).split(sep)[0];
      entries.set(name, { name, isFile: !file.slice(prefix.length).includes(sep) });
    }
    for (const directory of this.directories) {
      if (!directory.startsWith(prefix)) continue;
      const name = directory.slice(prefix.length).split(sep)[0];
      if (name) entries.set(name, { name, isFile: false });
    }
    return [...entries.values()];
  }

  createDirectory(path: string): void {
    this.directory(path);
  }

  remove(path: string): void {
    this.files.delete(path);
    this.directories.delete(path);
    this.symlinks.delete(path);
    const prefix = `${path}${sep}`;
    for (const file of this.files.keys()) if (file.startsWith(prefix)) this.files.delete(file);
    for (const directory of this.directories) if (directory.startsWith(prefix)) this.directories.delete(directory);
  }

  glob(patterns: string[], options: GlobOptions): string[] {
    this.globCalls.push({ patterns, options });
    const error = this.globErrors.get(options.cwd);
    if (error) throw error;
    const configured = this.globResults.get(options.cwd);
    if (configured) return [...configured];
    const prefix = `${options.cwd}${sep}`;
    return [...this.files.keys()].filter((file) => file.startsWith(prefix));
  }

  directory(path: string): void {
    let current = path;
    while (current && !this.directories.has(current)) {
      this.directories.add(current);
      const parent = dirname(current);
      if (parent === current) break;
      current = parent;
    }
  }
}

export class FakeModuleLoader implements ModuleLoader {
  readonly modules = new Map<string, Record<string, unknown> | Error>();
  readonly calls: string[] = [];

  async load(specifier: string): Promise<Record<string, unknown>> {
    this.calls.push(specifier);
    const value = this.modules.get(specifier);
    if (value instanceof Error) throw value;
    if (!value) throw new ModuleNotFoundError(specifier);
    return value;
  }
}

export class FakeConfigImporter implements ConfigModuleImporter {
  value: Record<string, unknown> = {};
  error?: Error;

  async importFile(): Promise<Record<string, unknown>> {
    if (this.error) throw this.error;
    return this.value;
  }
}

export class FakeLogger implements Logger {
  readonly infos: string[] = [];
  readonly errors: string[] = [];

  info(message: string): void {
    this.infos.push(message);
  }

  error(message: string): void {
    this.errors.push(message);
  }
}

export class FakeWatcherFactory implements WatcherFactory {
  readonly handles: FakeWatchHandle[] = [];

  watch(paths: string | string[], options?: WatchOptions): WatchHandle {
    const handle = new FakeWatchHandle(paths, options);
    this.handles.push(handle);
    return handle;
  }
}

export class FakeWatchHandle implements WatchHandle {
  closed = false;
  private event?: () => void;
  private error?: (error: unknown) => void;

  constructor(
    readonly paths: string | string[],
    readonly options?: WatchOptions,
  ) {}

  onEvent(listener: () => void): void {
    this.event = listener;
  }

  onError(listener: (error: unknown) => void): void {
    this.error = listener;
  }

  ready(): Promise<void> {
    return Promise.resolve();
  }

  async close(): Promise<void> {
    this.closed = true;
  }

  emit(): void {
    this.event?.();
  }

  fail(error: unknown): void {
    this.error?.(error);
  }
}
