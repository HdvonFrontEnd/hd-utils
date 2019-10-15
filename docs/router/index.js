import Vue from 'vue'
import Router from 'vue-router'
import routes from './route.config'
Vue.use(Router)

export const constantRouterMap = [
  {
    path: '/',
    redirect: () => '/home',
    component: () => import('../pages/index.vue'),
    children: [
      {
        path: '/home',
        component: () => import('../pages/home/home.vue')
      },
      {
        path: '/packages',
        redirect: () => '/packages/README',
        component: () => import('../pages/packages/packages.vue'),
        children: routes
      }
    ]
  },
  {
    path: '*',
    redirect: '/'
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
