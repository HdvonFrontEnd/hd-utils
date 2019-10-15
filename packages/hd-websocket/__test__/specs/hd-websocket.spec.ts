import { expect } from 'chai'
import * as sinon from 'sinon'
import HdWebsocket from '../../index'
import { genUUID } from 'hd-fun'
describe('hd-websocket', () => {
  const wsUrl = 'ws://localhost:3017/' // 此处使用了本地启动的websocket服务来测试
  const wsId = genUUID()
  const payload = {
    type: 'test'
  }
  const pingTimeout = 1
  const pongTimeout = 1
  const reconnectTimeout = 1
  let myWebsocket

  sinon.stub(console, 'log').callsFake(() => {
    // do nothing
    // 避免控制台上出现多余的日志
  })

  // 等待一段时间
  function wait(milliseconds: number): Promise<void> {
    return new Promise((resolve): void => {
      setTimeout(resolve, milliseconds)
    })
  }

  it('正确初始化实例', () => {
    myWebsocket = new HdWebsocket({
      wsUrl: `${wsUrl}?wsId=${wsId}`,
      pingTimeout: pingTimeout,
      pongTimeout: pongTimeout,
      reconnectTimeout: reconnectTimeout
    })
  })

  it('未连接时发送数据会抛出错误', (done) => {
    myWebsocket.sendMessage('').catch(err => {
      expect(err).to.equal('websocket连接不存在')
      done()
    })
  })

  it('建立连接', async() => {
    await myWebsocket.initWs()
    await new Promise((resolve): void => {
      expect(myWebsocket.ws).to.exist
      expect(myWebsocket.ws.readyState).to.equal(1)
      resolve()
    })
  })

  it('发送数据（需要返回）', async() => {
    const finalPayload = {
      ...payload,
      wsId: wsId
    }
    const res = await myWebsocket.sendMessage(finalPayload)
    expect(res.wsId).to.equal(wsId)
  })

  it('发送数据（不需要返回）', async() => {
    // 所谓不需要返回，其实就是直接发送，sendMessage直接得到resolve而不需要等待后端
    // 至于后端实际上有无根据这个数据进行返回，则不在考虑范围中
    // 立即得到resolve的参数是发送的数据
    const strPayload = '测试发送字符串'
    const res = await myWebsocket.sendMessage(strPayload, false)
    expect(strPayload).to.equal(res)
  })

  it('接收后端推送消息', async() => {
    let resInterceptorId
    const resMsg = await new Promise(resolve => {
      const reject = err => console.log(err)
      const resFul = res => {
        // do whatever you like here
        resolve(res)
      }
      resInterceptorId = myWebsocket.interceptors.response.use(resFul, reject)
    })
    expect(resMsg).to.equal('hello, this is a push test')
    myWebsocket.interceptors.response.eject(resInterceptorId)
  })

  // TODO 拦截器的测试待优化，目前太长了，而且有很多any类型的返回
  it('能串联配置请求拦截器与响应拦截器（resolve情况）', async() => {
    const reqInterceptorsArr: number[] = []
    const resInterceptorsArr: number[] = []
    const reqFul2 = (payload): any => ({ ...payload, reqSequence: 1 })
    const reqFul1 = (payload): any => {
      expect(payload.reqSequence).to.equal(1)
      return {
        ...payload
      }
    }
    const resFul1 = (res): any => ({ ...res, resSequence: 1 })
    const resFul2 = (res): any => {
      expect(res.resSequence).to.equal(1)
      res.resSequence = 2
      return res
    }
    const reject = (err): void => console.log(err)
    // 请求拦截器2 ---> 请求拦截器1 ---> 发送数据 ---> 响应拦截器1 ---> 响应拦截器2
    reqInterceptorsArr.push(myWebsocket.interceptors.request.use(reqFul1, reject))
    reqInterceptorsArr.push(myWebsocket.interceptors.request.use(reqFul2, reject))
    resInterceptorsArr.push(myWebsocket.interceptors.response.use(resFul1, reject))
    resInterceptorsArr.push(myWebsocket.interceptors.response.use(resFul2, reject))
    const res = await myWebsocket.sendMessage(payload)
    expect(res.resSequence).to.equal(2)
    // 弹出拦截器
    reqInterceptorsArr.forEach(id => myWebsocket.interceptors.request.eject(id))
    resInterceptorsArr.forEach(id => myWebsocket.interceptors.response.eject(id))
    expect(myWebsocket.interceptors.request.getInterceptorsCount()).to.equal(0)
    expect(myWebsocket.interceptors.response.getInterceptorsCount()).to.equal(0)
    // 弹出不存在的拦截器不应该报错
    expect(function() { myWebsocket.interceptors.request.eject(99999) }).to.not.throw()
  })

  it('能在请求拦截器与响应拦截器中处理reject', async() => {
    const reqErrorMsg = '请求失败'
    const resErrorMsg = '返回失败'
    const fakeResponse = { state: 'OK' }
    const reqInterceptorsArr: number[] = []
    const resInterceptorsArr: number[] = []
    const reqFul2 = (): Promise<never> => Promise.reject(reqErrorMsg)
    const reqRej2 = (err): void => console.log(err)
    const reqFul1 = (payload): any => payload
    const reqRej1 = (err): any => {
      expect(err).to.equal(reqErrorMsg)
      return {
        ...payload
      }
    }
    const resFul1 = (): Promise<never> => Promise.reject(resErrorMsg)
    const resRej1 = (err): void => console.log(err)
    const resFul2 = (res): any => res
    const resRej2 = (err): any => {
      expect(err).to.equal(resErrorMsg)
      return fakeResponse
    }
    reqInterceptorsArr.push(myWebsocket.interceptors.request.use(reqFul1, reqRej1))
    reqInterceptorsArr.push(myWebsocket.interceptors.request.use(reqFul2, reqRej2))
    resInterceptorsArr.push(myWebsocket.interceptors.response.use(resFul1, resRej1))
    resInterceptorsArr.push(myWebsocket.interceptors.response.use(resFul2, resRej2))
    const res = await myWebsocket.sendMessage(payload)
    expect(res).to.equal(fakeResponse)
    // 弹出拦截器
    reqInterceptorsArr.forEach(id => myWebsocket.interceptors.request.eject(id))
    resInterceptorsArr.forEach(id => myWebsocket.interceptors.response.eject(id))
  })

  it('能发送心跳', (done) => {
    const expectedDeltaCount = 2 // 期待这段时间内收发的心跳个数
    const previousCount = myWebsocket.getPongCount()
    setTimeout(() => {
      const afterCount = myWebsocket.getPongCount()
      expect(afterCount - previousCount).to.equal(expectedDeltaCount)
      done()
    }, pingTimeout * expectedDeltaCount * 1000)
  })

  it('能断开重连', async() => {
    // 首先请求断开
    myWebsocket.ws.send('close')
    await wait(20) // 关闭需要时间
    expect(myWebsocket.ws).to.be.null
    await wait(reconnectTimeout * 1000) // 指定时间后应该重连成功
    expect(myWebsocket.ws.readyState).to.equal(1)
  })

  it('主动断开连接', async() => {
    await myWebsocket.closeWs()
    expect(myWebsocket.ws).to.be.null
  })
})
