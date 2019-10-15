<template>
	<div class="home-wrapper">
    <div class="container" ref="container">
      <div class="cover"></div>
      <div class="info-wrapper">
        <div class="title">
          <h1 class="title--main">Hd-Utils</h1>
          <h3 class="title--sub">Javascript 工具函数库 ---使用lerna管理</h3>
        </div>
        <div class="btn-wrapper">
          <el-button type="primary" @click="navTo('readme')">起步</el-button>
          <el-button @click="navTo('github')">GITHUB</el-button>
        </div>
      </div>
    </div>
    <el-row class="card-wrapper" :gutter="50" type="flex" justify="center">
      <el-col :span="cardSize">
        <el-card shadow="always" class="card-item"  @click.native="navTo('CHANGELOG')">
          <div class="card-item--icon">
            <i class="el-icon-document"></i>
          </div>
          <h4>更新日志</h4>
          <div class="test"></div>
        </el-card>
      </el-col>
      <el-col :span="cardSize">
        <el-card shadow="always" class="card-item"  @click.native="navTo('hd-fun')">
          <div class="card-item--icon">
            <i class="el-icon-present"></i>
          </div>
          <h4>组件</h4>
        </el-card>
      </el-col>
      <el-col :span="cardSize">
        <el-card shadow="always" class="card-item" @click.native="navTo('hdvon')">
          <div class="card-item--icon">
            <i class="el-icon-office-building"></i>
          </div>
          <h4>关于HDVON</h4>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'home',
  data() {
    return {
      cardSize: 5
    }
  },
  mounted() {
    const container = this.$refs.container
    const app = new PIXI.Application({
      autoResize: true,
      antialias: false,
      transparent: true,
      resolution: 1,
      resizeTo: container
    })
    container.appendChild(app.view)
    let count = 0

    // build a rope!
    const ropeLength = 100
    // const ropeLength = 60
    const points = []

    for (let i = 0; i < 25; i++) {
      points.push(new PIXI.Point(i * ropeLength, 0))
    }

    const g = new PIXI.Graphics()
    g.x = -120
    g.y = 300

    const g2 = new PIXI.Graphics()
    g2.x = -400
    g2.y = 300

    const group = new PIXI.Container()
    group.addChild(g)
    group.addChild(g2)

    app.stage.addChild(group)

    app.ticker.add(function() {
      count += 0.05

      // make the snake
      for (let i = 0; i < points.length; i++) {
        points[i].y = Math.sin((i * 0.4) + count) * 40
        points[i].x = i * ropeLength + Math.cos((i * 0.3) + count) * 20
      }
      renderPoints()
    })

    function renderPoints() {
      g.clear()

      g.lineStyle(300, 0xffd000, 0.5)
      g.moveTo(points[0].x, points[0].y)

      for (let i = 1; i < points.length; i++) {
        g.lineTo(points[i].x, points[i].y)
      }

      g2.clear()

      g2.lineStyle(300, 0xffd000, 1)
      g2.moveTo(points[0].x, points[0].y)

      for (let i = 1; i < points.length; i++) {
        g2.lineTo(points[i].x, points[i].y)
      }
    }
  },
  methods: {
    navTo(destination) {
      if (destination === 'readme') {
        this.$router.push('packages/README')
      } else if (destination === 'github') {
        this.openWindow('https://www.github.com')
      } else if (destination === 'hdvon') {
        this.openWindow('http://www.hdvon.com/')
      } else {
        this.$router.push({
          name: destination
        })
      }
    },
    openWindow(url, targetType = '_blank') {
      const a = document.createElement('a')
      a.setAttribute('href', url)
      a.setAttribute('target', targetType)
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }
}
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
	.home-wrapper {
    .container {
      height: 500px;
      width: 100%;
      position: relative;
    }
    .cover {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 40%;
      background: #ffd000;
      z-index: -1;
    }
    .info-wrapper {
      width: 400px;
      height: 200px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .card-wrapper {
      margin-top: 30px;
      .card-item {
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        cursor: pointer;
        height: 200px;
        &:hover {
          background-color: #ecf5ff;
          color: #409EFF;
          h4 {
            color: #409EFF
          }
        }
      }
      .card-item--icon {
        font-size: 48px;
      }
    }
	}
</style>
