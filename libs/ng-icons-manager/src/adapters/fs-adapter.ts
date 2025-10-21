import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { glob } from 'glob';

import type { FileSystemAdapter } from '../types';

export class RealFileSystemAdapter implements FileSystemAdapter {
  readFile(path: string): string {
    return readFileSync(path, 'utf-8');
  }

  writeFile(path: string, content: string): void {
    writeFileSync(path, content, 'utf-8');
  }

  removeFile(path: string): void {
    rmSync(path, { force: true });
  }

  removeDirectory(path: string): void {
    rmSync(path, { recursive: true, force: true });
  }

  createDirectory(path: string): void {
    mkdirSync(path, { recursive: true });
  }

  glob(pattern: string): string[] {
    return glob.sync(pattern, { absolute: true });
  }

  exists(path: string): boolean {
    return existsSync(path);
  }
}
