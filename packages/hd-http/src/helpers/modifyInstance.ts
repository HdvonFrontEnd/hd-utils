import { Canceler, AxiosStatic, default as axios, AxiosRequestConfig, AxiosPromise } from 'axios'
const { CancelToken } = axios
import { HdHttpStatic } from '../types'

const MAX_QUEUE_LEN = 200 // 请求队列最大长度
const requestQueue: Canceler[] = [] // 请求队列

export default function modifyInstance(instance: AxiosStatic): HdHttpStatic {
  const toBeAdd = ['get', 'post', 'cancel']
  const result: HdHttpStatic = Object.create(null)
  for (const key in instance) {
    if (!toBeAdd.includes(key)) result[key] = instance[key]
  }
  result.get = function<T>(url: string, params?: any, config?: AxiosRequestConfig): AxiosPromise<T> {
    const finalConfig: AxiosRequestConfig = Object.assign({
      params
    }, {
      cancelToken: new CancelToken((c): void => {
        // 参数 c 也是个函数
        if (requestQueue.length >= MAX_QUEUE_LEN) {
          requestQueue.shift()
        }
        requestQueue.push(c)
      })
    }, config)
    return instance.get(url, finalConfig)
  }

  result.post = function<T>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T> {
    const finalConfig: AxiosRequestConfig = Object.assign({
      cancelToken: new CancelToken((c): void => {
        // 参数 c 也是个函数
        if (requestQueue.length >= MAX_QUEUE_LEN) {
          requestQueue.shift()
        }
        requestQueue.push(c)
      })
    }, config)
    return instance.post(url, data, finalConfig)
  }

  result.cancel = function(): void {
    while (requestQueue.length > 0) {
      const canceler = requestQueue.pop()
      if (typeof canceler !== 'undefined') canceler('取消请求')
    }
  }

  return result
}
