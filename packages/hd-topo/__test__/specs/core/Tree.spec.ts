/* eslint-env node, mocha */
import { expect } from 'chai'
import App from 'topo/App'
import Tree from 'topo/core/Tree'

describe('树结构的测试', () => {
  const app = new App(document.body)
  const tree = new Tree(app)

  it('创建垂直类型', () => {
    expect(tree.treeData).to.be.equal(null)
    expect(tree.nodes).to.have.lengthOf(0)
    expect(tree.edges).to.have.lengthOf(0)

    const pos = { x: 100, y: 100 }
    const rootNode = { id: 0, name: 'test-root', ...pos }
    const space = { width: 100, height: 200 }
    tree.attach({
      rootNode,
      space
    })
    expect(tree.rootNode).to.include(rootNode)
    expect(tree.space).to.include(space)
    expect(tree.type).to.be.equal('vertical')
    expect(app.mainContainer.position).to.include(pos)
    expect(tree.treeData).to.not.empty
    expect(tree.treeData.data.name).to.be.equal(rootNode.name)
    expect(tree.treeData.data.name).to.be.equal(rootNode.name)

    tree.addNode(0, { id: 1, name: 'child-1' })
    expect(tree.rootNode.children[0].id).to.be.equal(1)
    expect(tree.nodes).to.have.lengthOf(2)
    expect(tree.edges).to.have.lengthOf(1)
  })

  it('创建水平类型', () => {
    tree.attach({
      type: 'horizontal'
    })

    expect(tree.type).to.be.equal('horizontal')
    expect(tree.treeData).to.not.empty
  })

  it('创建环状类型', () => {
    tree.attach({
      type: 'radial'
    })

    expect(tree.type).to.be.equal('radial')

    tree.addNode(0, [{ id: 1, name: 'child-1' }])
    tree.addNode(1, [{ id: 2, name: 'child-2' }])
    expect(tree.nodes).to.have.lengthOf(3)
    expect(tree.edges).to.have.lengthOf(2)
  })

  it('工具方法测试', () => {
    const node = { x: 1, y: 2 }
    tree.swapXY(node)

    expect(node.x).to.be.equal(2)
    expect(node.y).to.be.equal(1)
  })
})

