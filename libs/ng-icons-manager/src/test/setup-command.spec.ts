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
  });

  it('writes the legacy assets preset and guidance', () => {
    setup.run(configPath, 'angular-assets', false);

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

  it('refuses to overwrite existing config unless forced', () => {
    fs.writeFile(configPath, 'existing');

    expect(() => setup.run(configPath, 'angular', false)).toThrow('already exists');
    expect(fs.readFile(configPath)).toBe('existing');

    setup.run(configPath, 'angular', true);

    expect(fs.readFile(configPath)).toContain("outputDir: 'public/icons'");
  });

  it('rejects unknown presets with the available names', () => {
    expect(() => setup.run(configPath, 'unknown', false)).toThrow(
      'Available presets: angular, angular-monorepo, nx-monorepo, nx-angular, angular-assets',
    );
  });
});
