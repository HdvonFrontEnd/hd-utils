/* eslint-env node, mocha */
import { expect } from 'chai'
import App from 'topo/App'
import EdgeManager from 'topo/manager/EdgeManager'
const data = {
  edges: [{
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
    'value': 1,
    'index': 0
  }]
}

describe('Edge管理者测试', () => {
  const app = new App(document.createElement('div'))
  let edgeManager
  it('实例化', () => {
    edgeManager = new EdgeManager(app)
    expect(edgeManager).to.be.an.instanceof(EdgeManager)
  })
  it('生成各个edge', () => {
    edgeManager.generate(data.edges)
    expect(edgeManager.list).to.have.length(data.edges.length)
    expect(edgeManager.container.children.length).to.be.eql(data.edges.length)
    expect(edgeManager.atomContainer.children.length).to.be.eql(data.edges.length)
  })
  it('更新位置', () => {
    data.edges[0].source.x = 10
    edgeManager.ticked(data.edges)
    expect(edgeManager.list[0].atom.root.x).to.be.eql(10)
  })
})
