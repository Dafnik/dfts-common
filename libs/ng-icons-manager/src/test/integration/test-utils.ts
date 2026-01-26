import { exec } from 'child_process';
import { mkdtemp, rm, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

export interface CliResult {
  code: number;
  stdout: string;
  stderr: string;
  error?: Error;
}

export async function createTempDir(): Promise<string> {
  return mkdtemp(join(tmpdir(), 'ng-icons-manager-test-'));
}

export async function removeTempDir(dir: string): Promise<void> {
  await rm(dir, { recursive: true, force: true });
}

export async function ensureBuild(): Promise<void> {
  return new Promise((resolve, reject) => {
    exec('npx nx run ng-icons-manager:build', { cwd: join(__dirname, '../../../../') }, (error, stdout, stderr) => {
      if (error) {
        console.error(stderr);
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

export async function runCli(cwd: string, args: string[] = []): Promise<CliResult> {
  const workspaceRoot = join(process.cwd(), '../../');
  const cliPath = join(workspaceRoot, 'dist/libs/ng-icons-manager/cli.cjs.js');

  const command = `node ${cliPath} ${args.join(' ')}`;

  return new Promise((resolve) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      resolve({
        code: error ? error.code || 1 : 0,
        stdout,
        stderr,
        error: error || undefined,
      });
    });
  });
}

export async function createConfigFile(cwd: string, config: any): Promise<void> {
  const content = `export default ${JSON.stringify(config, null, 2)};`;
  await writeFile(join(cwd, 'ng-icons-manager.config.mjs'), content);
}

export async function createSourceFile(cwd: string, path: string, content: string): Promise<void> {
  const fullPath = join(cwd, path);
  const dir = fullPath.substring(0, fullPath.lastIndexOf('/'));
  await mkdir(dir, { recursive: true });
  await writeFile(fullPath, content);
}
