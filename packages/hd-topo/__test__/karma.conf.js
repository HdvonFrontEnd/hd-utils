const webpackConfig = require('../../../build/webpack.test.js')
const baseKarmaConfig = require('../../../test/unit/karma.conf.base.js')
module.exports = function(config) {
  const configuration = Object.assign({}, baseKarmaConfig, {
    webpack: webpackConfig,
    files: ['./index.js'],
    preprocessors: {
      './index.js': ['webpack', 'sourcemap']
    },
    client: {
      mocha: {
        timeout: 4000,
        globals: ['PIXI', 'd3']
      }
    }
  })
  config.set(configuration)
}
