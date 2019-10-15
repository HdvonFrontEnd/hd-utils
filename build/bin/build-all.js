'use strict'

const components = require('../../components.json')
const execSync = require('child_process').execSync
const existsSync = require('fs').existsSync
const chalk = require('chalk')
const path = require('path')

Object.keys(components).forEach(key => {
  const filePath = path.join(__dirname, `../../packages/${key}/webpack.conf.js`)

  if (existsSync(filePath)) {
    console.log(chalk.white.bgGreen.bold(`正在构建的模块是：${key}`))
    const cli = `webpack  --config packages/${key}/webpack.conf.js`
    execSync(cli, { stdio: 'inherit' })
  }
})

console.log(chalk.blue('-----------✔ 全部模块构建完成-----------'))
