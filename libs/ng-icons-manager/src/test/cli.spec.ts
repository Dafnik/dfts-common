import { parseCliOptions } from '../internal/cli/cli-options';

describe('CLI argument parsing', () => {
  it('parses repeatable jobs and deduplicates them', () => {
    expect(parseCliOptions(['--job', 'app', '--job=admin', '--job', 'app', '--verbose'])).toEqual({
      jobs: ['app', 'admin'],
      watch: false,
      verbose: true,
      ignoreMissing: false,
    });
  });

  it.each([
    [['--unknown'], "Unknown option '--unknown'"],
    [['--config'], "Option '--config <value>' argument missing"],
    [['--config', 'a.mjs', '--config', 'b.mjs'], 'only be supplied once'],
    [['--config', 'a.js'], '.mjs'],
    [['--watch', '--ignore-missing'], 'cannot be used'],
    [['--job'], "Option '--job <value>' argument missing"],
  ])('rejects invalid arguments %#', (args, message) => {
    expect(() => parseCliOptions(args)).toThrow(message);
  });
});
