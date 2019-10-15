/* eslint-env node, mocha */
import * as PIXI from 'pixi.js'
import { expect } from 'chai'
import App from 'topo/App'
import Line from 'topo/model/Edge/Line'
const data = {
  'source': {
    'id': 10,
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

describe('线段测试', () => {
  const app = new App(document.createElement('div'))
  let line
  it('实例化', () => {
    line = new Line(app)
    expect(line).to.be.an.instanceof(Line)
  })
  it('创建', () => {
    const lineRoot = line.create()
    expect(lineRoot).to.be.an.instanceof(PIXI.Graphics)
  })
  describe('绘制', () => {
    it('已创建的情况', () => {
      line.draw(data)
    })
    it('未创建的情况', () => {
      line.root.destroy()
      line.root = null
      line.draw(data)
    })
    it('定制样式', () => {
      const style = {
        alpha: 0.5,
        color: 0xffffff
      }
      line.draw(data, false, style)
      expect(line.root._lineStyle).to.include({ ...style })
    })
    it('创建贝塞尔曲线', () => {
      line.draw(data, true)
    })
    it('node移动时，更新坐标', () => {
      const pos1 = { x: 100, y: 100 }
      const pos2 = { x: 200, y: 200 }
      line.draw(data)
      app.fire('node:move', {
        data: {
          ...data.source,
          ...pos1
        }
      })
      app.fire('node:move', {
        data: {
          ...data.target,
          ...pos2
        }
      })
      expect(line.data.source).to.have.include(pos1)
      expect(line.data.target).to.have.include(pos2)
    })
  })
})
