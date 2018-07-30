.
<template>
  <div class="my-app">
    <keep-alive>
      <router-view/>
    </keep-alive>

    <!-- 加载提示 -->
    <loading></loading>
  </div>
</template>

<script>
  import Loading from './layer/Loading.vue'

  /** 导入样式表 */
  import 'element-ui/lib/theme-chalk/index.css'
  import './assets/iconfont/iconfont.css'
  import './assets/less/index.less'

  export default {
    /** 本页面用到的组件 */
    components: {
      Loading, // 加载中
    },

    /** 本页面的属性 */
    data () {
      return {
        isDevMode: window.isDevMode,
      }
    },
  }
</script>
