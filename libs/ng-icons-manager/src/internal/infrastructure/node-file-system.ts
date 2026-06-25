import { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, realpathSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { glob } from 'node:fs/promises';
import { resolve } from 'node:path';

import type { DirectoryEntry, FileSystem, GlobOptions } from '../core/ports';

export class NodeFileSystem implements FileSystem {
  exists(path: string): boolean {
    return existsSync(path);
  }

  isDirectory(path: string): boolean {
    return statSync(path).isDirectory();
  }

  isSymbolicLink(path: string): boolean {
    return lstatSync(path).isSymbolicLink();
  }

  realPath(path: string): string {
    return realpathSync(path);
  }

  readFile(path: string): string {
    return readFileSync(path, 'utf8');
  }

  writeFile(path: string, content: string): void {
    writeFileSync(path, content, 'utf8');
  }

  readDirectory(path: string): DirectoryEntry[] {
    return readdirSync(path, { withFileTypes: true }).map((entry) => ({ name: entry.name, isFile: entry.isFile() }));
  }

  createDirectory(path: string): void {
    mkdirSync(path, { recursive: true });
  }

  remove(path: string): void {
    rmSync(path, { recursive: true, force: true });
  }

  async glob(patterns: string[], options: GlobOptions): Promise<string[]> {
    const files: string[] = [];
    for await (const file of glob(patterns, {
      cwd: options.cwd,
      exclude: options.ignore,
    })) {
      if (this.isDirectory(resolve(options.cwd, file))) continue;
      files.push(resolve(options.cwd, file));
    }
    return files;
  }
}
