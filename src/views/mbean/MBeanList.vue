<template>
  <div>
    <my-nav></my-nav>

    <b-card title="MBean列表"
            tag="article">

      <table class="table table-light table-hover table-fixed">
        <thead>
        <tr>
          <th width="33.3%">ObjectName</th>
          <th width="33.3%">说明</th>
          <th width="33.3%">Class</th>
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
              <td><a href="mbeanInfo?objectName=${mbeanVo.objectName?url('UTF-8')}">{{mbeanVo.displayName}}</a></td>
              <td>{{mbeanVo.desc}}</td>
              <td>{{mbeanVo.className}}</td>
            </tr>
          </template>
        </template>
        </tbody>
      </table>
    </b-card>

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
    },
  }
</script>

<!--<style scoped>-->
<style>

</style>
