import type { FileSystemAdapter, Logger, ModuleResolver } from '../types';

export class MockFileSystemAdapter implements FileSystemAdapter {
  private files = new Map<string, string>();
  private directories = new Set<string>();

  readFile(path: string): string {
    const content = this.files.get(path);
    if (content === undefined) {
      throw new Error(`File not found: ${path}`);
    }
    return content;
  }

  writeFile(path: string, content: string): void {
    this.files.set(path, content);
  }

  removeFile(path: string): void {
    this.files.delete(path);
  }

  removeDirectory(path: string): void {
    this.directories.delete(path);
    // Remove all files in directory
    for (const filePath of this.files.keys()) {
      if (filePath.startsWith(path + '/')) {
        this.files.delete(filePath);
      }
    }
  }

  createDirectory(path: string): void {
    this.directories.add(path);
  }

  glob(pattern: string): string[] {
    // Simple mock implementation
    return Array.from(this.files.keys()).filter((path) => path.endsWith('.html') || path.endsWith('.ts'));
  }

  exists(path: string): boolean {
    return this.files.has(path) || this.directories.has(path);
  }

  // Test helpers
  setFile(path: string, content: string): void {
    this.files.set(path, content);
  }

  getFile(path: string): string | undefined {
    return this.files.get(path);
  }

  hasFile(path: string): boolean {
    return this.files.has(path);
  }

  getWrittenFiles(): string[] {
    return Array.from(this.files.keys());
  }

  clear(): void {
    this.files.clear();
    this.directories.clear();
  }
}

export class MockModuleResolver implements ModuleResolver {
  private modules = new Map<string, Record<string, string>>();

  async resolve(packageName: string): Promise<Record<string, string>> {
    const module = this.modules.get(packageName);
    if (!module) {
      throw new Error(`Module not found: ${packageName}`);
    }
    return module;
  }

  setModule(packageName: string, icons: Record<string, string>): void {
    this.modules.set(packageName, icons);
  }
}

export class MockLogger implements Logger {
  private logs: string[] = [];
  private errors: string[] = [];

  log(message: string): void {
    this.logs.push(message);
  }

  error(message: string): void {
    this.errors.push(message);
  }

  getLogs(): string[] {
    return [...this.logs];
  }

  getErrors(): string[] {
    return [...this.errors];
  }

  clear(): void {
    this.logs.length = 0;
    this.errors.length = 0;
  }
}
