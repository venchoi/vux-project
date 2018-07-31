import Vue from 'vue'
import Router from 'vue-router'
import tradeRoute from './trade'
import marketRoute from './market'
import userRoute from './user'
import homeRoute from './home'
import { user } from '../model/storage'
Vue.use(Router)
const routerConfig = {
  routes: [
    ...tradeRoute,
    ...marketRoute,
    ...userRoute,
    ...homeRoute
  ]
}

const router = new Router(routerConfig)

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.needLogin)) { // 检测路由配置中是否要需要登录的 配置
    // todo
    // 如果没登录
    const userInfo = user.read()
    if (!userInfo) {
      next({
        path: '/login/userLogin'
        // query: { redirect: to.fullPath }
      })
    }
    // next()
  }
  next()
})

export default router
