/** 基础框架 */
import Vue from 'vue'

/** 全局变量 */
import serverContext from './util/ServerContext.js'

/** 公用组件库 */
import jsLib from '@gztree/jslib';
Vue.use(jsLib)

/** 公用样式主题 */
import cssLib from '@gztree/element-theme-dark01';
Vue.use(cssLib)

/** 消息总线 */
import eventBus from './event-bus';
Vue.use(eventBus)

/** 导入样式表 */
import './assets/index.scss';

/** 初始化vue的配置 */
import vueConfig from './config/vue.config'
Vue.use(vueConfig);

/** 路由配置 */
import routerConfig from './config/router.config'
const router = routerConfig.initRouter()

/** 首页 */
import App from './App.vue'
serverContext.init(function () {
  const app = new Vue({
    router,
    render: (h) => h(App),
  }).$mount('#app');

  console.debug(`vue初始化完成。路由页面数量:${app.$router.options.routes.length}`)
})
