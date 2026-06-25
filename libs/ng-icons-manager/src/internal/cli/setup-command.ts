import { dirname } from 'node:path';
import { emitKeypressEvents } from 'node:readline';

import type { FileSystem, Logger } from '../core/ports';

export const SETUP_PRESET_NAMES = ['angular', 'angular-monorepo', 'nx-monorepo', 'nx-angular', 'angular-assets'] as const;

export type SetupPresetName = (typeof SETUP_PRESET_NAMES)[number];

export interface SetupPresetMetadata {
  name: SetupPresetName;
  description: string;
}

export interface PresetSelector {
  select(presets: readonly SetupPresetMetadata[]): Promise<SetupPresetName>;
}

interface SetupPreset extends SetupPresetMetadata {
  name: SetupPresetName;
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
    private readonly selector?: PresetSelector,
  ) {}

  listPresets(): void {
    this.logger.info('Available ng-icons-manager setup presets:');
    for (const preset of setupPresetMetadata()) {
      this.logger.info(`- ${preset.name}: ${preset.description}`);
    }
  }

  async run(configPath: string, presetName: string | undefined, force: boolean): Promise<void> {
    const selectedPreset = presetName ?? (await this.selectPreset());
    const preset = this.preset(selectedPreset);
    if (this.fs.exists(configPath) && !force) {
      throw new Error(`Config file already exists: ${configPath}. Use --force to overwrite it.`);
    }

    this.fs.createDirectory(dirname(configPath));
    this.fs.writeFile(configPath, configContent(preset));
    this.report(configPath, preset);
  }

  private async selectPreset(): Promise<SetupPresetName> {
    if (!this.selector) throw new Error('setup requires --preset <name> or an interactive terminal');
    return this.selector.select(setupPresetMetadata());
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

export class KeyboardPresetSelector implements PresetSelector {
  constructor(
    private readonly input: KeyboardInput,
    private readonly output: KeyboardOutput,
  ) {}

  select(presets: readonly SetupPresetMetadata[]): Promise<SetupPresetName> {
    if (!this.input.isTTY || !this.output.isTTY || !this.input.setRawMode) {
      throw new Error('setup requires --preset <name> or an interactive terminal');
    }
    const setRawMode = this.input.setRawMode.bind(this.input);

    return new Promise((resolve, reject) => {
      let index = 0;
      const previousRawMode = this.input.isRaw === true;
      const cleanup = () => {
        this.input.off('keypress', onKeypress);
        this.input.pause();
        setRawMode(previousRawMode);
        this.output.write(`\x1b[${presets.length + 1}B\n`);
      };
      const finish = (preset: SetupPresetName) => {
        cleanup();
        resolve(preset);
      };
      const cancel = () => {
        cleanup();
        reject(new Error('Setup cancelled'));
      };
      const render = () => {
        this.output.write('\x1b[2K\x1b[0GSelect a setup preset with arrow keys, then press Enter:\n');
        presets.forEach((preset, presetIndex) => {
          this.output.write(`${presetIndex === index ? '>' : ' '} ${preset.name} - ${preset.description}\n`);
        });
        this.output.write(`\x1b[${presets.length + 1}A`);
      };
      const onKeypress = (_input: string, key: KeypressKey = {}) => {
        if (key.ctrl && key.name === 'c') {
          cancel();
          return;
        }
        if (key.name === 'escape' || key.name === 'q') {
          cancel();
          return;
        }
        if (key.name === 'up' || key.name === 'k') {
          index = (index + presets.length - 1) % presets.length;
          render();
          return;
        }
        if (key.name === 'down' || key.name === 'j') {
          index = (index + 1) % presets.length;
          render();
          return;
        }
        if (key.name === 'return' || key.name === 'enter') {
          finish(presets[index].name);
        }
      };

      emitKeypressEvents(this.input as NodeJS.ReadableStream);
      setRawMode(true);
      this.input.resume();
      this.input.on('keypress', onKeypress);
      render();
    });
  }
}

export function setupPresetMetadata(): SetupPresetMetadata[] {
  return SETUP_PRESET_NAMES.map((name) => ({ name, description: PRESETS[name].description }));
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

interface KeyboardInput {
  isTTY?: boolean;
  isRaw?: boolean;
  setRawMode?: (mode: boolean) => void;
  resume(): void;
  pause(): void;
  on(event: 'keypress', listener: (input: string, key?: KeypressKey) => void): void;
  off(event: 'keypress', listener: (input: string, key?: KeypressKey) => void): void;
}

interface KeyboardOutput {
  isTTY?: boolean;
  write(content: string): void;
}

interface KeypressKey {
  name?: string;
  ctrl?: boolean;
}
