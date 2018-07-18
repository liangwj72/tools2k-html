<!-- 编辑模式按钮 -->
<template>
  <span class="edit-btn">
     <!-- 查看模式 -->
      <el-button
        v-show="!editMode"
        size="mini"
        @click="switchToEditMode()"
        icon="el-icon-edit">
      </el-button>

      <el-button-group
        v-show="editMode">
          <!-- 编辑模式-->
          <el-button size="mini"
                     type="info"
                     @click="resetProp()">
            <i class="el-icon-close"></i>
          </el-button>
          <el-button size="mini"
                     type="primary"
                     @click="submitChange()">
            <i class="el-icon-check"></i>
          </el-button>
      </el-button-group>
  </span>
</template>

<script>

  export default {
    name: 'edit-mode', // 只有是组件的时候才有用

    /** 本页面用到的组件 */
    components: {},

    /** 组件的属性，只有是组件的时候才有用 */
    props: {
      value: {
        type: Boolean,
        required: true,
        default: false,
      },
    },

    /** 本页面的属性 */
    data () {
      return {
        editMode: false,
      }
    },

    watch: {
      value (value) {
        this.editMode = value
      },
    },

    /** 计算属性 */
    computed: {},

    /** 本页面可用的方法 */
    methods: {
      /** 切换到编辑模式 */
      switchToEditMode () {
        this.updateProp(true)
      },

      updateProp (value) {
        this.editMode = value
        this.$emit('input', value)
      },

      /** 重置为查看模式 */
      resetProp () {
        this.updateProp(false)
        this.$emit('reset')
      },

      /** 提交属性变更 */
      submitChange () {
        this.editMode = false
        this.$emit('submitChange')
      },
    },
  }
</script>
