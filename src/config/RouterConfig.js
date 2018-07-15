/**
 * 路由配置
 * Created by liangwj on 2017/6/13 0013.
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import layers from '../layer/LayerIndex.js'
import eventDispatcher from '../MyEventDispatcher.js'

const PATH_PREFIX = '/jmxInWeb/'
const INDEX_PATH = PATH_PREFIX // 首页的url

/** 所有路由的定义 */
function getRouteDefine () {

  // 默认的额外路由定义，默认定义有权限检查
  const ext = {
    meta: {
      checkRightFun: checkRightFun,
    },
  }

  // 路由配置
  const routers = []

  /** 登录页 */
  addToRoute(routers, 'Login', {
    alias: INDEX_PATH, // 登录页同时也是首页
  })

  /** MBean */
  addToRoute(routers, 'mbean/MBeanList', ext)
  addToRoute(routers, 'mbean/MBeanView', ext)

  return routers
}

/** 检查是否登录的方法 */
function checkRightFun () {
  // 登录就可以看到
  return (window.curUser && window.curUser.logined)
}

/**
 * 添加路由到路由表
 * @param routers 路由表
 * @param path url路径
 * @param ext 额外的定义
 */
function addToRoute (routers, path, ext) {
  const fullUrl = getMyPath(path)

  let r = {
    component: resolve => { require(['../views/' + path + '.vue'], resolve) },
    path: getMyPath(path),
  }

  if (ext) {
    for (let key in ext) {
      r[key] = ext[key]
    }
  }

  // 添加到路由表
  console.debug(`增加路由: ${fullUrl} -`, r)

  routers.push(r)
}

/** 根据前缀获得路径 */
function getMyPath (path) {
  return PATH_PREFIX + path
}

/** 路由配置 */
export default {

  /** 获取全路径 */
  getRoutePath: getMyPath,

  /** 初始化路由 */
  initRouter () {
    Vue.use(VueRouter)

    const router = new VueRouter({
      mode: 'history',
      routes: getRouteDefine(),
    })

    router.afterEach(function (to) {
      console.debug(`成功浏览到: ${to.path}`)

      // 进入一个页面时，关闭所有层
      layers.closeAll()
    })

    router.beforeEach(function (to, from, next) {
      if (to.path !== INDEX_PATH && !window.curUser) {
        console.debug('要访问的界面不是登录界面，但是没找到当前用户的信息，导航回到登录界面')
        next(INDEX_PATH)
      } else {
        if (to.matched.length === 0) {
          console.debug(`From:`, from)
          if (from.matched.length === 0) {
            const msg = `准备导航到: ${to.path}，但此页面不存在，并且from不存在，自动重定向到${INDEX_PATH}`
            console.debug(msg)
            next(INDEX_PATH)
          } else {
            const msg = `页面 ${to.path} 不存在`
            console.debug(msg)
          }
        } else {
          // 隐藏加载层
          eventDispatcher.hideAppLoading()

          next()
        }
      }
    })

    return router
  },

}
