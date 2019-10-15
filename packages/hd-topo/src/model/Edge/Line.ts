import * as PIXI from 'pixi.js'
import { EdgeDatum, LineStyle } from 'topo/types'
import App from 'topo/App'

export default class Line {
  protected app: App
  public root: PIXI.Graphics
  public data: EdgeDatum

  constructor(app) {
    this.app = app

    // 监听node节点移动时
    this.app.on('node:move', this.onNodeMove, this)
  }
  public create(): PIXI.Graphics {
    this.root = new PIXI.Graphics()
    return this.root
  }
  /**
   * 创建样式
   * @param  {Object} style // { width, color, alpha }
   * @return {Array} [width, color, alpha]
   */
  public createStyle(style: LineStyle): number[] {
    const _style = {
      ...{
        width: 1,
        color: 0x0696cb,
        alpha: 1
      },
      ...style
    }

    return [_style.width, _style.color, _style.alpha]
  }
  /**
   * 画线
   * @param {edges} data edges的数据
   * @param {Boolean} isCurve 是否需要曲线
   * @param {Object} style // { width, color, alpha }
   */
  public draw(data: EdgeDatum, isCurve?: boolean, style?: LineStyle): void {
    this.data = data
    if (!this.root) {
      this.create()
    }
    const _style = this.createStyle(style || {})
    this.root.clear()
    this.root.lineStyle(..._style)
    isCurve && data.path ? this._drawCurve(data.path) : this._drawLine(data)
    this.root.endFill()
  }
  /**
   * 画直线
   * @param {edges} data edges的数据
   */
  private _drawLine(data: EdgeDatum): void {
    const sx = data.source.x || 0
    const sy = data.source.y || 0
    const tx = data.target.x || 0
    const ty = data.target.y || 0
    this.root.moveTo(sx, sy)
    this.root.lineTo(tx, ty)
  }
  /**
   * 画贝塞尔曲线
   * @param {Array} path // [mx, my, x1, y1, x2, y2, x, y,]
   *   (mx, my)是移动到特定位置的 moveTo 坐标
   *   (x1,y1)是起点的控制点
   *   (x2,y2)是终点的控制点
   *   最后一个坐标(x,y)表示的是曲线的终点
   */
  private _drawCurve(path: [number, number, number, number, number, number, number, number]): void {
    this.root.moveTo(path[0], path[1]) // ...path.slice(0, 2)
    this.root.bezierCurveTo(path[2], path[3], path[4], path[5], path[6], path[7]) // ...path.slice(2, path.length)
  }

  // 处理node移动时，更新自己的坐标
  public onNodeMove(node): void {
    let isDraw = false // 是否更新
    switch (node.data.id) {
      case this.data.source.id:
        this.data.source.x = node.data.x
        this.data.source.y = node.data.y
        isDraw = true
        break
      case this.data.target.id:
        this.data.target.x = node.data.x
        this.data.target.y = node.data.y
        isDraw = true
        break
      default:
        break
    }

    if (isDraw) {
      this.draw(this.data)
    }
  }

  public destroy(): void {
    this.app.off('node:move', this.onNodeMove, this)
  }
}
