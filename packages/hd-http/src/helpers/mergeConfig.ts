import { deepMerge, isPlainObject } from './utils'
import { AxiosRequestConfig } from 'axios'

// ======================= 设置各个字段的合并策略 start =======================
interface StrategyMap {
  // TODO 待优化，细化类型
  [key: string]: (val1: any, val2: any) => any;
}

function defaultStrat(val1: any, val2: any): any {
  return typeof val2 !== 'undefined' ? val2 : val1
}

function fromVal2Strat(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}

function deepMergeStrat(val1: any, val2: any): any {
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2)
  } else if (typeof val2 !== 'undefined') {
    return val2
  } else if (isPlainObject(val1)) {
    return deepMerge(val1)
  } else {
    return val1
  }
}

const strats: StrategyMap = Object.create(null)
const stratKeysFromVal2: string[] = ['url', 'params', 'data']
const stratKeysDeepMerge: string[] = ['headers', 'auth']

stratKeysFromVal2.forEach((key: string): void => { strats[key] = fromVal2Strat })

stratKeysDeepMerge.forEach((key: string): void => { strats[key] = deepMergeStrat })

// ======================= 设置各个字段的合并策略 end =======================

export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2: AxiosRequestConfig = {}
): AxiosRequestConfig {
  const config: AxiosRequestConfig = Object.create(null)
  // if (!config2) config2 = {}

  function mergeField(key: string): void {
    const strat = strats[key] || defaultStrat
    config[key] = strat(config1[key], config2[key])
  }

  for (const key in config2) {
    mergeField(key)
  }

  for (const key in config1) {
    if (!config2[key]) {
      mergeField(key)
    }
  }

  return config
}
