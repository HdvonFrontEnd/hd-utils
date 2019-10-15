# Hd-Topo
此库主要是运用了D3的算法，计算每个节点的位置，通过pixi的绘制。

#### 结构说明
  * App.ts 文件作为一个入口文件，
  * 然后 通过各个Manager，去管理每个model
  * 如： app.nodeManager.node, 基本是这样一个关联逻辑

#### 目录文件说明
  * **core**： 主要放一些核心代码
    - events: 一个消息系统， 主要做一些各模块之间的通信。 也有向外发送一些事件信息
    - Tree: 一个整合d3 tree的代码 主要用于计算树结构的位置
  
  * **manager**： 主要放一些管理器的代码
    - EdgeManager： 用于管理Edge
    - NodeManager： 用于管理Node
    - ManorManager： 用于管理Manor
    - Manager： Manger的基类

  * **model**： 放一些模型创建代码
    - Edge： 存放Edge相关的东西，包括 Atom（滚动粒子）、Line（线段）
    - Node： 存放Node相关的东西，包括 Node (节点)、 Text（名字）
    - Manor： 面板（一个父节点的相关区域）
    - Tooltip: 主要是显示节点的详情
  * App： 入口文件

#### 重要Api说明
##### 创建
```js
  const container = documnet.body
  const app = new App(container, {
    transparent: true
  })

  // 第一个参数为dom容器，用来存放pixi创建出来的canvas
  // 第二参数为pixi的一些参数，具体可参考pixi文档
  
  app.draw(data) // 绘制节点、线段 等
  app.generate(data) // 自动计算节点位置，注意计算节点位置时，需要先调用draw，进行绘制。 如已存在坐标，无需计算，就不用调用。 如 树结构的topo，后面详解
  app.bindZoom(data) // 添加画布的move跟zoom事件， 应创建完最后调用，只需要创建一次

  // 开启节点拖拽
  demo.nodes.list.forEach(n => {
    // 开启拖拽
    n.dragable = true
  })

  // 如果需要重新绘制，如，数据有改动。 可调用
  app.clear() // 先清除画布
  app.draw(data) // 再绘制
```

##### 创建树结构拓扑
```js
 // 初始化方法
app.tree.attach({
  rooNode: { x: 100, y: 100 }, // 根节点信息。 x, y 起始坐标，还有更多信息看Tree.ts
  space: { width: 40, height: 70 }, // 间隙
  type: 'vertical' // 类型： vertical（垂直）、horizontal（水平）、radial（环状）
})

// 往节点添加child
app.tree.addNode(
  0, // 父节点id
  { id: 1, name: 'child-1' } // child信息。 注意 也可以是一个数组，包含多个 [{ id: 1, name: 'child-1' }, { id: 2, name: 'child-2' }]
)

// 调用绘制
app.draw({
  nodes: app.tree.nodes,
  edges: aap.tree.edges
})

```


##### 自定义图标
```js
app.addAssets({ filename: 'url' }) // 先把资源添加到pixi
app.load() // 加载完资源后的回调，返回一个promise
// 此时节点的应有个字段type与之映射 所以数据应该为:
const data = { nodes: [{ name: '自定义图标1', id: 1, type: 'filename'}] }
```

##### 销毁
```js
app.destroy() // 想释放内存时，可调用自行销毁
```

#### 可监听的事件
```js
// 监听加载资源的进度情况
app.loader.on('progress', ({ progress }) => {})

// 节点的事件, 兼容手机、pc
/** 
  *@params
  * node: 当前的节点实例
  * event: 事件的event
 */
// 第三个参数可指定上下文, 如： this
app.on('node:pointerover', (node, event) => {}, this) // 鼠标进入
app.on('node:pointerout', (node, event) => {}) // 鼠标移出
app.on('node:pointerdown', (node, event) => {}) // 鼠标按下
app.on('node:pointermove', (node, event) => {}) // 鼠标移动
app.on('node:pointerup', (node, event) => {}) // 鼠标抬起

// 更多事件可查看pixi，通过node.root.on(xxx)进行绑定 
```

