# Hd-Queue

用于管理并发任务

通过push方法往任务队列（waitList）推入任务

如果执行中的任务数量（aRunning）不超过最大同时执行任务数（concurrency），则立即调用go方法

在go方法中，会不断从waitList中获取任务并执行，如果已经满了（this.aRunning.length ===this.thread）就等待

另外push方法经过promise封装，如果推入的任务得到执行，则会被resolve或reject
 


## 快速开始

#### 下载
``` bash
# 安装插件
npm install hd-queue
```

#### 引入
```js
// 引入插件
import HdQueue from 'hd-queue'
```

#### 使用
```js
const q = new HdQueue(2)
for (let i = 0; i < 10; i++) {
  console.log(`插入id:${i}`)
  q.push(() => {
    return new Promise(resolve => {
      setTimeout(() => resolve(i), 1000)
    })
  }).then(res => {
    console.log(`插入id完成:${res}`)
  })
}
```
:::demo
```html
<template>
  <div class="hd-queue-example-wrapper">
    <h2>Hd-queue 队列函数</h2>
    <el-form size="mini">
      <el-form-item label="队列并行数">
        <el-input-number v-model="concurrent " :disabled="!!queue"></el-input-number>
      </el-form-item>
        <el-form-item label="等待时间(ms)：">
        <el-input-number v-model="waitTime "></el-input-number>
      </el-form-item>
      <el-button @click="instantiationQueue" :disabled="!!queue">实例化Queue</el-button>
      <el-button @click="pushFun" :disabled="!queue">push一个参数为{{id+1}}的函数</el-button>
      <el-button @click="clear" :disabled="!queue">清空</el-button>
    </el-form>
    <el-row>
      <el-col :span="12">
        <div v-for="(item,idx) in logs1" :key="idx">{{item}}</div>
      </el-col>
      <el-col :span="12">
        <div v-for="(item,idx) in logs2" :key="idx">{{item}}</div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
const wait = async(time, data) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), time)
  })
}
export default {
  name: 'hd-queue-example',
  data() {
    return {
      activeName: 'example',
      concurrent: 2,
      logs1: [],
      logs2: [],
      id: 0,
      waitTime: 1000,
      queue: null
    }
  },
  methods: {
    instantiationQueue() {
      console.log(this.$hdQueue)
      this.queue = new this.$hdQueue(this.concurrent)
    },
    clear() {
      this.logs1 = []
      this.logs2 = []
    },
    pushFun() {
      this.id++
      const id = this.id
      this.logs1.unshift(`插入id:${id}`)
      this.queue.push(async() => {
        return await wait(this.waitTime, id)
      }).then(res => {
        this.logs2.unshift(`插入id完成:${res}`)
      })
    }
  }
}
</script>

```
:::



#### 参数
参数名|类型|默认值
---|---|---|
concurrency | Number(正整数) | 无


#### Methods
方法名|说明|参数
---|---|---|
push | 往队列推入一个带执行的Promis函数，函数会立即执行或等待 | 无
