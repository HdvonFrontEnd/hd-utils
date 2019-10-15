import HdHttp, { CancelToken, isCancel } from './core/HdHttp'
import { AxiosRequestConfig } from 'axios'
import { HdHttpStatic } from './types'
import { extend } from './helpers/utils'
import mergeConfig from './helpers/mergeConfig'
import modifyInstance from './helpers/modifyInstance'
import defaults from './config/index'

/**
 * Create an instance of HdHttp
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {HdHttp} A new instance of HdHttp
 */
function createInstance(defaultConfig: AxiosRequestConfig): HdHttpStatic {
  const context = new HdHttp(defaultConfig)
  const instance = HdHttp.prototype.request.bind(context)
  // Copy HdHttp.prototype to instance
  extend(instance, HdHttp.prototype)
  // Copy context to instance
  extend(instance, context)

  // TODO 通过这种方式即可，不需要继承Axios
  const result: HdHttpStatic = modifyInstance(instance)

  // TODO 在这里可以添加默认的拦截器
  return result
}

const hdHttp = createInstance(defaults)

hdHttp.create = function create(instanceConfig: AxiosRequestConfig): HdHttpStatic {
  return createInstance(mergeConfig(hdHttp.defaults, instanceConfig))
}

hdHttp.isCancel = isCancel
hdHttp.CancelToken = CancelToken

export default hdHttp

