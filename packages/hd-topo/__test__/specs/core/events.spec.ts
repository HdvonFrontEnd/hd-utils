/* eslint-env node, mocha */
import { Object } from 'topo/types'
import { expect } from 'chai'
import events from 'topo/core/events'

describe('事件系统', () => {
  it('添加事件系统', () => {
    const o: Object = {}
    const _o = events.attach(o)

    expect(o).to.be.equal(_o)
    expect(o.on).to.exist
    expect(o.off).to.exist
    expect(o.fire).to.exist
  })

  it('添加一个监听事件', () => {
    const o: Object = {}
    events.attach(o)
    const cb = (): void => { }
    o.on('test', cb)

    expect(o._callbacks['test']).to.exist
    expect(o._callbacks['test'][0].callback).to.equal(cb)
  })

  it('发出一个事件', () => {
    const o: Object = {}
    let called = false

    events.attach(o)

    const cb = (): void => {
      called = true
    }

    o.on('test', cb)

    o.fire('test')

    expect(called).to.exist
  })

  it('测试noce', () => {
    const o: Object = {}
    events.attach(o)

    let count = 0
    o.once('test', () => {
      count++
    })

    o.fire('test')
    o.fire('test')

    expect(count).to.be.equal(1)
  })

  it('绑定2个，解除第一个事件', () => {
    const o: Object = {}

    events.attach(o)

    const f1 = (): void => { }
    const f2 = (): void => { }

    o.on('test', f1)
    o.on('test', f2)
    expect(o._callbacks['test'].length).to.equal(2)

    o.off('test', f1)

    expect(o._callbacks['test'].length).to.equal(1)
    expect(o._callbacks['test'][0].callback).to.equal(f2)
  })

  it('绑定2个，解除最后一个事件', () => {
    const o: Object = {}

    events.attach(o)

    const f1 = (): void => { }
    const f2 = (): void => { }

    o.on('test', f1)
    o.on('test', f2)
    expect(o._callbacks['test'].length).to.equal(2)

    o.off('test', f2)

    expect(o._callbacks['test'].length).to.equal(1)
    expect(o._callbacks['test'][0].callback).to.equal(f1)
  })

  it('指定作用域', () => {
    const o: Object = {}
    const m: Object = {}

    events.attach(o)

    o.on(
      'test',
      function() {
        expect(this).to.equal(m)
      },
      m
    )

    o.fire('test')
  })

  it('绑定后，再全部解除', () => {
    const o: Object = {}

    events.attach(o)

    o.on('test', () => { })
    o.on('test', () => { })

    o.off('test')

    expect(o._callbacks['test']).to.be.undefined
  })

  it('绑定2个对象，同一件事', () => {
    const o: Object = {}
    const p: Object = {}
    let r = {
      o: false,
      p: false
    }

    events.attach(o)
    events.attach(p)

    o.on('test', () => {
      r.o = true
    })
    p.on('test', () => {
      r.p = true
    })

    o.fire('test')

    expect(r.o).to.equal(true)
    expect(r.p).to.equal(false)

    r = {
      o: false,
      p: false
    }

    p.fire('test')
    expect(r.o).to.equal(false)
    expect(r.p).to.equal(true)
  })

  it('2个方法，同一个事件', () => {
    const o: Object = {}
    const r = {
      a: false,
      b: false
    }

    events.attach(o)

    o.on('test', () => {
      r.a = true
    })
    o.on('test', () => {
      r.b = true
    })

    o.fire('test')

    expect(r.a).to.equal(true)
    expect(r.b).to.equal(true)
  })

  it('2次相同的监听', () => {
    let count = 0
    const fn = (): void => {
      count++
    }

    const o: Object = {}
    events.attach(o)

    o.on('test', fn)
    o.on('test', fn)

    o.fire('test')

    expect(count).to.equal(4)
  })

  it('同一个方法监听2次，解除一次', () => {
    const fn = (): void => {}
    const o: Object = {}
    events.attach(o)

    o.on('test', fn)
    o.on('test', fn)

    o.off('test', fn)

    expect(o._callbacks['test'].length).to.equal(0)
  })

  it('同一个方法，指定不同的作用域', () => {
    const fn = (): void => {}
    const o: Object = {}
    const m: Object = {}
    events.attach(o)

    o.on('test', fn, o)
    o.on('test', fn, m)

    o.off('test', fn, o)

    expect(o._callbacks['test'].length).to.equal(1)
  })

  it('只发出，不监听', () => {
    const o: Object = {}
    events.attach(o)

    const fn = (): void => {
      o.fire('test')
    }

    expect(fn).to.not.throw
  })

  it('第一个监听方法里面，解除监听', () => {
    const o: Object = {}
    events.attach(o)

    o.on('test', () => {
      o.off('test')
    })

    o.on('test', () => {
      expect(true).to.be.true
    })

    o.fire('test')
  })

  it('解除一个，没有发送过的事件', () => {
    const o: Object = {}
    events.attach(o)

    const fn = (): void => {
      o.off('test')
    }

    expect(fn).to.not.throw
  })

  it('判断一个不存在的事件', () => {
    const o: Object = {}
    events.attach(o)

    expect(o.hasEvent('event_name')).to.equal(false)
  })

  it('判断一个存在的事件', () => {
    const o: Object = {}
    events.attach(o)

    o.on('event_name', () => { })

    expect(o.hasEvent('event_name')).to.equal(true)
  })

  it('判断一个不存在的事件2', () => {
    const o: Object = {}
    events.attach(o)

    o.on('other_event', () => { })

    expect(o.hasEvent('event_name')).to.equal(false)
  })

  it('判断一个已被解除的事件是否存在', () => {
    const o: Object = {}
    events.attach(o)
    o.on('event_name', () => { })
    o.off('event_name')
    expect(o.hasEvent('event_name')).to.equal(false)
  })

  it('发送一个带1个参数的事件', () => {
    const o: Object = {}
    const value = '1234'

    events.attach(o)

    o.on('test', (a) => {
      expect(a).to.equal(value)
    })

    o.fire('test', value)
  })

  it('发送一个带2个参数的事件', () => {
    const o: Object = {}
    const value = '1'
    const value2 = '2'

    events.attach(o)

    o.on('test', (a, b) => {
      expect(a).to.equal(value)
      expect(b).to.equal(value2)
    })

    o.fire('test', value, value2)
  })
})
