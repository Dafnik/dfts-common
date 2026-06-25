import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

export interface CliResult {
  code: number;
  stdout: string;
  stderr: string;
}

export const workspaceRoot = join(__dirname, '../../../../../');
export const distRoot = join(workspaceRoot, 'dist/libs/ng-icons-manager');
export const cliPath = join(distRoot, 'cli.esm.js');

export function createTempDir(): Promise<string> {
  return mkdtemp(join(tmpdir(), 'ng-icons-manager-test-'));
}

export function removeTempDir(dir: string): Promise<void> {
  return rm(dir, { recursive: true, force: true });
}

export async function ensureBuild(): Promise<void> {
  const result = await execute('pnpm', ['exec', 'nx', 'run', 'ng-icons-manager:build', '--skip-nx-cache'], workspaceRoot);
  if (result.code !== 0) throw new Error(`Build failed:\n${result.stderr}\n${result.stdout}`);
}

export function runCli(cwd: string, args: string[] = []): Promise<CliResult> {
  return execute(process.execPath, [cliPath, ...args], cwd);
}

export async function createConfigFile(cwd: string, config: unknown): Promise<void> {
  await linkBuiltPackage(cwd);
  const content = `import { defineConfig } from 'ng-icons-manager';\n\nexport default defineConfig(${JSON.stringify(config, null, 2)});\n`;
  await writeFile(join(cwd, 'ng-icons-manager.config.mjs'), content);
}

export function linkBuiltNgIconsManager(cwd: string): Promise<void> {
  return linkBuiltPackage(cwd);
}

export async function createSourceFile(cwd: string, path: string, content: string): Promise<void> {
  const fullPath = join(cwd, path);
  await mkdir(dirname(fullPath), { recursive: true });
  await writeFile(fullPath, content);
}

export async function createBootstrapPackage(cwd: string): Promise<void> {
  await createSourceFile(
    cwd,
    'node_modules/@ng-icons/bootstrap-icons/package.json',
    JSON.stringify({
      name: '@ng-icons/bootstrap-icons',
      type: 'module',
      exports: { '.': './index.mjs' },
    }),
  );
  await createSourceFile(
    cwd,
    'node_modules/@ng-icons/bootstrap-icons/index.mjs',
    `export const bootstrapAlarm = '<svg>alarm</svg>';\nexport const bootstrapBell = '<svg>bell</svg>';`,
  );
}

export function execute(command: string, args: string[], cwd: string): Promise<CliResult> {
  return new Promise((resolve) => {
    execFile(command, args, { cwd }, (error, stdout, stderr) => {
      resolve({ code: typeof error?.code === 'number' ? error.code : error ? 1 : 0, stdout, stderr });
    });
  });
}

async function linkBuiltPackage(cwd: string): Promise<void> {
  const nodeModules = join(cwd, 'node_modules');
  await mkdir(nodeModules, { recursive: true });
  await symlink(distRoot, join(nodeModules, 'ng-icons-manager'), 'dir').catch((error: NodeJS.ErrnoException) => {
    if (error.code !== 'EEXIST') throw error;
  });
}
