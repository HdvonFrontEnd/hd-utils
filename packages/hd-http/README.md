## Hd-Http

![npm download](https://img.shields.io/npm/dt/hd-http)

一个基于axios封装的 http 库

使用方式：

```js
import HdHttp from 'hd-http'
let http = HdHttp.create()

// 发送get请求
http.get('https://jsonplaceholder.typicode.com/posts', { userId: 1 }).then(res => console.log(res))

// 发送post请求
http.post('https://jsonplaceholder.typicode.com/posts', { title: 'foo', userId: 1 }).then(res => console.log(res))

// 取消请求
http.cancel()

// 添加拦截器
http.interceptors.request.use(config => {
  return config
},
error => {
  return Promise.reject(error)
})
```

详细文档见：