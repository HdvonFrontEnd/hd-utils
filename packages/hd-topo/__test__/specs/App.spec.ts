/* eslint-env node, mocha */
import App from 'topo/App'
import { expect } from 'chai'
import * as PIXI from 'pixi.js'
import data from 'static/hd-topo-demo-data/demo/data/demoData.json'

// https://github.com/pixijs/pixi.js/issues/5778
// 解决 WebGL unsupported in this browser
PIXI.settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = false

describe('hd-topo库测试', function() {
  let tp
  /**
   * 实例化测试
   * */
  describe('拓扑库实例化', () => {
    tp = new App(document.body)
    it('实例化', () => {
      expect(tp).to.be.an.instanceOf(App)
    })
    it('未传dom，抛出错误', () => {
      expect(App).to.throw()
    })
    it('资源添加', () => {
      tp.addAssets({})
      // tp.addAssets.bind(tp, null).should.not.be.ok()
    })
    it('资源加载', () => {
      const p = tp.load()
      expect(p).to.be.a('promise')
      // expect(tp).be.eventually.is.Number()
    })
    it('绘制方法', () => {
      const instance = tp.draw(data)
      expect(instance).be.an.instanceOf(App)
    })
    it('自动生成位置坐标', () => {
      const instance = tp.generate(data)
      expect(instance).be.an.instanceOf(App)
    })
    it('绑定zoom事件', () => {
      const instance = tp.bindZoom()
      expect(instance).be.an.instanceOf(App)
    })
    it('清除画布', () => {
      tp.clear()
      expect(tp.mainContainer.children).to.be.lengthOf(0)
    })
    it('销毁app', () => {
      tp.destroy()
    })
  })
})
