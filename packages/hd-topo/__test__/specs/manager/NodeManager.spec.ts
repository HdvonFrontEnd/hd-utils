/* eslint-env node, mocha */
import App from 'topo/App'
import { expect } from 'chai'
import NodeManager from 'topo/manager/NodeManager'
import data from 'static/hd-topo-demo-data/demo/data/demoData.json'

describe('节点管理者测试', () => {
  const app = new App(document.createElement('div'))
  let nodeManager
  it('实例化', () => {
    nodeManager = new NodeManager(app)
    expect(nodeManager).to.be.an.instanceof(NodeManager)
  })
  it('生成各个节点', () => {
    nodeManager.generate(data.nodes)
    expect(nodeManager.list).to.have.length(data.nodes.length)
    expect(nodeManager.container.children.length).to.be.eql(data.nodes.length)
    expect(nodeManager.textContainer.children.length).to.be.eql(data.nodes.length)
  })
  it('更新位置', () => {
    data.nodes[0].x = 10
    nodeManager.ticked(data.nodes)
    expect(nodeManager.list[0].node.root.x).to.be.eql(10)
  })
})
