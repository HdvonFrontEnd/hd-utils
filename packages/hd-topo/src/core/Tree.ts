import * as d3 from 'd3'
import App from 'topo/App'
import { TreeNode, TreeSpace, TreeRootNode, EdgeDatum, NodeDatum, Object } from 'topo/types'

class Tree {
  static LINK_TYPES = { vertical: 'linkVertical', horizontal: 'linkHorizontal', radial: 'linkRadial' };

  protected app: App
  public rootNode: TreeRootNode
  public space: TreeSpace
  public type: string
  public tree: any

  constructor(app) {
    this.app = app
  }
  public attach(params: { rootNode?: Object; space?: Object; type?: string }): void {
    const { rootNode, space, type } = params
    // 根节点
    this.rootNode = {
      id: 0,
      name: 'root',
      x: this.app.app.view.width / 2,
      y: 200,
      children: [],
      ...rootNode
    }

    // 间距
    this.space = {
      width: 40,
      height: 70,
      ...space
    }

    // 树的类型, 默认为垂直
    this.type = type || 'vertical'

    if (type === 'radial') {
      this.tree = d3.tree().size([2 * Math.PI, this.rootNode.x / 2]) // size 以区域的大小划分
        .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth)
    } else {
      this.tree = d3.tree().nodeSize([this.space.width, this.space.height]) // nodeSize 以节点的大小划分
    }

    // 将初始位置移至起始坐标
    this.app.mainContainer.position.set(this.rootNode.x, this.rootNode.y)
  }

  get treeData(): any {
    if (this.rootNode) {
      const treeData = this.tree(d3.hierarchy(this.rootNode))
      if (this.type === 'horizontal') {
        treeData.each(this.swapXY)
      }
      return treeData
    }
    return null
  }
  /**
   * 获取所有节点
   * @return {Array} []
   */
  get nodes(): Array<NodeDatum> {
    if (!this.treeData) {
      return []
    }
    const nodes = this.treeData.descendants()
    return nodes.map(v => {
      const res = {
        ...v,
        name: v.data.name,
        id: v.data.id
      }

      if (this.type === 'radial') {
        res.x = Math.sin(v.x) * v.y
        res.y = Math.cos(v.x) * (-v.y)
      }
      return res
    })
  }
  /**
   * 获取edges
   * @return {Array} []
   */
  get edges(): Array<EdgeDatum> {
    if (!this.treeData) {
      return []
    }
    // 计算贝塞尔值
    const linkType = Tree.LINK_TYPES[this.type]
    let linkPath
    if (linkType === 'linkRadial') {
      linkPath = d3.linkRadial().angle((d: Object) => d.x).radius((d: Object) => d.y)
    } else {
      linkPath = d3[linkType]().x(d => d.x).y(d => d.y)
    }

    return this.treeData.links().map(v => {
      let data = v

      if (this.type === 'vertical') {
        data = {
          source: data.target,
          target: data.source
        }
      }
      const paths = linkPath(data).replace('M', '').split('C').map(str => str.split(','))

      return {
        ...data,
        path: paths[0].concat(paths[1])
      }
    })
  }
  /**
   * 添加节点
   * @param {String} parentId 父节点Id
   * @param {Object|Array} child 节点信息 可以是数组，也可以是一个
   */
  public addNode(parentId: string | number, child: TreeNode | TreeNode[]): void {
    function addNode(node): void {
      if (node.id === parentId) {
        if (Array.isArray(child)) {
          node.children.push(...child.map(v => ({ ...v, children: [] })))
        } else {
          node.children.push({ ...child, children: [] })
        }
      } else {
        node.children.forEach(addNode)
      }
    }
    addNode(this.rootNode)
  }

  // 垂直切换成水平坐标
  public swapXY(node): void {
    const { x, y } = node
    node.x = y
    node.y = x
  }
}

export default Tree
