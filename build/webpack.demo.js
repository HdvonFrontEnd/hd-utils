const path = require('path')
const baseConfig = require('./webpack.common')
const merge = require('webpack-merge')

const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const config = require('./config')

const { HashedModuleIdsPlugin } = require('webpack')

const isProd = process.env.NODE_ENV === 'production'
const isGithubPages = process.env.GITHUB_PAGES === 'gh-pages'

if (!isProd) {
  // 在本地development环境下
  // 建立本地websocket服务，用于调试与测试
  const WebsocketServer = require('../test/utils/ws-server')
  new WebsocketServer()
}

const webpackConfig = {
  mode: process.env.NODE_ENV,
  entry: './docs/entry.js',
  output: {
    path: path.resolve(process.cwd(), './lib/'),
    publicPath: isProd && isGithubPages ? '/hd-utils' : '/',
    filename: '[name].[chunkhash:7].js',
    chunkFilename: isProd ? '[name].[chunkhash:7].js' : '[name].js'
  },
  devServer: {
    index: 'index.html',
    host: config.devServer.host,
    port: config.devServer.port,
    noInfo: false,
    proxy: config.devServer.proxyTable
  },
  module: {
    rules: [
      {
        test: /\.(ts|js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        exclude: config.eslintexclude
      },
      {
        test: /\.(scss|css)$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.md$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              compilerOptions: {
                preserveWhitespace: false
              }
            }
          },
          {
            loader: path.resolve(__dirname, '../packages/hd-md-loader')
          }
        ]
      }
    ]
  },
  plugins: [
    // 全局注入（hd-topo用）
    new webpack.ProvidePlugin({
      PIXI: 'pixi.js',
      d3: 'd3'
    }),
    new HashedModuleIdsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './docs/index.html'
    }),
    new VueLoaderPlugin(),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: 'static',
        ignore: ['.*']
      }
    ])
  ],
  optimization: {
    minimizer: []
  }
}

if (isProd) {
  webpackConfig.plugins.push(
    ...[
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash:7].css'
      })
    ]
  )
  webpackConfig.optimization.minimizer.push(...[
    new TerserJSPlugin({}),
    new OptimizeCSSAssetsPlugin({})
  ])
}

module.exports = merge(baseConfig, webpackConfig)
