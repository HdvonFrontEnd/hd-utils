import * as PIXI from 'pixi.js'
import { NodeDatum } from 'topo/types'

export default class Node {
  protected app: PIXI.Application
  public root: PIXI.Graphics | PIXI.Sprite
  public name: string | number | undefined
  public id: string | number | undefined

  constructor(app) {
    this.app = app
  }
  public create(data: NodeDatum): PIXI.Graphics | PIXI.Sprite {
    if (data.type) {
      const resource = this.app.loader.resources[data.type.toString()]
      if (resource) {
        this.root = this.createSprite(resource.texture)
      } else {
        this.root = this.createCircle(data.r)
      }
    } else {
      this.root = this.createCircle(data.r)
    }
    this.root.x = data.x ? data.x : 0
    this.root.y = data.y ? data.y : 0
    this.name = data.name
    this.id = data.id
    return this.root
  }
  public createCircle(r: any = 12): PIXI.Graphics {
    const circle = new PIXI.Graphics()
    circle.beginFill(0x9966FF)
    circle.drawCircle(0, 0, r)
    circle.endFill()
    return circle
  }
  public createSprite(texture): PIXI.Sprite {
    const sprite = new PIXI.Sprite(texture)
    sprite.anchor.set(0.5)
    return sprite
  }
}
