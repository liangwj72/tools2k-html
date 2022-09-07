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

                // 动态请求图表
                actionChart: {
                    data: chartHelper.actionChart.data,
                    options: chartHelper.actionChart.options,
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
                chartHelper.onDataLoad(list) // 更新数据
                this.$refs.actionChart.updateChart() // 更新动态请求图
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
