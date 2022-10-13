const bundleName = 'ui-bundle'

const { basename } = require('path')
const ZipPlugin = require('zip-webpack-plugin');
const FaviconsPlugin = require('favicons-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'production',
  plugins: [
    new ZipPlugin({ filename: bundleName }),
    new HtmlPlugin({
      publicPath: 'uiRootPath',
      templateContent: ({htmlWebpackPlugin}) => `${faviconsTags(htmlWebpackPlugin)}`,
      filename: 'partials/favicons.hbs',
      inject: false
    }),
    new FaviconsPlugin({
      logo: 'logo.svg',
      favicons: { appName: 'Taymyr' },
      inject: htmlPlugin => basename(htmlPlugin.options.filename).endsWith('favicons.hbs')
    }),
    new CopyPlugin({
      patterns: [
        { from: 'src/layouts', to: 'layouts' },
        { from: 'src/partials', to: 'partials' },
      ]
    }),
  ],
  performance: {
    assetFilter: (filename) => !filename.startsWith(bundleName)
  }
};

function faviconsTags(htmlWebpackPlugin) {
  return htmlWebpackPlugin.tags.headTags
    // Skip script tag with bundle that generated HtmlPlugin by default
    .filter((tag) => tag.tagName !== 'script')
    .join('')
    // It must be Handlebars template with root path as variable
    .replaceAll('uiRootPath', '{{{uiRootPath}}}')
}
