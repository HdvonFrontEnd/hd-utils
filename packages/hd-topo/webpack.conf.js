const path = require('path')
const basePackagesConfig = require('../../build/webpack.packages')
const merge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')

const webpackConfig = {
  entry: {
    index: path.join(__dirname, 'index.js')
  },
  output: {
    path: path.join(__dirname, 'dist'),
    library: 'hd-topo',
    filename: '[name].js',
    chunkFilename: '[name].js',
    libraryTarget: 'umd'
  },
  externals: [nodeExternals({ modulesDir: path.join(__dirname, './node_modules') })]
}

module.exports = merge(basePackagesConfig, webpackConfig)
