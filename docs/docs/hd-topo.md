## Hd-Topo

- 此库使用[PIXI](https://github.com/pixijs/pixi.js/)， 使用webgl绘制2D的形式，用来绘制拓扑图；
- 使用了[d3-force](https://github.com/d3/d3-force)力导引布局，自动计算位置；
- 使用了[d3-zoom](https://github.com/d3/d3/blob/f025ca4ed8e66184b0ca3308eda5d91c5ba66834/API.md#zooming-d3-zoom), 计算zoom；

:::tip
注意：要先引用PIXI与d3才能使用
:::

### 用法
+ 可以直接再页面上引用，如：
```$xslt
<body>
    <div id="app"></div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/5.9.2/d3.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/5.1.0/pixi.min.js"></script>
    <script src="/lib/hd-topo.js"></script>
    <script>
        window.app = new HdTopo.Application(document.getElementById('app'))
    </script>
</body>
```

+ 推荐使用npm的方式安装，如
```$xslt
npm install hd-topo
```
#### 配置 webpack，全局注入PIXI 、d3
```$xslt
npm install pixijs
npm install d3
```
```$xslt
plugins: [
    // 全局注入
    new webpack.ProvidePlugin({
      PIXI: 'pixi.js',
      d3: 'd3'
    })
]
```
#### Hello world
```$xslt
import App from 'hd-topo'
const app = new App(
    document.getElementById('app'), // dom 容器，装载canvas
)
app
   .draw(data) // 先绘画图像，才能计算位置
   .generate(data) // 计算节点位置
   .bindZoom() // 添加zoom事件
```

#### JSON数据格式
```$xslt
 {
    nodes: [{
        "id": 0,
        "name": "广州市", // 可选，节点名称
        "type": "district_admin", // 可选，对应的图片别名
        "desc": "美丽广州", // 可选，节点详细信息
        "manor": true, // 可选，绘制该节点下的区域块
    }, {
        "id": 100,
        "name": "天河区",
    }],
    edges: [{
        "source": 0,
        "target": 100,
        "value": 1
    }]
}
```

#### 添加资源: 
```$xslt
import district_admin from './images/pic-district_admin.png'

// 监听加载资源的进度情况
 app.loader.on('progress', ({ progress }) => {
    console.log('progress: ', progress)
 })
 
// 添加加载的资源
app
    .addAssets({
        district_admin
    })
    .load()
        .then(() => {
            // TODO, 如 app.draw(data)
        })
```

### 普通拓扑

:::demo
```html
<template>
  <div ref="container" style="width: 600px; height: 600px; overflow: auto"></div>
</template>
<script>
export default {
  mounted() {
    this.attach()
  },
  data() {
    return {
      activeName: 'example'
    }
  },
  methods: {
    attach() {
      const demo = window.generalDemo = new this.$hdTopo(
        this.$refs.container,
        {
          transparent: true,
          width: 600,
          height: 600
        }
      )
      // 监听加载资源的进度情况
      demo.app.loader.on('progress', ({ progress }) => {
        console.log('progress: ', progress)
      })
      // 添加加载的资源
      demo.addAssets(this.$topoAssets).load()
        .then(() => {
          demo
            .draw(this.$topoData) // 先绘画图像，才能计算位置
            .generate(this.$topoData, -3000) // 计算节点位置
            .bindZoom() // 添加zoom事件
          this.init(demo)
        })
      return demo
    },
    init(demo) {
      // 设置节点大小
      demo.nodes.list.forEach(n => {
        n.node.root.scale.set(0.35)
        // n.updatePosition({ x: n.root.x, y: n.root.y })
        // 开启拖拽
        n.dragable = true
      })
      demo.edges.list.forEach(e => {
        e.move = true
      })
    }
  }
}
</script>

```
:::

### 树形拓扑

:::demo
```html
<template>
  <div style="position: relative;">
    <div style="position: absolute;left: 0;top: 20px;z-index: 10;">
      <el-radio-group v-model="type" size="mini" @change="onTypeChange">
      <el-radio-button label="vertical">垂直</el-radio-button>
      <el-radio-button label="horizontal">水平</el-radio-button>
      <el-radio-button label="radial">环形</el-radio-button>
    </el-radio-group>
    </div>
    <div ref="container" style="width: 600px; height: 600px; overflow: auto"></div>
  </div>
</template>
<script>
export default {
  mounted() {
    this.attach()
  },
  data() {
    return {
      type: 'radial',
      size: 0 // 记录节点个数
    }
  },
  methods: {
    onTypeChange(type) {
      if (this.treeDemo) {
        this.treeDemo.destroy()
      }
      this.size = 0
      this.attach()
    },
    attach() {
      this.treeDemo = window.treeDemo = new this.$hdTopo(
        this.$refs.container,
        {
          transparent: true,
          width: 600,
          height: 600
        }
      )
      this.treeDemo.tree.attach({
        space: { width: 40, height: 70 }, // 间距
        type: this.type
      })
      this.treeDemo.tree.addNode(0, this.getChild())
      this.treeDemo.tree.addNode(0, this.getChild())

      this.draw()
      this.treeDemo.bindZoom()

      this.treeDemo.on('node:pointerup', this.mouseUp, this)
    },
    draw() {
      this.treeDemo.clear()
      this.treeDemo.draw({
        nodes: this.treeDemo.tree.nodes,
        edges: this.treeDemo.tree.edges
      }, { edge: {
        isCurve: true
      }})
    },
    mouseUp(node) {
      const child = this.getChild()
      this.treeDemo.tree.addNode(node.data.id, child)
      this.draw()
    },
    // 随机获取节点个数
    getChild() {
      const num = this.getRandomNum()
      return new Array(num).fill(1).map(n => {
        this.size += 1
        return {
          id: this.size,
          name: this.size
        }
      })
    },
    // 随机返回范围内的整数
    getRandomNum(Min = 1, Max = 4) {
      const Range = Max - Min
      const Rand = Math.random()
      return (Min + Math.round(Rand * Range))
    }
  }
}
</script>
```
:::

