import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { vi } from 'vitest';

import {
  createBootstrapPackage,
  createConfigFile,
  createSourceFile,
  createTempDir,
  cliPath,
  distRoot,
  ensureBuild,
  execute,
  linkBuiltNgIconsManager,
  removeTempDir,
  runCli,
} from './test-utils';

vi.setConfig({ testTimeout: 60000 });

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

  it('lists setup presets', async () => {
    const result = await runCli(tempDir, ['setup', '--list-presets']);

    expect(result.code).toBe(0);
    expect(result.stdout).toContain('angular:');
    expect(result.stdout).toContain('angular-monorepo:');
    expect(result.stdout).toContain('nx-monorepo:');
    expect(result.stdout).toContain('nx-angular:');
    expect(result.stdout).toContain('angular-assets:');
  });

  it('requires an interactive terminal or preset for bare setup', async () => {
    const result = await runCli(tempDir, ['setup']);

    expect(result.code).toBe(1);
    expect(result.stderr).toContain('setup requires --preset <name> or an interactive terminal');
  });

  it('creates an angular setup config that can be loaded by a normal run', async () => {
    await createBootstrapPackage(tempDir);
    await linkBuiltNgIconsManager(tempDir);
    await createSourceFile(tempDir, 'src/app.html', '<ng-icon name="bootstrapAlarm" />');

    const setup = await runCli(tempDir, ['setup', '--preset', 'angular']);
    const rerun = await runCli(tempDir, ['setup', '--preset', 'angular']);
    const run = await runCli(tempDir);

    expect(setup.code).toBe(0);
    expect(setup.stdout).toContain('Selected preset: angular');
    expect(setup.stdout).toContain('/icons/${name}.svg');
    expect(readFileSync(join(tempDir, 'ng-icons-manager.config.mts'), 'utf8')).toContain("outputDir: 'public/icons'");
    expect(rerun.code).toBe(1);
    expect(rerun.stderr).toContain('already exists');
    expect(run.code).toBe(0);
    expect(readFileSync(join(tempDir, 'public/icons/bootstrapAlarm.svg'), 'utf8')).toBe('<svg>alarm</svg>');
  });

  it('supports setup force and custom config paths', async () => {
    mkdirSync(join(tempDir, 'tools'), { recursive: true });
    writeFileSync(join(tempDir, 'tools/icons.config.mjs'), 'existing');

    const result = await runCli(tempDir, ['setup', '--preset', 'angular-assets', '--config', 'tools/icons.config.mjs', '--force']);

    expect(result.code).toBe(0);
    expect(result.stdout).toContain('Selected preset: angular-assets');
    expect(result.stdout).toContain('/assets/icons/${name}.svg');
    expect(readFileSync(join(tempDir, 'tools/icons.config.mjs'), 'utf8')).toContain("outputDir: 'src/assets/icons'");
  });

  it('loads a fallback mjs config when the default mts config is missing', async () => {
    await createBootstrapPackage(tempDir);
    await linkBuiltNgIconsManager(tempDir);
    await createSourceFile(tempDir, 'src/app.html', '<ng-icon name="bootstrapAlarm" />');
    writeFileSync(
      join(tempDir, 'ng-icons-manager.config.mjs'),
      `import { defineConfig } from 'ng-icons-manager';

export default defineConfig({
  jobs: {
    app: {
      inputDirs: ['src'],
      outputDir: 'public/icons',
    },
  },
});
`,
    );

    const result = await runCli(tempDir);

    expect(result.code).toBe(0);
    expect(readFileSync(join(tempDir, 'public/icons/bootstrapAlarm.svg'), 'utf8')).toBe('<svg>alarm</svg>');
  });

  it('prefers the default mts config when mts and mjs configs both exist', async () => {
    await createBootstrapPackage(tempDir);
    await linkBuiltNgIconsManager(tempDir);
    await createSourceFile(tempDir, 'src/app.html', '<ng-icon name="bootstrapAlarm" />');
    writeFileSync(
      join(tempDir, 'ng-icons-manager.config.mts'),
      `import { defineConfig } from 'ng-icons-manager';

type JobName = 'app';
const appJob: JobName = 'app';

export default defineConfig({
  jobs: {
    [appJob]: {
      inputDirs: ['src'],
      outputDir: 'public/mts-icons',
    },
  },
});
`,
    );
    writeFileSync(
      join(tempDir, 'ng-icons-manager.config.mjs'),
      `export default { jobs: { app: { inputDirs: ['src'], outputDir: 'public/mjs-icons' } } };
`,
    );

    const result = await runCli(tempDir);

    expect(result.code).toBe(0);
    expect(readFileSync(join(tempDir, 'public/mts-icons/bootstrapAlarm.svg'), 'utf8')).toBe('<svg>alarm</svg>');
    expect(existsSync(join(tempDir, 'public/mjs-icons'))).toBe(false);
  });

  it('loads an explicit custom mts config with erasable TypeScript syntax', async () => {
    await createBootstrapPackage(tempDir);
    await linkBuiltNgIconsManager(tempDir);
    await createSourceFile(tempDir, 'src/app.html', '<ng-icon name="bootstrapAlarm" />');
    writeFileSync(
      join(tempDir, 'icons.config.mts'),
      `import { defineConfig, type NgIconsManagerConfig } from 'ng-icons-manager';

const config: NgIconsManagerConfig = {
  jobs: {
    app: {
      inputDirs: ['src'],
      outputDir: 'public/icons',
    },
  },
};

export default defineConfig(config);
`,
    );

    const result = await runCli(tempDir, ['--config', 'icons.config.mts']);

    expect(result.code).toBe(0);
    expect(readFileSync(join(tempDir, 'public/icons/bootstrapAlarm.svg'), 'utf8')).toBe('<svg>alarm</svg>');
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
    expect((await runCli(tempDir, ['--config', 'config.js'])).stderr).toContain('.mts or .mjs');
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

      writeFileSync(join(tempDir, 'ng-icons-manager.config.mts'), 'export default { jobs: {} };\n');
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
