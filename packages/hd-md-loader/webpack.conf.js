const path = require('path')
const basePackagesConfig = require('../../build/webpack.packages')
const merge = require('webpack-merge')

const webpackConfig = {
  entry: {
    index: path.join(__dirname, 'index.js')
  },
  output: {
    path: path.join(__dirname, 'dist'),
    library: 'md-loader',
    filename: '[name].js',
    chunkFilename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  externals: ['markdown-it-anchor', 'markdown-it-chain', 'markdown-it-container', 'transliteration']
}

module.exports = merge(basePackagesConfig, webpackConfig)
