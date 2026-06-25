import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { existsSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  createBootstrapPackage,
  createConfigFile,
  createSourceFile,
  createTempDir,
  cliPath,
  distRoot,
  ensureBuild,
  execute,
  removeTempDir,
  runCli,
} from './test-utils';

jest.setTimeout(60000);

describe('CLI integration', () => {
  let tempDir: string;

  beforeAll(() => ensureBuild());
  beforeEach(async () => {
    tempDir = await createTempDir();
  });
  afterEach(() => removeTempDir(tempDir));

  it('requires a config file', async () => {
    const result = await runCli(tempDir);
    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Config file not found');
  });

  it('loads defineConfig through ESM and runs a selected named job', async () => {
    await createBootstrapPackage(tempDir);
    await createSourceFile(tempDir, 'apps/app/src/app.html', '<ng-icon name="bootstrapAlarm" />');
    await createSourceFile(tempDir, 'apps/admin/src/app.html', '<ng-icon name="bootstrapBell" />');
    await createConfigFile(tempDir, {
      jobs: {
        app: { inputDirs: ['apps/app/src'], outputDir: 'apps/app/public/icons' },
        admin: { inputDirs: ['apps/admin/src'], outputDir: 'apps/admin/public/icons' },
      },
    });

    const result = await runCli(tempDir, ['--job', 'app', '--verbose']);

    expect(result.code).toBe(0);
    expect(readFileSync(join(tempDir, 'apps/app/public/icons/bootstrapAlarm.svg'), 'utf8')).toBe('<svg>alarm</svg>');
    expect(existsSync(join(tempDir, 'apps/admin/public/icons'))).toBe(false);
  });

  it('finishes other jobs and exits 1 when one job fails', async () => {
    await createBootstrapPackage(tempDir);
    await createSourceFile(tempDir, 'apps/app/src/app.html', '<ng-icon name="bootstrapAlarm" />');
    await createSourceFile(tempDir, 'apps/admin/src/app.html', '<ng-icon name="bootstrapMissing" />');
    await createConfigFile(tempDir, {
      jobs: {
        app: { inputDirs: ['apps/app/src'], outputDir: 'apps/app/public/icons' },
        admin: { inputDirs: ['apps/admin/src'], outputDir: 'apps/admin/public/icons' },
      },
    });

    const result = await runCli(tempDir);

    expect(result.code).toBe(1);
    expect(existsSync(join(tempDir, 'apps/app/public/icons/bootstrapAlarm.svg'))).toBe(true);
    expect(existsSync(join(tempDir, 'apps/admin/public/icons'))).toBe(false);
  });

  it('updates valid jobs when another job has a missing input directory', async () => {
    await createBootstrapPackage(tempDir);
    await createSourceFile(tempDir, 'apps/app/src/app.html', '<ng-icon name="bootstrapAlarm" />');
    await createConfigFile(tempDir, {
      jobs: {
        app: { inputDirs: ['apps/app/src'], outputDir: 'apps/app/public/icons' },
        missing: { inputDirs: ['apps/missing/src'], outputDir: 'apps/missing/public/icons' },
      },
    });

    const result = await runCli(tempDir);

    expect(result.code).toBe(1);
    expect(existsSync(join(tempDir, 'apps/app/public/icons/bootstrapAlarm.svg'))).toBe(true);
    expect(existsSync(join(tempDir, 'apps/missing/public/icons'))).toBe(false);
  });

  it('applies globs, ignores hidden and symbolic-link paths, and excludes nested output', async () => {
    await createBootstrapPackage(tempDir);
    await createSourceFile(tempDir, 'src/app.html', '<ng-icon name="bootstrapAlarm" />');
    await createSourceFile(tempDir, 'src/ignored.spec.ts', '/* i(bootstrapMissing) */');
    await createSourceFile(tempDir, 'src/.hidden/hidden.html', '<ng-icon name="bootstrapMissing" />');
    await createSourceFile(tempDir, 'src/link-target.txt', '<ng-icon name="bootstrapMissing" />');
    await createSourceFile(tempDir, 'src/generated/icons/generated.html', '<ng-icon name="bootstrapMissing" />');
    symlinkSync(join(tempDir, 'src/link-target.txt'), join(tempDir, 'src/linked.html'));
    await createConfigFile(tempDir, {
      jobs: {
        app: {
          inputDirs: ['src'],
          outputDir: 'src/generated/icons',
          exclude: ['**/*.spec.ts'],
        },
      },
    });

    const result = await runCli(tempDir);

    expect(result.code).toBe(0);
    expect(readFileSync(join(tempDir, 'src/generated/icons/bootstrapAlarm.svg'), 'utf8')).toBe('<svg>alarm</svg>');
    expect(existsSync(join(tempDir, 'src/generated/icons/generated.html'))).toBe(false);
  });

  it('strictly validates arguments and configuration', async () => {
    expect((await runCli(tempDir, ['--unknown'])).stderr).toContain("Unknown option '--unknown'");
    expect((await runCli(tempDir, ['--config', 'config.js'])).stderr).toContain('.mjs');
  });

  it('supports ESM import from the built package', async () => {
    const esm = await execute(
      process.execPath,
      [
        '--input-type=module',
        '-e',
        `import { defineConfig } from ${JSON.stringify(join(distRoot, 'index.esm.js'))}; console.log(typeof defineConfig)`,
      ],
      tempDir,
    );

    expect(esm).toMatchObject({ code: 0, stdout: 'function\n' });
  });

  it('exits nonzero on an invalid watch-mode config reload without deleting existing output', async () => {
    await createBootstrapPackage(tempDir);
    await createSourceFile(tempDir, 'src/app.html', '<ng-icon name="bootstrapAlarm" />');
    await createConfigFile(tempDir, {
      jobs: { app: { inputDirs: ['src'], outputDir: 'public/icons' } },
    });
    const child = spawn(process.execPath, [cliPath, '--watch'], { cwd: tempDir });

    try {
      await waitForOutput(child, 'Watching 1 ng-icons-manager job(s)');
      const output = join(tempDir, 'public/icons/bootstrapAlarm.svg');
      expect(existsSync(output)).toBe(true);

      writeFileSync(join(tempDir, 'ng-icons-manager.config.mjs'), 'export default { jobs: {} };\n');
      const code = await waitForExit(child);

      expect(code).toBe(1);
      expect(existsSync(output)).toBe(true);
    } finally {
      if (child.exitCode === null) child.kill('SIGTERM');
    }
  });
});

function waitForOutput(child: ChildProcessWithoutNullStreams, expected: string): Promise<void> {
  return new Promise((resolve, reject) => {
    let output = '';
    const timeout = setTimeout(() => reject(new Error(`Timed out waiting for output: ${output}`)), 10000);
    const onData = (chunk: Buffer) => {
      output += chunk.toString();
      if (output.includes(expected)) {
        clearTimeout(timeout);
        child.stdout.off('data', onData);
        resolve();
      }
    };
    child.stdout.on('data', onData);
    child.stderr.on('data', (chunk: Buffer) => {
      output += chunk.toString();
    });
  });
}

function waitForExit(child: ChildProcessWithoutNullStreams): Promise<number | null> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Timed out waiting for watch process to exit')), 10000);
    child.once('exit', (code) => {
      clearTimeout(timeout);
      resolve(code);
    });
  });
}
