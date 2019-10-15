import * as PIXI from 'pixi.js'
import { Object } from 'topo/types'
import Manager from './Manager'
import { Edge } from '../model'

export default class EdgeManager extends Manager {
  protected atomContainer: PIXI.Container
  public params: Object
  public list: Edge[]

  constructor(app) {
    super(app)
    this.atomContainer = new PIXI.Container()
    this.list = []
  }
  /**
   * 生成链接线
   * @param {data} edges - 所有节点数据
   * @param {params} isCurve 是否需要曲线，（日后可扩展更多参数）
   */
  generate(edges, params?: Object): this {
    this.params = params || {}
    edges.forEach((edge) => {
      const child = new Edge(this.app)
      child.data = edge
      this.list.push(child)
      // 创建线段
      child.line.draw(edge, this.params.isCurve)
      this.container.addChild(child.line.root)
      // 创建流动粒子
      child.atom.draw()
      child.atom.setPosition(edge)
      this.atomContainer.addChild(child.atom.root)
    })
    return this
  }
  // 添加进入画布
  public attach(): void {
    this.app.mainContainer.addChild(this.container)
    this.app.mainContainer.addChild(this.atomContainer)
  }
  // 移除出画布
  public detach(): void {
    this.destroy()

    this.app.mainContainer.removeChild(this.container)
    this.app.mainContainer.removeChild(this.atomContainer)
  }
  public destroy(): void {
    this.list.forEach(nodePark => {
      nodePark.destroy()
    })
  }
  /**
   * @param {data} edges - 所有节点数据
   */
  public ticked(edges): void {
    this.list.forEach((edge, i) => {
      if (edges[i]) {
        // 重绘链接线
        edge.line.draw(edges[i], this.params.isCurve)
        // 重置粒子的位置
        edge.atom.setPosition(edges[i])
      }
    })
  }
}
