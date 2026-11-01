const { withNx } = require('@nx/rollup/with-nx');

// These options were migrated by @nx/rollup:convert-to-inferred from project.json
const options = {
  additionalEntryPoints: ['./bin/cli.js'],
  assets: ['libs/ng-icons-manager/README.md', 'libs/ng-icons-manager/CHANGELOG.md', 'libs/ng-icons-manager/LICENSE'],
  format: ['esm'],
  main: './src/index.ts',
  outputPath: '../../dist/libs/ng-icons-manager',
  sourceMap: true,
  tsConfig: './tsconfig.lib.json',
};

const config = withNx(options, {
  // Provide additional rollup configuration here. See: https://rollupjs.org/configuration-options
  // e.g.
  // output: { sourcemap: true },
});

module.exports = config;
