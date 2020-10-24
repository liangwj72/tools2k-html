import Vue from 'vue'
import App from './App.vue'
import routerConfig from './config/router.config'
import vueConfig from './config/vue.config'
import serverContext from './util/ServerContext.js'
import jslib from '@gztree/jslib';

/** 初始化vue的配置 */
Vue.use(vueConfig);
Vue.use(jslib)

const router = routerConfig.initRouter()

serverContext.init(function () {
  let app = new Vue({
    el: '#app',
    router: router,
    template: '<App/>',
    components: {App},
  })

  console.debug(`vue初始化完成。路由页面数量:${app.$router.options.routes.length}`)
})
