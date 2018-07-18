<template>
  <div class="mbean-view">
    <my-nav activeName="mbean"></my-nav>

    <!-- 属性列表 vue-->
    <div class="attr_container">
      <attrs-comp
        :objectName="info.objectName"
        :attrs="info.attrs"
        @reload="reload(true)"
      />
    </div>
    <!-- /属性列表 -->

  </div>
</template>

<script>
  import apiUrl from '../../ApiUrl'
  import myUtil from '../../util/MyUtils'
  import AttrsComp from './AttrsComp.vue'

  export default {

    /** 本页面用到的组件 */
    components: {AttrsComp},

    /** 组件的属性，只有是组件的时候才有用 */
    props: {},

    /** 本页面的属性 */
    data () {
      return {
        objectName: '',

        showAllCol: false, // 是否显示所有列

        attrs: [], // 属性列表
        info: {
          objectName: '',
          attrs: [],
        },

      }
    },

    /** 计算属性 */
    computed: {
      showAllColText: function () {
        return (this.showAllCol) ? '隐藏名字列' : '显示所有列'
      },
    },

    /** 每次进入页面时 */
    activated () {
      this.objectName = this.$route.query.objectName
      this.reload(false)
    },

    /** 本页面可用的方法 */
    methods: {

      reload (showMsg) {

        console.debug('刷新 mbean:', this.objectName)

        const that = this
        const param = {
          objectName: this.objectName,
        }

        myUtil.ajax(apiUrl.jmxInWeb.getMBeanInfo, param, function (res) {
          that.onDateLoad(res.info)

          if (showMsg) {
            myUtil.showMsg('刷新成功')
          }
        })
      },

      onDateLoad (info) {

        // 在原来的属性中增加用于编辑的相关属性
        for (let attr of info.attrs) {
          // 将属性的值备份一次，方便编辑
          this.addEditModeData(attr)
        }

        this.info = info
      },

      /** 增加编辑模式需要的数据 */
      addEditModeData (row) {
        row.editMode = false
        row._value = row.value
      },
    },
  }
</script>
