const bundleName = 'ui-bundle'

const path = require('path')
const ZipPlugin = require('zip-webpack-plugin');
const FaviconsPlugin = require('favicons-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const get = require('lodash/get')

const htmlHeadTags = ({ fileName, filterKey, filterValue }) => {
  const getTemplateContent = (htmlWebpackPlugin) => htmlWebpackPlugin.tags.headTags
      .filter(tagNode => get(tagNode, filterKey) === filterValue)
      .join('')
      // It must be Handlebars template with root path as variable
      .replaceAll('uiRootPath', '{{{uiRootPath}}}')
  return new HtmlPlugin({
    publicPath: 'uiRootPath',
    templateContent: ({htmlWebpackPlugin}) => `${getTemplateContent(htmlWebpackPlugin)}`,
    filename: `partials/${fileName}`,
    inject: false
  })
}

module.exports = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(sc|sa|c)ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: './css/[name].[contenthash].css'
    }),
    new ZipPlugin({ filename: bundleName }),
    htmlHeadTags({fileName: 'head-icons.hbs', filterKey: 'meta.plugin', filterValue: 'favicons-webpack-plugin'}),
    htmlHeadTags({fileName: 'head-styles.hbs', filterKey: 'attributes.rel', filterValue: 'stylesheet'}),
    htmlHeadTags({fileName: 'head-local-scripts.hbs', filterKey: 'tagName', filterValue: 'script'}),
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
