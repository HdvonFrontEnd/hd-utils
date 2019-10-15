import { ResolvedFn, RejectedFn } from '../types'

interface Interceptor<T> {
  resolved: ResolvedFn<T>;
  rejected: RejectedFn;
}

/**
 * 拦截器管理类
 * 通过泛型，同时适用于请求拦截器与响应拦截器
 */
export default class InterceptorManager<T> {
  private _interceptors: Array<Interceptor<T> | null>

  constructor() {
    this._interceptors = []
  }

  /**
   * 添加拦截器
   * @param resolved 成功回调
   * @param rejected 失败回调
   * @return {number} 拦截器id
   */
  use(resolved: ResolvedFn<T>, rejected: RejectedFn): number {
    this._interceptors.push({
      resolved,
      rejected
    })
    return this._interceptors.length - 1
  }

  /**
   * 删除拦截器
   * @param id 拦截器id
   */
  eject(id: number): void {
    if (this._interceptors[id]) this._interceptors[id] = null
  }

  /**
   * 遍历拦截器
   * @param fn
   */
  forEach(fn: (interceptor: Interceptor<T>) => void): void {
    this._interceptors.forEach(interceptor => {
      if (interceptor !== null) fn(interceptor)
    })
  }

  /**
   * 获取当前活动的拦截器数量（主要用于测试）
   */
  getInterceptorsCount(): number {
    return this._interceptors.filter(interceptor => interceptor !== null).length
  }
}
