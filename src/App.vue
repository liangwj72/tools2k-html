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
