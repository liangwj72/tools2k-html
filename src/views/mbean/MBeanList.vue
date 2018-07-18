<template>
  <div>
    <my-nav active-name="mbean"></my-nav>

    <div class="main-content" v-if="!loading">
      <el-card header="MBean列表">

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

        <div v-for="domainVo in list">
          <div class="table-caption">
            {{domainVo.name}}
          </div>
          <el-table border
                    :showHeader="false"
                    :data="domainVo.beans"
                    class="table-fixed">
            <el-table-column
              label="ObjectName">
              <template slot-scope="scope">
                <a href="#" @click.prevent="view(scope.row)">{{scope.row.displayName}}</a>
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
      </el-card>
    </div>
  </div>
</template>

<script>
  import apiUrl from '../../ApiUrl'
  import myUtil from '../../util/MyUtils'

  export default {

    /** 组件的属性，只有是组件的时候才有用 */
    props: {},

    /** 本页面的属性 */
    data () {
      return {
        list: [],

        loading: false,
      }
    },

    /** 计算属性 */
    computed: {},

    /** 每次进入页面时 */
    activated () {
      this.reloadList()
    },

    /** 本页面可用的方法 */
    methods: {
      reloadList () {
        console.debug('加载MBean列表')
        this.loading = true

        const that = this
        myUtil.ajax(apiUrl.jmxInWeb.getMBeanList, {}, function (res) {
          that.list = res.list
          that.loading = false
        })
      },

      /** 查看mbean */
      view (mbeanVo) {
        this.$router.push({
          path: 'MBeanView',
          query: {
            objectName: mbeanVo.objectName,
          },
        })
      },
    },
  }
</script>

