const bundleName = 'ui-bundle'

const ZipPlugin = require('zip-webpack-plugin');
const FaviconsPlugin = require('favicons-webpack-plugin')

module.exports = {
  mode: 'production',
  plugins: [
    new ZipPlugin({ filename: bundleName }),
    new FaviconsPlugin('logo.svg')
  ],
  performance: {
    assetFilter: (filename) => !filename.startsWith(bundleName)
  }
};
