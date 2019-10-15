import { FullScreen } from './fullscreen'

const fullScreen = new FullScreen()

/**
 * 生成UUID
 * reference：https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript/8809472#8809472
 * @return {String} UUID
 */
function genUUID(): string {
  let d = new Date().getTime()
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    d += performance.now() // use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

/**
 * 判断当前为什么浏览器
 * @param  {[string]} name
 * @return {[boolean]}
 */
function browser(name: string): boolean {
  const userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
  const isOpera = userAgent.indexOf('Opera') > -1 // 判断是否Opera浏览器
  const isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera || 'ActiveXObject' in window // 判断是否IE浏览器
  const isFF = userAgent.indexOf('Firefox') > -1 // 判断是否Firefox浏览器
  const isChrome = userAgent.indexOf('Chrome') > -1 // 判断是否Chrome浏览器
  const isSafari = userAgent.indexOf('Safari') > -1 && !isChrome // 判断是否Safari浏览器
  return {
    opera: isOpera,
    ie: isIE,
    firefox: isFF,
    safari: isSafari,
    chrome: isChrome
  }[name]
}

/**
 * 将字节转换成合适的显示方式
 * 例如：
 * bytesToSize(683468) // 667 KB
 * bytesToSize(98223445) // 93.7 MB
 * @param bytes
 * @return {string}
 */
function bytesToSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024 // or 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
}

/**
 * 指定元素进入全屏
 * @param element
 * @return {boolean}
 */
function enterFullscreen(element: Element): boolean {
  if (element && fullScreen.requestFullscreen) {
    element[fullScreen.requestFullscreen]()
    return true
  } else {
    return false
  }
}

/**
 * 退出全屏
 * @return {boolean}
 */
function exitFullscreen(): boolean {
  if (fullScreen.exitFullscreen) {
    document[fullScreen.exitFullscreen]()
    return true
  } else {
    return false
  }
}

/**
 * 监听全屏状态
 * @param cb
 */
function listenFullscreen(cb): void {
  document.addEventListener(fullScreen.fullscreenchange, cb)
}

/**
 * 根据对象某个属性找到对象数组中的某一项
 * @param dataArr
 * @param key
 * @param value
 * @return {*}
 */
function getDataByKey<T = any>(dataArr: T[], key: string, value: any): T | undefined {
  return dataArr.find(item => item[key] === value)
}

export {
  browser,
  genUUID,
  bytesToSize,
  enterFullscreen,
  exitFullscreen,
  listenFullscreen,
  getDataByKey
}
