import Manager from './Manager'
import { Manor } from '../model'

export default class ManorManager extends Manager {
  public list: Manor[]

  constructor(app) {
    super(app)
    this.list = []
  }
  /**
   * 生成区域面积
   * @param {data} data - 所有数据
   */
  public generate(data): this {
    data.nodes.forEach((node) => {
      if (node.manor) {
        const manor = new Manor(this.app)
        this.list.push(manor)
        // 数据生成
        manor.generate(data, node)
        // 创建
        this.container.addChild(manor.create())
        manor.draw()
      }
    })
    return this
  }
  // 添加进入画布
  public attach(): void {
    this.app.mainContainer.addChild(this.container)
  }
  // 移除出画布
  public detach(): void {
    this.app.mainContainer.removeChild(this.container)
  }
  public ticked(): void {
    this.list.forEach((manor) => {
      // 重绘区域面积
      manor.draw()
    })
  }
}
