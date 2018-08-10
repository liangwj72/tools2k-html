<template>
  <div>
    <my-nav activeName="runtime"></my-nav>

    <!-- 自动刷新按钮 -->
    <auto-refresh
      @refresh="reload"></auto-refresh>

    <div class="main-content">
      <el-card>

        <div class="flex-container">
          <div>
            硬盘空间: <span class="mr-10 text-caption">{{diskInfo.total}}</span>
            可使用容量: <span class="mr-10 text-caption">{{diskInfo.free}}</span>
          </div>
          <div class="flex1">
            <el-progress
              :text-inside="true"
              :stroke-width="18"
              :percentage="diskInfo.percent"></el-progress>
          </div>
        </div>
      </el-card>

      <el-row :gutter="10" class="mt-10">
        <el-col :span="12">
          <!-- 内存图 -->
          <line-chart
            ref="memoryChart"
            :chartData="memoryChart.data"
            :chartOptions="memoryChart.options">
          </line-chart>
        </el-col>
        <el-col :span="12">
          <!-- CPU图 -->
          <line-chart
            ref="cpuChart"
            :chartData="cpuChart.data"
            :chartOptions="cpuChart.options">
          </line-chart>
        </el-col>
      </el-row>

      <el-row :gutter="10" class="mt-10">
        <el-col :span="12">
          <!-- 线程图-->
          <line-chart
            ref="threadChart"
            :chartData="threadChart.data"
            :chartOptions="threadChart.options">
          </line-chart>
        </el-col>
        <el-col :span="12">
          <!-- 动态请求-->
          <line-chart
            ref="actionChart"
            :chartData="actionChart.data"
            :chartOptions="actionChart.options">
          </line-chart>
        </el-col>
      </el-row>

      <el-row :gutter="10" class="mt-10" v-if="hasWsApiImpl">
        <el-col :span="12">
          <!-- ws 次数-->
          <line-chart
            ref="wsCountChart"
            :chartData="wsCountChart.data"
            :chartOptions="wsCountChart.options">
          </line-chart>
        </el-col>
        <el-col :span="12">
          <!-- ws 流量-->
          <line-chart
            ref="wsPayloadChart"
            :chartData="wsPayloadChart.data"
            :chartOptions="wsPayloadChart.options">
          </line-chart>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import apiUrl from '../../ApiUrl'
  import myUtil from '../../util/MyUtils'
  import chartHelper from './ChartHelper'
  import LineChart from '../../components/LineCharts'
  import AutoRefresh from '../../components/AutoRefresh'
  import serverContext from '../../util/ServerContext'

  export default {

    components: {
      AutoRefresh,
      LineChart,
    },

    /** 组件的属性，只有是组件的时候才有用 */
    props: {},

    /** 本页面的属性 */
    data () {
      return {
        hasWsApiImpl: serverContext.serverInfo.hasWsApiImpl,

        // 内存使用的图表
        memoryChart: {
          data: chartHelper.memoryChart.data,
          options: chartHelper.memoryChart.options,
        },

        // CPU图表
        cpuChart: {
          data: chartHelper.cpuChart.data,
          options: chartHelper.cpuChart.options,
        },

        // 线程图表
        threadChart: {
          data: chartHelper.threadChart.data,
          options: chartHelper.threadChart.options,
        },

        // 动态请求图表
        actionChart: {
          data: chartHelper.actionChart.data,
          options: chartHelper.actionChart.options,
        },
        // ws 次数图表
        wsCountChart: {
          data: chartHelper.wsCountChart.data,
          options: chartHelper.wsCountChart.options,
        },

        // ws 流量
        wsPayloadChart: {
          data: chartHelper.wsPayloadChart.data,
          options: chartHelper.wsPayloadChart.options,
        },

        diskInfo: {
          total: '',
          used: '',
          free: '',

          percent: 1,
        },
      }
    },

    /** 计算属性 */
    computed: {},

    /** 每次进入页面时 */
    activated () {
      this.reload(false)
    },

    /** 每次退出页面时 */
    deactivated () {
      console.debug('activated()')
    },

    /** 本页面可用的方法 */
    methods: {
      reload (showMsg) {

        const that = this
        myUtil.ajax(apiUrl.commonRuntime.runtimeHistory, {}, function (res) {
          that.onDataLoad(res.list)
          that.updateDiskInfo(res.diskInfo)

          if (showMsg) {
            myUtil.showMsg('刷新成功')
          }
        })
      },

      /** 更新硬盘信息 */
      updateDiskInfo (info) {
        let used = info.totalSpace - info.usableSpace

        if (info.totalSpace > 0) {
          this.diskInfo.percent = Number.parseFloat((used * 100 / info.totalSpace).toFixed(2))
        } else {
          this.diskInfo.percent = 0
        }

        this.diskInfo.total = myUtil.toSizeStr(info.totalSpace)
        this.diskInfo.used = myUtil.toSizeStr(used)
        this.diskInfo.free = myUtil.toSizeStr(info.usableSpace)
      },

      /** 更新图表信息 */
      onDataLoad (list) {
        const labels = [] // 时间轴

        const totalMemory = [] // 已分配内存
        const usedMemory = [] // 已经使用的内存
        const cpuJvm = [] // JVM负载
        const thread = [] // 线程
        const action = [] // http动态请求数
        const wsCountUp = [] // ws请求数
        const wsCountDown = [] // ws发送次数
        const wsPayloadUp = [] // ws上行流行
        const wsPayloadDown = [] // ws下行流量

        for (let row of list) {
          // 时间轴数据
          labels.push(myUtil.timeFormat(row.recordTime, 'hh:mm:ss'))

          // 内存图表的数据
          totalMemory.push(chartHelper.toMemoryM(row.memory.totalMemory))
          usedMemory.push(chartHelper.toMemoryM(row.memory.usedMemory))

          // CPU 图表
          cpuJvm.push(Math.round(row.processCpuLoad * 100) / 100)

          thread.push(row.threadCount) // 线程
          action.push(row.actionCount) // http动态请求数
          wsCountUp.push(row.wsUpCount)  // ws请求数
          wsCountDown.push(row.wsUpCount) // ws发送次数
          wsPayloadUp.push(this.sizeToK(row.wsUpPayload)) // ws上行流行
          wsPayloadDown.push(this.sizeToK(row.wsDownPayload)) // ws下行流量
        }

        this.updateMemoryChart(labels, totalMemory, usedMemory) // 更新内存图
        this.updateCpuChart(labels, cpuJvm) // 更新cpu图
        this.updateThreadChart(labels, thread) // 更新线程图
        this.updateActionChart(labels, action) // 更新动态请求图

        if (this.hasWsApiImpl) {
          this.updateWsCountChart(labels, wsCountUp, wsCountDown) // 更新ws次数
          this.updateWsPayloadChart(labels, wsPayloadUp, wsPayloadDown) // 更新ws流量
        }
      },

      /** 更新ws 次数图表 */
      updateWsCountChart (labels, data0, data1) {
        const chartData = this.wsCountChart.data
        chartData.datasets[0].data = data0
        chartData.datasets[1].data = data1
        chartData.labels = labels

        this.$refs.wsCountChart.updateChart()
      },
      /** 更新ws 流量图表 */
      updateWsPayloadChart (labels, data0, data1) {
        const chartData = this.wsPayloadChart.data
        chartData.datasets[0].data = data0
        chartData.datasets[1].data = data1
        chartData.labels = labels

        this.$refs.wsPayloadChart.updateChart()
      },

      /** 更新线程图表 */
      updateActionChart (labels, data0) {
        const chartData = this.actionChart.data
        chartData.datasets[0].data = data0
        chartData.labels = labels

        this.$refs.actionChart.updateChart()
      },

      /** 更新线程图表 */
      updateThreadChart (labels, data0) {
        const chartData = this.threadChart.data
        chartData.datasets[0].data = data0
        chartData.labels = labels

        this.$refs.threadChart.updateChart()
      },

      /** 更新cpu图表 */
      updateCpuChart (labels, data0) {
        const chartData = this.cpuChart.data
        chartData.datasets[0].data = data0
        chartData.labels = labels

        this.$refs.cpuChart.updateChart()
      },

      /** 更新内存图表 */
      updateMemoryChart (labels, totalMemory, usedMemory) {
        const chartData = this.memoryChart.data
        chartData.datasets[0].data = totalMemory
        chartData.datasets[1].data = usedMemory
        chartData.labels = labels

        this.$refs.memoryChart.updateChart()
      },

      sizeToK (size) {
        return (size / 1024).toFixed(2)
      },
    },
  }
</script>
