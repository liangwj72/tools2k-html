<template>
  <div>
    <div v-if="!loading">

      <!-- 显示一个空的表格头 -->
      <el-table border
                class="table-fixed only-header">
        <div slot="empty"></div>
        <el-table-column
          label="ObjectName">
        </el-table-column>
        <el-table-column
          label="说明">
        </el-table-column>
        <el-table-column
          label="Class">
        </el-table-column>
      </el-table>

      <!-- 循环显示每个分组的mbean表格，不显示表格头 -->
      <div v-for="(domainVo,index) in list"
           :key="index">
        <div class="table-caption">
          {{domainVo.name}}
        </div>

        <el-table border
                  style="width: 100%"
                  :showHeader="false"
                  :data="domainVo.beans"
                  class="table-fixed1">
          <el-table-column
            label="ObjectName">
            <template slot-scope="scope">
              <el-button type="text" @click="view(scope.row)">{{scope.row.displayName}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="desc"
            label="说明">
          </el-table-column>
          <el-table-column
            prop="className"
            label="Class">
          </el-table-column>
        </el-table>

      </div>
    </div>

    <mbean-view/>
  </div>
</template>

<script>
  import apiUrl from '../../ApiUrl'
  import myUtil from '../../util/MyUtils'
  import eventBus from '@/event-bus'
  import MbeanView from './CompMBeanView.vue'

  export default {

    /** 本页面用到的组件 */
    components: {
      MbeanView,
    },

    /** 本页面的属性 */
    data() {
      return {
        list: [],

        loading: false,
      }
    },

    /** 计算属性 */
    computed: {},

    /** 每次进入页面时 */
    activated() {
      this.reloadList()
    },

    /** 本页面可用的方法 */
    methods: {
      reloadList() {
        console.debug('加载MBean列表')
        this.loading = true

        const that = this
        myUtil.ajax(apiUrl.jmxInWeb.getMBeanList, {}, function (res) {
          that.list = res.list
          that.loading = false
        })
      },

      /** 查看mbean */
      view(mbeanVo) {
        console.debug(`点击查看MBean详情 , objname=${mbeanVo.objectName}`)
        eventBus.showMBeanDetail(mbeanVo.objectName)
      },
    },
  }
</script>

