/**
 * 路由配置
 * Created by liangwj on 2017/6/13 0013.
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import layers from '../layer/LayerIndex.js'
import eventDispatcher from '../MyEventDispatcher'

const PATH_PREFIX = '/jmxInWeb/'
const INDEX_PATH = PATH_PREFIX

/** 根据前缀获得路径 */
function getMyPath (path) {
  return PATH_PREFIX + path
}

function getRouteDefine () {

  // 路由配置
  const routers = []

  /** 欢迎页 */
  const index = newRoute('Login')
  index.alias = INDEX_PATH
  routers.push(index)

  return routers
}

function newRoute (name) {
  /* eslint-disable */
  return {
    component: resolve => require([`../views/${name}.vue`], resolve),
    path: getMyPath(name),
  }
}

function NewNestRoute (r, prefix) {
  let children = []

  let dir = 'views'

  for (let k in r.children) {
    let cur = r.children[k]
    let filePath = `../${dir}/${r.path}/${cur.path}.vue`
    let child = {
      title: cur.title,
      icon: cur.icon,
      path: cur.path,
      component: resolve => { require([`../views/${r.path}/${cur.path}.vue`], resolve) },
      meta: {
        keepAlive: cur.keepAlive, // 需要被缓存
      }
    }
    if (cur.checkRightFun) {
      // 如果二级菜单有定义校验权限的方法，就用定义的
      child.meta.checkRightFun = cur.checkRightFun
    } else {
      // 否则就用一级菜单的权限定义
      child.meta.checkRightFun = r.checkRightFun
    }

    if (typeof child.meta.checkRightFun !== 'function') {
      throw new Error(`路由定义错误：${child.title} 缺少检查权限的函数 checkRightFun`)
    }

    console.debug(`增加路由: ${r.path}/${cur.path} - ${filePath}`)
    children.push(child)
  }

  return {
    title: r.title,
    icon: r.icon,
    path: getMyPath(r.path),
    // component: MainPage,
    children: children,
    navType: r.navType,
    meta: {
      checkRightFun: r.checkRightFun
    }
  }
}

/** 路由配置 */
export default {

  /** 获取全路径 */
  getRoutePath (path) {
    return getMyPath(path)
  },

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
            const msg = `准备导航到: ${to.path}，但此页面不存在，并且from不存在，自动重定向到首页`
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
  }

}
