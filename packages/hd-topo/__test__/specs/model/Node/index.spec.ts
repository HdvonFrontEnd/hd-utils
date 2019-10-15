/* eslint-env node, mocha */
import App from 'topo/App'
import NodePark from 'topo/model/Node/index'
import { Tooltip } from 'topo/model'
import { expect } from 'chai'

const nodeData = {
  id: 0,
  name: '广州市',
  type: 'district_admin',
  desc: '美丽广州'
}
describe('节点区测试', () => {
  const app = new App(document.createElement('div'))
  app.tooltip = new Tooltip(app)
  app.tooltip.create()

  let nodePark
  it('实例化', () => {
    nodePark = new NodePark(app)
    nodePark.node.create(nodeData)
    nodePark.title.create(nodeData)
    nodePark.tooltipDesc = nodeData.desc
    expect(nodePark).to.be.an.instanceof(NodePark)
  })
  describe('警告开关测试', () => {
    it('开启警告', () => {
      nodePark.warning = true
      expect(nodePark._orin).to.have.ownProperty('scale')
        .which.be.an.instanceof(Object)
        .and.include({
          x: nodePark.node.root.scale.x,
          y: nodePark.node.root.scale.y
        })
      expect(nodePark._orin).to.have.property('name', nodePark.title.root.text)
    })
    it('关闭警告', () => {
      nodePark.warning = false
      expect(nodePark.title.root.style).to.have.property('fontSize', nodePark.title._styleText.fontSize)
      expect(nodePark.title.root.text).to.be.equal(nodePark._orin.name)
      expect(nodePark.node.root.scale).to.include({
        x: nodePark._orin.scale.x,
        y: nodePark._orin.scale.y
      })
    })
  })

  it('获取文字的Y坐标值', () => {
    expect(nodePark.textY).to.be.a('number')
  })

  it('更新位置', () => {
    const pos = { x: 10, y: 10 }
    nodePark.updatePosition(pos)
    let nodePos = nodePark.node.root.position
    nodePos = {
      x: nodePos.x,
      y: nodePos.y
    }
    expect(nodePos).to.include({ ...pos })

    let titlePos = nodePark.node.root.position
    titlePos = {
      x: titlePos.x,
      y: titlePos.y
    }
    expect(titlePos).to.include({ ...pos })
  })

  describe('添加事件', () => {
    it('事件绑定', () => {
      nodePark.bindEvent()
      expect(nodePark.node.root.interactive).to.be.equal(true)
      expect(nodePark.node.root.buttonMode).to.be.equal(true)

      // 拖拽
      expect(nodePark).to.have.property('_pan', false)
      expect(nodePark).to.have.property('startX', 0)
      expect(nodePark).to.have.property('startY', 0)
    })

    it('pointerover事件', () => {
      // 触发前的准备工作
      const scale = {
        x: nodePark.node.root.scale.x + 0.1,
        y: nodePark.node.root.scale.y + 0.1
      }
      nodePark.warning = false
      nodePark.app.on('node:pointerover', obj => {
        expect(obj).to.be.equal(nodePark)
      })
      // 开始触发
      nodePark.pointerOver()

      // 触发后应有的现象
      if (nodePark.tooltipDesc) {
        expect(nodePark.app.tooltip.root.visible).to.be.equal(true)
      }
      if (!nodePark.warning) {
        let nodeScale = nodePark.node.root.scale
        nodeScale = {
          x: nodeScale.x,
          y: nodeScale.y
        }
        expect(nodeScale).to.include({ ...scale })
      }
    })

    it('pointerout事件', () => {
      // 触发前的准备工作
      const scale = {
        x: nodePark.node.root.scale.x - 0.1,
        y: nodePark.node.root.scale.y - 0.1
      }
      nodePark.app.on('node:pointerout', obj => {
        expect(obj).to.be.equal(nodePark)
      })
      // 开始触发
      nodePark.pointerOut()

      // 触发后应有的现象
      expect(nodePark.app.tooltip.root.visible).to.be.equal(false)
      if (!nodePark.warning) {
        let nodeScale = nodePark.node.root.scale
        nodeScale = {
          x: nodeScale.x,
          y: nodeScale.y
        }
        expect(nodeScale).to.include({ ...scale })
      }
    })

    it('拖拽事件', () => {
      // 启动拖拽事件
      nodePark.dragable = true
      expect(nodePark.dragable).to.be.equal(true)

      const event = {
        data: {
          global: { x: 10, y: 10 },
          originalEvent: { movementX: 0, movementY: 0 }
        }
      }

      // 鼠标向下按
      nodePark.pointerDown(event)
      expect(nodePark.pan).to.be.equal(true)
      expect(nodePark.startX).to.be.equal(event.data.global.x)
      expect(nodePark.startY).to.be.equal(event.data.global.y)

      // 鼠标移动
      const x = 0
      const y = 0
      const moveEvent = {
        data: {
          global: { x: 50, y: 50 }, // 移动了 30，才出发 move
          originalEvent: { movementX: 10, movementY: 10 }
        }
      }
      nodePark.data = { x, y }

      nodePark.pointerMove(moveEvent)
      expect(nodePark._move).to.be.equal(true)
      if (nodePark.tooltipDesc) {
        expect(nodePark.app.tooltip.root.visible).to.be.equal(false)
      }
      expect(nodePark.data.x).to.be.equal(x + moveEvent.data.originalEvent.movementX)
      expect(nodePark.data.y).to.be.equal(y + moveEvent.data.originalEvent.movementY)
      expect(nodePark.node.root.x).to.be.equal(nodePark.data.x)
      expect(nodePark.node.root.y).to.be.equal(nodePark.data.y)

      // 鼠标抬起
      nodePark.pointerUp(event)
      expect(nodePark.pan).to.be.equal(false)
      expect(nodePark._move).to.be.equal(false)
    })
  })
})
