const execSync = require('child_process').execSync
const chalk = require('chalk')
const branch = require('git-branch')
const inquirer = require('inquirer')

function askQuestions() {
  const questions = [
    {
      name: 'npmRegistry',
      type: 'input',
      message: '请输入npm registry',
      default: 'https://registry.npmjs.org'
    }
  ]

  return inquirer.prompt(questions)
}

// 检查一下当前分支，
// 如果不在develop分支就报错
// 或者在develop分支，但是有未commit的改动
// 又或者与远程分支不同步
function inDevelopBranch() {
  const currentBranch = branch.sync()
  return currentBranch === 'develop'
}

function hasUncommit() {
  const successStr = 'untracked'
  const result = execSync(`git diff-index --quiet HEAD -- || echo "${successStr}"`, { encoding: 'utf-8' })
  const targetRes = execSync(`echo "${successStr}"`, { encoding: 'utf-8' })
  return result === targetRes
}

function needToPull() {
  // 参考：https://stackoverflow.com/questions/17719829/check-if-local-git-repo-is-ahead-behind-remote
  const local = execSync('git rev-parse @', { encoding: 'utf-8' })
  const remote = execSync('git rev-parse @{u}', { encoding: 'utf-8' })
  const base = execSync('git merge-base @ @{u}', { encoding: 'utf-8' })
  if (local !== remote && local === base) {
    return true
  } else {
    return false
  }
}

const run = async() => {
  if (!inDevelopBranch()) {
    console.log(chalk.red('-----------✘ 请先切换到develop分支-----------'))
    return false
  }

  if (hasUncommit()) {
    console.log(chalk.red('-----------✘ 有尚未commit的改动-----------'))
    return false
  }

  if (needToPull()) {
    console.log(chalk.red('-----------✘ 远程有更新，请先拉取最新代码-----------'))
    return false
  }

  const { npmRegistry } = await askQuestions()

  // 先切到master，同步线上的， 然后合并develop
  execSync('git checkout master && git pull origin master --tags && git merge develop')
  console.log(chalk.blue('-----------✔ git checkout master && git pull origin master --tags && git merge develop-----------'))

  // 发布版本
  execSync('npm run build:all', { stdio: 'inherit' })
  console.log(chalk.blue('-----------✔ 构建完成-----------'))
  execSync(`lerna publish --registry ${npmRegistry} --conventional-commits`, { stdio: 'inherit' })
  console.log(chalk.blue(`-----------✔ 发布完成，发布在：${npmRegistry}-----------`))
  // 再切回 develop，并rebase 一下master
  execSync('git push origin master --tags && git checkout develop && git rebase master && git push origin develop --tags')
  console.log(chalk.blue('-----------✔ git push origin master --tags && git checkout develop && git rebase master && git push origin develop --tags-----------'))
}

run()
