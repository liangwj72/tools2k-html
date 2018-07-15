import Vue from 'vue'
import App from './App.vue'
import routerConfig from './config/RouterConfig'
import vueConfig from './config/AppVueConfig.js'
import myUtil from './util/MyUtils.js'
import dictContext from './DictContext.js'

/** 初始化工具 */
myUtil.init(Vue)

/** 初始化vue的配置 */
vueConfig.init()

const router = routerConfig.initRouter()

dictContext.init(function () {
  let app = new Vue({
    el: '#app',
    router: router,
    template: '<App/>',
    components: {App},
  })

  console.debug(`vue初始化完成。路由页面数量:${app.$router.options.routes.length}`)
  console.debug(`vue初始化完成。路由页面数量:`, app.$router.options.routes)
})
