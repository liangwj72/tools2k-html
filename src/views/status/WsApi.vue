<template>
  <div>
    <my-nav></my-nav>
  </div>
</template>

<script>
  export default {

    /** 组件的属性，只有是组件的时候才有用 */
    props: {},

    /** 本页面的属性 */
    data () {
      return {}
    },

    /** 计算属性 */
    computed: {},

    /** 构建页面时 */
    mounted () {
      console.debug('mounted()')
    },

    /** 每次进入页面时 */
    activated () {
      console.debug('activated()')
    },

    /** 每次退出页面时 */
    deactivated () {
      console.debug('activated()')
    },

    /** 本页面可用的方法 */
    methods: {},
  }
</script>

<!--<style scoped>-->
<style>

</style>
