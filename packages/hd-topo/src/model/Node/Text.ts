import * as PIXI from 'pixi.js'
import { Object } from 'topo/types'

export default class Text {
  protected app: PIXI.Application
  public root: PIXI.Text
  public _styleText: Object

  constructor(app, style = {}) {
    this.app = app

    // 文字默认样式
    this._styleText = {
      fontFamily: 'Arial',
      fontSize: 14,
      align: 'center',
      fill: '#666'
      // stroke: '#000',
      // strokeThickness: 1,
      // dropShadow: true,
      // dropShadowColor: '#000000',
      // dropShadowBlur: 3,
      // dropShadowAngle: Math.PI / 6,
      // dropShadowDistance: 2
    }
    this._styleText = { ...this._styleText, ...style }
  }
  public create(data, style = {}): PIXI.Text {
    this._styleText = { ...this._styleText, ...style }
    const _style = new PIXI.TextStyle(this._styleText)
    this.root = new PIXI.Text(data.name, _style)
    this.root.anchor.set(0.5)
    return this.root
  }
  public updateStyle(style = this._styleText): void {
    if (this.root) {
      for (const k in style) {
        this.root.style[k] = style[k]
      }
    }
  }
}
