<!-- 加载提示 -->
<template>
  <div class="my-loading">
    <div v-show="showMask"
         class="loading-mask"></div>
    <div v-show="showText"
         class="loading-box">
      <div class="loading-div">
        <i class="el-icon-loading"></i>
        <span class="loading-txt">数据加载中...</span>
      </div>
    </div>
  </div>
</template>

<script>
  import ctrl from './controller'
  import './my-loading.scss'
  export default {
    name: 'my-loading',

    data () {
      return ctrl.vueData
    },

  }
</script>
