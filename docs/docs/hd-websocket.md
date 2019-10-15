## Hd-Websocket

一个WebSocket库，支持：

1. 发送需要响应的websocket请求（需要后端配合）
2. 发送不需要响应的websocket请求（普通发送消息）
3. 接收后端主动推送的消息（普通接收推送消息）

:::tip
无法在github page中测试本页的例子。如需实际体验效果，可以克隆或下载本仓库，安装依赖后执行`npm run dev`，在本地页面中体验。
:::

使用方式：
```js
import HdWebsocket from 'hd-websocket'
const WS_URL = 'ws://this/is/a/fake/url'
const ws = new HdWebsocket({ wsUrl: WS_URL }) // 传入配置，新建实例

// 注册请求拦截器与响应拦截器
ws.interceptors.request.use(reqFulfilledFun, reqRejectedFun) // 分别是成功请求拦截器与失败请求拦截器
ws.interceptors.response.use(resFulfilledFun, resRejectedFun) // 分别是成功响应拦截器与失败响应拦截器

// 建立连接
ws.initWs().then(() => {
  // 连接成功后发送消息
  return ws.sendMessage({ msg: 'hello WebSocket'})
}).then(res => {
  // 得到成功的响应
  console.log(msg, '<========response received')
})
```

### 需要返回的请求

请打开控制台查看结果

:::demo 此处使用了HDVON内部的websocket服务，在外网无法运行
```html
<template>
  <el-form size="mini" inline class="form">
    <el-form-item label="websocket地址">
      <el-input v-model="wsUrl"></el-input>
    </el-form-item>
    <el-form-item label="token">
      <el-input v-model="token"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="connectWs">连接websocket</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="reconnectWs">测试websocket断开重连</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="stopHeartBeat">测试停止心跳</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="danger" @click="closeWs">断开websocket</el-button>
    </el-form-item>
  </el-form>
  <el-button size="mini" @click="sendRequest">点击发送请求</el-button>
</template>
<script>
export default {
  data() {
    return {
      wsUrl: 'ws://localhost:3017/',
      token: 'token111',
      wsId: this.$hdFun.genUUID(),
      ws: null
    }
  },
  methods: {
    connectWs() {
      this.ws = new this.$hdWebsocket({
        wsUrl: `${this.wsUrl}?wsId=${this.wsId}&token=${this.token}`,
        pingTimeout: 10,
        pongTimeout: 1
      })
      this.ws.initWs().then(res => {
        console.log(res, '<=======websocket连接成功')
      }).catch(err => {
        console.log(err, '<=======连接失败')
      })
      const reqFulfilledFun = payload => {
        return {
          ...payload,
          token: this.token,
          wsId: this.wsId,
          version: '1.0'
        }
      }
      const reqRejectedFun = (err) => {
        console.log(err)
      }
      if (this.ws) {
        this.ws.interceptors.request.use(reqFulfilledFun, reqRejectedFun)
      }
    },
    closeWs() {
      if (this.ws) {
        this.ws.closeWs().then(res => {
          console.log(res)
        }).catch(err => {
          console.log('关闭失败，错误码是', err)
        })
      } else {
        this.$message.error('请先连接websocket')
      }
    },
    sendRequest() {
      const payload = {
        type: 'video',
        method: 'play',
        param: {
          protocol: '28181'
        }
      }
      this.ws.sendMessage(payload).then(res => {
        console.log('请求成功', res)
      })
    },
    reconnectWs() {
      this.ws.ws.send('close')
    },
    stopHeartBeat() {
      this.ws.ws.send('stopHeart')
    }
  }
}
</script>
```
:::

### 服务器主动推送数据

请打开控制台查看结果

:::demo 此处使用了HDVON内部通知推送的websocket做例子，在外网无法运行
```html
<template>
	<div class="server-push-example-wrapper">
    <el-form size="mini" inline class="form">
      <el-form-item label="websocket地址">
        <el-input v-model="wsUrl"></el-input>
      </el-form-item>
      <el-form-item label="token">
        <el-input v-model="token"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="connectWs">连接websocket</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="closeWs">断开websocket</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'server-push-example',
  data() {
    return {
      wsUrl: 'ws://localhost:3017/',
      token: 'token111',
      wsId: this.$hdFun.genUUID(),
      ws: null
    }
  },
  methods: {
    connectWs() {
      this.ws = new this.$hdWebsocket({
        wsUrl: `${this.wsUrl}?wsId=${this.wsId}&token=${this.token}`,
        pingTimeout: 60 * 60 * 2,
        pongTimeout: 1
      })

      const resFulfilledFun = response => {
        console.log('接收到来自服务器的推送：', response)
        return response
      }
      const resRejectedFun = (err) => {
        console.log(err)
      }
      this.ws.interceptors.response.use(resFulfilledFun, resRejectedFun)

      this.ws.initWs()
    },
    closeWs() {
      if (this.ws) {
        this.ws.closeWs()
      } else {
        this.$message.error('请先连接websocket')
      }
    }
  }
}
</script>
```
:::

### 可选配置
参数名 | 说明 | 值类型 | 默认值
--- | --- | --- | ---
wsUrl | WebSocket的url | string | —
pingTimeout | 心跳发送间隔， 单位s | number | 5
pongTimeout | 心跳发回间隔， 单位s | number | 1
reconnectTimeout | 重连间隔， 单位s | number | 5
reconnectCountLimit | 最大重连次数 | number | 200
pingMsg | 心跳ping信息 | string | 'ping'
pongMsg | 心跳pong信息 | string | 'pong'
pingLog | 是否打开心跳日志 | boolean | false
transactionID | 请求id的key，用于需要返回的请求 | string | 'transactionID'
transformRequest | 在发送数据前对数据做最后的处理 | function | 见下方
transformResponse | 接收到服务端推送的数据后对数据进行处理的函数 | function | 见下方

```
// 默认 transformRequest
function defaultTransformRequest(data) {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}
```

```
// 默认 transformResponse
defaultransformResponse(data) {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) {
      // do nothing
    }
  }
  return data
}
```

### Methods

方法名|说明|参数
---|---|---|
initWs | 建立WebSocket连接，绑定事件， 返回Promise，resolve参数为实例 | —
sendMessage | 向服务端发送数据， 返回Promise | (data, needResponse)，接收两个参数，1. data待发送消息，2. needResponse是否为需要返回的请求，默认为true
interceptors.request.use | 添加请求拦截器，返回拦截器id | (resolved, rejected)，接收两个参数，1. resolved成功请求拦截器，rejected失败请求拦截器，类型均为function
interceptors.request.eject | 弹出指定请求拦截器 | (id)，接收一个参数，1. id拦截器id
interceptors.response.use | 添加响应拦截器，返回拦截器id | (resolved, rejected)，接收两个参数，1. resolved成功响应拦截器，rejected失败响应拦截器，类型均为function
interceptors.response.eject | 弹出指定响应拦截器 | (id)，接收一个参数，1. id拦截器id

### 拦截器

:::tip
针对拦截器做一些说明，
通过interceptors.request.use或者interceptors.response.use可以添加多个对应拦截器，也可以通过对应的eject方法弹出指定拦截器。
:::

各个拦截器配合情况是这样的：**（拦截器的编号代表拦截器的添加顺序，例如拦截器1比拦截器2更早被添加）**

a. **需要响应的请求**

请求拦截器2 --> 请求拦截器1 --> 发送消息 --> 接收响应 --> 响应拦截器1 --> 响应拦截器2

b. **不需要响应的请求（普通发送消息）**

请求拦截器2 --> 请求拦截器1 --> 发送消息

c. **后端主动推送的消息（普通接收推送消息）**

接收消息 --> 响应拦截器1 --> 响应拦截器2

**另外注意的是，请求拦截器接收到的参数是待发送的数据，而响应拦截器接收到的参数则是收到的消息。**

因此拦截器在处理完之后，都应该返回一个数据，供后续操作。