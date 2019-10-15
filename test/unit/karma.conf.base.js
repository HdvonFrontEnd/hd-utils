/**
 * 分别运行单元测试时的基本karma配置
 */
const specFiles = './specs/*.js'
const sourceFiles = '../index.js'
module.exports = {
  browsers: ['ChromeHeadless'],
  frameworks: ['mocha', 'sinon-chai'],
  reporters: ['spec', 'coverage-istanbul'],
  files: [
    specFiles,
    sourceFiles
  ],
  preprocessors: {
    [specFiles]: ['webpack', 'sourcemap'],
    [sourceFiles]: ['webpack', 'sourcemap']
  },
  webpackMiddleware: {
    noInfo: false
  },
  coverageIstanbulReporter: {
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
