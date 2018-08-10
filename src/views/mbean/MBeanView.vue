<template>
  <div class="mbean-view">

    <auto-refresh
      :timer="false"
      @refresh="reload"></auto-refresh>

    <my-nav activeName="mbean"></my-nav>

    <div v-if="!loading">
      <!-- 属性列表 vue-->
      <attrs-comp
        @refresh="reload"
        :objectName="objectName"
        :sendTime="sendTime"
        :attrs="attrs">
      </attrs-comp>
      <!-- /属性列表 -->

      <!-- opt列表 -->
      <opts-comp
        @refresh="reload"
        :info="info">
      </opts-comp>
      <!-- /opt列表 -->
    </div>
  </div>
</template>

<script>
  import apiUrl from '../../ApiUrl'
  import myUtil from '../../util/MyUtils'
  import AttrsComp from './AttrsComp.vue'
  import OptsComp from './OptsComp'

  export default {

    /** 本页面用到的组件 */
    components: {
      OptsComp,
      AttrsComp,
    },

    /** 组件的属性，只有是组件的时候才有用 */
    props: {},

    /** 本页面的属性 */
    data () {
      return {
        showAllCol: false, // 是否显示所有列

        loading: false,
        inited: false,

        attrs: [], // 属性列表
        sendTime: 0, // 刷新时间
        objectName: '',

        info: {},
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
      this.loading = true
      this.inited = false
      this.objectName = this.$route.query.objectName
      this.reload(false)
    },

    /** 本页面可用的方法 */
    methods: {

      reload (showMsg) {

        console.debug('刷新 mbean:', this.objectName)

        const param = {
          objectName: this.objectName,
        }

        myUtil.ajax(apiUrl.jmxInWeb.getMBeanInfo, param, (res) => {
          this.onDateLoad(res.info)
          this.sendTime = res.sendTime
          this.loading = false

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

        this.attrs = info.attrs
        this.objectName = info.objectName

        if (!this.inited) {
          this.info = info
          this.inited = true
        }
      },

      /** 增加编辑模式需要的数据 */
      addEditModeData (row) {
        row.editMode = false
        row._value = row.value
      },
    },
  }
</script>
