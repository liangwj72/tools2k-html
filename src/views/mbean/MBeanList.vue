<template>
  <div>
    <my-nav active-name="mbean"></my-nav>

    <div class="main-content">
      <el-card header="MBean列表">
        <table class="table table-light table-hover table-fixed">
          <thead>
          <tr>
            <th>ObjectName</th>
            <th>说明</th>
            <th>Class</th>
          </tr>
          </thead>
          <tbody>
          <template v-for="domainVo in list">
            <tr>
              <td colspan="3">
                <div class="caption">
                  {{domainVo.name}}
                </div>
              </td>
            </tr>
            <template v-for="mbeanVo in domainVo.beans">
              <tr>
                <td><a href="#" @click.prevent="view(mbeanVo)">{{mbeanVo.displayName}}</a></td>
                <td>{{mbeanVo.desc}}</td>
                <td>{{mbeanVo.className}}</td>
              </tr>
            </template>
          </template>
          </tbody>
        </table>
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

        const that = this
        myUtil.ajax(apiUrl.jmxInWeb.getMBeanList, {}, function (res) {
          that.list = res.list
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

