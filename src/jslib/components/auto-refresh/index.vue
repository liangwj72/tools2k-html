<!--
  自动刷新按钮，回调事件：refresh
-->
<template>
    <el-button-group class="auto-refresh" :class="fixedClass">
        <el-button :size="size"
                   @click="onClickRefresh">刷新
        </el-button>
        <el-button :size="size"
                   @click="playOrPause"
                   :icon="iconClass"
                   class="btn-left">
            <span v-show="playing">{{remainInSec}}</span>
        </el-button>
    </el-button-group>
</template>

<script>
    import js from './index_.js'
    import './auto-refresh.scss'

    export default js
</script>
