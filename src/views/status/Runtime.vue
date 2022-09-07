<template>
    <div>
        <div class="article-header">
            <div>
                {{this.$route.meta.title}}
            </div>
            <!-- 自动刷新按钮 -->
            <auto-refresh :fixed="false" @refresh="reload"></auto-refresh>
        </div>

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
        <br/>

        <template v-if="hasSendPacketData">
            <el-row :gutter="10" class="mt-10">
                <el-col :span="12">
                    <!-- 发包 次数-->
                    <line-chart
                            ref="sendPacketCountChart"
                            avg-post-fix="个 "
                            :show-avg="true"
                            :chartData="sendPacketCountChart.data"
                            :chartOptions="sendPacketCountChart.options">
                    </line-chart>
                </el-col>
                <el-col :span="12">
                    <!-- 发包 流量-->
                    <line-chart
                            ref="sendPacketPayloadChart"
                            avg-post-fix="KB "
                            :show-avg="true"
                            :chartData="sendPacketPayloadChart.data"
                            :chartOptions="sendPacketPayloadChart.options">
                    </line-chart>
                </el-col>
            </el-row>
            <br/>
        </template>

        <el-row :gutter="10" class="mt-10">
            <el-col :span="12">
                <!-- 线程图-->
                <line-chart
                        ref="threadChart"
                        :chartData="threadChart.data"
                        :chartOptions="threadChart.options">
                </line-chart>
            </el-col>
        </el-row>
        <br/>

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
</template>

<script>
    import apiUrl from '../../ApiUrl'
    import myUtil from '../../util/MyUtils'
    import chartHelper from '../../util/ChartHelper'
    import LineChart from '../../components/LineCharts'
    import serverContext from '../../util/ServerContext'

    export default {

        components: {
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

                    if (showMsg) {
                        myUtil.showMsg('刷新成功')
                    }
                })
            },

            /** 更新图表信息 */
            onDataLoad(list) {
                chartHelper.onDataLoad(list) // 更新数据

                if (this.hasWsApiImpl) {
                    /** 更新ws 次数图表 */
                    this.$refs.wsCountChart.updateChart()
                    /** 更新ws 流量图表 */
                    this.$refs.wsPayloadChart.updateChart()
                }

                if (this.hasSendPacketData) {
                    /** 更新发包数量图表 */
                    this.$refs.sendPacketCountChart.updateChart()
                    /** 更新发包流量图表 */
                    this.$refs.sendPacketPayloadChart.updateChart()
                }

                /** 更新线程图表 */
                this.$refs.threadChart.updateChart()
                /** 更新cpu图表 */
                this.$refs.cpuChart.updateChart()
                /** 更新内存图表 */
                this.$refs.memoryChart.updateChart()

            },
        }
    }
</script>
