/**
 * Vue 的各种配置
 * Created by liangwj on 2017/6/20 0020.
 */

import Vue from 'vue'
import MyKey from '../components/MyKey.vue'
import MyNav from '../components/MyNav.vue'
import ElementUI from 'element-ui'

/** 配置组件 */
function initComp () {
  /** 我们可以再这个地方注入全局的组件，这样就不需要在每个页面单独的声明了 */
  Vue.component('my-key', MyKey)
  Vue.component('my-nav', MyNav)
}

export default {
  /** 初始化所有 */
  init () {
    Vue.config.productionTip = false

    initComp()

    // 我们使用 ElementUI
    Vue.use(ElementUI)
  },

}
