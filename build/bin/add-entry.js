const inquirer = require('inquirer')
const chalk = require('chalk')

const fs = require('fs')
const render = require('json-templater/string')
// const uppercamelcase = require('uppercamelcase')
const path = require('path')
const OUTPUT_PATH = path.join(__dirname, `../../packages`)

const PACKAGE_JSON_TEMPLATE = `{
  "name": "{{name}}",
  "version": "0.0.1",
  "description": "",
  "main": "dist/index.js",
  "files": [
    "dist"
  ],
  "scripts": {},
  "keywords": [],
  "author": "HDVON",
  "license": "MIT"
}
`

const WEBPACK_CONF_TEMPLATE = `const path = require('path')
const basePackagesConfig = require('../../build/webpack.packages')
const merge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')

const webpackConfig = {
  entry: {
    index: path.join(__dirname, 'index.js')
  },
  output: {
    path: path.join(__dirname, 'dist'),
    library: '{{name}}',
    filename: '[name].js',
    chunkFilename: '[name].js',
    libraryTarget: 'umd'
  },
  externals: [nodeExternals({ modulesDir: path.join(__dirname, './node_modules') })]
}

module.exports = merge(basePackagesConfig, webpackConfig)`

const init = () => {
  console.log(chalk.green('Create relate files for adding a new package'))
}

const askQuestions = async() => {
  const questions = [
    {
      name: 'PACKAGENAME',
      type: 'input',
      message: 'What\'s the name of your package?'
    }
  ]

  return inquirer.prompt(questions)
}

const createFile = (packageName) => {
  const PACKAGE_PATH = path.join(OUTPUT_PATH, `/${packageName}`)
  // 创建目录
  fs.mkdirSync(path.join(PACKAGE_PATH, '/src'), { recursive: true })

  // 创建index.js
  fs.writeFileSync(path.join(PACKAGE_PATH, '/index.js'), '')

  // 创建src目录下的index.js
  fs.writeFileSync(path.join(PACKAGE_PATH, '/src/index.js'), '')

  // 创建package.json
  fs.writeFileSync(path.join(PACKAGE_PATH, `/package.json`), render(PACKAGE_JSON_TEMPLATE, {
    name: packageName
  }))

  // 创建webpack.conf.js
  fs.writeFileSync(path.join(PACKAGE_PATH, '/webpack.conf.js'), render(WEBPACK_CONF_TEMPLATE, {
    name: packageName
  }))

  // 返回路径
  return PACKAGE_PATH
}

const success = (filePath) => {
  console.log(chalk.white.bgGreen.bold(`DONE! Relate files had been created at: ${filePath}`))
}

const run = async() => {
  // show script introduction
  init()
  // ask questions
  const answers = await askQuestions()
  const { PACKAGENAME } = answers
  // create the file
  const filePath = createFile(PACKAGENAME)
  // show success message
  success(filePath)
}

run()
