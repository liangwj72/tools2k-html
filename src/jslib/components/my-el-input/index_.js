export default {
  name: 'my-el-input',

  components: {

  },

  props: {
    updated: {
      type: Boolean,
      default: false,
    },
    text: {
      default: '',
    },
    value: {
      default: '',
    },
  },

  /** 本页面的属性 */
  data() {
    return {
      val: this.value,
    }
  },
  /** 计算属性 */
  computed: {

  },

  watch: {
    value(v) {
      this.val = v
    }
  },

  created() {

  },

  /** 构建页面时 */
  mounted() {

  },

  /** 每次进入页面时 */
  activated() { },

  /** 本页面可用的方法 */
  methods: {
    input() {
      this.$emit('input', this.val)
    },
  },
}
