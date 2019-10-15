/**
 * 合并运行单元测试时的karma配置
 */
const webpackConfig = require('../../build/webpack.test.js')
const path = require('path')
module.exports = function(config) {
  const configuration = {
    browsers: ['ChromeHeadless'],
    frameworks: ['mocha', 'sinon-chai'],
    reporters: ['spec', 'coverage-istanbul'],
    files: ['./index.js'],
    preprocessors: {
      './index.js': ['webpack', 'sourcemap']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: false
    },
    coverageIstanbulReporter: {
      dir: path.join(__dirname, 'coverage'),
      reports: ['html', 'lcovonly', 'text-summary'],
      'report-config': {
        html: {
          subdir: '.'
        },
        lcov: {
          subdir: '.'
        }
      }
    },
    client: {
      mocha: {
        timeout: 4000
      }
    }
  }
  config.set(configuration)
}
