const VueLoaderPlugin = require('vue-loader/lib/plugin')
const baseConfig = require('./webpack.common')
const merge = require('webpack-merge')

// 建立本地websocket服务，用于测试
const WebsocketServer = require('../test/utils/ws-server')
new WebsocketServer({
  pushInterval: 1000,
  pushMsg: 'hello, this is a push test'
})

const webpackConfig = {
  mode: 'development',
  node: {
    fs: 'empty' // 用以解决 Module not found: Error: Can't resolve 'fs'
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(ts|js)?$/,
        enforce: 'post',
        // 排除掉dist是因为只写node_modules的话，hd-fun/dist依然会被参与到计算覆盖率
        exclude: [/node_modules/, /dist/],
        use: {
          loader: 'istanbul-instrumenter-loader',
          options: { esModules: true }
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}
module.exports = merge(baseConfig, webpackConfig)
