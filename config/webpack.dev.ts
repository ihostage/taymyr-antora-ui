import path from 'path'
import type { Configuration, WebpackOptionsNormalized } from 'webpack'
import { merge } from 'webpack-merge'
import WatchExternalFilesPlugin from 'webpack-watch-files-plugin'
import { Env } from './constants/Env'
import commonConfig from './webpack.common'

const watchedFiles = [path.resolve(Env.cwd, 'docs/**/*'), path.resolve(Env.cwd, 'src/**/*')]

const config = merge<WebpackOptionsNormalized | Configuration>(commonConfig, {
  mode: 'development',
  target: 'web',
  output: {
    filename: 'js/[name].js',
  },
  devServer: {
    port: 4224,
    static: {
      directory: path.resolve(Env.cwd, 'build'),
    },
    open: ['/site/en'],
    compress: true,
    hot: true,
    devMiddleware: {
      writeToDisk: true,
    },
  },
  devtool: 'source-map',
  plugins: [
    new WatchExternalFilesPlugin({
      files: watchedFiles,
    }),
  ],
})

export default config
