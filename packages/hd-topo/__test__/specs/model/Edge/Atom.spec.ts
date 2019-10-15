/* eslint-env node, mocha */
import * as PIXI from 'pixi.js'
import { expect } from 'chai'
import App from 'topo/App'
import Atom from 'topo/model/Edge/Atom'
const data = {
  'source': {
    'id': 0,
    'name': '广州市',
    'type': 'district_admin',
    'manor': true,
    'index': 0,
    'x': 445.32417800345087,
    'y': 362.5546221467127,
    'vy': -0.0018734520938764746,
    'vx': 0.0004575876558939681
  },
  'target': {
    'id': 100,
    'name': '天河区',
    'type': 'district',
    'index': 1,
    'x': 145.45688818555874,
    'y': 176.39499177115303,
    'vy': 0.012157737102885093,
    'vx': -0.01088022292716834
  },
  'path': [-172.3189335858495, -85.80463348698368, -258.4784003787742, -128.7069502304755, -194.52961710294335, -213.38882484746534, -259.37282280392446, -284.5184331299538],
  'value': 1,
  'index': 0
}

describe('流动粒子测试', () => {
  const app = new App(document.createElement('div'))
  let atom
  it('实例化', () => {
    atom = new Atom(app)
    expect(atom).to.be.an.instanceof(Atom)
  })
  it('创建', () => {
    const atomRoot = atom.create()
    expect(atomRoot).to.be.an.instanceof(PIXI.Graphics)
  })
  describe('绘制', () => {
    it('已创建的情况', () => {
      atom.draw(data)
    })
    it('未创建的情况', () => {
      atom.root.destroy()
      atom.root = null
      atom.draw(data)
    })
  })
  it('更新位置', () => {
    atom.setPosition(data)
    expect(atom.root).to.include({
      x: data.source.x,
      y: data.source.y
    })
    expect(atom).to.include({
      sx: data.source.x,
      sy: data.source.y,
      tx: data.target.x,
      ty: data.target.y
    })
  })
  it('关闭流动', () => {
    atom.move = true
    // 测试 流动100ms，之后停止的位置，是否正确
    setTimeout(() => {
      atom.move = false
      const endPoint = {
        x: atom.root.x,
        y: atom.root.y
      }
      expect(atom._move).to.be.equal(false)
      app.ticker.add(() => {
        // 看看每帧的位置是否一致
        expect(atom.root).to.include({ ...endPoint })
      })
    }, 100)
  })
  it('开启流动', () => {
    function testAtomPositionUpdate(atom, data): void {
      atom.setPosition(data)
      atom.update()

      const sx = data.source.x
      const sy = data.source.y
      const tx = data.target.x
      const ty = data.target.y
      if (sx === tx) {
        if (sy > ty) {
          expect(atom.root.y).to.be.equal(sy - atom.speed)
        } else {
          expect(atom.root.y).to.be.equal(sy + atom.speed)
        }
      } else if (sy === ty) {
        if (sx > tx) {
          expect(atom.root.x).to.be.equal(sx - atom.speed)
        } else {
          expect(atom.root.x).to.be.equal(sx + atom.speed)
        }
      } else {
        const k = (ty - sy) / (tx - sx)
        const b = sy - k * sx
        const y = Math.abs(Math.sin(Math.atan(k)) * atom.speed)
        if (sy > ty) {
          expect(atom.root.y).to.be.equal(sy - y)
          expect(atom.root.x).to.be.equal((sy - y - b) / k)
        } else {
          expect(atom.root.y).to.be.equal(sy + y)
          expect(atom.root.x).to.be.equal((sy + y - b) / k)
        }
      }
    }
    atom.move = true
    expect(atom._move).to.be.equal(true)
    // 移除ticker
    atom.app.ticker.remove(atom.update, atom)
    // x相等，y小于 的情况
    let data = {
      source: { x: 0, y: 10 },
      target: { x: 0, y: 0 }
    }
    testAtomPositionUpdate(atom, data)

    // x相等，y大于 的情况
    data = {
      source: { x: 0, y: 0 },
      target: { x: 0, y: 10 }
    }
    testAtomPositionUpdate(atom, data)

    // y相等，x小于 的情况
    data = {
      source: { x: 10, y: 10 },
      target: { x: 0, y: 10 }
    }
    testAtomPositionUpdate(atom, data)

    // y相等，x大于 的情况
    data = {
      source: { x: 0, y: 10 },
      target: { x: 10, y: 10 }
    }
    testAtomPositionUpdate(atom, data)

    // 其余情况 x任意，y大于
    data = {
      source: { x: 10, y: 2 },
      target: { x: 30, y: 20 }
    }
    testAtomPositionUpdate(atom, data)

    // 其余情况 x任意，y小于
    data = {
      source: { x: 10, y: 20 },
      target: { x: 30, y: 2 }
    }
    testAtomPositionUpdate(atom, data)
  })
})
