import { dirname } from 'node:path';

import type { FileSystem, Logger } from '../core/ports';

export const SETUP_PRESET_NAMES = ['angular', 'angular-monorepo', 'nx-monorepo', 'nx-angular', 'angular-assets'] as const;

export type SetupPresetName = (typeof SETUP_PRESET_NAMES)[number];

interface SetupPreset {
  name: SetupPresetName;
  description: string;
  inputDirs: string[];
  outputDir: string;
  loaderPath: string;
  guidance: string[];
}

const PUBLIC_LOADER_PATH = '/icons/${name}.svg';

const PRESETS: Record<SetupPresetName, SetupPreset> = {
  angular: {
    name: 'angular',
    description: 'single Angular app using the public folder',
    inputDirs: ['src'],
    outputDir: 'public/icons',
    loaderPath: PUBLIC_LOADER_PATH,
    guidance: [
      'Asset mapping: no extra mapping is usually needed when Angular serves public/ at the application root.',
      'If your workspace customizes assets, verify the Angular project build options still include the public folder.',
    ],
  },
  'angular-monorepo': {
    name: 'angular-monorepo',
    description: 'Angular CLI workspace with projects/app',
    inputDirs: ['projects/app/src'],
    outputDir: 'projects/app/public/icons',
    loaderPath: PUBLIC_LOADER_PATH,
    guidance: [
      'Asset mapping: add or verify this app in angular.json at projects.<app>.architect.build.options.assets.',
      'Use an object entry such as { "glob": "**/*", "input": "projects/app/public", "output": "." } if public is not already mapped.',
      'Angular workspace paths in angular.json are relative to the workspace root.',
    ],
  },
  'nx-monorepo': {
    name: 'nx-monorepo',
    description: 'Nx Angular monorepo with apps/app and libs/shared-ui',
    inputDirs: ['apps/app/src', 'libs/shared-ui/src'],
    outputDir: 'apps/app/public/icons',
    loaderPath: PUBLIC_LOADER_PATH,
    guidance: [
      'Asset mapping: add or verify this app build target in apps/app/project.json or the package nx.targets build options.',
      'Use Nx asset object syntax such as { "input": "apps/app/public", "glob": "**/*", "output": "." } if public is not already mapped.',
    ],
  },
  'nx-angular': {
    name: 'nx-angular',
    description: 'single Angular app in an Nx workspace',
    inputDirs: ['src'],
    outputDir: 'public/icons',
    loaderPath: PUBLIC_LOADER_PATH,
    guidance: [
      'Asset mapping: add or verify the app build target options.assets in project.json or the package nx.targets.',
      'Use Nx asset object syntax such as { "input": "public", "glob": "**/*", "output": "." } if public is not already mapped.',
    ],
  },
  'angular-assets': {
    name: 'angular-assets',
    description: 'Angular app using the legacy src/assets/icons path',
    inputDirs: ['src'],
    outputDir: 'src/assets/icons',
    loaderPath: '/assets/icons/${name}.svg',
    guidance: [
      'Asset mapping: ensure src/assets is included in angular.json at the app build options.assets.',
      'The icon loader must use the /assets/icons path because this preset writes below src/assets.',
    ],
  },
};

export class SetupCommand {
  constructor(
    private readonly fs: FileSystem,
    private readonly logger: Logger,
  ) {}

  listPresets(): void {
    this.logger.info('Available ng-icons-manager setup presets:');
    for (const preset of SETUP_PRESET_NAMES.map((name) => PRESETS[name])) {
      this.logger.info(`- ${preset.name}: ${preset.description}`);
    }
  }

  run(configPath: string, presetName: string, force: boolean): void {
    const preset = this.preset(presetName);
    if (this.fs.exists(configPath) && !force) {
      throw new Error(`Config file already exists: ${configPath}. Use --force to overwrite it.`);
    }

    this.fs.createDirectory(dirname(configPath));
    this.fs.writeFile(configPath, configContent(preset));
    this.report(configPath, preset);
  }

  private preset(name: string): SetupPreset {
    const preset = PRESETS[name as SetupPresetName];
    if (!preset) throw new Error(`Unknown setup preset "${name}". Available presets: ${SETUP_PRESET_NAMES.join(', ')}`);
    return preset;
  }

  private report(configPath: string, preset: SetupPreset): void {
    this.logger.info(`Created ${configPath}`);
    this.logger.info(`Selected preset: ${preset.name}`);
    this.logger.info(`Output directory: ${preset.outputDir}`);
    this.logger.info('Warning: ng-icons-manager fully owns the output directory and replaces its contents during a full run.');
    this.logger.info('');
    this.logger.info('Preset-specific setup:');
    for (const line of preset.guidance) this.logger.info(`- ${line}`);
    this.logger.info('');
    this.logger.info('Loader example:');
    this.logger.info(`import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { provideNgIconLoader, withCaching } from '@ng-icons/core';

provideNgIconLoader((name) => {
  const http = inject(HttpClient);
  return http.get(\`${preset.loaderPath}\`, { responseType: 'text' });
}, withCaching())`);
  }
}

function configContent(preset: SetupPreset): string {
  return `import { defineConfig } from 'ng-icons-manager';

export default defineConfig({
  jobs: {
    app: {
      inputDirs: ${arrayLiteral(preset.inputDirs)},
      outputDir: '${preset.outputDir}',
    },
  },
});
`;
}

function arrayLiteral(values: string[]): string {
  return `[${values.map((value) => `'${value}'`).join(', ')}]`;
}
