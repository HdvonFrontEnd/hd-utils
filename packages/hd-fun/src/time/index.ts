import * as dayjs from 'dayjs'

/**
 * 格式化时间
 * @param date
 * @param format
 * @return {string}
 */
const formatTime = function(date: dayjs.ConfigType, format = 'YYYY-MM-DD HH:mm:ss.SSS'): string {
  return dayjs(date).format(format)
}

/**
 * 秒数转化为时分秒
 * @param value
 * @return {string}
 */
const formatSecond = function(value: number): string {
  let secondTime: number = Math.floor(value)// 秒
  let minuteTime = 0// 分
  let hourTime = 0// 小时
  if (secondTime > 60) { // 如果秒数大于60，将秒数转换成整数
    // 获取分钟，除以60取整数，得到整数分钟
    minuteTime = Math.floor(secondTime / 60)
    // 获取秒数，秒数取佘，得到整数秒数
    secondTime = Math.floor(secondTime % 60)
    // 如果分钟大于60，将分钟转换成小时
    if (minuteTime > 60) {
      // 获取小时，获取分钟除以60，得到整数小时
      hourTime = Math.floor(minuteTime / 60)
      // 获取小时后取佘的分，获取分钟除以60取佘的分
      minuteTime = Math.floor(minuteTime % 60)
    }
  }
  let result = '' + Math.floor(secondTime) + '秒'

  if (minuteTime > 0) {
    result = '' + Math.floor(minuteTime) + '分' + result
  }
  if (hourTime > 0) {
    result = '' + Math.floor(hourTime) + '小时' + result
  }
  return result
}

/**
 * 获取时间戳
 * @param date
 * @param ms
 * @return {*}
 */
const getTimestamp = function(date: dayjs.ConfigType, ms = true): number {
  return dayjs(date)[ms ? 'valueOf' : 'unix']()
}

/**
 * 获取时间差
 * 时间差小于一分钟：刚刚（不管是前还是后）
 * 大于一分钟小于一小时：x分钟前（或者x分钟后）
 * 大于一小时小于一周：x天前（或者x天后）
 * 同年：MM-DD
 * 大于一年：YYYY-MM-DD
 * @param date
 * @param ref
 * @param monthFormat
 * @param yearFormat
 * @return {string}
 */
const timeDiff = (date: dayjs.ConfigType, ref: dayjs.ConfigType = 'now', monthFormat = 'MM-DD', yearFormat = 'YYYY-MM-DD'): string => {
  const sourceDate: number = dayjs(date).valueOf()
  const refDate = dayjs(ref === 'now' ? new Date() : ref).valueOf()
  const minute = 60 * 1000
  const hour = minute * 60
  const day = hour * 24
  const direction = refDate - sourceDate > 0 ? '前' : '后'
  const diff = Math.abs(refDate - sourceDate)
  if (diff / minute < 1) {
    return '刚刚'
  } else if (diff / hour < 1) {
    return `${Math.floor(diff / minute)}分钟${direction}`
  } else if (diff / day < 1) {
    return `${Math.floor(diff / hour)}小时${direction}`
  } else if (diff / day >= 1 && diff / day <= 7) {
    return `${Math.floor(diff / day)}天${direction}`
  } else if (formatTime(sourceDate, 'YYYY') === formatTime(refDate, 'YYYY')) {
    return formatTime(sourceDate, monthFormat)
  } else {
    return formatTime(sourceDate, yearFormat)
  }
}

const day = function(...args: any[]): dayjs.Dayjs {
  return dayjs(...args)
}

export {
  formatTime,
  formatSecond,
  getTimestamp,
  timeDiff,
  day
}
