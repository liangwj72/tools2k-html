<template>
  <div>
    <el-drawer
      :title="'详情: ' + title"
      :visible.sync="visible"
      size="50%">

      <el-table
        :data="urlHistory">
        <el-table-column
          label="url"
          prop="url"></el-table-column>
        <el-table-column
          width="180"
          label="访问时间">
          <template slot-scope="scope">
            {{scope.row.accessTime | timeFormat}}
          </template>
        </el-table-column>
        <el-table-column
          width="80"
          label="消耗时间">
          <template slot-scope="scope">
            {{scope.row.cost}} ms
          </template>
        </el-table-column>
      </el-table>

    </el-drawer>
  </div>
</template>

<script>
  import eventBus from '@/event-bus'
  import jsLib from '@nnland/jslib'
  import apiUrl from '../../ApiUrl'

  export default {
    name: 'comp-uri-detail', // 只有是组件的时候才有用

    /** 本页面用到的组件 */
    components: {},

    /** 组件的属性，只有是组件的时候才有用 */
    props: {},

    /** 本页面的属性 */
    data() {
      return {
        visible:false,
        uriStat: {},
        title:'',
        urlHistory:{}, // 服务器返回的详情
      }
    },

    /** 计算属性 */
    computed: {},

    /** 构建页面时 */
    mounted() {
      // 先关闭原来的
      this.$eventBus.$off(eventBus.eventName.showUriStatDetail)
      // 监听打开事件
      this.$eventBus.$on(eventBus.eventName.showUriStatDetail,
        ({row}) => {
          console.debug(`showUriStatDetail 事件: `, row)
          this.visible = true
          this.uriStat = row
          this.reload()
        }
      )
    },

    /** 本页面可用的方法 */
    methods: {
      reload() {
        if (this.uriStat.timeRangeMax>0) {
          this.title=`${this.uriStat.timeRangeMin} - ${this.uriStat.timeRangeMax}`
        } else {
          this.title=`大于${this.uriStat.timeRangeMin}`
        }


        let param={
          id : this.uriStat.id
        }
        jsLib.ajax.post(apiUrl.commonRuntime.getUrlStatById,param).then(res=>{
          console.debug('获取uristat访问详情', res)
          this.urlHistory = res.stat.urlHistory
        })
      },
    },
  }
</script>
