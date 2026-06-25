import { join } from 'node:path';

import type { ResolvedJobConfig, ResolvedManagerConfig } from '../internal/config/models';
import { OutputPathPolicy } from '../internal/config/output-path-policy';
import { IconManager } from '../internal/core/icon-manager';
import { IconOutput } from '../internal/core/icon-output';
import { IconParser } from '../internal/core/icon-parser';
import { IconResolver } from '../internal/core/icon-resolver';
import { IconScanner } from '../internal/core/icon-scanner';
import { FakeFileSystem, FakeModuleLoader } from './fakes';

describe('icon parser', () => {
  it('extracts exact static names and comment hints', () => {
    const icons = new IconParser().parse(`
      <ng-icon name="bootstrapAlarm" />
      <!-- i(heroHome, heroHomeSolid) -->
      /* i(matHome) */
      matNotAlarm
      /*
        i(matClock, matClock2)
        i(matClock3)
      */
      /** i(matSearch) */
      // i(matAlarm)
    `);

    expect([...icons]).toEqual([
      'bootstrapAlarm',
      'heroHome',
      'heroHomeSolid',
      'matHome',
      'matClock',
      'matClock2',
      'matClock3',
      'matSearch',
      'matAlarm',
    ]);
  });
});

describe('icon scanner', () => {
  const root = join('/', 'workspace');
  const source = join(root, 'src');
  const output = join(source, 'generated/icons');
  let fs: FakeFileSystem;
  let job: ResolvedJobConfig;

  beforeEach(() => {
    fs = new FakeFileSystem();
    fs.directory(source);
    job = resolvedJob(source, output);
  });

  it('passes job globs and every nested output exclusion to the filesystem port', () => {
    const app = join(source, 'app.html');
    fs.writeFile(app, '<ng-icon name="bootstrapAlarm" />');
    fs.globResults.set(source, [app]);

    const result = new IconScanner(fs, new IconParser()).scan(job, [output, join(root, 'other/icons')]);

    expect([...result.icons]).toEqual(['bootstrapAlarm']);
    expect(fs.globCalls).toEqual([
      {
        patterns: ['**/*.{html,ts}'],
        options: { cwd: source, ignore: ['**/*.spec.ts', 'generated/icons/**'] },
      },
    ]);
  });

  it('skips symbolic links and returns typed read issues', () => {
    const linked = join(source, 'linked.html');
    const missing = join(source, 'missing.html');
    fs.symlinks.add(linked);
    fs.globResults.set(source, [linked, missing]);

    const result = new IconScanner(fs, new IconParser()).scan(job, []);

    expect(result.icons.size).toBe(0);
    expect(result.issues).toEqual([expect.objectContaining({ kind: 'read', path: missing })]);
  });

  it('returns a typed read issue when globbing an input fails', () => {
    fs.globErrors.set(source, new Error('permission denied'));

    const result = new IconScanner(fs, new IconParser()).scan(job, []);

    expect(result.issues).toEqual([
      expect.objectContaining({ kind: 'read', path: source, message: expect.stringContaining('permission denied') }),
    ]);
  });
});

describe('icon manager output semantics', () => {
  const root = join('/', 'workspace');
  const source = join(root, 'src');
  const output = join(source, 'generated/icons');
  let fs: FakeFileSystem;
  let modules: FakeModuleLoader;
  let job: ResolvedJobConfig;
  let config: ResolvedManagerConfig;
  let sourceFile: string;

  beforeEach(() => {
    fs = new FakeFileSystem();
    modules = new FakeModuleLoader();
    fs.directory(source);
    sourceFile = join(source, 'app.html');
    fs.globResults.set(source, [sourceFile]);
    job = resolvedJob(source, output);
    config = {
      configDir: root,
      configPath: join(root, 'ng-icons-manager.config.mts'),
      jobs: { app: job },
    };
  });

  it('validates all icons before replacing output', async () => {
    fs.writeFile(sourceFile, '<ng-icon name="bootstrapMissing" />');
    fs.writeFile(join(output, 'existing.svg'), 'keep');

    const result = await manager().run(job, { fullReplace: true, ignoreMissing: false });

    expect(result.success).toBe(false);
    expect(fs.readFile(join(output, 'existing.svg'))).toBe('keep');
  });

  it('replaces output with successful icons when missing icons are ignored', async () => {
    fs.writeFile(sourceFile, '<ng-icon name="bootstrapAlarm" /><ng-icon name="bootstrapMissing" />');
    fs.writeFile(join(output, 'old.svg'), 'old');
    modules.modules.set('@ng-icons/bootstrap-icons', { bootstrapAlarm: '<svg>alarm</svg>' });

    const result = await manager().run(job, { fullReplace: true, ignoreMissing: true });

    expect(result.success).toBe(true);
    expect(fs.exists(join(output, 'old.svg'))).toBe(false);
    expect(fs.readFile(join(output, 'bootstrapAlarm.svg'))).toBe('<svg>alarm</svg>');
  });

  it('recreates an empty output for a zero-icon scan', async () => {
    fs.writeFile(sourceFile, 'no icons');
    fs.writeFile(join(output, 'old.svg'), 'old');

    const result = await manager().run(job, { fullReplace: true, ignoreMissing: false });

    expect(result.success).toBe(true);
    expect(fs.exists(output)).toBe(true);
    expect(fs.exists(join(output, 'old.svg'))).toBe(false);
  });

  it('rechecks symbolic-link safety immediately before deletion', async () => {
    fs.writeFile(sourceFile, 'no icons');
    fs.directory(join(source, 'generated'));
    fs.symlinks.add(output);

    const result = await manager().run(job, { fullReplace: true, ignoreMissing: false });

    expect(result).toMatchObject({ success: false, issues: [expect.objectContaining({ kind: 'write' })] });
    expect(fs.symlinks.has(output)).toBe(true);
  });

  it('validates output filenames before deleting the owned directory', async () => {
    fs.writeFile(sourceFile, '<ng-icon name="bootstrap../outside" />');
    fs.writeFile(join(output, 'existing.svg'), 'keep');
    modules.modules.set('@ng-icons/bootstrap-icons', { 'bootstrap../outside': '<svg>unsafe</svg>' });

    const result = await manager().run(job, { fullReplace: true, ignoreMissing: false });

    expect(result).toMatchObject({ success: false, issues: [expect.objectContaining({ kind: 'write' })] });
    expect(fs.readFile(join(output, 'existing.svg'))).toBe('keep');
  });

  it('incrementally removes stale files and avoids rewriting unchanged icons', async () => {
    fs.writeFile(sourceFile, '<ng-icon name="bootstrapAlarm" />');
    fs.writeFile(join(output, 'bootstrapAlarm.svg'), '<svg>alarm</svg>');
    fs.writeFile(join(output, 'stale.svg'), 'stale');
    modules.modules.set('@ng-icons/bootstrap-icons', { bootstrapAlarm: '<svg>alarm</svg>' });

    const result = await manager().run(job, { fullReplace: false, ignoreMissing: false });

    expect(result.success).toBe(true);
    expect(fs.exists(join(output, 'stale.svg'))).toBe(false);
    expect(fs.readFile(join(output, 'bootstrapAlarm.svg'))).toBe('<svg>alarm</svg>');
  });

  function manager(): IconManager {
    const paths = new OutputPathPolicy(fs);
    return new IconManager(config, paths, new IconScanner(fs, new IconParser()), new IconResolver(modules), new IconOutput(fs, paths));
  }
});

function resolvedJob(inputDir: string, outputDir: string): ResolvedJobConfig {
  return {
    name: 'app',
    inputDirs: [inputDir],
    outputDir,
    include: ['**/*.{html,ts}'],
    exclude: ['**/*.spec.ts'],
    packagePreferences: {},
  };
}
