/**
 * Vue 的各种配置
 * Created by liangwj on 2017/6/20 0020.
 */

import Vue from 'vue'
import ElementUI from 'element-ui'
import MyKey from '../components/MyKey.vue'
import MyNav from '../components/MyNav.vue'
import AutoRefresh from '../components/AutoRefresh'
import filters from '../util/Filters'

/** 配置组件 */
function initComp () {
  /** 我们可以再这个地方注入全局的组件，这样就不需要在每个页面单独的声明了 */
  Vue.component('my-key', MyKey)
  Vue.component('my-nav', MyNav)
  Vue.component('auto-refresh', AutoRefresh)

}

export default {
  /** 初始化所有 */
  init () {
    Vue.config.productionTip = false

    // 配置全局组件
    initComp()

    // 设置格式化输出
    Vue.filter('numFormat', filters.numFormat) // 逗号分隔，取整
    Vue.filter('numFormat2', filters.numFormat2) // 逗号分隔，保留两位小数
    Vue.filter('timeFormat', filters.timeFormat) // unix时间 到年月日时分秒
    Vue.filter('sizeToK', filters.sizeToK) // 转为K
    Vue.filter('sizeToM', filters.sizeToM) // 转为M

    // 我们使用 ElementUI
    Vue.use(ElementUI)
  },

}
