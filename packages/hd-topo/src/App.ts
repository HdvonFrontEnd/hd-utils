import * as PIXI from 'pixi.js'
import * as d3 from 'd3'
import { AppParams, SimulationDatum, Object } from './types'
import { NodeManager, EdgeManager, ManorManager } from './manager'
import { Tooltip } from './model'
import { events, Tree } from './core'

export default class App {
  public container: HTMLElement
  public app: PIXI.Application
  public mainContainer: PIXI.Container
  public nodes: NodeManager
  public edges: EdgeManager
  public manors: ManorManager
  public tree: Tree
  public tooltip: Tooltip
  public selection: d3.Selection<HTMLElement, undefined, any, any>
  public zoom: d3.ZoomBehavior<HTMLElement, any>
  public onResize: () => void
  public onTicked: () => void
  public data: SimulationDatum
  [field: string]: any
  /**
   * container: div 容器，
   * parmas：pixi的初始化参数，可参考 https://github.com/Zainking/learningPixi#introduction
   * */
  constructor(container: HTMLElement, params: AppParams = {}) {
    this.app = new PIXI.Application({
      ...{
        width: window.innerWidth,
        height: window.innerHeight,
        autoResize: true,
        antialias: true, // 消除锯齿
        // transparent: true, // 背景透明
        resolution: 1 // 分辨率
      },
      ...params
    })
    if (container) {
      this.container = container
      container.appendChild(this.app.view)
    } else {
      throw new Error('Container is required!')
    }

    // app的属性提升一级，方便使用
    Object.keys(this.app).forEach(key => {
      key = key.replace('_', '')
      this[key] = this.app[key]
    })
    this.app.view.className = 'hd-topo-view'

    // 创建一个主容器
    this.mainContainer = new PIXI.Container()
    this.app.stage.addChild(this.mainContainer)

    // 注册事件机制
    events.attach(this)

    // 树结构处理对象
    this.tree = new Tree(this)

    // 绑定resize
    this.onResize = this._onResize.bind(this)
    window.addEventListener('resize', this.onResize, false)
  }
  /**
   * 添加资源
   * @param {assets} 为一个对象
      *eg: {picName: picPath} // picName 图片别名，picPath 图片路径
   * */
  public addAssets(assets: Object = {}): this {
    for (const k in assets) {
      this.app.loader.add(k, assets[k])
    }
    // 添加内部资源一起加载
    // this.app.loader
    //   .add('trail', trail) // 第一个参数是别名，第二参数是路径

    return this
  }
  /**
   * 加载资源
   * */
  public load(): Promise<number> {
    return new Promise((resolve): void => {
      this.app.loader
        .load(resolve) // pixi加载完成之后的回调
    })
  }

  /**
   * 计算节点位置
   * @param {obj} data 数据
   * @param {number} strength 线的长度
   * */
  public generate(data: SimulationDatum, strength = -3000): this {
    const width = this.app.view.width
    const height = this.app.view.height
    const simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id((d) => d[data.id || 'id']))
      .force('charge', d3.forceManyBody().strength(strength))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(() => 32 * 1.5))

    simulation
      .nodes(data.nodes)
      .on('tick', this.ticked.bind(this, data))

    const linkSimulation: any = simulation.force('link') // 暂时性修复tsc报不存在 links 的bug
    if (linkSimulation) {
      linkSimulation.links(data.edges)
    }

    return this
  }

  /**
   * 监听d3的节点坐标更新
   * @param {data} data 数据
   * @param {object} params
   **/
  public draw(data: SimulationDatum, params?: Object): this {
    this.data = data
    // 创建区域面积
    this.manors = new ManorManager(this)
    this.manors.generate(data)
    this.manors.attach()

    // // 创建连接线
    this.edges = new EdgeManager(this)
    this.edges.generate(data.edges, params ? params.edge : null)
    this.edges.attach()

    // 创建节点
    this.nodes = new NodeManager(this)
    this.nodes.generate(data.nodes)
    this.nodes.attach()

    // 创建提示框
    this.tooltip = new Tooltip(this)
    this.tooltip.create()
    this.mainContainer.addChild(this.tooltip.root)

    return this
  }

  /**
   * 清除画布
   **/
  public clear(): void {
    if (this.manors) {
      this.manors.detach()
    }
    if (this.edges) {
      this.edges.detach()
    }
    if (this.nodes) {
      this.nodes.detach()
    }
    if (this.tooltip) {
      this.mainContainer.removeChild(this.tooltip.root)
    }
  }

  /**
   * 监听d3的节点坐标更新
   * @param {data} data 数据
   **/
  public ticked(data: SimulationDatum): this {
    this.nodes.ticked(data.nodes)
    this.edges.ticked(data.edges)
    // this.manors.ticked(data)
    this.onTicked && this.onTicked()

    return this
  }

  /**
   * 添加d3的zoom事件
   * @param {function} onZoom 监听鼠标滚动，拖拽
   * */
  public bindZoom(onZoom?: (event: any) => {}): this {
    this.selection = d3.select(this.container)
    this.zoom = d3.zoom()
    this.selection.call(this.zoom)
    // 可缩放的范围
    // this.zoom.scaleExtent([0.5, 4])
    // 初始化舞台大小
    // const scale = this.app.view.width / (data.max_radius * 2)
    // this.app.stage.scale.set(scale)
    // zoom.scaleBy(selection, scale)
    // const view = this.app.view
    // zoom.translateBy(
    //   selection,
    //   view.width / 2,
    //   (view.height / 2) / scale
    // )

    this.zoom.on('zoom', (): void => {
      onZoom && onZoom(d3.event)
      const t = d3.event.transform
      // 缩放大小
      this.app.stage.scale.set(t.k, t.k)
      // 移动舞台
      if (!this._nodeMove) { // 如果节点在移动则停止舞台移动
        this.app.stage.position.set(t.x, t.y)
      }
    })
    return this
  }

  /**
   * 根据屏幕宽度改变view的大小
  * */
  private _onResize(): this {
    const canvas = this.app.view
    const scaleX = window.innerWidth / canvas.offsetWidth
    const scaleY = window.innerHeight / canvas.offsetHeight
    const scale = Math.min(scaleX, scaleY)
    canvas.style.transformOrigin = '0 0'
    canvas.style.transform = 'scale(' + scale + ')'

    return this
  }

  /**
   * 销毁应用
  * */
  public destroy(): void {
    this.nodes.destroy()
    this.edges.destroy()
    window.removeEventListener('resize', this.onResize, false)
    this.app.destroy(true)
  }
}
