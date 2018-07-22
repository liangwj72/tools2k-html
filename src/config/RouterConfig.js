/**
 * 路由配置
 * Created by liangwj on 2017/6/13 0013.
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import layers from '../layer/LayerIndex.js'
import eventDispatcher from '../MyEventDispatcher.js'
import serverContext from '../util/ServerContext.js'

const PATH_PREFIX = '/commonAdmin/'
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

  addToRoute(routers, 'status/Summary', ext)
  addToRoute(routers, 'status/WsApi', ext)
  addToRoute(routers, 'status/Runtime', ext)

  addToRoute(routers, 'dict/Keys', ext)
  addToRoute(routers, 'dict/Upload', ext)

  return routers
}

/** 检查是否登录的方法 */
function checkRightFun () {
  // 登录就可以看到
  return serverContext.logined
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
    component: resolve => { require(['@/views/' + path + '.vue'], resolve) },
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
      let error = false
      if (to.path !== INDEX_PATH) {
        // 只检查费索引页
        console.debug('要访问的界面不是登录界面，但是没找到当前用户的信息，导航回到登录界面')

        if (to.matched.length === 0) {
          // 如果页面不存在
          error = true
          // 如果不存在，就判断是否有from ，如果没有from ,就跳首页
          if (from.matched.length === 0) {
            console.debug(`准备导航到: ${to.path}，但此页面不存在，并且from不存在，自动重定向到${INDEX_PATH}`)
            next(INDEX_PATH)
          } else {
            console.debug(`准备从 ${from.path} 导航到: ${to.path}，但此页面不存在，不做任何操作`)
          }
        } else {
          // 如果页面存在
          if (to.meta) {
            let checkRightFun = to.meta.checkRightFun
            if (typeof checkRightFun === 'function') {
              // 目标页面需要权限检查，就先这些检查的方法
              let ok = checkRightFun()
              if (!ok) {
                // 如果检查权限不通过
                console.debug(`准备导航到: ${to.path}，但此页面的权限校验不通过，自动重定向到${INDEX_PATH}`)
                error = true
                next(INDEX_PATH)
              }
            }
          }
        }
      }

      // 如果没有错误，就跳转到目的页面
      if (!error) {
        // 隐藏加载层
        eventDispatcher.hideAppLoading()

        // 转到目的页面
        next()
      }
    })

    return router
  },

}
