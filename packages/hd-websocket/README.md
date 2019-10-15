## Hd-Websocekt

![npm download](https://img.shields.io/npm/dt/hd-websocket)

一个WebSocket库，支持：

1. 发送需要响应的websocket请求（需要后端配合）
2. 发送不需要响应的websocket请求（普通发送消息）
3. 接收后端主动推送的消息（普通接收推送消息）

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

详细文档见：