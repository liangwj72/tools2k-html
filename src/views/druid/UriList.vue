<template>
    <div>
        <div class="article-header">
            <div>
                {{this.$route.meta.title}}
            </div>

            <!-- 重置计数器按钮 -->
            <comp-reset-druid @refresh="reload"></comp-reset-druid>

            <!-- 刷新按钮 -->
            <auto-refresh
                    :fixed="false"
                    :timer="false"
                    @refresh="reload"/>

        </div>
        <!-- 列表 -->
        <div class="article-container">
            <el-table border
                      size="small"
                      :data="uriList">
                <el-table-column
                        sortable
                        prop="URI"
                        :show-overflow-tooltip="true"
                        label="URI">
                    <template slot-scope="scope">
                        <el-button type="text" @click="viewDetail(scope.row)">
                            {{scope.row.URI}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        label="sql执行数"
                        sortable align="right" width="110px"
                        prop="JdbcExecuteCount">
                    <template slot-scope="scope">
                        {{scope.row.JdbcExecuteCount | noZero}}
                    </template>
                </el-table-column>

                <el-table-column
                        label="请求次数"
                        sortable align="right" width="105px"
                        prop="RequestCount"/>
                <el-table-column
                        label="合计时长"
                        sortable align="right" width="105px"
                        prop="RequestTimeMillis"/>
                <el-table-column
                        label="请求最慢"
                        sortable align="right" width="105px"
                        prop="RequestTimeMillisMax"/>
                <el-table-column
                        sortable align="right" width="180px"
                        label="最后访问">
                    <template slot-scope="scope">
                        {{scope.row.RequestTimeMillisMaxOccurTime | timeFormat}}
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- /列表 -->

        <!-- sql详情 -->
        <el-drawer title="详情"
                   :visible.sync="detail.visible"
                   size="900px">
            <el-card class="article-small-card">
                <el-form labelPosition="left"
                         label-width="150px">
                    <el-form-item label="URL:" class="text-caption">
                        {{detail.data.URI}}
                    </el-form-item>
                    <el-form-item label="请求次数:" class="text-caption">
                        {{detail.data.RequestCount | noZero}}
                        <bar-chart
                                title="时长分布"
                                :labels="timeChart.labels"
                                :xdata="timeChart.data"/>
                    </el-form-item>
                    <el-form-item label="合计时长:" class="text-caption">
                        {{detail.data.RequestTimeMillis | noZero}}
                    </el-form-item>
                    <el-form-item label="请求最慢:" class="text-caption">
                        {{detail.data.RequestTimeMillisMax | noZero}}
                    </el-form-item>
                    <el-form-item label="最后访问时间:" class="text-caption">
                        {{detail.data.LastAccessTime | timeFormat}}
                    </el-form-item>
                    <el-form-item label="执行中:" class="text-caption">
                        {{detail.data.RunningCount | noZero}}
                    </el-form-item>
                    <el-form-item label="最大并发:" class="text-caption">
                        {{detail.data.ConcurrentMax | noZero}}
                    </el-form-item>
                    <el-form-item label="Sql执行数:" class="text-caption">
                        {{detail.data.JdbcExecuteCount | noZero}}
                    </el-form-item>
                    <el-form-item label="Sql出错数:" class="text-caption">
                        {{detail.data.ErrorCount | noZero}}
                    </el-form-item>
                    <el-form-item label="Sql执行峰值:" class="text-caption">
                        {{detail.data.JdbcExecutePeak | noZero}}
                    </el-form-item>
                    <el-form-item label="Sql时间:" class="text-caption">
                        {{detail.data.JdbcExecuteTimeMillis | noZero}}
                    </el-form-item>
                    <el-form-item label="事务提交数:" class="text-caption">
                        {{detail.data.JdbcCommitCount | noZero}}
                    </el-form-item>
                    <el-form-item label="事务回滚数:" class="text-caption">
                        {{detail.data.JdbcRollbackCount | noZero}}
                    </el-form-item>
                    <el-form-item label="Sql查询取回行数:" class="text-caption">
                        {{detail.data.JdbcFetchRowCount | noZero}}
                    </el-form-item>
                    <el-form-item label="Sql查询取回行数峰值:" class="text-caption">
                        {{detail.data.JdbcFetchRowPeak | noZero}}
                    </el-form-item>
                    <el-form-item label="Sql更新行数:" class="text-caption">
                        {{detail.data.JdbcUpdateCount | noZero}}
                    </el-form-item>
                    <el-form-item label="Sql更新峰值:" class="text-caption">
                        {{detail.data.JdbcUpdatePeak | noZero}}
                    </el-form-item>
                    <el-form-item label="连接池获取连接次数:" class="text-caption">
                        {{detail.data.JdbcPoolConnectionOpenCount | noZero}}
                    </el-form-item>
                    <el-form-item label="连接池关闭连接次数:" class="text-caption">
                        {{detail.data.JdbcPoolConnectionCloseCount | noZero}}
                    </el-form-item>
                    <el-form-item label="ResultSet打开次数:" class="text-caption">
                        {{detail.data.JdbcResultSetOpenCount | noZero}}
                    </el-form-item>
                    <el-form-item label="ResultSet关闭次数:" class="text-caption">
                        {{detail.data.JdbcResultSetCloseCount | noZero}}
                    </el-form-item>
                </el-form>
            </el-card>
        </el-drawer>
    </div>
</template>

<script>
    import apiUrl from '../../ApiUrl'
    import jsLib from '@/jslib'
    import BarChart from '../../components/BarCharts.vue'
    import CompResetDruid from './CompResetDruid.vue'

    export default {

        /** 本页面用到的组件 */
        components: {CompResetDruid, BarChart},

        /** 组件的属性，只有是组件的时候才有用 */
        props: {},

        /** 本页面的属性 */
        data() {
            return {
                // 列表
                uriList: [],

                timeChart: {
                    color: '#5BC0DE',
                    data: [],
                    labels: [
                        '0-1毫秒次数',
                        '1-10毫秒次数',
                        '10-100毫秒次数',
                        '100-1000毫秒次数',
                        '1-10秒次数',
                        '10-100秒次数',
                        '100-1000秒次数',
                        '大于1000秒次数',
                    ],
                },

                detail: { // 详情
                    visible: false,
                    data: [],
                },
            }
        },

        /** 计算属性 */
        computed: {},

        /** 构建页面时 */
        mounted() {
        },

        /** 每次进入页面时 */
        activated() {
            this.reload()
        },

        /** 本页面可用的方法 */
        methods: {
            /** 刷新数据 */
            reload() {
                jsLib.ajax.post(apiUrl.commonDurid.getWebUris, {}).then(res => {
                    this.uriList = res.list
                    // if (res.list.length > 0) {
                    //   开发时测试用
                    //   this.detail.data = res.list[0]
                    // }
                    // console.debug('获取了uri监控数据', this.detail.data)
                })
            },

            resetAll() {
                console.debug('点击了重置计数器按钮')
                jsLib.ajax.post(apiUrl.commonDurid.resetAll, {}).then(() => {
                    this.reload()
                })
            },

            /** 查看详情 */
            viewDetail(row) {
                this.detail.data = row
                this.detail.visible = true
                this.timeChart.data = row.Histogram
            },
        },
    }
</script>
