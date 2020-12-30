/**
 * Vue 的各种配置
 * Created by liangwj on 2017/6/20 0020.
 */

import MyKey from '../components/MyKey.vue'
import MyNav from '../components/MyNav.vue'

function noZero(value) {
  if (value>0) {
    return value
  } else {
    return ''
  }
}

export default {
  /** 初始化所有 */
  install (Vue) {
    /** 我们可以再这个地方注入全局的组件，这样就不需要在每个页面单独的声明了 */
    Vue.component('my-key', MyKey)
    Vue.component('my-nav', MyNav)

    Vue.filter('noZero', noZero); // 如果值为0就不显示
  },

}
