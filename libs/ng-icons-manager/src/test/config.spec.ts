import { join } from 'node:path';

import { ConfigLoader } from '../internal/config/config-loader';
import { ConfigValidator } from '../internal/config/config-validator';
import { OutputPathPolicy } from '../internal/config/output-path-policy';
import { ConfigError } from '../internal/core/issues';
import { FakeConfigImporter, FakeFileSystem } from './fakes';

describe('configuration', () => {
  const root = join('/', 'workspace');
  const configPath = join(root, 'ng-icons-manager.config.mts');
  const fallbackConfigPath = join(root, 'ng-icons-manager.config.mjs');
  let fs: FakeFileSystem;
  let importer: FakeConfigImporter;
  let validator: ConfigValidator;
  let paths: OutputPathPolicy;
  let loader: ConfigLoader;

  beforeEach(() => {
    fs = new FakeFileSystem();
    fs.directory(join(root, 'apps/app/src'));
    fs.directory(join(root, 'apps/admin/src'));
    fs.writeFile(configPath, 'config');
    importer = new FakeConfigImporter();
    validator = new ConfigValidator();
    paths = new OutputPathPolicy(fs);
    loader = new ConfigLoader(fs, importer, validator, paths);
  });

  it('prefers mts for default runs and falls back to mjs', () => {
    expect(loader.defaultSetupPath(root)).toBe(configPath);
    expect(loader.defaultRunPath(root)).toBe(configPath);

    fs.files.delete(configPath);
    fs.writeFile(fallbackConfigPath, 'config');

    expect(loader.defaultRunPath(root)).toBe(fallbackConfigPath);
    expect(loader.defaultSetupPath(root)).toBe(configPath);
  });

  it('accepts mts and mjs config files and rejects other extensions', async () => {
    importer.value = moduleWith({
      jobs: { app: { inputDirs: ['apps/app/src'], outputDir: 'apps/app/public/icons' } },
    });
    fs.writeFile(fallbackConfigPath, 'config');

    await expect(loader.load(configPath)).resolves.toMatchObject({ configPath });
    await expect(loader.load(fallbackConfigPath)).resolves.toMatchObject({ configPath: fallbackConfigPath });
    await expect(loader.load(join(root, 'ng-icons-manager.config.js'))).rejects.toThrow('.mts or .mjs');
  });

  it('applies built-in glob defaults and resolves paths', async () => {
    importer.value = moduleWith({
      jobs: { app: { inputDirs: ['apps/app/src'], outputDir: 'apps/app/public/icons' } },
    });

    const config = await loader.load(configPath);

    expect(config.jobs['app']).toMatchObject({
      include: ['**/*.{html,ts}'],
      exclude: [],
      inputDirs: [join(root, 'apps/app/src')],
      outputDir: join(root, 'apps/app/public/icons'),
    });
  });

  it('lets job globs replace global defaults', () => {
    const config = validator.validate({
      defaults: { include: ['**/*.html'], exclude: ['**/*.spec.ts'] },
      jobs: {
        app: {
          inputDirs: ['apps/app/src'],
          outputDir: 'apps/app/public/icons',
          include: ['**/*.ts'],
          exclude: [],
        },
      },
    });

    expect(config.jobs['app']?.include).toEqual(['**/*.ts']);
    expect(config.jobs['app']?.exclude).toEqual([]);
  });

  it.each([
    [{ jobs: {} }, 'at least one named job'],
    [{ unknown: true, jobs: { app: {} } }, 'unknown properties'],
    [{ jobs: { app: { inputDirs: [], outputDir: 'out' } } }, 'non-empty array'],
    [{ jobs: { app: { inputDirs: ['../src'], outputDir: 'out' } } }, 'invalid relative path'],
    [{ jobs: { app: { inputDirs: ['C:\\src'], outputDir: 'out' } } }, 'invalid relative path'],
    [{ jobs: { app: { inputDirs: ['apps/app/src'], outputDir: 'out', packagePreferences: { mat: 'bad' } } } }, 'material-icons'],
  ])('rejects invalid schema %#', (value, message) => {
    expect(() => validator.validate(value)).toThrow(message);
  });

  it('reports missing and symlinked inputs as job-scoped validation issues', () => {
    const missing = validator.validate({ jobs: { app: { inputDirs: ['missing'], outputDir: 'out' } } });
    const missingConfig = paths.resolve(configPath, missing);
    expect(paths.validateInputs(missingConfig, missingConfig.jobs['app'])).toEqual([
      expect.objectContaining({ kind: 'read', message: expect.stringContaining('existing directory') }),
    ]);

    fs.symlinks.add(join(root, 'linked'));
    fs.directory(join(root, 'linked/src'));
    const linked = validator.validate({ jobs: { app: { inputDirs: ['linked/src'], outputDir: 'out' } } });
    const linkedConfig = paths.resolve(configPath, linked);
    expect(paths.validateInputs(linkedConfig, linkedConfig.jobs['app'])).toEqual([
      expect.objectContaining({ kind: 'read', message: expect.stringContaining('symbolic link') }),
    ]);
  });

  it('allows shared inputs and outputs below inputs', () => {
    const config = validator.validate({
      jobs: {
        app: { inputDirs: ['apps/app/src'], outputDir: 'apps/app/src/generated' },
        admin: { inputDirs: ['apps/app/src'], outputDir: 'apps/admin/public/icons' },
      },
    });

    expect(() => paths.resolve(configPath, config)).not.toThrow();
  });

  it('rejects output roots, input ancestors, and overlapping outputs', () => {
    const inputAncestor = validator.validate({
      jobs: { app: { inputDirs: ['apps/app/src'], outputDir: 'apps' } },
    });
    expect(() => paths.resolve(configPath, inputAncestor)).toThrow('contain an input');

    const overlapping = validator.validate({
      jobs: {
        app: { inputDirs: ['apps/app/src'], outputDir: 'dist/icons' },
        admin: { inputDirs: ['apps/admin/src'], outputDir: 'dist/icons/admin' },
      },
    });
    expect(() => paths.resolve(configPath, overlapping)).toThrow('equal or nested');
  });

  it('wraps module import failures as ConfigError', async () => {
    importer.error = new Error('bad syntax');
    await expect(loader.load(configPath)).rejects.toEqual(
      expect.objectContaining<Partial<ConfigError>>({ name: 'ConfigError', message: expect.stringContaining('bad syntax') }),
    );
  });
});

function moduleWith(config: unknown): Record<string, unknown> {
  return { default: config };
}
