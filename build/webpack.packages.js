// const path = require('path')
const baseConfig = require('./webpack.common')
const merge = require('webpack-merge')

const TerserJSPlugin = require('terser-webpack-plugin')

const config = require('./config')

const webpackConfig = {
  mode: 'production',
  externals: config.externals,
  optimization: {
    minimizer: [
      new TerserJSPlugin({})
    ]
  }
}

module.exports = merge(baseConfig, webpackConfig)
