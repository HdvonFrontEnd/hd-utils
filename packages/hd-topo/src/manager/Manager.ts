import * as PIXI from 'pixi.js'
import App from 'topo/App'

export default class Manager {
  protected app: App
  protected container: PIXI.Container
  constructor(app) {
    this.app = app
    this.container = new PIXI.Container()
  }
}
