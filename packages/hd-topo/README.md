## Hd-Topo

![npm download](https://img.shields.io/npm/dt/hd-topo)

- 此库使用[PIXI](https://github.com/pixijs/pixi.js/)， 使用webgl绘制2D的形式，用来绘制拓扑图；
- 使用了[d3-force](https://github.com/d3/d3-force)力导引布局，自动计算位置；
- 使用了[d3-zoom](https://github.com/d3/d3/blob/f025ca4ed8e66184b0ca3308eda5d91c5ba66834/API.md#zooming-d3-zoom), 计算zoom；

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

详细文档见：