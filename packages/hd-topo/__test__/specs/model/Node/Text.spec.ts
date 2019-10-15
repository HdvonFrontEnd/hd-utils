/* eslint-env node, mocha */
import * as PIXI from 'pixi.js'
import { expect } from 'chai'
import App from 'topo/App'
import Text from 'topo/model/Node/Text'
const nodeData = {
  id: 0,
  name: '广州市',
  type: 'district_admin',
  manor: true
}
describe('节点文本测试', () => {
  const app = new App(document.createElement('div'))
  let text
  it('实例化', () => {
    text = new Text(app, { fontSize: 16, stroke: '#000' })
    expect(text).to.be.an.instanceof(Text)
    expect(text._styleText).to.have.property('fontSize', 16)
    expect(text._styleText).to.have.property('stroke', '#000')
  })
  it('创建文本', () => {
    const textRoot = text.create(nodeData)
    expect(textRoot).to.be.an.instanceof(PIXI.Text)
  })
  it('更新文本样式', () => {
    text.updateStyle({
      fontSize: 14,
      fill: '#fff'
    })
    expect(text.root.style).to.have.property('fontSize', 14)
    expect(text.root.style).to.have.property('fill', '#fff')
  })
})
