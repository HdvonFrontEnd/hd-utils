import * as PIXI from 'pixi.js'
import Manager from './Manager'
import { NodePark } from '../model'

export default class NodeManager extends Manager {
  protected textContainer: PIXI.Container
  public list: NodePark[]

  constructor(app) {
    super(app)
    this.textContainer = new PIXI.Container()
    this.list = []
  }
  /**
   * 根据数据生成各个节点
   * @param {data} nodes - 所有节点数据
   */
  public generate(nodes): this {
    nodes.forEach((node) => {
      const nodePark = new NodePark(this.app)
      nodePark.data = node
      // 缓存pixi的节点
      this.list.push(nodePark)
      // 添加节点
      this.container.addChild(nodePark.node.create(node))
      // 添加名称
      this.textContainer.addChild(nodePark.title.create(node))
      // // 添加详细信息
      if (node.desc) {
        nodePark.tooltipDesc = node.desc
      }

      // 更新坐标
      nodePark.updatePosition()

      // 绑定事件
      nodePark.bindEvent()
    })
    return this
  }
  // 添加进入画布
  public attach(): void {
    this.app.mainContainer.addChild(this.container)
    this.app.mainContainer.addChild(this.textContainer)
  }
  // 移除出画布
  public detach(): void {
    this.destroy()

    this.app.mainContainer.removeChild(this.container)
    this.app.mainContainer.removeChild(this.textContainer)
  }
  public destroy(): void {
    this.list.forEach(nodePark => {
      nodePark.destroy()
    })
  }
  /**
   * 就按节点领域半径及布局半径
   * @param {data} nodes - 所有节点数据
   */
  public ticked(nodes): void {
    this.list.forEach((node, i) => {
      if (nodes[i]) {
        const { x, y } = nodes[i]
        node.updatePosition({ x, y })
      }
    })
  }
}
