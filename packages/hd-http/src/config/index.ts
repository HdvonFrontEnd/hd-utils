import mergeConfig from '../helpers/mergeConfig'
import axios, { AxiosRequestConfig } from 'axios'
const AXIOS_DEFAULT_CONFIG: AxiosRequestConfig = axios.defaults

// TODO 在这里可以添加我们需要的默认配置
const hdHttpDefault: AxiosRequestConfig = {
  method: 'post',
  // 基础url前缀
  baseURL: '/',
  // 请求头信息
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  // // post data参数
  // data: {}, // 不能给默认值，否则通过formData上传文件的时候会因为有默认值而无法通过isFormData的判断
  // get urlparams参数
  params: {},
  // 设置超时时间
  timeout: 10000
  // 返回数据类型
  // // responseType: 'json', // 不能指定'json'，否则会使得传到transformResponse中的data已经被解析，那么此处transformResponse处理id溢出问题的逻辑就会变得无意义。
  // transformResponse: [(data) => {
  //   // 解决id大于17位，导致溢出的问题。
  //   /*eslint no-param-reassign:0*/
  //   if (typeof data === 'string') {
  //     try {
  //       // Do whatever you want to transform the data
  //       const reg = /:\s?(\d{17,})/g
  //       data = data.replace(reg, ':"$1"')
  //     } catch (e) { /* Ignore */ }
  //     return JSON.parse(data)
  //   }
  //   return data
  // }]
}

/**
 * 默认axios配置
 */
export default mergeConfig(AXIOS_DEFAULT_CONFIG, hdHttpDefault)
