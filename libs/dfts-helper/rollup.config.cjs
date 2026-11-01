const { withNx } = require('@nx/rollup/with-nx');

// These options were migrated by @nx/rollup:convert-to-inferred from project.json
const options = {
  assets: ['libs/dfts-helper/README.md', 'libs/dfts-helper/CHANGELOG.md', 'libs/dfts-helper/LICENSE'],
  format: ['esm', 'cjs'],
  main: './src/index.ts',
  outputPath: '../../dist/libs/dfts-helper',
  tsConfig: './tsconfig.lib.json',
};

const config = withNx(options, {
  // Provide additional rollup configuration here. See: https://rollupjs.org/configuration-options
  // e.g.
  // output: { sourcemap: true },
});

module.exports = config;
