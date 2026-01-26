import { join } from 'path';
import { existsSync, readFileSync } from 'fs';
import { createTempDir, removeTempDir, runCli, createConfigFile, createSourceFile, ensureBuild } from './test-utils';

// Increase timeout for integration tests as they spawn child processes and build
jest.setTimeout(60000);

describe('CLI Integration', () => {
  let tempDir: string;

  beforeAll(async () => {
    await ensureBuild();
  });

  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    await removeTempDir(tempDir);
  });

  it('should verify setup', () => {
    expect(tempDir).toBeDefined();
  });

  it('should fail if no config is found and default config fails (or just runs)', async () => {
    // Without config, it runs with defaults. If defaults don't match anything, it might just succeed with 0 icons.
    const result = await runCli(tempDir);
    expect(result.code).toBe(0);
  });

  it('should scan and copy icons based on config', async () => {
    // 1. Setup config
    await createConfigFile(tempDir, {
      srcDirs: ['./src'],
      outDir: './src/assets/icons',
      iconMap: {
        hero: '@ng-icons/heroicons',
      },
    });

    // 2. Setup package mocks
    await createSourceFile(
      tempDir,
      'node_modules/@ng-icons/heroicons/package.json',
      JSON.stringify({
        name: '@ng-icons/heroicons',
        main: 'index.mjs',
        type: 'module',
      }),
    );

    await createSourceFile(
      tempDir,
      'node_modules/@ng-icons/heroicons/index.mjs',
      `
      export const heroHome = '<svg>home</svg>';
      export const heroUser = '<svg>user</svg>';
    `,
    );

    // 3. Setup source files
    await createSourceFile(
      tempDir,
      'src/app/app.component.html',
      `
      <ng-icon name="heroHome"></ng-icon>
    `,
    );

    // 4. Run CLI
    const result = await runCli(tempDir, ['--verbose']);

    if (result.code !== 0) {
      console.error(result.stderr);
      console.log(result.stdout);
    }

    expect(result.code).toBe(0);
    expect(result.stdout).toContain('Found 1 icons');

    // 5. Verify output using standard fs checks
    const outputFile = join(tempDir, 'src/assets/icons/heroHome.svg');
    expect(existsSync(outputFile)).toBe(true);
    expect(readFileSync(outputFile, 'utf-8')).toBe('<svg>home</svg>');
  });

  it('should fail when icon package is missing', async () => {
    await createConfigFile(tempDir, {
      srcDirs: ['./src'],
      outDir: './src/assets/icons',
      iconMap: {
        hero: '@ng-icons/missing-package',
      },
    });

    await createSourceFile(
      tempDir,
      'src/app/app.component.html',
      `
      <ng-icon name="heroHome"></ng-icon>
    `,
    );

    const result = await runCli(tempDir);

    expect(result.code).toBe(1);
    // ScannerFacade logs resolving errors to log (stdout) not error
    expect(result.stdout).toContain('Failed to load heroHome from @ng-icons/missing-package');
  });

  it('should ignore missing icons with --ignore-missing', async () => {
    await createConfigFile(tempDir, {
      srcDirs: ['./src'],
      outDir: './src/assets/icons',
      iconMap: {
        hero: '@ng-icons/missing-package',
      },
    });

    await createSourceFile(
      tempDir,
      'src/app/app.component.html',
      `
        <ng-icon name="heroHome"></ng-icon>
      `,
    );

    const result = await runCli(tempDir, ['--ignore-missing']);

    if (result.code !== 0) {
      console.error('Available icons test failed');
      console.error('STDERR:', result.stderr);
      console.error('STDOUT:', result.stdout);
    }
    expect(result.code).toBe(0);
  });
});
