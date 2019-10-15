import { ObjectLiteral } from '../types'
function extend<T, U>(target: T, source: U): T & U {
  for (const key in source) {
    (target as T & U)[key] = source[key] as any
  }
  return target as T & U
}

function isPlainObject(val: any): val is Object {
  return Object.prototype.toString.call(val) === '[object Object]'
}

function deepMerge(...objs: ObjectLiteral[]): ObjectLiteral {
  const result: ObjectLiteral = {}

  objs.forEach(obj => {
    Object.keys(obj).forEach(key => {
      const val = obj[key]
      if (isPlainObject(val)) {
        if (isPlainObject(result[key])) {
          result[key] = deepMerge(result[key], val)
        } else {
          result[key] = deepMerge(val)
        }
      } else {
        result[key] = val
      }
    })
  })

  return result
}

export {
  extend,
  isPlainObject,
  deepMerge
}
