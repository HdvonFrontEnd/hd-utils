/* eslint-env node, mocha */
import * as PIXI from 'pixi.js'
import App from 'topo/App'
import Manor from 'topo/model/Manor'
import { expect } from 'chai'
import data from 'static/hd-topo-demo-data/demo/data/demoData.json'

describe('区域面板测试', () => {
  const app = new App(document.createElement('div'))
  let manor
  it('实例化', () => {
    manor = new Manor(app)
    expect(manor).to.be.an.instanceof(Manor)
  })
  it('获取区域坐标点', () => {
    const polygon = manor.polygon
    expect(polygon).to.be.instanceof(Array).and.have.lengthOf(8)
  })
  it('创建', () => {
    const root = manor.create()
    expect(root).to.be.an.instanceof(PIXI.Graphics)
  })
  it('绘制', () => {
    manor.root.destroy()
    manor.root = null
    manor.draw()
    expect(manor.root).to.be.an.instanceof(PIXI.Graphics)
  })
  it('数据生成', () => {
    manor.generate(data, data.nodes[0])
    expect(manor.nodes).to.be.instanceof(Array)
    expect(manor.nodes[0]).to.be.deep.equal(data.nodes[0])
  })
})
