'use strict';

const { composePlugins, withNx } = require('@nx/webpack');
const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = composePlugins(withNx(), (config, { options, context }) => {
  return merge(config, {
    output: {
      publicPath: '',
      globalObject: 'this',
      filename: 'index.js',
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
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
    },
    target: 'web',
    externalsPresets: { node: true },
  });
});
