/* eslint-env node, mocha */
import * as PIXI from 'pixi.js'
import { expect } from 'chai'
import App from 'topo/App'
import Node from 'topo/model/Node/Node'
const districtAdmin = import('static/hd-topo-demo-data/demo/images/pic-district_admin.png')
const nodeData = {
  id: 0,
  name: '广州市',
  type: 'districtAdmin',
  manor: true
}
describe('节点测试', () => {
  const app = new App(document.createElement('div'))
  let node
  it('实例化', () => {
    node = new Node(app)
    expect(node).to.be.an.instanceof(Node)
  })
  describe('创建节点', () => {
    it('创建 Graphics 类型的节点', () => {
      const nodeRoot = node.create(nodeData)
      expect(nodeRoot).to.be.an.instanceof(PIXI.Graphics)
    })
    it('创建 Sprite 类型的节点', () => {
      app.addAssets({
        districtAdmin
      }).load().then(() => {
        const nodeRoot = node.create(nodeData)
        expect(nodeRoot).to.be.an.instanceof(PIXI.Sprite)
      })
    })
  })
})
