<template>
  <div class="page-upload">
    <my-nav activeName="upload"></my-nav>

    <div>
      <!-- 左边图片列表 -->
      <div class="my-pannel pic-pannel">
        <div class="my-header">
          附件列表
        </div>
      </div>
      <!-- /左边图片列表 -->

      <!-- 右边的编辑区 -->
      <div class="my-pannel edit-pannel">
        <div class="my-header">
          附件编辑
        </div>
      </div>
      <!-- /右边的编辑区 -->
    </div>

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

    /** 本页面可用的方法 */
    methods: {},
  }
</script>

<!--<style scoped>-->
<style>

</style>
