'use strict'

/**
 * 如果有指定测试模块，则只测试该模块
 * 通过参数p来指定模块，例如： npm run test -- --p=hd-fun
 * 否则测试全部有karma配置的模块
 */

const components = require('../../components.json')
const execSync = require('child_process').execSync
const existsSync = require('fs').existsSync
const chalk = require('chalk')
const path = require('path')
const args = require('minimist')(process.argv.slice(2))

function execTest(packageName, isSingleRun = false) {
  const configPath = path.join(__dirname, `../../packages/${packageName}/__test__/karma.conf.js`)
  if (existsSync(configPath)) {
    console.log(chalk.white.bgGreen.bold(`本次测试的模块是：${packageName}`))
    const cli = `cross-env BABEL_ENV=test karma start ${configPath}${isSingleRun ? ' --single-run' : ''}`
    execSync(cli, { stdio: 'inherit' })
  }
}

if (args.p) {
  const packageName = args.p
  if (Object.keys(components).includes(packageName)) {
    execTest(packageName, args['single-run'])
  } else {
    console.log(chalk.white.bgRed.bold('该模块不存在'))
    return
  }
} else {
  Object.keys(components).forEach(packageName => {
    execTest(packageName)
  })
}
