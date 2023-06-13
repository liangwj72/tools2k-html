<template>
  <div>
    <span v-show="!updated">{{ text }}</span>
    <el-input v-bind="$attrs"
      v-show="updated"
      v-model="val"
      @input="input"></el-input>
  </div>
</template>

<script>
import ed from './index_'
export default ed
</script>
