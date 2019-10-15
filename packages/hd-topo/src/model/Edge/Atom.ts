import * as PIXI from 'pixi.js'

export default class Atom {
  protected app: PIXI.Application
  public root: PIXI.Graphics
  private _move: boolean
  private _radius: number
  private sx: number
  private sy: number
  private tx: number
  private ty: number
  public speed: number

  constructor(app) {
    this.app = app
    // 开启线路流动
    this._move = false
    // 流动速度
    this.speed = 0.7
    // 半径
    this._radius = 2
    this.app.ticker.add(this.update, this)
  }
  get move(): boolean {
    return this._move
  }
  set move(bool) {
    this._move = bool
    if (this.root) {
      this.root.visible = bool
    }
  }
  get radius(): number {
    return this._radius
  }
  set radius(radius) {
    this._radius = radius
    this.draw()
  }
  public create(): PIXI.Graphics {
    this.root = new PIXI.Graphics()
    this.root.visible = false
    return this.root
  }
  /**
   * 画滚动粒子
   */
  public draw(): void {
    // 如果没创建先创建
    if (!this.root) {
      this.create()
    }
    // 清除缓存buffer
    this.root.clear()
    // 开始绘制
    this.root.beginFill(0x0696cb)
    this.root.drawCircle(0, 0, this.radius)
    this.root.endFill()
  }
  /**
   * 画滚动粒子
   * @param {edges} data edges的数据
   */
  public setPosition(data): void {
    this.root.x = data.source.x
    this.root.y = data.source.y
    // 记录起始、结束位置
    this.sx = data.source.x
    this.sy = data.source.y
    this.tx = data.target.x
    this.ty = data.target.y
  }

  /**
   * 每帧更新粒子位置
   */
  public update(): void {
    // 根据线性方程流动粒子
    if (this._move && this.root) {
      const sx = this.sx
      const sy = this.sy
      const tx = this.tx
      const ty = this.ty
      if (sx === tx) {
        if (sy > ty) {
          this.root.y -= this.speed
          // 到达目的后重置
          if (this.root.y <= ty) {
            this.root.y = sy
          }
        } else {
          this.root.y += this.speed
          // 到达目的后重置
          if (this.root.y >= ty) {
            this.root.y = sy
          }
        }
      } else if (sy === ty) {
        if (sx > tx) {
          this.root.x -= this.speed
          // 到达目的后重置
          if (this.root.x <= tx) {
            this.root.x = sx
          }
        } else {
          this.root.x += this.speed
          // 到达目的后重置
          if (this.root.x >= tx) {
            this.root.x = sx
          }
        }
      } else {
        const k = (ty - sy) / (tx - sx)
        const b = sy - k * sx
        const y = Math.abs(Math.sin(Math.atan(k)) * this.speed)
        // this.root.angle = Math.atan(k) * 180 / Math.PI - 90
        if (sy > ty) {
          this.root.y -= y
          this.root.x = (this.root.y - b) / k
          // 到达目的后重置
          if (this.root.y <= ty) {
            this.root.y = sy
            this.root.x = sx
          }
        } else {
          this.root.y += y
          this.root.x = (this.root.y - b) / k
          // 到达目的后重置
          if (this.root.y >= ty) {
            this.root.y = sy
            this.root.x = sx
          }
        }
      }
      // console.log(this.root.x, this.root.y, sx, sy, tx, ty)
    }
  }

  public destroy(): void {
    this.app.ticker.remove(this.update, this)
  }
}
