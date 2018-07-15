<template>
  <span>{{ thisValue }}</span>
</template>

<script>
  import context from '../ApiContext'

  export default {
    name: 'my-key',

    props: {
      vkey: {
        type: String,
        required: true,
      },
    },

    data () {
      return {
        thisValue: '', // 根据key找到的值
        hasKey: false, // key是否存在
      }
    },

    mounted: function () {
      this.thisValue = context.getDictValue(this.vkey)
    },
  }
</script>
