const Websocket = require('ws')

module.exports = class WebsocketServer {
  constructor({
    needPush = true,
    pushInterval = 20 * 1000,
    pushMsg = 'hello, this is a push test'
  } = {}) {
    this._wscSet = {} // 需要自己根据自己定义的id来保存客户端信息
    this._wscTimerSet = {}
    this.pingMsg = 'ping'
    this.pongMsg = 'pong'
    this.pushInterval = pushInterval
    this.pushMsg = pushMsg
    this.wss = new Websocket.Server({ port: 3017 })
    this.wss.on('connection', (wsc, request) => {
      const wsId = this.getWsId(request)
      wsc.sendPong = true
      this.saveWsc(wsc, wsId)
      wsc.on('message', data => {
        this.messageHandler(data, wsId)
      })
      if (needPush) this.setupPushTimer(wsId)
      wsc.on('close', () => {
        this.clearPushTimer(wsId)
      })
    })
  }

  /**
   * 保存websocket client
   * @param wsc
   * @param wsId
   */
  saveWsc(wsc, wsId) {
    if (wsId) {
      this._wscSet[wsId] = wsc
    } else {
      wsc.terminate()
    }
    return wsId
  }

  /**
   * 提取wsId
   * @param request
   * @return {any}
   */
  getWsId(request) {
    const reg = /wsId=([\w\d-]+)/
    const { url } = request
    const wsId = Array.isArray(reg.exec(url)) ? reg.exec(url)[1] : undefined
    return wsId
  }

  /**
   * 响应客户端发送的数据
   * 对于心跳则发送心跳信息，对于其他信息则直接返回接收的信息
   * @param data
   * @param wsId
   */
  messageHandler(data, wsId) {
    const wsc = this._wscSet[wsId]
    if (data === 'close') {
      this.closeWsc(wsId)
    } else if (data === 'stopHeart') {
      wsc.sendPong = false
    } else {
      const payload = data === this.pingMsg ? (wsc.sendPong ? this.pongMsg : 'sorry, heart beat has been disable temporally') : data
      wsc && wsc.send(payload)
    }
  }

  /**
   * 设置定时推送消息到客户端
   * @param wsId
   */
  setupPushTimer(wsId) {
    if (!wsId || !this._wscSet[wsId]) return
    if (this._wscTimerSet[wsId]) clearTimeout(this._wscTimerSet[wsId])
    this._wscSet[wsId].send(this.pushMsg)
    this._wscTimerSet[wsId] = setTimeout(() => {
      this.setupPushTimer(wsId)
    }, this.pushInterval)
  }

  /**
   * 清空指定定时器
   * @param wsId
   */
  clearPushTimer(wsId) {
    if (!wsId || !this._wscTimerSet[wsId]) return
    if (this._wscTimerSet[wsId]) clearTimeout(this._wscTimerSet[wsId])
    delete this._wscTimerSet[wsId]
  }

  /**
   * 关闭指定Ws连接
   * @param wsId
   */
  closeWsc(wsId) {
    const wsc = this._wscSet[wsId]
    wsc && wsc.close()
    delete this._wscSet[wsId]
    this.clearPushTimer(wsId)
  }
}

