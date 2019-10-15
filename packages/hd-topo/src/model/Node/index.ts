import { NodeDatum, Orin } from 'topo/types'
import App from 'topo/App'
import Node from './Node'
import Text from './Text'

export default class NodePark {
  static SCALE = 0.1
  protected app: App
  public node: Node
  public title: Text
  private _warning: boolean
  private _pan: boolean
  private _move: boolean
  private _scale: number
  private _count: number
  private dragable: boolean
  private startX: number
  private startY: number
  private _orin: Orin
  public data: NodeDatum
  public tooltipDesc: string | number | null | undefined

  constructor(app) {
    this.app = app
    this.node = new Node(app)
    this.title = new Text(app)
    this.tooltipDesc = null
    // 开启警示
    this._warning = false
    // 鼠标是是否在挤压状态，用于移动节点
    this._pan = false
    // 警告的放大倍数
    this._scale = NodePark.SCALE
    this._count = 0
    // 缓存原来的东西
    this._orin = {
      scale: { x: 1, y: 1 },
      name: ''
    }

    // 是否开启拖拽
    this.dragable = false

    // 监听ticker 每帧更新
    this.app.ticker.add(() => this.update(), this)
  }

  get pan(): boolean {
    return this._pan
  }
  set pan(enabled) {
    this._pan = enabled
    this.app._nodeMove = enabled // 用于app的整体移动判断
  }

  get warning(): boolean {
    return this._warning
  }
  set warning(bool) {
    if (bool === this._warning) return
    this._warning = bool
    this._count = 0
    if (bool) {
      this._scale = NodePark.SCALE
      this._orin = {
        scale: {
          x: this.node.root.scale.x,
          y: this.node.root.scale.y
        },
        name: this.title.root.text
      }
    } else {
      this.title.updateStyle()
      this.node.root.scale.set(this._orin.scale.x, this._orin.scale.y)
      this.title.root.text = this._orin.name
      this.title.root.position.set(this.node.root.x, this.textY)
    }
  }
  // 获取文字的Y坐标值
  get textY(): number {
    return this.node.root
      ? this.node.root.y + (this.node.root.height + this.title.root.height) / 2
      : 0
  }
  // 更新位置
  public updatePosition({ x = this.data.x, y = this.data.y } = {}): void {
    this.node.root.position.set(x, y)
    this.title.root.position.set(x, this.textY)
  }
  public update(): void {
    if (this._warning) {
      this.updateWarning()
    }
  }
  // 警告样式
  public updateWarning(): void {
    this._count++
    if (this._count % 30 === 0 || this._count === 1) {
      let style = {
        fill: '#dd1144'
      }
      let text = this._orin.name
      if (this._scale === 0) {
        this._scale = NodePark.SCALE
        text += '\n【产生警告了哦】'
      } else {
        this._scale = 0
        style = {
          fill: this.title._styleText.fill
        }
      }
      const x = this._orin.scale.x + this._scale
      const y = this._orin.scale.y + this._scale
      this.node.root.scale.set(x, y)
      this.title.root.text = text
      this.title.root.position.set(this.node.root.x, this.textY)
      this.title.updateStyle(style)
    }
  }

  public destroy(): void {
    this.app.ticker.remove(this.update, this)
    this.node.root.removeAllListeners()
  }
  /**
    * 添加事件
    **/
  public bindEvent(): void {
    if (this.node.root) {
      this.node.root.interactive = true
      this.node.root.buttonMode = true
      this.node.root.on('pointerover', this.pointerOver, this)
      this.node.root.on('pointerout', this.pointerOut, this)

      this.bindDragEvent()
    }
  }
  public pointerOver(e): void {
    const root = this.node.root
    this.app.fire('node:pointerover', this, e)

    if (this.tooltipDesc && this.app.tooltip) {
      this.app.tooltip.show({
        x: root.x + root.width,
        y: this.textY - root.height - 40,
        text: this.tooltipDesc.toString()
      })
    }
    if (this._warning) return
    const x = this.node.root.scale.x + 0.1
    const y = this.node.root.scale.y + 0.1
    this.node.root.scale.set(x, y)
  }
  public pointerOut(e): void {
    this.app.fire('node:pointerout', this, e)
    if (this.app.tooltip) {
      this.app.tooltip.hide()
    }

    if (this._warning) return
    const x = this.node.root.scale.x - 0.1
    const y = this.node.root.scale.y - 0.1
    this.node.root.scale.set(x, y)
  }

  // 绑定drag
  public bindDragEvent(): void {
    if (this.node.root) {
      this._pan = false
      this.startX = 0
      this.startY = 0
      this.node.root.on('pointerdown', this.pointerDown, this)
      this.node.root.on('pointermove', this.pointerMove, this)
      this.node.root.on('pointerup', this.pointerUp, this)
      this.node.root.on('pointerupoutside', this.pointerUp, this)
    }
  }
  public pointerDown(e): void {
    if (this.dragable) {
      this.pan = true
      const { x, y } = e.data.global
      this.startX = x
      this.startY = y
    }
    this.app.fire('node:pointerdown', this, e)
  }
  public pointerMove(e): void {
    if (this.pan && this.dragable) {
      const { x, y } = e.data.global
      if (Math.abs(x - this.startX) > 30 || Math.abs(y - this.startY) > 30) {
        this._move = true
        // 如果有提示，移动的的时候则隐藏
        if (this.app.tooltip) {
          this.app.tooltip.hide()
        }
        this.data.x += e.data.originalEvent.movementX
        this.data.y += e.data.originalEvent.movementY
        this.updatePosition()

        this.app.fire('node:move', this, e)
      }
    }

    this.app.fire('node:pointermove', this, e)
  }
  public pointerUp(e): void {
    if (this.dragable) {
      this.pan = false
      if (this._move) {
        this.app.fire('node:move:end', this, e)
        this._move = false
      }
    }
    this.app.fire('node:pointerup', this, e)
  }
}
