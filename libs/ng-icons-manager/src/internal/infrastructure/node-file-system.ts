import { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, realpathSync, rmSync, statSync, writeFileSync } from 'node:fs';

import { glob } from 'glob';

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

  glob(patterns: string[], options: GlobOptions): string[] {
    return glob.sync(patterns, {
      absolute: true,
      cwd: options.cwd,
      dot: false,
      follow: false,
      ignore: options.ignore,
      nodir: true,
    });
  }
}
