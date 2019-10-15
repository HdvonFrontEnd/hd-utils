## Hd-Fun

工具函数库

内部含有多个函数，通过ES Module引入所需函数：

```js
import { genTreeData } from 'hd-fun'

const originalTree = [{name: 'xx', pid: 0, id: 123}, {name: 'yy', pid: 123, id: 1234} ]
const resTree = genTreeData(originalTree)
```

### 交互模块

涉及一些用户直接与应用交互的操作

#### 点击拷贝指定文字

:::demo
```html
<template>
  <div>
     <div class="test-msg">{{testMsg}}</div>
     <el-button @click="copy" size="mini" type="primary">点击拷贝上面的文字</el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      testMsg: '测试拷贝文字'
    }
  },
  methods: {
    copy() {
      if (this.$hdFun.copyData(this.testMsg)) {
        this.$message.success('拷贝成功')
      }
    }
  }
}
</script>
```
:::

#### 下载blob数据

:::demo
```html
<template>
  <div>
    <canvas ref="canvas" width="150" height="80"></canvas>
    <el-button size="mini" type="primary" @click="download">点击下载左侧图片</el-button>
  </div>
</template>
<script>
export default {
  mounted() {
    const canvas = this.$refs.canvas
    const ctx = canvas.getContext('2d')
    ctx.font = '20px serif'
    ctx.fillStyle = '#FFA500'
    ctx.fillRect(0, 0, 150, 80)
    ctx.fillStyle = '#000'
    ctx.fillText('Hello world', 10, 50)
  },
  methods: {
    download() {
      this.$refs.canvas.toBlob(blob => {
        this.$hdFun.downloadBlobFile(blob, '下载blob测试.png')
      })
    }
  }
}
</script>
```
:::

#### 在新标签页打开链接

:::demo
```html
<template>
  <div>
    <div class="test-link">
      <a :href="url">弘度科技-中国领先的视频云平台及智慧运维产品提供商</a>
    </div>
    <el-button @click="open" size="mini" type="primary">点击在新标签打开上述链接</el-button>
  </div>
</template>
<script>
export default {
    data() {
      return {
        url: 'http://www.hdvon.com/'
      }
    },
    methods: {
      open() {
        this.$hdFun.openWindow(this.url)
      }
    }
}
</script>
```
:::

#### Functions
函数名|说明|参数
---|---|---|
copyData | 拷贝指定值，返回boolean代表是否拷贝成功 | (value)接收一个参数，待拷贝到剪切板的值 value
downloadBlobFile | 下载blob数据 | (blob, filename)接收两个参数，1. blob数据，2. filename文件名
openWindow | 在新窗口打开链接，用于绕开浏览器对window.open的限制 | (url, targetType)接收两个参数，1. url需要被打开的链接，2. targetType链接打开的目标位置，用于赋值给a标签的target属性，默认值为_blank

### Tree 模块

用于树形结构数据相关操作

#### 生成树形结构数据

::: demo
```html
<template>
  <div>
    <el-form size="mini" inline>
      <el-form-item label="根节点id">
        <el-input v-model="rootID"></el-input>
      </el-form-item>
      <el-form-item label="起始level值">
        <el-input v-model="rootLevel"></el-input>
      </el-form-item>
      <el-form-item label="父节点字段名">
        <el-input v-model="parentKey"></el-input>
      </el-form-item>
    </el-form>
    <el-form size="mini">
      <el-form-item label="原始数据">
        <el-input type="textarea" v-model="flatTreeData"></el-input>
      </el-form-item>
      <el-form-item label="转换后数据">
        <el-input type="textarea" v-model="structureTreeData"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="genStructureTree">转换</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      flatTreeData: JSON.stringify([
        { name: 'xx', pid: 0, id: 123 }, 
        { name: 'yy', pid: 123, id: 1234 },
        { name: 'zz', pid: 0, id: 124 }, 
        { name: 'yy', pid: 124, id: 1234 }]),
      structureTreeData: '',
      rootID: 0,
      rootLevel: 1,
      parentKey: 'pid'
    }
  },
  methods: {
    genStructureTree() {
      this.structureTreeData = JSON.stringify(
        this.$hdFun.genTreeData(JSON.parse(this.flatTreeData), { pid: this.parentKey, root: +this.rootID, level: +this.rootLevel })
      )
    }
  }
}
</script>
```
:::

#### 给结构化的树形数据添加level值

:::demo
```html
<template>
  <div>
    <el-form size="mini" inline>
      <el-form-item label="起始level值">
        <el-input v-model="rootLevel"></el-input>
      </el-form-item>
      <el-form-item label="子节点字段名">
        <el-input v-model="childrenKey"></el-input>
      </el-form-item>
    </el-form>
    <el-form size="mini">
      <el-form-item label="原始数据">
        <el-input type="textarea" v-model="oriTreeData"></el-input>
      </el-form-item>
      <el-form-item label="转换后数据">
        <el-input type="textarea" v-model="setLevelTreeData"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="setTreeNodeLevel">转换</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'set-level',
  data() {
    return {
      oriTreeData: JSON.stringify([
        { 'name': 'xx', 'pid': 0, 'id': 123, 'children': [{ 'name': 'yy', 'pid': 123, 'id': 1234 }] }
      ]),
      setLevelTreeData: '',
      rootLevel: 1,
      childrenKey: 'children'
    }
  },
  methods: {
    setTreeNodeLevel() {
      this.setLevelTreeData = JSON.stringify(this.$hdFun.setTreeNodeLevel(JSON.parse(this.oriTreeData), {
        rootLevel: +this.rootLevel,
        childrenKey: this.childrenKey
      }))
    }
  }
}
</script>
```
:::

#### Functions
函数名|说明|参数
---|---|---|
genTreeData | 生成结构化的树形数据，返回结构化的树形数据，也会给数据新增一个uniKey的字段，用于适配同时有多个id相同的成员的问题 | (arr,option)接收两个参数，1. arr平铺的具有层级结构的数组，例如`[{name: 'xx', pid: 0, id: 123}, {name: 'yy', pid: 123, id: 1234} ]`，2. option选项，Object类型，可配置root 根节点id，level 起始level值，pid 父节点字段名，默认值：`{ root：0, level：1, pid： 'pid' }` 
setTreeNodeLevel | 给结构化的树形数据设定level值，返回添加了level值的数据 | (treeData, option)接收两个参数，1. treeData结构化的树形数据数组，例如`[{name: 'xx', pid: 0, id: 123, children: [{name: 'yy', pid: 123, id: 1234}]}]`，2. option选项，Object类型，可配置rootLevel 起始level值，childrenKey 子节点的字段名，默认值： `{ rootLevel: 1, childrenKey: 'children' }`


### util 模块

其他一些工具函数

#### 生成UUID

:::demo
```html
<template>
  <div>
    <el-button @click="genUUID" size="mini" type="primary">生成</el-button>
    <div class="gen-result">{{uuid}}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      uuid: '点击按钮生成UUID'
    }
  },
  methods: {
    genUUID() {
      this.uuid = this.$hdFun.genUUID()
    }
  }
}
</script>
```
:::

#### 检测当前浏览器

:::demo
```html
<template>
  <div>
    <ul class="browser-list">
      <li class="browser-item" v-for="browser in browserList" :key="browser">
        是否为 {{browser}} 浏览器？ {{detectBrowser(browser) ? '是' : '否'}}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      browserList: ['opera', 'ie', 'firefox', 'safari', 'chrome']
    }
  },
  methods: {
    detectBrowser(browserName) {
      return this.$hdFun.browser(browserName)
    }
  }
}
</script>
```
:::

#### 字节数转化成合适的单位

:::demo
```html
<template>
  <div class="bytes-to-size-wrapper">
    <el-form inline>
      <el-form-item label="转换前（单位byte）" size="mini">
        <el-input v-model.number="bytes"></el-input>
      </el-form-item>
      <el-form-item label="转换后" size="mini">
        <el-input readonly v-model="size"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    const defaultSize = 683468
    return {
      bytes: defaultSize,
      size: this.$hdFun.bytesToSize(defaultSize)
    }
  },
  watch: {
    bytes(newVal) {
      if (!newVal) {
        this.bytes = 0
      }
      this.size = this.$hdFun.bytesToSize(newVal)
    }
  }
}
</script>
```
:::

#### 全屏模块

:::demo
```html
<template>
  <div class="fullscreen-wrapper">
    <div class="fullscreen-target" ref="fullscreenTarget">
      点击进入全屏
      <el-button
        class="button"
        @click="toggleFullscreen"
        size="mini"
      >{{isFullscreen ? '退出全屏' : '进入全屏'}}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isFullscreen: false
    }
  },
  mounted() {
    this.$hdFun.listenFullscreen(this.onFullscreenChange.bind(this))
  },
  methods: {
    onFullscreenChange() {
      this.isFullscreen = !this.isFullscreen
    },
    toggleFullscreen() {
      if (this.isFullscreen) {
        this.$hdFun.exitFullscreen()
      } else {
        this.$hdFun.enterFullscreen(this.$refs.fullscreenTarget)
      }
    }
  }
}
</script>
```
:::

#### 根据属性查找对象数组中的项

:::demo
```html
<template>
  <div class="get-data-by-key-wrapper">
    <el-form :model="form" label-width="80px" size="mini">
      <el-form-item label="对象数组">
        <el-input type="textarea" v-model="form.dataArr"></el-input>
      </el-form-item>
      <el-form-item label="key">
        <el-input v-model="form.key"></el-input>
      </el-form-item>
      <el-form-item label="value">
        <el-input v-model="form.value"></el-input>
      </el-form-item>
    </el-form>
    <h4>查找结果：</h4>
    <div>{{result}}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        dataArr: '[{"name":"xx","pid":"0","id":"123"},{"name":"yy","pid":"123","id":"1234"},{"name":"zz","pid":"0","id":"124"}]',
        key: '',
        value: ''
      },
      result: {}
    }
  },
  watch: {
    form: {
      deep: true,
      immediate: true,
      handler() {
        const dataArr = JSON.parse(this.form.dataArr)
        this.result = this.$hdFun.getDataByKey(dataArr, this.form.key, this.form.value) || '请输入数据与查询条件'
      }
    }
  }
}
</script>
```
:::

#### Functions
函数名|说明|参数
---|---|---|
genUUID | 生成UUID，返回一个UUID字符串，例如：'fa0e7d70-d4f8-4920-843d-4f8c6ab86198' | —
browser | 判断是否为某浏览器，返回一个Boolean代表是否为该浏览器 | (name)接收一个参数，name浏览器名，可选值：opera，ie，safari，firefox，chrome
bytesToSize | 将字节转换成合适的显示方式，返回一个格式化后的字符串 | (bytes)接收一个参数，bytes字节大小，number类型
enterFullscreen | 让指定dom节点进入全屏 | (dom)接收一个参数，dom需要全屏的dom节点
exitFullscreen | 退出全屏 | —
listenFullscreen | 监听全屏状态 | (cb)接收一个参数，cb全屏状态改变时触发的回调函数
getDataByKey | 根据对象某个属性找到对象数组中的某一项，返回查找到的对象 | (dataArr, key, value)接收三个参数，1. dataArr对象数组，2. key根据这个属性来查找，3. value需要查找的值

### 时间模块

维护一些时间相关的函数，基于day.js

#### 时间差

:::demo
```html
<template>
  <div class="time-diff-wrapper">
    <h4><el-date-picker v-model="source" type="datetime" placeholder="选择日期时间" size="mini"></el-date-picker> 与当前时间（{{new Date()}}）差为：</h4>
    <h4>{{result}}</h4>
  </div>
</template>

<script>
export default {
  data() {
    return {
      source: '2019-07-21 11:20:00'
    }
  },
  computed: {
    result() {
      return this.$hdFun.timeDiff(this.source)
    }
  }
}
</script>
```
:::

#### 获取时间戳

:::demo
```html
<template>
  <div class="get-timestamp-wrapper">
    <h4>转换前</h4>
    <div class="source">{{source}}</div>
    <h4>转换后</h4>
    <div class="output">{{output}}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      source: '2019-05-27 00:00:00'
    }
  },
  computed: {
    output() {
      return this.$hdFun.getTimestamp(this.source)
    }
  }
}
</script>
```
:::

#### 秒数转化为时分秒

:::demo
```html
<template>
  <div class="second">
    <h4>请输入秒数</h4>
    <el-input size="small" v-model="second"></el-input>
    <h4>结果：</h4>
    <div>{{result}}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      second: '100000'
    }
  },
  computed: {
    result() {
      return this.$hdFun.formatSecond(this.second)
    }
  }
}
</script>
```
:::

#### Functions
函数名|说明|参数
---|---|---|
formatTime | 输出格式化日期字符串，返回格式化的日期字符串 | (date, format)接收两个参数，1. date时间，2.format输出格式，默认值：'YYYY-MM-DD HH:mm:ss.SSS'。参数详情见day.js文档
getTimestamp | 获取时间戳，返回时间戳 | (date, ms)接收两个参数，1. date时间，详见day.js文档，2. 是否为毫秒格式，默认是true
formatSecond | 秒数转化为时分秒，返回时分秒格式的字符串 | (value)接收一个参数，value秒数
timeDiff | 获取时间差字符串，返回时间差字符串： 时间差小于一分钟：刚刚（不管是前还是后），大于一分钟小于一小时：x分钟前（或者x分钟后），大于一小时小于一周：x天前（或者x天后），同年：MM-DD，大于一年：YYYY-MM-DD | (date, ref, monthFormat, yearFormat)接收四个参数，1. date日期，详见day.js，2. ref参考日期，如果值为now则与当前时间对比，默认值为now，3. monthFormat月份格式，当时间差大于7天但是两个时间同年时显示的格式，默认为MM-DD，4. yearFormat年格式，时间差大于一周且两个时间**不**同年时显示的格式， 默认值为YYYY-MM-DD
day | 完整的day.js函数 | —

### 正则校验模块

维护一些常用正则表达式，存放在regexp的属性中

:::demo 引入方式为 `import {regexp} from 'hd-fun'`
```html
<template>
  <div class="regexp-example-wrapper">
    <el-tabs type="border-card">
      <el-tab-pane :label="item.label" v-for="(item, index) in regexpList" :key="item.label">
        <div class="desc">{{item.desc}}</div>
        <el-form size="mini">
          <el-form-item label="待校验字符串">
            <el-input v-model="item.text"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="validateBtn" @click="validate(index)">校验</el-button>
            <el-tag type="success" v-if="item.result">校验通过</el-tag>
            <el-tag type="danger" v-else-if="item.result === false">校验失败</el-tag>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      regexpList: [
        {
          label: '名称',
          regexp: this.$hdFun.regexp.regexpAccount,
          desc: '由中文、英文以及下划线组成，但不允许以下划线开头或结尾。',
          text: ''
        },
        {
          label: 'IPv4',
          regexp: this.$hdFun.regexp.regexpIP,
          desc: '点分十进制, 范围为[0, 255]',
          text: ''
        },
        {
          label: '端口',
          regexp: this.$hdFun.regexp.regexpPort,
          desc: '校验端口号',
          text: ''
        },
        {
          label: '手机号码',
          desc: '11位数字，可以是13, 14, 15, 16, 17, 18, 19开头',
          regexp: this.$hdFun.regexp.regexpMobilePhone,
          text: ''
        },
        {
          label: '固定电话号码',
          desc: '需要添加区号，并且用短横线隔开。区号需要0开头，可以3位也可以4位。电话号码为7到8位。',
          regexp: this.$hdFun.regexp.regexpPhone,
          text: ''
        },
        {
          label: '邮箱',
          desc: '电子邮箱的规则较为复杂，参考：https://emailregex.com/',
          regexp: this.$hdFun.regexp.regexpEmail,
          text: ''
        },
        {
          label: '居民身份证号',
          desc: '长度为18位或15位。对于18位的，最后一位可以是x（大小写均可）。其余情况必须为数字。',
          regexp: this.$hdFun.regexp.regexpResidentID,
          text: ''
        },
        {
          label: '整数',
          desc: '包括0， 正整数，负整数。除0以外不能以0开头',
          regexp: this.$hdFun.regexp.regexpInteger,
          text: ''
        },
        {
          label: '正整数',
          desc: '只能是正整数',
          regexp: this.$hdFun.regexp.regexpIntegerP,
          text: ''
        },
        {
          label: '负整数',
          desc: '只能是负整数',
          regexp: this.$hdFun.regexp.regexpIntegerN,
          text: ''
        },
        {
          label: '英文字母',
          desc: '只含有英文字母',
          regexp: this.$hdFun.regexp.regexpEnOnly,
          text: ''
        },
        {
          label: '英文字母或下划线',
          desc: '只含有英文字母或下划线',
          regexp: this.$hdFun.regexp.regexpEnUnderline,
          text: ''
        },
        {
          label: '英文或数字',
          desc: '只有英文或数字',
          regexp: this.$hdFun.regexp.regexpEnNumber,
          text: ''
        },
        {
          label: '中文字符',
          desc: '只有中文字符',
          regexp: this.$hdFun.regexp.regexpChOnly,
          text: ''
        },
        {
          label: '含有中文字符',
          desc: '含有中文字符',
          regexp: this.$hdFun.regexp.regexpHasCh,
          text: ''
        },
        {
          label: '20位国标编码',
          desc: '20位数字',
          regexp: this.$hdFun.regexp.regexpGB,
          text: ''
        },
        {
          label: '汉字，数字，英文，下划线，短线',
          desc: '只允许含有汉字，数字，英文，下划线，短线',
          regexp: this.$hdFun.regexp.regexpChEnNumDash,
          text: ''
        },
        {
          label: 'MAC地址',
          desc: 'xx-xx-xx-xx-xx-xx的形式（xx为16进制数字）',
          regexp: this.$hdFun.regexp.regexpMac,
          text: ''
        },
        {
          label: '两位正整数',
          desc: '两位正整数, 即01-99',
          regexp: this.$hdFun.regexp.regexpTwoDigit,
          text: ''
        },
        {
          label: '经度',
          desc: '0-180度, 可以以-，+开头，小数点后最多6位，也可以没有小数点。',
          regexp: this.$hdFun.regexp.regexpLongitude,
          text: ''
        },
        {
          label: '维度',
          desc: '0-90度, 可以以-，+开头，小数点后最多6位，也可以没有小数点。',
          regexp: this.$hdFun.regexp.regexpLatitude,
          text: ''
        }
      ]
    }
  },
  methods: {
    validate(index) {
      const item = this.regexpList[index]
      const result = item.regexp.test(item.text)
      this.$set(item, 'result', result)
    }
  }
}
</script>
```
:::


属性名 | 说明
--- | ---
regexpAccount | 校验名称
regexpIP | 校验IP
regexpPort | 校验端口
regexpMobilePhone | 校验手机号码
regexpPhone | 校验固定电话号码
regexpEmail | 校验邮箱
regexpResidentID | 校验居民身份证号
regexpInteger | 校验整数
regexpIntegerP | 校验正整数
regexpIntegerN | 校验负整数
regexpEnOnly | 只能有英文字母
regexpEnUnderline | 只有英文字母或下划线
regexpEnNumber | 只有英文与数字
regexpChOnly | 只有中文字符
regexpHasCh | 含有中文字符
regexpGB | 校验20位国标编码
regexpChEnNumDash | 只允许输入汉字，数字，下划线，短线等
regexpMac | 校验MAC地址
regexpTwoDigit | 校验两位正整数
regexpLongitude | 校验经度
regexpLatitude | 校验维度