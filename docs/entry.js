import Vue from 'vue'
import App from './app'
import router from './router'
import DemoBlock from './components/demo-block'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import hljs from 'highlight.js'
import 'normalize.css/normalize.css'// A modern alternative to CSS resets
import '@babel/polyfill'

// 引入待调试的组件

// hd-fun
import * as HdFun from 'packages/hd-fun/index'
Vue.prototype.$hdFun = HdFun

// hd-http
import HdHttp from 'packages/hd-http/index'
import qs from 'qs'
Vue.prototype.$hdHttp = HdHttp
Vue.prototype.$qs = qs

// hd-log
import HdLog from 'packages/hd-log/index'
Vue.prototype.$hdLog = HdLog

// hd-topo
import HdTopo from 'packages/hd-topo/index'
import network_device from 'static/hd-topo-demo-data/demo/images/pic-network_device.png'
import firewall from 'static/hd-topo-demo-data/demo/images/pic-firewall.png'
import district from 'static/hd-topo-demo-data/demo/images/pic-district.png'
import district_admin from 'static/hd-topo-demo-data/demo/images/pic-district_admin.png'
import data from 'static/hd-topo-demo-data/demo/data/demoData.json'
Vue.prototype.$hdTopo = HdTopo
Vue.prototype.$topoAssets = {
  network_device,
  firewall,
  district,
  district_admin
}
Vue.prototype.$topoData = data

// hd-queue
import HdQueue from 'packages/hd-queue/index'
Vue.prototype.$hdQueue = HdQueue

// hd-tree-data
import HdTreeData from 'packages/hd-tree-data/index'
Vue.prototype.$hdTreeData = HdTreeData

// hd-websocket
import HdWebsocket from 'packages/hd-websocket/index'
Vue.prototype.$hdWebsocket = HdWebsocket

// 因为文档页面相关
Vue.use(ElementUI)
Vue.component('demo-block', DemoBlock)
Vue.config.productionTip = false

router.afterEach(route => {
  // https://github.com/highlightjs/highlight.js/issues/909#issuecomment-131686186
  Vue.nextTick(() => {
    const blocks = document.querySelectorAll('pre code:not(.hljs)')
    Array.prototype.forEach.call(blocks, hljs.highlightBlock)
  })
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

