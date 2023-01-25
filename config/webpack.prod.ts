import FaviconsPlugin from 'favicons-webpack-plugin'
import path from 'path'
import type { Configuration } from 'webpack'
import { merge } from 'webpack-merge'
import commonConfig from './webpack.common'

const config = merge<Configuration>(commonConfig, {
  mode: 'production',
  output: {
    filename: 'js/[name].js?v=[hash]',
  },
  plugins: [
    new FaviconsPlugin({
      logo: 'logo.svg',
      favicons: { appName: 'Taymyr' },
      prefix: 'assets/[contenthash]/',
      inject: htmlPlugin => path.basename(htmlPlugin.options.filename).endsWith('head-icons.hbs'),
    }),
  ],
})

export default config
