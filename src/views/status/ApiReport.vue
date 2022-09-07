<template>
    <div>
        <div class="article-header">
            <div>
                {{this.$route.meta.title}}
            </div>
            <!-- 自动刷新按钮 -->
            <auto-refresh :fixed="false" @refresh="reload"></auto-refresh>
        </div>

        <el-row :gutter="10">
            <el-col :span="12">
                <div class="flex-container">
                    <el-card class="hor-space10">
                        <el-progress
                                :width="150"
                                :stroke-width="20"
                                type="dashboard"
                                :percentage="diskInfo.percent"></el-progress>
                        <div>
                            硬盘空间: <span class="text-caption">{{diskInfo.total}}</span>
                        </div>
                    </el-card>
                    <br/>
                    <el-card class="full-body flex1">
                        <el-table
                                size="mini"
                                :data="uriStat">
                            <el-table-column label="消耗时长">
                                <template slot-scope="scope">
                                    <el-button
                                            type="text"
                                            @click="showUriStatDetail(scope.row)">
                                        {{scope.row.timeRangeMin}}
                                        <span v-if="scope.row.timeRangeMax>0"> - {{scope.row.timeRangeMax}} </span>
                                    </el-button>
                                </template>
                            </el-table-column>

                            <el-table-column label="次数">
                                <template slot-scope="scope">
                                    {{scope.row.count}}
                                </template>
                            </el-table-column>

                            <el-table-column
                                    width="200px"
                                    label="占比">
                                <template slot-scope="scope">
                                    <el-progress
                                            :stroke-width="10"
                                            :showText="false"
                                            :percentage="scope.row.percent"></el-progress>
                                </template>
                            </el-table-column>

                        </el-table>
                    </el-card>
                </div>
            </el-col>
            <el-col :span="12">
                <el-card>
                    <bar-chart
                            ref="uriStatChart"
                            title="Uri时长分布"
                            :labels="uriStatChart.labels"
                            :xdata="uriStatChart.data"/>
                </el-card>
            </el-col>
        </el-row>
        <br/>

        <el-row :gutter="10" class="mt-10">
            <el-col :span="12">
                <!-- 动态请求-->
                <line-chart
                        ref="actionChart"
                        :chartData="actionChart.data"
                        :chartOptions="actionChart.options">
                </line-chart>
            </el-col>
        </el-row>
        <br/>
        <comp-uri-detail/>
    </div>
</template>

<script>
    import apiUrl from '../../ApiUrl'
    import myUtil from '../../util/MyUtils'
    import chartHelper from '../../util/ChartHelper'
    import LineChart from '../../components/LineCharts'
    import serverContext from '../../util/ServerContext'
    import eventBus from '@/event-bus'
    import CompUriDetail from './CompUriDetail'
    import BarChart from '../../components/BarCharts'
    import MyUtils from '../../util/MyUtils'

    export default {

        components: {
            BarChart,
            CompUriDetail,
            LineChart,
        },

        /** 组件的属性，只有是组件的时候才有用 */
        props: {},

        /** 本页面的属性 */
        data() {
            return {
                hasWsApiImpl: serverContext.serverInfo.hasWsApiImpl,
                hasSendPacketData: serverContext.serverInfo.hasSendPacketData,

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

                // 发包次数
                sendPacketCountChart: {
                    data: chartHelper.sendPacketCountChart.data,
                    options: chartHelper.sendPacketCountChart.options,
                },

                // 发包流量
                sendPacketPayloadChart: {
                    data: chartHelper.sendPacketPayloadChart.data,
                    options: chartHelper.sendPacketPayloadChart.options,
                },

                // 时长段范围统计
                uriStatChart: {
                    labels: [],
                    data: [],
                },

                diskInfo: {
                    total: '',
                    used: '',
                    free: '',

                    percent: 1,
                },

                uriStat: [], // 时长段范围统计
            }
        },

        /** 计算属性 */
        computed: {},

        /** 每次进入页面时 */
        activated() {
            this.reload(false)
        },

        /** 每次退出页面时 */
        deactivated() {
            console.debug('activated()')
        },

        /** 本页面可用的方法 */
        methods: {
            reload(showMsg) {

                const that = this
                myUtil.ajax(apiUrl.commonRuntime.runtimeHistory, {}, function (res) {
                    that.onDataLoad(res.list)
                    that.updateDiskInfo(res.diskInfo)
                    that.updateUirStat(res.uriStat)

                    if (showMsg) {
                        myUtil.showMsg('刷新成功')
                    }
                })
            },

            updateUirStat(uriStat) {
                let total = 0
                let labels = []
                let data = []
                uriStat.forEach(row => {
                    total += row.count
                    if (row.timeRangeMax > 0) {
                        labels.push(`${row.timeRangeMin}-${row.timeRangeMax}毫秒`)
                    } else {
                        labels.push(`大于${row.timeRangeMin}`)
                    }
                    data.push(row.count)
                })
                // this.uriStatChart.labels = labels
                // this.uriStatChart.data = data

                this.$refs.uriStatChart.updateChart(labels, data)

                uriStat.forEach(row => {
                    row.percent = (total > 0) ? myUtil.percent2num(row.count * 100 / total) : 0
                })
                this.uriStat = uriStat
                console.debug('uri访问时长段统计:', this.uriStatChart)
            },

            /** 更新硬盘信息 */
            updateDiskInfo(info) {
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
            onDataLoad(list) {
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
                const sendPacketCount = [] // 发包数
                const sendPacketPayload = [] // 发包流量

                for (let row of list) {
                    // 时间轴数据
                    labels.push(myUtil.timeFormat(row.recordTime, 'hh:mm:ss'))

                    // 内存图表的数据
                    totalMemory.push(MyUtils.toMemoryM(row.memory.totalMemory))
                    usedMemory.push(MyUtils.toMemoryM(row.memory.usedMemory))

                    // CPU 图表
                    cpuJvm.push(Math.round(row.processCpuLoad * 100) / 100)

                    thread.push(row.threadCount) // 线程
                    action.push(row.actionCount) // http动态请求数
                    wsCountUp.push(row.wsUpCount)  // ws请求数
                    wsCountDown.push(row.wsUpCount) // ws发送次数
                    wsPayloadUp.push(this.sizeToK(row.wsUpPayload)) // ws上行流行
                    wsPayloadDown.push(this.sizeToK(row.wsDownPayload)) // ws下行流量
                    sendPacketCount.push(row.sendPacketCount) // 发包数量
                    sendPacketPayload.push(this.sizeToK(row.sendPacketPayload / 10)) // 发包流量
                }

                this.updateMemoryChart(labels, totalMemory, usedMemory) // 更新内存图
                this.updateCpuChart(labels, cpuJvm) // 更新cpu图
                this.updateThreadChart(labels, thread) // 更新线程图
                this.updateActionChart(labels, action) // 更新动态请求图

                if (this.hasWsApiImpl) {
                    this.updateWsCountChart(labels, wsCountUp, wsCountDown) // 更新ws次数
                    this.updateWsPayloadChart(labels, wsPayloadUp, wsPayloadDown) // 更新ws流量
                }

                if (this.hasSendPacketData) {
                    this.updateSendPacketCountChart(labels, sendPacketCount) // 发包数量
                    this.updateSendPacketPayloadChart(labels, sendPacketPayload) // 发包流量
                }

            },

            /** 更新ws 次数图表 */
            updateWsCountChart(labels, data0, data1) {
                const chartData = this.wsCountChart.data
                chartData.datasets[0].data = data0
                chartData.datasets[1].data = data1
                chartData.labels = labels

                this.$refs.wsCountChart.updateChart()
            },
            /** 更新ws 流量图表 */
            updateWsPayloadChart(labels, data0, data1) {
                const chartData = this.wsPayloadChart.data
                chartData.datasets[0].data = data0
                chartData.datasets[1].data = data1
                chartData.labels = labels

                this.$refs.wsPayloadChart.updateChart()
            },

            /** 更新线程图表 */
            updateActionChart(labels, data0) {
                const chartData = this.actionChart.data
                chartData.datasets[0].data = data0
                chartData.labels = labels

                this.$refs.actionChart.updateChart()
            },

            /** 更新发包数量图表 */
            updateSendPacketCountChart(labels, data0) {
                const chartData = this.sendPacketCountChart.data
                chartData.datasets[0].data = data0
                chartData.labels = labels

                this.$refs.sendPacketCountChart.updateChart()
            },

            /** 更新发包流量图表 */
            updateSendPacketPayloadChart(labels, data0) {
                const chartData = this.sendPacketPayloadChart.data
                chartData.datasets[0].data = data0
                chartData.labels = labels

                this.$refs.sendPacketPayloadChart.updateChart()
            },

            /** 更新线程图表 */
            updateThreadChart(labels, data0) {
                const chartData = this.threadChart.data
                chartData.datasets[0].data = data0
                chartData.labels = labels

                this.$refs.threadChart.updateChart()
            },

            /** 更新cpu图表 */
            updateCpuChart(labels, data0) {
                const chartData = this.cpuChart.data
                chartData.datasets[0].data = data0
                chartData.labels = labels

                this.$refs.cpuChart.updateChart()
            },

            /** 更新内存图表 */
            updateMemoryChart(labels, totalMemory, usedMemory) {
                const chartData = this.memoryChart.data
                chartData.datasets[0].data = totalMemory
                chartData.datasets[1].data = usedMemory
                chartData.labels = labels

                this.$refs.memoryChart.updateChart()
            },

            sizeToK(size) {
                return (size / 1024).toFixed(2)
            },

            /**
             * 查看url时长统计详情
             * @param id
             */
            showUriStatDetail(row) {
                console.debug(`查看uri时长统计详情:id=${row.id}`)
                eventBus.showUriStatDetail(row)
            },

        },
    }
</script>
