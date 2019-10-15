const toString = Object.prototype.toString

/**
 * 判断是否为一个对象
 * @param val
 */
function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}

export {
  isPlainObject
}

