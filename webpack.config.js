const bundleName = 'ui-bundle'

const path = require('path')
const ZipPlugin = require('zip-webpack-plugin');
const FaviconsPlugin = require('favicons-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
        filename: './css/[name].[contenthash].css'
      }),
    new ZipPlugin({ filename: bundleName }),
    new HtmlPlugin({
      publicPath: 'uiRootPath',
      templateContent: ({htmlWebpackPlugin}) => `${faviconsTags(htmlWebpackPlugin)}`,
      filename: 'partials/head-icons.hbs',
      inject: false
    }),
    new FaviconsPlugin({
      logo: 'logo.svg',
      favicons: { appName: 'Taymyr' },
      prefix: 'assets/[contenthash]/',
      inject: htmlPlugin => path.basename(htmlPlugin.options.filename).endsWith('head-icons.hbs')
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
