import * as PIXI from 'pixi.js'
import { Object } from 'topo/types'

class Tooltip {
  static unique: null | Tooltip = null;

  protected app: PIXI.Application
  public root: PIXI.Container
  public bg: PIXI.Graphics
  public text: PIXI.Text
  public _styleText: Object
  public _styleBg: Object

  constructor(app, style?: Object) {
    // 单例判断
    if (Tooltip.unique) {
      return Tooltip.unique
    }
    this.app = app
    style = style || {}

    // 文字默认样式
    this._styleText = {
      fontFamily: 'Arial',
      fontSize: 12,
      lineHeight: 12 * 1.5,
      fill: '0x666666',
      wordWrap: true,
      breakWords: true,
      wordWrapWidth: 200
    }
    // 背景默认样式
    this._styleBg = {
      color: '0xEEEEEE',
      alpha: 1,
      padding: 10
    }
    this._styleText = { ...this._styleText, ...style }

    Tooltip.unique = this
  }
  public create(style = { background: {}}): PIXI.Container {
    this.root = new PIXI.Container()
    if (style.background) {
      this._styleBg = style.background
      delete style.background
    }
    this.bg = this.createBackground()
    this.text = this.createText(style)
    // 添加
    this.root.addChild(this.bg)
    this.root.addChild(this.text)

    // 默认隐藏
    this.hide()
    return this.root
  }
  public createText(style = {}): PIXI.Text {
    this._styleText = { ...this._styleText, ...style }
    const _style = new PIXI.TextStyle(this._styleText)
    const text = new PIXI.Text('', _style)
    return text
  }
  public createBackground(): PIXI.Graphics {
    const bg = new PIXI.Graphics()
    this.drawBackground(bg)
    return bg
  }
  public drawBackground(bg = this.bg): void {
    const r = this._styleBg.padding
    const width = this.text ? this.text.width : 1
    const height = this.text ? this.text.height : 1

    bg.clear()
    bg.beginFill(this._styleBg.color)
    bg.drawRect(0 - r, 0 - r, width + r * 2, height + r * 2)
    bg.endFill()
  }
  public toggle(bool): void {
    if (this.root) {
      this.root.visible = bool
    }
  }
  public show(data: { x: number; y: number; text: string }): void {
    this.text.text = data.text
    this.drawBackground()
    // 居中
    const moveX = this.bg.width / 1.5
    const moveY = 5
    this.root.x = data.x - moveX
    this.root.y = data.y - moveY - this.bg.height / 2

    this.toggle(true)
  }
  public hide(): void {
    this.toggle(false)
  }
}
export default Tooltip
