import * as PIXI from 'pixi.js'
import Line from './Line'
import Atom from './Atom'
import { EdgeDatum } from 'topo/types'

export default class Edge {
  protected app: PIXI.Application
  public line: Line
  public atom: Atom
  public data: EdgeDatum

  constructor(app) {
    this.app = app
    this.line = new Line(app)
    this.atom = new Atom(app)
  }

  public destroy(): void {
    this.line.destroy()
    this.atom.destroy()
  }
}
