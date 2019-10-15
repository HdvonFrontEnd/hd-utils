const webpackConfig = require('../../../build/webpack.test.js')
const baseKarmaConfig = require('../../../test/unit/karma.conf.base.js')
const path = require('path')
module.exports = function(config) {
  const configuration = Object.assign({}, baseKarmaConfig, {
    webpack: webpackConfig,
    files: ['./index.js'],
    preprocessors: {
      './index.js': ['webpack', 'sourcemap']
    }
  })
  // 设置coverage的输出路径
  configuration.coverageIstanbulReporter.dir = path.join(__dirname, 'coverage')
  config.set(configuration)
}
