<!-- 加载提示 -->
<template>
  <div class="loading">
    <div v-show="showMask"
         class="loading-mask"></div>
    <div v-show="showText"
         class="loading-box">
      <div class="loading-div">
        <i class="el-icon-loading"></i>
        数据加载中...
      </div>
    </div>
  </div>
</template>

<script>
  import ctrl from '../util/LoadingController'

  export default {
    name: 'loading',

    data () {
      return ctrl.vueData
    },

  }
</script>
