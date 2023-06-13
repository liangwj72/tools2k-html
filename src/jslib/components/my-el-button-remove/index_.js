export default {
  name: 'my-el-button-remove',

  props: {
    row: {
      type: Object,
      default() {
        return {}
      },
    },
    message: {
      type: String,
      default: '确认删除？'
    },
    title: {
      type: String,
      default: '提示'
    },
    type: {
      type: String,
      default: 'danger'
    },
    size: {
      type: String,
      default: 'mini',
    },
    onThen: {
      type: Function,
    },
    onCatch: {
      type: Function,
    },
  },

  data() {
    return {

    }
  },
  /** 计算属性 */
  computed: {

  },

  watch: {

  },

  created() {

  },

  methods: {
    onClick() {
      this.$confirm(this.message, this.title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (typeof this.onThen === 'function') {
          this.onThen(this.row)
        }
      }).catch(() => {
        if (typeof this.onCatch === 'function') {
          this.onCatch(this.row)
        }
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // })
      })
    }
  }
}