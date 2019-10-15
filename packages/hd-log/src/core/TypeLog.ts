import Ajax from './ajax'
import { formatTime, getType } from './util'

interface LevelEnumItem {
  name: string;
  value: number;
}

interface LevelEnum {
  [enumName: string]: LevelEnumItem;
}

enum colorEnum {
  // 信息日志颜色，默认宝蓝色
  info = 'DodgerBlue',
  // 警告日志颜色，默认橘黄色
  warn = 'orange',
  // 错误日志颜色，默认红色
  error = 'red',
  // ajax分组颜色，默认紫色
  ajaxGroup = '#800080',
  // 日志发送成功颜色，默认绿色
  sendSuccess = 'green',
  // 描述文字颜色，默认粉红色
  desc = '#d30775'
}

const levelEnum: LevelEnum = {
  // 信息
  info: {
    name: 'info',
    value: 1
  },
  // 警告
  warn: {
    name: 'warn',
    value: 2
  },
  // 错误
  error: {
    name: 'error',
    value: 3
  },
  // 停止日志打印
  off: {
    name: 'off',
    value: 999
  }
}

export default class HdLog {
  /**
   * 配置参数
   * @param serverUrl 服务器地址，为空则不会发送到服务端
   * @param sendInterval 发送间隔
   * @param maxSendError 最大连续发送错误次数
   * @param autoLogError 是否自动记录未捕获错误
   * @param autoLogPromise 是否自动记录未捕获的promise异常
   * @param needStringify 是否需要对数组与对象序列化
   * @param verbose 是否需要打印消息级别的堆栈信息
   */

  private serverUrl: string
  private sendInterval: number
  private maxSendError: number
  private autoLogError: boolean
  private autoLogPromise: boolean
  private needStringify: boolean
  private verbose: boolean
  private printLevel: string
  private sendLevel: string
  private ajax: Ajax
  private logQueue: any[]
  private sendErrorCount: number
  private timer: number | null

  /**
   * 日志级别枚举
   */
  public static levelEnum = levelEnum

  /**
   * 日志颜色枚举
   */
  public static colorEnum = colorEnum

  constructor({
    serverUrl = '',
    sendInterval = 10 * 1000,
    maxSendError = 5,
    autoLogError = true,
    autoLogPromise = true,
    needStringify = false,
    verbose = false
  } = {}) {
    // 配置参数
    this.serverUrl = serverUrl
    this.sendInterval = sendInterval
    this.maxSendError = maxSendError
    this.autoLogError = autoLogError
    this.autoLogPromise = autoLogPromise
    this.needStringify = needStringify
    this.verbose = verbose

    // 打印级别与发送级别
    this.printLevel = ''
    this.sendLevel = ''

    this.ajax = new Ajax()
    this.logQueue = [] // 日志队列
    this.sendErrorCount = 0 // 连续发送错误次数
    this.timer = null // 日志发送定时器

    // 初始化
    this._init()
  }

  /**
   * 初始化
   * @private
   */
  private _init(): void {
    // 初始化打印级别与发送级别
    this.setLevel('info')
    // 设置定时器
    this._setupTimer()
    // 设置自动捕获错误与promise异常
    this._exceptionAutoLog()
  }

  /**
   * 自动捕获错误与promise异常
   * @private
   */
  private _exceptionAutoLog(): void {
    if (this.autoLogError) {
      window.addEventListener('error', err => {
        this.error('[OnError]', err.message, `(${err.lineno}行${err.colno}列)`)
      })
    }

    if (this.autoLogPromise) {
      window.addEventListener('unhandledrejection', err => {
        this.error('[OnRejection]', err.reason)
      })
    }
  }

  /**
   * 同时设置打印级别与发送级别
   * @param level
   */
  public setLevel(level: string): void {
    this.setPrintLevel(level)
    this.setSendLevel(level)
  }

  /**
   * 设置打印级别
   * @param level
   */
  public setPrintLevel(level: string): void {
    if (level && HdLog.levelEnum[level]) {
      this.printLevel = level
    }
  }

  /**
   * 设置发送级别
   * @param level
   */
  public setSendLevel(level: string): void {
    if (level && HdLog.levelEnum[level]) {
      this.sendLevel = level
    }
  }

  /**
   * 记录一条信息日志
   * info方法的别名
   * @param args
   */
  public log(...args: string[]): void {
    this.info(...args)
  }

  /**
   * 记录一条信息级别的日志
   * @param args
   */
  public info(...args: string[]): void {
    const stack = this._getStackTrace()
    const regExp = /\((.+)\)/
    const firstStack = stack.split('\n')[0]
    const temp = firstStack.match(regExp)
    const url = Array.isArray(temp) ? temp[1] : firstStack
    this._log('info', url, ...args)
  }

  /**
   * 记录一条警告级别的日志
   * @param args
   */
  public warn(...args: string[]): void {
    const stack = this._getStackTrace()
    const msg = [...args]
    this._log('warn', stack, ...msg)
  }

  /**
   * 记录一条错误级别的日子
   * @param args
   */
  public error(...args: string[]): void {
    const stack = this._getStackTrace()
    const msg = [...args]
    this._log('error', stack, ...msg)
  }

  /**
   * 获取日志队列
   */
  public getLogQueue(): any[] {
    return this.logQueue
  }

  /**
   * 将日志打印到控制台，并推送到日志队列等待发送
   * @param level
   * @param stackInfo
   * @param args
   * @private
   */
  private _log(level: string, stackInfo: any, ...args: string[]): void {
    this._printLog(level, stackInfo, ...args)
    this._pushToQueue(level, stackInfo, ...args)
  }

  /**
   * 打印日志
   * @param level
   * @param args
   * @private
   */
  private _printLog(level: string, stackInfo: string, ...args: string[]): void {
    if (this._levelFilter(level, this.printLevel) && console) {
      const msg = this.needStringify ? args.map(item => this._toStringify(item)) : args
      const msgHeader = `%c[${this._getTimeString('HH:mm:ss.SSS')}] [${level.toUpperCase()}] -`

      console[level](msgHeader, `color: ${HdLog.colorEnum[level]}`, ...msg)
      if (this.verbose && level === HdLog.levelEnum.info.name) {
        // 只有开启了“话痨”模式以及level为消息级别才会打印（其他级别的堆栈信息已经包含在msg里了）
        console[level](`%c[日志位置：${stackInfo}]`, `color: ${HdLog.colorEnum[level]}`)
      }

      if (level === HdLog.levelEnum.warn.name || level === HdLog.levelEnum.error.name) {
        console[level](`%c---堆栈信息：${stackInfo}`, `color: ${HdLog.colorEnum[level]}`)
      }
    }
  }

  /**
   * 推送到队列
   * @param level
   * @param stackInfo
   * @param args
   * @private
   */
  private _pushToQueue(level: string, stackInfo: string, ...args: any[]): void {
    // 如果没有设置服务端地址就认为没有启用日志发送功能，不往队列中添加
    if (this._levelFilter(level, this.sendLevel) && this.serverUrl) {
      this.logQueue.push({
        time: this._getTimeString('YYYY-MM-DD HH:mm:ss.SSS'),
        level,
        messages: args,
        stack: stackInfo,
        url: window.location.href,
        agent: navigator.userAgent
      })
    }
  }

  /**
   * TODO 发送日志到服务端
   * @private
   */
  private _send(): void {
    // console.log('send')
  }

  /**
   * 设置发送定时器
   * @private
   */
  private _setupTimer(): void {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    this.timer = window.setInterval(() => {
      this._send()
    }, this.sendInterval)
  }

  /**
   * 判断级别是否应被过滤
   * @param level 待判断级别
   * @param currentLevel 当前设置的级别
   * @return {boolean}
   * @private
   */
  private _levelFilter(level: string, currentLevel: string): boolean {
    const levelVal = HdLog.levelEnum[level] && HdLog.levelEnum[level].value
    const currentLevelVal = HdLog.levelEnum[currentLevel] && HdLog.levelEnum[currentLevel].value
    if (levelVal && currentLevelVal && levelVal >= currentLevelVal) {
      return true
    } else {
      return false
    }
  }

  /**
   * 获取当前时间字符串
   * @param format 字符串格式
   * @private
   */
  private _getTimeString(format: string): Date {
    return formatTime(new Date(), format)
  }

  /**
   * 获取堆栈信息
   * @return {string}
   * @private
   */
  private _getStackTrace(): string {
    let stack
    try {
      throw new Error('')
    } catch (error) {
      stack = error.stack || ''
    }
    stack = stack.split('\n').map(line => line.trim())
    return stack.splice(stack[0] === 'Error' ? 3 : 1).join('\n')
  }

  /**
   * 对数组与对象类型进行序列化
   * @param input
   * @return {*}
   * @private
   */
  private _toStringify(input: string): string {
    const needStringify = ['array', 'object']
    if (needStringify.includes(getType(input))) {
      return JSON.stringify(input)
    } else {
      return input
    }
  }
}
