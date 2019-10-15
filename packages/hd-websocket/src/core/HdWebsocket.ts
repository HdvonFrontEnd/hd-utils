import { genUUID } from 'hd-fun'
import { isPlainObject } from '../helpers/utils'
import InterceptorManager from './InterceptorManager'
import { defaultTransformRequest, defaultTransformResponse } from '../helpers/data'
import {
  HdWebsocketConfig,
  Transaction,
  PromiseCache,
  ResolvedFn,
  RejectedFn
} from '../types'

interface Interceptors {
  // 此处用了any，是因为参数或相应可以是各种各样
  request: InterceptorManager<any>;
  response: InterceptorManager<any>;
}

interface ConnectPool {
  [transactionID: string]: Transaction<any>;
}

interface PromiseChain<T> {
  resolved: ResolvedFn<T> | ((reason?: T) => Promise<T> | void);
  rejected?: RejectedFn;
}

/**
 * 类型守卫
 * @param ws
 */
function isWebSocket(ws: WebSocket | null): ws is WebSocket {
  return ws !== null && ws instanceof WebSocket
}

function isValidChainItem(item: any): item is PromiseChain<any> {
  return item && item.resolved !== undefined
}

function isPromiseCache(item: PromiseCache | undefined): item is PromiseCache {
  return typeof item !== 'undefined'
}

export default class HdWebsocket {
  public ws: WebSocket | null // WebSocket 实例
  public interceptors: Interceptors
  private _opts: HdWebsocketConfig
  private _isConnected: boolean // 是否已连接
  private _connectPool: ConnectPool // 连接池
  private _pingTimer: number | null // ping超时计时器
  private _pongTimer: number | null // pong超时计时器
  private _pongCounter: number // pong接收个数
  private _reconnectTimer: number | null // 重连计时器
  private _reconnectCounter: number // 重连计数器
  private _closeByUser: boolean // 是否为用户主动断开
  private _initWsPromise: PromiseCache | undefined
  private _closeWsPromise: PromiseCache | undefined

  constructor({
    // TODO 这种写法不知道怎么校验参数类型，要么换一种写法，要么看看这种情况下如何校验
    wsUrl,
    pingTimeout = 5,
    pongTimeout = 1,
    reconnectTimeout = 5,
    reconnectCountLimit = 200,
    pingMsg = 'ping',
    pongMsg = 'pong',
    pingLog = false,
    transactionID = 'transactionID',
    transformResponse = (data: any): any => {
      return defaultTransformResponse(data)
    },
    transformRequest = (data: any): any => {
      return defaultTransformRequest(data)
    }
  }: HdWebsocketConfig) {
    this._opts = {
      wsUrl,
      pingTimeout: pingTimeout * 1000, // ping超时时间
      pongTimeout: pongTimeout * 1000, // pong超时时间
      reconnectTimeout: reconnectTimeout * 1000, // 重连超时时间
      reconnectCountLimit,
      pingMsg,
      pongMsg,
      pingLog,
      transactionID,
      transformResponse,
      transformRequest
    }

    this.interceptors = {
      request: new InterceptorManager<any>(),
      response: new InterceptorManager<any>()
    }

    this.ws = null
    this._isConnected = false
    this._connectPool = Object.create(null)
    this._pingTimer = null
    this._pongTimer = null
    this._pongCounter = 0
    this._reconnectTimer = null
    this._reconnectCounter = 0
    this._closeByUser = false
  }

  initWs(): Promise<this> {
    return new Promise((resolve, reject): void => {
      this._initWsPromise = {
        resolve,
        reject
      }

      if (!isWebSocket(this.ws)) {
        try {
          if ('WebSocket' in window) {
            this.ws = new WebSocket(this._opts.wsUrl)
          } else {
            const notSupportMsg = '您的浏览器不支持websocket协议,建议使用新版谷歌、火狐浏览器，请勿使用IE10以下浏览器，360浏览器请使用极速模式，不要使用兼容模式！'
            console.log(notSupportMsg)
            reject(notSupportMsg)
          }
        } catch (e) {
          console.error(e, '<====Initialize WebSocket Error')
          reject(e)
          throw new Error(e)
        }

        try {
          if (isWebSocket(this.ws)) {
            this.ws.onopen = this._onOpen.bind(this)
            this.ws.onmessage = this._onMessageHandler.bind(this)
            this.ws.onerror = this._onError.bind(this)
            this.ws.onclose = this._onClose.bind(this)
          }
        } catch (e) {
          // 初始化WebSocket事件处理器出错
          console.error('setup websocket error:', e)
          reject(e)
          throw new Error('setup websocket error')
        }
      } else {
        reject('websocket实例已存在')
      }
    })
  }

  /**
   * 发送数据
   * @param data
   * @param needResponse
   */
  sendMessage(data: any, needResponse = true): Promise<any> {
    if (!isWebSocket(this.ws)) return Promise.reject('websocket连接不存在')
    // 连接是否成功有2个状态判断，一个本身ws的readyState ，一个是自己定义的isConnected
    if (this.ws.readyState !== 1 || !this._isConnected) {
      console.log('发送信息时候连接已断开')
      this._isConnected = false
      return Promise.reject('connection error')
    }

    // ======================发送数据==================

    // 构造拦截器链条
    const _dispatchMessage = this._dispatchMessage.bind(this, needResponse)
    const chain: PromiseChain<any>[] = [{
      resolved: _dispatchMessage,
      rejected: undefined
    }]
    this.interceptors.request.forEach(interceptor => chain.unshift(interceptor))
    if (needResponse) this.interceptors.response.forEach(interceptor => chain.push(interceptor)) // 对于需要返回的请求，在这里就添加响应拦截器。

    // 从这里开始，payload将按顺序经过一系列处理
    // 请求拦截器2 ---> 请求拦截器1 ---> 发送数据 ---> 响应拦截器1 ---> 响应拦截器2
    let promise = Promise.resolve(data)

    while (chain.length) {
      const chainItem = chain.shift()
      if (isValidChainItem(chainItem)) {
        const { resolved, rejected } = chainItem
        promise = promise.then(resolved, rejected)
      }
    }

    return promise
  }

  /**
   * 断开WebSocket
   */
  closeWs(): Promise<any> {
    return new Promise((resolve, reject): void => {
      this._closeWsPromise = {
        resolve,
        reject
      }
      if (isWebSocket(this.ws)) {
        this._closeByUser = true
        this.ws.close()
        this._heartEnd()
        console.log('-------------主动断开-------------')
      } else {
        console.error('无法断开，websocket不存在')
        reject('无法断开，websocket不存在')
      }
    })
  }

  /**
   * 获取接收到pong的个数（主要用于测试）
   */
  getPongCount(): number {
    return this._pongCounter
  }

  /**
   * 发送数据
   * @param needResponse
   * @param data
   * @private
   */
  private _dispatchMessage(needResponse: boolean, data: any): Promise<any> {
    if (!isWebSocket(this.ws)) return Promise.reject('websocket连接不存在')
    if (this.ws.readyState !== WebSocket.OPEN) {
      return Promise.reject('connection error， message sending was aborted')
    }

    // 准备发送的数据， 其实就是对于需要返回的请求，给他添加一个transactionID
    let transactionID
    if (needResponse) {
      if (!isPlainObject(data)) {
        const rejectMsg = '需要返回的websocket请求，请求参数必须是一个对象'
        console.log(rejectMsg)
        return Promise.reject(rejectMsg)
      }
      if (!this._opts.transactionID) {
        const rejectMsg = '需要返回的websocket请求，必须制定transactionID的key名'
        console.log(rejectMsg)
        return Promise.reject(rejectMsg)
      }
      transactionID = genUUID()
      data = Object.assign({}, { [this._opts.transactionID]: transactionID }, data)
    }

    const payload = this._opts.transformRequest ? this._opts.transformRequest(data) : data // 发送前对数据进行处理

    // 发送数据
    console.log('webSocket-sendMessage:', isPlainObject(payload) ? JSON.stringify(payload) : payload)
    this.ws.send(payload)

    // 对于需要返回的请求与不需要返回的请求做不同的处理
    if (needResponse) {
      return new Promise((resolve, reject): void => {
        this._connectPool[transactionID] = {
          resolve,
          reject,
          payload
        }
      })
    } else {
      return Promise.resolve(payload)
    }
  }

  /**
   * WebSocket打开回调
   * @private
   */
  private _onOpen(): void {
    console.log('webSocket 连接成功', `连接url：${this._opts.wsUrl}`)
    this._isConnected = true
    this._closeByUser = false
    if (isPromiseCache(this._initWsPromise)) this._initWsPromise.resolve(this)
    // 连接成功后开始发送心跳
    this._heartPingStart()
  }

  /**
   * 心跳发送开始
   * @private
   */
  private _heartPingStart(): void {
    if (isWebSocket(this.ws) && this._isConnected) {
      if (this._pingTimer) window.clearTimeout(this._pingTimer)
      this._pingTimer = window.setTimeout(() => {
        // 发送心跳
        if (!isWebSocket(this.ws)) return
        if (this._opts.pingLog) console.log('ping----', new Date())
        if (this.ws.readyState === WebSocket.OPEN && typeof this._opts.pingMsg !== 'undefined') this.ws.send(this._opts.pingMsg)

        this._pongTimer = window.setTimeout(() => {
          // 如果在发送心跳之后隔了一段时间仍未收到回复则断开连接
          if (!isWebSocket(this.ws)) return
          if (this._opts.pingLog) console.log('接收心跳回复超时----', new Date())
          this.ws.close()
          this._reconnect()
        }, this._opts.pongTimeout)
        this._heartPingStart()
      }, this._opts.pingTimeout) // 每隔一段时间发送一次ping
    }
  }

  /**
   * 心跳pong重置
   * @private
   */
  private _heartPongReset(): void {
    if (this._pongTimer) {
      window.clearTimeout(this._pongTimer)
      this._pongTimer = null
      this._pongCounter++
    }
    if (this._opts.pingLog) {
      console.log('pong----', new Date())
    }
  }

  /**
   * 停止心跳
   * @private
   */
  private _heartEnd(): void {
    if (this._pongTimer) {
      console.log('------停止pongTimer--------')
      window.clearTimeout(this._pongTimer)
      this._pongTimer = null
    }
    if (this._pingTimer) {
      console.log('------停止pingTimer--------')
      window.clearTimeout(this._pingTimer)
      this._pingTimer = null
    }
  }

  /**
   * 对接收回来的数据进行处理
   * @param msg
   * @private
   */
  private _onMessageHandler(msg: MessageEvent): void {
    let { data } = msg
    if (data === this._opts.pongMsg) {
      this._heartPongReset()
    } else {
      console.log('WebSocket-receiveMessage:', data)

      if (this._opts.transformResponse) {
        data = this._opts.transformResponse(data) // 使用默认的或者用户配置的transformResponse方法对接收到的数据进行预处理
      }

      // 如果是需要请求的返回，则在connectPool里找到对应的项，resolve出去
      if (isPlainObject(data) && this._opts.transactionID && data[this._opts.transactionID] && this._connectPool[data[this._opts.transactionID]]) {
        const transactionID = data[this._opts.transactionID]
        this._connectPool[transactionID].resolve(data)
        delete this._connectPool[transactionID]
      } else {
        // 如果不是对象，或者没有transactionID, 又或者transactionID在connectPool没有对应的项，那么必然不是需要返回的数据
        // 组合响应拦截器链条：数据 ---> 响应拦截器1 ---> 响应拦截器2
        const chain: PromiseChain<any>[] = []
        this.interceptors.response.forEach(interceptor => chain.push(interceptor))
        let promise = Promise.resolve(data)

        while (chain.length) {
          const chainItem = chain.shift()
          if (isValidChainItem(chainItem)) {
            const { resolved, rejected } = chainItem
            promise = promise.then(resolved, rejected)
          }
        }
      }
    }
  }

  /**
   * 错误处理
   * @param e
   * @private
   */
  private _onError(e: Event): void {
    console.error(`WebSocket 错误`, e)
    this._heartEnd()
    this._isConnected = false
    if (isWebSocket(this.ws)) {
      this.ws.close()
      this.ws = null
    }
    this._handleError()
  }

  /**
   * WebSocket连接关闭事件处理（主动或异常关闭）
   * @param event
   * @private
   */
  private _onClose(event: CloseEvent): void {
    const code = event.code
    console.log(`websocket关闭，关闭代码：${code}`)
    this._heartEnd()
    this._isConnected = false
    if (isWebSocket(this.ws)) this.ws = null
    // 如果不是正常关闭，则进行异常处理
    if (code !== 1000 && !this._closeByUser) {
      // 1000是正常关闭websocket的代码
      this._handleError()
      if (isPromiseCache(this._closeWsPromise)) this._closeWsPromise.reject(code)
    } else {
      if (isPromiseCache(this._closeWsPromise)) this._closeWsPromise.resolve('websocket关闭成功')
    }
  }

  /**
   * WebSocket异常处理
   * @private
   */
  private _handleError(): void {
    // 出现异常，重新连接
    if (isPromiseCache(this._initWsPromise)) this._initWsPromise.reject('websocket error')
    this._reconnect()
  }

  /**
   * 重连
   * @private
   */
  private _reconnect(): void {
    if (this._reconnectCounter >= this._opts.reconnectCountLimit) {
      console.error('达到最大重连次数，不再进行重连')
      return
    }

    if (this._reconnectTimer) {
      console.log('已经在重连，不重复发起')
      return
    }

    this._reconnectTimer = window.setTimeout(() => {
      console.log('WebSocket重连--------')
      this._reconnectTimer = null
      this._reconnectCounter++
      this.ws = null
      this.initWs()
    }, this._opts.reconnectTimeout)
  }
}
