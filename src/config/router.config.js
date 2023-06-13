/**
 * 路由配置
 * Created by liangwj on 2017/6/13 0013.
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import eventDispatcher from '../util/MyEventDispatcher.js'
import serverContext from '../util/ServerContext.js'
import Main from '../views/Main.vue'
import jslib from '@/jslib'


//const PATH_PREFIX = '/_common_/statics/commonAdmin/'
const PATH_PREFIX = ''
const INDEX_PATH = '/' // 首页的url

function addRouter(e) {
  e.path = PATH_PREFIX + e.path
  if (e.redirect) {
    e.redirect = PATH_PREFIX + e.redirect
  }
  if (e.alias) {
    e.alias = PATH_PREFIX + e.alias
  }
  return e
}

const routers = [
  // 登录页
  addRouter({
    path: '/Login',
    alias: '/',
    hidden: true,
    component: () => import('@/views/Login.vue'),
  }),

  // 系统信息
  addRouter({
    path: '/status/Summary',
    component: Main,
    meta: {
      title: '系统摘要',
      // icon: 'el-icon-s-platform'
    },
    children: [
      {
        path: '/status/Summary',
        meta: {
          checkRightFun: checkRightFun,
          title: '系统摘要',
          icon: 'dashboard',
        },
        component: () => import('@/views/status/Summary.vue'),
      },
    ]
  }),

  // 系统信息
  addRouter({
    path: '/status/Runtime',
    component: Main,
    meta: {
      title: '运行图表',
      // icon: 'el-icon-s-platform'
    },
    children: [
      {
        path: '/status/Runtime',
        meta: {
          checkRightFun: checkRightFun,
          title: '运行图表',
          icon: 'dashboard'
        },
        component: () => import('@/views/status/Runtime.vue'),
      },
      {
        path: '/status/ApiReport',
        meta: {
          checkRightFun: checkRightFun,
          title: 'API调用',
          icon: 'dashboard'
        },
        component: () => import('@/views/status/ApiReport.vue'),
      },
      {
        path: '/status/WsConns',
        hidden: function () {
          !serverContext.serverInfo.hasWsApiImpl // 如果后端没有ws接口，就隐藏
        },
        meta: {
          checkRightFun: checkRightFun,
          title: 'Websocket信息',
          icon: 'dashboard'
        },
        component: () => import('@/views/status/WsConns.vue'),
      },
    ]
  }),

  // JMX
  addRouter({
    path: '/mbean',
    redirect: '/mbean/MBeanList',
    component: Main,
    meta: {
      title: 'JMX',
      // icon: 'el-icon-s-platform'
    },
    children: [
      {
        path: '/mbean/MBeanList',
        meta: {
          checkRightFun: checkRightFun,
          title: 'JMX',
          icon: 'dashboard'
        },
        component: () => import('@/views/mbean/MBeanList.vue'),
      },
    ]
  }),

  // Durid监控
  addRouter({
    path: '/druid',
    redirect: '/druid/DataSources',
    hidden: function () {
      return !serverContext.serverInfo.hasDruid // 如果后端没有数据库，就隐藏
    },
    component: Main,
    meta: {
      title: '数据库监控',
      // icon: 'el-icon-s-platform'
    },
    children: [
      {
        path: '/druid/DataSources',
        meta: {
          checkRightFun: checkRightFun,
          title: 'SQL监控',
          icon: 'dashboard'
        },
        component: () => import('@/views/druid/DataSources.vue'),
      },
      {
        path: '/druid/UriList',
        meta: {
          checkRightFun: checkRightFun,
          title: 'URI监控',
          icon: 'dashboard'
        },
        component: () => import('@/views/druid/UriList.vue'),
      },
      {
        path: '/druid/BaseInfo',
        meta: {
          checkRightFun: checkRightFun,
          title: 'Druid基础信息',
          icon: 'dashboard'
        },
        component: () => import('@/views/druid/BaseInfo.vue'),
      },
    ]
  }),

  // 字典管理
  addRouter({
    path: '/Keys',
    redirect: '/dict/Keys',
    component: Main,
    meta: {
      title: '字典管理',
      // icon: 'el-icon-s-platform'
    },
    children: [
      {
        path: '/dict/Keys',
        meta: {
          checkRightFun: checkRightFun,
          title: '字典管理',
          icon: 'dashboard'
        },
        component: () => import('@/views/dict/Keys.vue'),
      },
    ]
  }),

  // 图床
  addRouter({
    path: '/Pics',
    redirect: '/dict/Upload',
    component: Main,
    meta: {
      title: '图床',
      // icon: 'el-icon-s-platform'
    },
    children: [
      {
        path: '/dict/Upload',
        meta: {
          checkRightFun: checkRightFun,
          title: '图床',
          icon: 'dashboard'
        },
        component: () => import('@/views/dict/Upload.vue'),
      },
    ]
  }),
]

/** 检查是否登录的方法 */
function checkRightFun() {
  // 登录就可以看到
  return serverContext.logined
}

/** 根据前缀获得路径 */
function getMyPath(path) {
  return PATH_PREFIX + path
}

/** 路由配置 */
export default {

  /** 获取全路径 */
  getRoutePath: getMyPath,

  /** 初始化路由 */
  initRouter() {
    Vue.use(VueRouter)

    const router = new VueRouter({
      mode: 'hash',
      routes: routers,
    })

    router.afterEach(function (to) {
      console.debug(`成功浏览到: ${to.path}`)
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
            if (jslib.utils.isFunction(checkRightFun)) {
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
