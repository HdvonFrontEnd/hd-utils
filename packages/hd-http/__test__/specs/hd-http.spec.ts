import HdHttp from '../../index'
import { expect } from 'chai'
import * as sinon from 'sinon'
describe('hd-http', () => {
  let server
  const getUrl = 'https://test.com/get'
  const postUrl = 'https://test.com/post'
  it('能配置默认参数', () => {
    const http = HdHttp.create({
      baseURL: '/hdTest/'
    })

    const { defaults } = http
    expect(defaults.baseURL).to.equal('/hdTest/')
  })

  it('能发送get请求', (done) => {
    const msg = 'hello'
    server = sinon.fakeServer.create()
    server.respondWith(
      'GET', getUrl,
      [
        200,
        { 'Content-Type': 'application/json' },
        `{"text": "${msg}"}`
      ]
    )
    server.autoRespond = true
    HdHttp.get(getUrl).then(res => {
      expect(res.data.text).to.equal(msg)
      expect(server.requests.length).to.equal(1)
      server.restore()
      done()
    })
  })

  it('能发送post请求', (done) => {
    const sendData = 'hello'
    server = sinon.fakeServer.create()
    server.respondWith(
      'POST', postUrl, function(request) {
        request.respond(
          200,
          { 'Content-Type': 'application/json' },
          `{ "data": "${JSON.parse(request.requestBody).data}" }`
        )
      }
    )
    server.autoRespond = true
    HdHttp.post(postUrl, {
      data: sendData
    }).then(res => {
      expect(res.data.data).to.equal(sendData)
      expect(server.requests.length).to.equal(1)
      server.restore()
      done()
    })
  })

  it('能取消请求', (done) => {
    server = sinon.fakeServer.create()
    server.respondWith(
      'GET', getUrl,
      [
        200,
        { 'Content-Type': 'application/json' },
        ''
      ]
    )
    server.autoRespond = true
    server.autoRespondAfter = 200
    HdHttp.get(getUrl).catch(err => {
      expect(HdHttp.isCancel(err)).to.be.true
      done()
    })
    setTimeout(() => {
      HdHttp.cancel()
    }, 10)
  })
})
