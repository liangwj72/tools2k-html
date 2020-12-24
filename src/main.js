import Vue from 'vue'
import App from './App.vue'
import routerConfig from './config/router.config'
import vueConfig from './config/vue.config'
import serverContext from './util/ServerContext.js'
import jsLib from '@nnland/jslib';
import cssLib from '@nnland/element-theme-admin1';
import eventBus from './event-bus';

/** 初始化vue的配置 */
Vue.use(vueConfig);
Vue.use(jsLib)
Vue.use(cssLib)
Vue.use(eventBus)

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
