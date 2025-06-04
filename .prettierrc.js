module.exports = {
  plugins: [
    '@trivago/prettier-plugin-sort-imports',
    'prettier-plugin-organize-attributes',
    'prettier-plugin-tailwindcss',
    'prettier-plugin-sort-json',
  ],
  printWidth: 140,
  singleQuote: true,
  bracketSpacing: true,
  bracketSameLine: true,
  trailingComma: 'all',
  htmlWhitespaceSensitivity: 'ignore',
  importOrder: ['^@angular/(.*)$', '^@angular/cdk', '^rxjs', '<THIRD_PARTY_MODULES>', '^@app/(.*)', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: ['typescript', 'decorators-legacy'],
  jsonRecursiveSort: true,
};
