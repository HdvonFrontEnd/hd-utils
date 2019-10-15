## Hd-Http

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

### 发送 Post 请求

:::demo
```html
<template>
  <div>
    <el-form size="mini" inline>
      <el-form-item label="title">
        <el-input v-model="title"></el-input>
      </el-form-item>
      <el-form-item label="userId">
        <el-input v-model.number="userId"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">发送请求</el-button>
      </el-form-item>
    </el-form>
    <el-card class="response-card">
      <div slot="header">
        <span>返回信息</span>
      </div>
      <div style="word-break: break-all">
        {{loginResponse}}
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loginApi: 'https://jsonplaceholder.typicode.com/posts',
      title: 'admin',
      userId: 1,
      loginResponse: ''
    }
  },
  methods: {
    async login() {
      const params = {
        title: this.title,
        userId: this.userId
      }
      const res = await this.$hdHttp.post(this.loginApi, this.$qs.stringify(params))
      this.loginResponse = JSON.stringify(res.data)
      return res
    }
  }
}
</script>
```
:::

### 发送 Get 请求

:::demo
```html
<template>
  <div>
     <el-form size="mini" inline>
        <el-form-item label="userId">
          <el-input v-model.number="userId"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="sendReq">发送请求</el-button>
        </el-form-item>
      </el-form>
      <el-card>
        <div slot="header">
          <span>返回信息</span>
        </div>
        <div  style="word-break: break-all">
          {{response}}
        </div>
     </el-card>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        response: '',
        userId: 1
      }
    },
    methods: {
      async sendReq() {
        const res = await this.$hdHttp.get('https://jsonplaceholder.typicode.com/posts', {
          userId: this.userId
        })
        const resStr = JSON.stringify(res.data)
        this.response = resStr
        return res
      }
    }
  }
</script>
```
:::

### 取消请求

:::demo
```html
<template>
  <div>
     <el-button size="mini" type="primary" @click="cancel">发送请求后取消</el-button>
     <el-button size="mini" @click="reset">重置</el-button>
     <el-alert
       v-if="hasCancel"
       title="请求被取消"
       type="error"
       :closable="false"
       style="margin-top: 10px">
     </el-alert>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        hasCancel: false
      }
    },
    methods: {
      cancel() {
        const { isCancel } = this.$hdHttp
        this.$hdHttp.get('https://jsonplaceholder.typicode.com/posts').catch(err => {
          if (isCancel(err)) {
            this.hasCancel = true
            console.error('请求被取消')
          } else {
            console.error(err)
          }
        })
        this.$hdHttp.cancel()
      },
      reset() {
        this.hasCancel = false
      }
    }
  }
</script>
```
:::

### 参数说明

本库基于Axios，因此 API 也继承自[axios](https://github.com/axios/axios)。在axios的基础上修改了get方法的参数，并新增了cancel方法用于取消请求。

#### Methods
方法名|说明|参数
---|---|---|
get | 发送get请求 | (url, params, config)接收三个参数，1. url请求地址，2. params请求参数，可选，3. config请求配置，同axios，可选
post | 发送post请求 | (url, data, config)接收三个参数，同axios，1. url请求地址，2. data请求参数，可选，3. config请求配置，可选。
cancel | 取消所有已发送但是暂未返回的请求| —
