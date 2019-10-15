/* eslint-env node, mocha */
import * as PIXI from 'pixi.js'
import App from 'topo/App'
import Tooltip from 'topo/model/Tooltip'
import { expect } from 'chai'

describe('提示框测试', () => {
  const app = new App(document.createElement('div'))
  let tooltip
  it('单例tooltip', () => {
    tooltip = new Tooltip(app)
    const tooltip1 = new Tooltip(app)
    const tooltip2 = new Tooltip(app)
    expect(tooltip).to.deep.equal(tooltip1)
    expect(tooltip1).to.deep.equal(tooltip2)
    expect(tooltip2).to.deep.equal(tooltip)
  })

  it('创建', () => {
    const root = tooltip.create({
      fontSize: 14
    })
    expect(root).to.be.an.instanceOf(PIXI.Container)
    expect(tooltip).to.have.property('bg')
      .which.be.an.instanceOf(PIXI.Graphics)
    expect(tooltip).to.have.property('text')
      .which.be.an.instanceOf(PIXI.Text)
    expect(tooltip.text.style).to.have.property('fontSize', 14)
  })
  describe('显示/隐藏', () => {
    it('显示', () => {
      const data = {
        x: 0,
        y: 10,
        text: 'test show'
      }
      tooltip.show(data)
      expect(tooltip.text.text).to.be.equal(data.text)

      const moveX = tooltip.bg.width / 1.5
      const moveY = 5
      expect(tooltip.root.x).to.be.equal(data.x - moveX)
      expect(tooltip.root.y).to.be.equal(data.y - moveY - tooltip.bg.height / 2)
      expect(tooltip.root.visible).to.be.equal(true)
    })
    it('隐藏', () => {
      tooltip.hide()
      expect(tooltip.root.visible).to.be.equal(false)
    })
  })
})
