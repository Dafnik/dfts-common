import { join } from 'node:path';

import { SetupCommand, type PresetSelector, type SetupPresetMetadata, type SetupPresetName } from '../internal/cli/setup-command';
import { FakeFileSystem, FakeLogger } from './fakes';

class FakePresetSelector implements PresetSelector {
  calls: readonly SetupPresetMetadata[][] = [];
  selection: SetupPresetName | Error = 'angular';

  async select(presets: readonly SetupPresetMetadata[]): Promise<SetupPresetName> {
    this.calls.push(presets);
    if (this.selection instanceof Error) throw this.selection;
    return this.selection;
  }
}

describe('setup command', () => {
  const root = join('/', 'workspace');
  const configPath = join(root, 'ng-icons-manager.config.mts');
  const mjsConfigPath = join(root, 'ng-icons-manager.config.mjs');
  let fs: FakeFileSystem;
  let logger: FakeLogger;
  let selector: FakePresetSelector;
  let setup: SetupCommand;

  beforeEach(() => {
    fs = new FakeFileSystem();
    fs.directory(root);
    logger = new FakeLogger();
    selector = new FakePresetSelector();
    setup = new SetupCommand(fs, logger, selector);
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

  it('writes an angular config and loader guidance', async () => {
    await setup.run(configPath, 'angular', false);

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
        'Warning: ng-icons-manager fully owns the output directory and replaces its contents during a full run.',
        '',
        'Preset-specific setup:',
        '- Asset mapping: no extra mapping is usually needed when Angular serves public/ at the application root.',
        '- If your workspace customizes assets, verify the Angular project build options still include the public folder.',
        '',
        'Loader example:',
        `import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { provideNgIconLoader, withCaching } from '@ng-icons/core';

provideNgIconLoader((name) => {
  const http = inject(HttpClient);
  return http.get(\`/icons/\${name}.svg\`, { responseType: 'text' });
}, withCaching())`,
      ]),
    );
    expect(selector.calls).toEqual([]);
  });

  it('writes the legacy assets preset and guidance', async () => {
    await setup.run(configPath, 'angular-assets', false);

    expect(fs.readFile(configPath)).toContain("outputDir: 'src/assets/icons'");
    expect(logger.infos).toEqual(
      expect.arrayContaining([
        'Selected preset: angular-assets',
        'Loader example:',
        `import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { provideNgIconLoader, withCaching } from '@ng-icons/core';

provideNgIconLoader((name) => {
  const http = inject(HttpClient);
  return http.get(\`/assets/icons/\${name}.svg\`, { responseType: 'text' });
}, withCaching())`,
      ]),
    );
  });

  it('honors an explicit mjs config path', async () => {
    await setup.run(mjsConfigPath, 'angular', false);

    expect(fs.readFile(mjsConfigPath)).toContain("outputDir: 'public/icons'");
    expect(logger.infos).toContain(`Created ${mjsConfigPath}`);
  });

  it('selects a preset when none is supplied', async () => {
    selector.selection = 'nx-angular';

    await setup.run(configPath, undefined, false);

    expect(selector.calls).toHaveLength(1);
    expect(selector.calls[0].map(({ name }) => name)).toEqual([
      'angular',
      'angular-monorepo',
      'nx-monorepo',
      'nx-angular',
      'angular-assets',
    ]);
    expect(fs.readFile(configPath)).toContain("outputDir: 'public/icons'");
    expect(logger.infos).toEqual(expect.arrayContaining(['Selected preset: nx-angular']));
  });

  it('surfaces selector cancellation', async () => {
    selector.selection = new Error('Setup cancelled');

    await expect(setup.run(configPath, undefined, false)).rejects.toThrow('Setup cancelled');
    expect(fs.exists(configPath)).toBe(false);
  });

  it('fails without a preset or selector', async () => {
    setup = new SetupCommand(fs, logger);

    await expect(setup.run(configPath, undefined, false)).rejects.toThrow('setup requires --preset <name> or an interactive terminal');
  });

  it('refuses to overwrite existing config unless forced', async () => {
    fs.writeFile(configPath, 'existing');

    await expect(setup.run(configPath, 'angular', false)).rejects.toThrow('already exists');
    expect(fs.readFile(configPath)).toBe('existing');

    await setup.run(configPath, 'angular', true);

    expect(fs.readFile(configPath)).toContain("outputDir: 'public/icons'");
  });

  it('rejects unknown presets with the available names', async () => {
    await expect(setup.run(configPath, 'unknown', false)).rejects.toThrow(
      'Available presets: angular, angular-monorepo, nx-monorepo, nx-angular, angular-assets',
    );
  });
});
