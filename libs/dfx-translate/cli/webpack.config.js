'use strict';
const path = require('path');

module.exports = {
  entry: './translate.cli.ts',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, './../../../dist/dfx-translate-cli'),
    publicPath: '',
    globalObject: 'this',
  },
  module: {
    rules: [
      {
        test: /\.([cm]?ts|tsx)$/,
        loader: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    fallback: {
      fs: false,
      path: false,
      process: false,
      child_process: false,
    },
  },
  performance: {
    hints: false,
  },
  externalsPresets: {node: true},
};
