/* eslint-env node, mocha */
import App from 'topo/App'
import { expect } from 'chai'
import ManorManager from 'topo/manager/ManorManager'
import data from 'static/hd-topo-demo-data/demo/data/demoData.json'

describe('面板区域管理者测试', () => {
  const app = new App(document.createElement('div'))
  let manorManager
  it('实例化', () => {
    manorManager = new ManorManager(app)
    expect(manorManager).to.be.an.instanceOf(ManorManager)
  })
  it('生成各个面板', () => {
    manorManager.generate(data)
    const manors = data.nodes.filter(n => n.manor)
    expect(manorManager.list).to.have.length(manors.length)
  })
})
