## Hd-Log

日志格式化打印库

使用方式：
``` bash
# 安装插件
npm install hd-log
```

```js
// 引入插件
import HdLog from 'hd-log'
// 传入配置参数，返回一个实例
const config = {
  serverUrl: 'http://test.com',
  needStringify: true
}
const logger = new HdLog(config)
logger.info('hello, world')
```

### 日志格式化打印

能设置打印级别与发送级别，能自动捕获未被捕获的错误与promise reject。

:::demo
```html
<template>
	<div>
    <el-alert
      class="hd-log-notice"
      title="请打开控制台查看打印结果"
      :closable="false"
      type="success">
    </el-alert>
    <el-form>
      <el-form-item label="设置打印级别">
        <el-radio-group v-model="printLevel" @change="setPrintLevel">
          <el-radio v-for="item in levelArr" :key="item" :label="item">{{item}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="设置发送级别">
        <el-radio-group v-model="sendLevel" @change="setSendLevel">
          <el-radio v-for="item in levelArr" :key="item" :label="item">{{item}}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <el-button size="mini" type="primary" @click="toLog('info')">info 级别</el-button>
    <el-button size="mini" type="warning" @click="toLog('warn')">warn 级别</el-button>
    <el-button size="mini" type="danger" @click="toLog('error')">error 级别</el-button>
    <el-button size="mini" @click="emitErr">点击产生一个错误</el-button>
    <el-button size="mini" @click="emitPromiseErr">点击产生一个Promise异常</el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      logger: new this.$hdLog({
        verbose: true
      }),
      levelArr: ['info', 'warn', 'error', 'off'],
      printLevel: 'info',
      sendLevel: 'info'
    }
  },
  methods: {
    setPrintLevel() {
      this.logger.setPrintLevel(this.printLevel)
    },
    setSendLevel() {
      this.logger.setSendLevel(this.sendLevel)
    },
    toLog(level) {
      this.logger[level](`一条消息，级别：`, [level], level, { level })
    },
    emitErr() {
      throw new Error('抛出一条错误')
    },
    emitPromiseErr() {
      return Promise.reject('抛出一条promise 异常')
    }
  }
}
</script>
```
:::

### 定时发送日志到后台服务器

能定时发送日志到后台服务器，用于长期保存。

:::demo
```html
<template>
  <div>尚未实现</div>
</template>
```
:::

### 可选配置
参数名 | 说明 | 值类型 | 默认值
--- | --- | --- | ---
serverUrl | 服务器地址，为空则不会发送到服务端 | String | 无
sendInterval | 发送到服务器的发送间隔（毫秒） | Number | 10秒
maxSendError | 最大连续发送错误次数，超过则停止发送到服务器 | Number | 5
autoLogError | 是否自动记录未捕获错误 | Boolean | true
autoLogPromise | 是否自动记录未捕获的promise异常 | Boolean | true
needStringify | 是否需要对数组与对象序列化 | Boolean | false
verbose | 是否需要打印消息级别的堆栈信息 | Boolean | false

### Methods

方法名|说明|参数
---|---|---|
setLevel | 同时设置打印级别与发送级别 | (level)，接收一个参数，1. level级别，可选值：info-信息级别，warn-警告级别，error-错误级别，off-关闭所有
setPrintLevel | 单独设置打印级别 | 同setLevel。
setSendLevel | 单独设置发送级别 | 同setLevel。
info | 记录一条信息日志 | (arg1, arg2, ...args)，接收任意数量、任意类型的参数。
log | 同`info` | 同info
warn | 记录一条警告日志 | 同info
error | 记录一条错误日志 | 同info
