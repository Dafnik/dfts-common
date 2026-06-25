import { parseCliOptions } from '../internal/cli/cli-options';

describe('CLI argument parsing', () => {
  it('parses repeatable jobs and deduplicates them', () => {
    expect(parseCliOptions(['--job', 'app', '--job=admin', '--job', 'app', '--verbose'])).toEqual({
      command: 'run',
      jobs: ['app', 'admin'],
      watch: false,
      verbose: true,
      ignoreMissing: false,
    });
  });

  it('parses setup options', () => {
    expect(parseCliOptions(['setup', '--preset', 'angular', '--config', 'tools/icons.config.mjs', '--force'])).toEqual({
      command: 'setup',
      configPath: 'tools/icons.config.mjs',
      preset: 'angular',
      listPresets: false,
      force: true,
    });
  });

  it('parses setup preset listing', () => {
    expect(parseCliOptions(['setup', '--list-presets'])).toEqual({
      command: 'setup',
      listPresets: true,
      force: false,
    });
  });

  it.each([
    [['--unknown'], "Unknown option '--unknown'"],
    [['unknown'], 'Unknown command'],
    [['--config'], "Option '--config <value>' argument missing"],
    [['--config', 'a.mjs', '--config', 'b.mjs'], 'only be supplied once'],
    [['--config', 'a.js'], '.mjs'],
    [['--watch', '--ignore-missing'], 'cannot be used'],
    [['--job'], "Option '--job <value>' argument missing"],
    [['--preset', 'angular'], 'can only be used with setup'],
    [['--list-presets'], 'can only be used with setup'],
    [['--force'], 'can only be used with setup'],
    [['setup'], 'requires --preset'],
    [['setup', '--preset', 'angular', '--list-presets'], 'cannot be used'],
    [['setup', '--preset', 'angular', '--preset', 'nx-angular'], 'only be supplied once'],
    [['setup', '--job', 'app', '--preset', 'angular'], 'cannot be used with setup'],
    [['setup', '--watch', '--preset', 'angular'], 'cannot be used with setup'],
    [['setup', '--verbose', '--preset', 'angular'], 'cannot be used with setup'],
    [['setup', '--ignore-missing', '--preset', 'angular'], 'cannot be used with setup'],
  ])('rejects invalid arguments %#', (args, message) => {
    expect(() => parseCliOptions(args)).toThrow(message);
  });
});
