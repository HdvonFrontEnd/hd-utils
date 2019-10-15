import * as PIXI from 'pixi.js'
import { NodeDatum } from 'topo/types'
export default class Manor {
  protected app: PIXI.Application
  public root: PIXI.Graphics
  public nodes: NodeDatum[]

  constructor(app) {
    this.app = app
    this.nodes = []
  }
  get polygon(): [number, number, number, number, number, number, number, number] {
    let xArr: number[] = []
    let yArr: number[] = []
    this.nodes.forEach((n: NodeDatum) => {
      xArr.push(n.x || 0)
      yArr.push(n.y || 0)
    })
    xArr = xArr.sort((a, b) => a - b)
    yArr = yArr.sort((a, b) => a - b)
    const r = 100 // 扩展半径
    const xMax = xArr[xArr.length - 1] + r
    const xMin = xArr[0] - r
    const yMax = yArr[yArr.length - 1] + r
    const yMin = yArr[0] - r
    return [xMin, yMin, xMax, yMin, xMax, yMax, xMin, yMax]
  }
  public create(): PIXI.Graphics {
    this.root = new PIXI.Graphics()
    return this.root
  }
  /**
   * @param {array} data  每个点的x, y
   * eg: [0, 0, 10, 0, 10, 10, 0, 10]
   **/
  public draw(data = this.polygon): void {
    if (!this.root) {
      this.create()
    }
    this.root.clear()
    this.root.beginFill(0xF8F8F8)
    this.root.drawPolygon(data)
    this.root.endFill()
    // this.root.x = data.x
    // this.root.y = data.y
  }
  public generate(data, node): void {
    this.nodes = [node]
    this.getNodes(data, node)
  }
  /**
   * 获取某节点下的所有节点数据
   * @param data 整体数据
   * @param node 某节点
   **/
  public getNodes(data, node): void {
    data.edges.forEach(edge => {
      if (edge.source === node.id) {
        const _node = data.nodes.find(n => n.id === edge.target)
        this.nodes.push(_node)
        this.getNodes(data, _node)
      }
    })
  }
}
