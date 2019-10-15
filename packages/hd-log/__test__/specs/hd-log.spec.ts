/**
 * 此处需要使用sinon来模拟console.log
 */
import { expect } from 'chai'
import * as sinon from 'sinon'
import HdLog from '../../src/core/TypeLog'
describe('hd-log', () => {
  it('打印各级消息', () => {
    const logger = new HdLog()
    const msg = '测试打印'
    const levelArr = ['info', 'warn', 'error']
    levelArr.forEach((level, index) => {
      const stub = sinon.stub(console, level).callsFake(() => {
        // do nothing
        // 避免控制台上出现多余的日志
      })
      logger[level](msg + level)
      expect(stub.callCount).to.equal(index === 0 ? 1 : 2) // warn与error级别会额外打印堆栈信息
      expect(stub.getCall(0).args).to.include(msg + level)
      stub.restore()
    })
  })

  it('设置打印级别', () => {
    const logger = new HdLog()
    const msg = '测试打印'
    const levelArr = ['info', 'warn', 'error', 'off']
    const toBePrint = ['info', 'warn', 'error']
    levelArr.forEach((level, index) => {
      logger.setPrintLevel(level)
      toBePrint.forEach((printLevel, printIndex) => {
        const stub = sinon.stub(console, printLevel).callsFake(() => {
          // do nothing
        })
        logger[printLevel](msg)
        if (printIndex >= index) {
          expect(stub.callCount).to.be.above(0)
        } else {
          expect(stub.callCount).to.equal(0)
        }
        stub.restore()
      })
    })
  })

  // TODO 如何测试？如何模拟抛出错误？
  // it('自动捕获错误', () => {
  // })

  // TODO 如何测试？似乎无法触发事件
  // it('自动捕获promise异常', () => {
  // })

  it('能打印堆栈信息', () => {
    const logger = new HdLog({ verbose: true })
    const toBeTest = ['info', 'warn', 'error']
    toBeTest.forEach(level => {
      const stub = sinon.stub(console, level).callsFake(() => {
        // do nothing
      })
      logger[level]('测试堆栈信息')
      const arg = stub.secondCall.args[0]
      expect(arg).to.include('webpack:///./packages/hd-log/__test__/specs/hd-log.spec.ts?')
      stub.restore()
    })
  })

  it('能将日志添加到队列', () => {
    const logger = new HdLog({ serverUrl: 'http://www.hdvon.com/' })
    const sendLevelArr = ['info', 'warn', 'error', 'off']
    const toBeTest = ['info', 'warn', 'error']
    let cacheLen = 0
    sendLevelArr.forEach((sendLevel, index) => {
      logger.setSendLevel(sendLevel)
      toBeTest.forEach(level => {
        const stub = sinon.stub(console, level).callsFake(() => {
          // do nothing
        })
        logger[level]('test')
        stub.restore()
      })
      // LogQueue的长度在4次循环中分别是：3, 5, 6, 6
      expect(logger.getLogQueue().length).to.equal(cacheLen + 3 - index)
      cacheLen = logger.getLogQueue().length
    })
  })
})
