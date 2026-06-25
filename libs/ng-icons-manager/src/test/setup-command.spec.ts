import { join } from 'node:path';

import { SetupCommand } from '../internal/cli/setup-command';
import { FakeFileSystem, FakeLogger } from './fakes';

describe('setup command', () => {
  const root = join('/', 'workspace');
  const configPath = join(root, 'ng-icons-manager.config.mjs');
  let fs: FakeFileSystem;
  let logger: FakeLogger;
  let setup: SetupCommand;

  beforeEach(() => {
    fs = new FakeFileSystem();
    fs.directory(root);
    logger = new FakeLogger();
    setup = new SetupCommand(fs, logger);
  });

  it('lists available presets', () => {
    setup.listPresets();

    expect(logger.infos).toEqual([
      'Available ng-icons-manager setup presets:',
      expect.stringContaining('angular:'),
      expect.stringContaining('angular-monorepo:'),
      expect.stringContaining('nx-monorepo:'),
      expect.stringContaining('nx-angular:'),
      expect.stringContaining('angular-assets:'),
    ]);
  });

  it('writes an angular config and loader guidance', () => {
    setup.run(configPath, 'angular', false);

    expect(fs.readFile(configPath)).toBe(`import { defineConfig } from 'ng-icons-manager';

export default defineConfig({
  jobs: {
    app: {
      inputDirs: ['src'],
      outputDir: 'public/icons',
    },
  },
});
`);
    expect(logger.infos).toEqual(
      expect.arrayContaining([
        `Created ${configPath}`,
        'Selected preset: angular',
        'Output directory: public/icons',
        '- provideNgIconLoader path: /icons/${name}.svg',
        "provideNgIconLoader((name) => http.get(`/icons/${name}.svg`, { responseType: 'text' }))",
      ]),
    );
  });

  it('writes the legacy assets preset and guidance', () => {
    setup.run(configPath, 'angular-assets', false);

    expect(fs.readFile(configPath)).toContain("outputDir: 'src/assets/icons'");
    expect(logger.infos).toEqual(
      expect.arrayContaining([
        'Selected preset: angular-assets',
        '- provideNgIconLoader path: /assets/icons/${name}.svg',
        "provideNgIconLoader((name) => http.get(`/assets/icons/${name}.svg`, { responseType: 'text' }))",
      ]),
    );
  });

  it('refuses to overwrite existing config unless forced', () => {
    fs.writeFile(configPath, 'existing');

    expect(() => setup.run(configPath, 'angular', false)).toThrow('already exists');
    expect(fs.readFile(configPath)).toBe('existing');

    setup.run(configPath, 'angular', true);

    expect(fs.readFile(configPath)).toContain("outputDir: 'public/icons'");
  });

  it('rejects unknown presets with the available names', () => {
    expect(() => setup.run(configPath, 'unknown', false)).toThrow('Available presets: angular, angular-monorepo, nx-monorepo, nx-angular, angular-assets');
  });
});
