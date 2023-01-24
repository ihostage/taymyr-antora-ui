// eslint-disable-next-line import/default
import CopyPlugin from 'copy-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import type { Configuration } from 'webpack'
// Compiler's webpack annotations are incompatible in types package:(
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ZipPlugin from 'zip-webpack-plugin'
import { Env } from './constants/ENv'
import { createHtmlPlugin } from './helpers/htmlPlugin'
import { BuildAntoraPlugin } from './plugins/BuildAntoraPlugin'

const bundleName = 'ui-bundle'
const HbsPartialsPath = {
  HEAD_ICONS: 'partials/head-icons.hbs',
  HEAD_STYLES: 'partials/head-styles.hbs',
  BODY_ASSETS: 'partials/body-assets.hbs',
}

const config: Configuration = {
  entry: path.resolve(Env.cwd, './src/index.ts'),
  module: {
    rules: [
      {
        test: /\.(sc|sa|c)ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: './css/[name].[contenthash].css',
    }),
    createHtmlPlugin({
      fileName: HbsPartialsPath.HEAD_ICONS,
      filterKey: 'meta.plugin',
      filterValue: 'favicons-webpack-plugin',
    }),
    createHtmlPlugin({
      fileName: HbsPartialsPath.HEAD_STYLES,
      filterKey: 'attributes.rel',
      filterValue: 'stylesheet',
    }),
    createHtmlPlugin({
      fileName: HbsPartialsPath.BODY_ASSETS,
      filterKey: 'tagName',
      filterValue: 'script',
    }),
    new CopyPlugin({
      patterns: [
        { from: 'src/layouts', to: 'layouts' },
        {
          from: 'src/partials',
          to: 'partials',
          filter: filepath =>
            !Object.values(HbsPartialsPath).some(hbsPartialPath =>
              filepath.endsWith(hbsPartialPath),
            ),
        },
      ],
    }),
    new ZipPlugin({ filename: bundleName }),
    new BuildAntoraPlugin(),
  ],
  performance: {
    assetFilter: (filename: string) => {
      return !filename.startsWith(bundleName)
    },
  },
}

export default config
