const path = require('path')
const nodeExternals = require('webpack-node-externals')

// 路径别名
exports.alias = {
  src: path.resolve(__dirname, '../src'),
  static: path.resolve(__dirname, '../static'),
  packages: path.resolve(__dirname, '../packages'),
  topo: path.resolve(__dirname, '../packages/hd-topo/src'),
  examples: path.resolve(__dirname, '../examples'),
  docs: path.resolve(__dirname, '../docs'),
  test: path.resolve(__dirname, '../test')
}
// externals配置
exports.externals = [{ vue: 'vue' }, { 'element-ui': 'element-ui' }, { axios: 'axios' }, nodeExternals()]

// babel 排除
exports.babelexclude = /node_modules/

// babel 包含
exports.babelinclude = process.cwd()

// eslint 排除
exports.eslintexclude = /node_modules/

// dev server proxy table
const proxyTable = {
}

// dev server
exports.devServer = {
  host: '0.0.0.0',
  port: 8820,
  proxyTable
}
