<template>
  <el-button v-bind="$attrs"
    :type="type" 
    :size="size"
    @click="onClick">
    <slot />
  </el-button>
</template>

<script>
import ed from './index_'
export default ed
</script>

