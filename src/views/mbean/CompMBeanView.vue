<template>
  <el-drawer
    :title="'MBean详情:' + objectName"
    :visible.sync="visible"
    size="90%">

    <div class="mbean-view">
      <auto-refresh
        :timer="false"
        @refresh="reload"></auto-refresh>

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
  </el-drawer>
</template>

<script>
  import apiUrl from '../../ApiUrl'
  import myUtil from '../../util/MyUtils'
  import AttrsComp from './CompMBeanAttrs.vue'
  import OptsComp from './CompMBeanOpts.vue'
  import eventBus from '@/event-bus'

  export default {

    name:'mbean-detail',

    /** 本页面用到的组件 */
    components: {
      OptsComp,
      AttrsComp,
    },

    /** 组件的属性，只有是组件的时候才有用 */
    props: {},

    /** 构建页面时 */
    mounted() {
      // 先关闭原来的
      this.$eventBus.$off(eventBus.eventName.showMBeanDetail)
      // 监听打开事件
      this.$eventBus.$on(eventBus.eventName.showMBeanDetail,
        ({objectName}) => {
          console.debug(`showMBeanDetail 事件: objectName=${objectName}`)
          this.visible=true
          this.loading = true
          this.objectName = objectName
          this.reload(false)
        }
      )
    },

    /** 本页面的属性 */
    data() {
      return {
        visible: false, // 是否显示
        showAllCol: false, // 是否显示所有列

        loading: false,

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

    /** 本页面可用的方法 */
    methods: {

      reload(showMsg) {

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

      onDateLoad(info) {

        // 在原来的属性中增加用于编辑的相关属性
        for (let attr of info.attrs) {
          // 将属性的值备份一次，方便编辑
          this.addEditModeData(attr)
        }

        this.attrs = info.attrs
        this.objectName = info.objectName

        this.info = info
      },

      /** 增加编辑模式需要的数据 */
      addEditModeData(row) {
        row.editMode = false
        row._value = row.value
      },
    },
  }
</script>
