<template>
  <div class="ws-conns">
    <!-- 自动刷新按钮 -->
    <auto-refresh
      @refresh="reload(false)"></auto-refresh>

    <my-nav activeName="wsapi"></my-nav>

    <div v-show="!loading">
      <div class="my-pannel summary-pannel">
        <div class="flex-container">
          <h4 class="flex1">汇总信息</h4>
          <el-button size="mini"
                     @click="resetCounter">
            重置计数器
          </el-button>

        </div>
        <hr/>
        <div class="flex-container">
          <div class="info-label">总连接数:</div>
          <div class="info-value">{{totalConnectCount}}</div>
        </div>
        <div class="flex-container">
          <div class="info-label">总登录用户数</div>
          <div class="info-value">{{totalUserCount}}</div>
        </div>

        <br/>
        <h4>请求信息</h4>
        <hr/>
        <div class="flex-container">
          <div class="info-label">请求次数</div>
          <div class="info-value">{{upCounter.count}}</div>
        </div>
        <div class="flex-container">
          <div class="info-label">平均耗时(微秒)</div>
          <div class="info-value">{{upCounter.timeAvg / 1000}}</div>
        </div>
        <div class="flex-container">
          <div class="info-label">平均带宽</div>
          <div class="info-value">{{sizeToK(upCounter.payloadAvg)}} B</div>
        </div>
        <div class="flex-container">
          <div class="info-label">总带宽</div>
          <div class="info-value">{{sizeToK(upCounter.payloadTotal)}}</div>
        </div>

        <br/>
        <h4>消息发送</h4>
        <hr/>
        <div class="flex-container">
          <div class="info-label">发送次数</div>
          <div class="info-value">{{downCounter.count}}</div>
        </div>
        <div class="flex-container">
          <div class="info-label">平均耗时(微秒)</div>
          <div class="info-value">{{downCounter.timeAvg / 1000}}</div>
        </div>
        <div class="flex-container">
          <div class="info-label">平均带宽</div>
          <div class="info-value">{{sizeToK(downCounter.payloadAvg)}}</div>
        </div>
        <div class="flex-container">
          <div class="info-label">总带宽</div>
          <div class="info-value">{{sizeToK(downCounter.payloadTotal)}}</div>
        </div>
      </div>

      <div class="my-pannel conns-pannel">
        <div class="p-header">当前连接信息</div>
        <div class="p-body">
          <table class="el-table my-table">
            <thead>
            <tr>
              <th>SessionId</th>
              <th>用户</th>
              <th>ip</th>
              <th>连接时间</th>
              <th>最后消息</th>
              <th>请求总数</th>
              <th>平均处理时间</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="row in list">
              <td>
                {{row.sessionId}}
              </td>
              <td>
                <div v-if="row.userLogined">
                  <el-tooltip :content="row.userClassName" placement="top" effect="light">
                    <el-button size="mini">{{row.userAccount}}</el-button>
                  </el-tooltip>
                </div>
              </td>
              <td>
                {{row.ipAddress}}
              </td>
              <td>{{row.connectTime.full}}</td>
              <td>{{row.lastRequestTime.full}}</td>
              <td>{{row.upCounter.count}}</td>
              <td>
                <span v-if="row.upCounter.count>0">
                {{(row.upCounter.timeAvg / 1000 / 1000).toFixed(2)}} ms
                </span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import apiUrl from '../../ApiUrl'
  import myUtil from '../../util/MyUtils'
  import AutoRefresh from '../../components/AutoRefresh'

  export default {

    /** 本页面用到的组件 */
    components: {AutoRefresh},

    /** 本页面的属性 */
    data () {
      return {
        loading: false,

        downCounter: {
          count: 0,
          payloadAvg: 0,
          payloadMax: 0,
          payloadMin: 0,
          payloadTotal: 0,
          timeAvg: 0,
          timeMax: 0,
          timeMin: 0,
          timeTotal: 0,
        },
        list: [],
        totalConnectCount: 0,
        totalUserCount: 0,
        upCounter: {
          count: 0,
          payloadAvg: 0,
          payloadMax: 0,
          payloadMin: 0,
          payloadTotal: 0,
          timeAvg: 0,
          timeMax: 0,
          timeMin: 0,
          timeTotal: 0,
        },
      }
    },

    /** 计算属性 */
    computed: {},

    /** 每次进入页面时 */
    activated () {
      this.loading = true
      this.reload(false)
    },

    /** 本页面可用的方法 */
    methods: {
      reload (showMsg) {
        myUtil.ajax(apiUrl.commonRuntime.wsConnectList, {}, res => {
          this.loading = false
          this.downCounter = res.downCounter
          this.upCounter = res.upCounter
          this.list = res.list
          this.totalConnectCount = res.totalConnectCount
          this.totalUserCount = res.totalUserCount

          if (showMsg) {
            myUtil.showMsg('刷新成功')
          }
        })
      },

      /** 重置计数器 */
      resetCounter () {
        myUtil.ajax(apiUrl.commonRuntime.wsResetCounter, {}, () => {
          this.reload(false)

          myUtil.showMsg('重置成功')
        })
      },

      sizeToK (size) {
        return (size / 1024).toFixed(2) + 'K'
      },
    },
  }
</script>
