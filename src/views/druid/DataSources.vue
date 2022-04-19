<template>
    <div>
        <div class="article-header">
            <div>
                {{this.$route.meta.title}}
            </div>

            <!-- 重置计数器按钮 -->
            <comp-reset-druid @refresh="reloadSqlList"></comp-reset-druid>

            <auto-refresh
                    :fixed="false"
                    :timer="false"
                    @refresh="reloadSqlList"/>

        </div>

        <el-tabs :value.sync="activeTab"
                 @tab-click="onTabClick">
            <el-tab-pane
                    v-for="(row,index) in list"
                    :key="index"
                    :name="''+row.Identity"
                    :label="row.DbType + '-' + row.Identity">

                <!-- 数据源的基础信息 -->
                <el-card class="small-header">
                    <template slot="header">
                        <div>数据源信息</div>
                    </template>

                    <el-form class="info-form"
                             labelPosition="left"
                             label-width="120px">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="用户名:" class="text-caption">{{row.UserName}}</el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="类型:" class="text-caption">{{row.DbType}}</el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="url:" class="text-caption">{{row.URL}}</el-form-item>
                    </el-form>
                </el-card>
                <!-- /数据源的基础信息 -->

                <!-- 该数据源的sql -->
                <el-table border
                          size="small"
                          :data="sqlList">
                    <el-table-column :show-overflow-tooltip="true"
                                     label="sql">
                        <template slot-scope="scope">
                            <el-button type="text" @click="viewSql(scope.row)">
                                {{scope.row.SQL}}
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="执行数"
                            sortable align="right" width="105px"
                            prop="ExecuteCount"/>
                    <el-table-column
                            label="执行时间"
                            sortable align="right" width="105px"
                            prop="TotalTime"/>
                    <el-table-column
                            label="最慢"
                            sortable align="right" width="105px"
                            prop="MaxTimespan"/>
                    <el-table-column
                            label="更新行数"
                            sortable align="right" width="105px"
                            prop="EffectedRowCount"/>
                    <el-table-column
                            label="读取行数"
                            sortable align="right" width="105px"
                            prop="FetchRowCount"/>
                </el-table>
                <!-- /该数据源的sql -->
            </el-tab-pane>
        </el-tabs>

        <!-- sql详情 -->
        <el-drawer title="sql详情"
                   :visible.sync="detail.visible"
                   size="900px">
            <el-card class="article-small-card">
                <template slot="header">
                    <div>SQL详情</div>
                </template>

                <el-input type="textarea"
                          readonly
                          size="medium"
                          :autosize="{ minRows: 2, maxRows: 10 }"
                          v-model="detail.sql.SQL"/>
            </el-card>

            <el-card class="article-small-card">
                <template slot="header">
                    <div>执行时间</div>
                </template>

                <el-form labelPosition="left"
                         label-width="100px">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="执行次数:" class="text-caption">
                                {{detail.sql.ExecuteCount}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="总执行时间:" class="text-caption">
                                {{detail.sql.TotalTime}} 毫秒
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="最长执行时间:" class="text-caption">
                                {{detail.sql.MaxTimespan}} 毫秒
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <bar-chart
                            title="SQL执行时间"
                            :color="sqlTimeChart.color"
                            :labels="sqlTimeChart.labels"
                            :xdata="sqlTimeChart.data"/>
                </el-form>
            </el-card>

            <el-card class="article-small-card">
                <template slot="header">
                    <div>执行时间</div>
                </template>

                <el-form labelPosition="left"
                         label-width="100px">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="更新行数:" class="text-caption">
                                {{detail.sql.EffectedRowCount}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="读取行数:" class="text-caption">
                                {{detail.sql.FetchRowCount}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <bar-chart
                            title="读取行分布"
                            :color="fetchRowChart.color"
                            :labels="fetchRowChart.labels"
                            :xdata="fetchRowChart.data"/>
                    <bar-chart
                            title="更新行分布"
                            :color="effectedRowChart.color"
                            :labels="effectedRowChart.labels"
                            :xdata="effectedRowChart.data"/>

                </el-form>
            </el-card>

        </el-drawer>
        <!-- /sql详情 -->
    </div>
</template>

<script>
    import apiUrl from '../../ApiUrl'
    import jsLib from '@gztree/jslib'
    import sqlFormatter from 'sql-formatter'
    import BarChart from '../../components/BarCharts'
    import CompResetDruid from './CompResetDruid'

    export default {

        /** 本页面用到的组件 */
        components: {
            BarChart,
            CompResetDruid,
        },

        /** 组件的属性，只有是组件的时候才有用 */
        props: {},

        /** 本页面的属性 */
        data() {
            return {
                list: [],

                activeTab: '',//激活的tab的name，值是datasource的id

                sqlTimeChart: {
                    color: '#5CB85C',
                    data: [],
                    labels: [
                        '0-1毫秒',
                        '1-10毫秒',
                        '10-100毫秒',
                        '100-1000毫秒',
                        '1-10秒次数',
                        '10-100秒',
                        '100-1000秒',
                        '大于1000秒',
                    ],
                },
                effectedRowChart: {
                    color: '#5BC0DE',
                    data: [],
                    labels: [
                        '更新行数为0',
                        '更新行数1-9',
                        '更新行数10-99',
                        '更新行数100-999',
                        '更新行数1000-9999',
                        '更新行数大于9999',
                    ],
                },
                fetchRowChart: {
                    color: '#9418de',
                    data: [],
                    labels: [
                        '读取行数为0',
                        '读取行数1-9',
                        '读取行数10-99',
                        '读取行数100-999',
                        '读取行数1000-9999',
                        '读取行数大于9999',
                    ],
                },

                // 当前查看的sql
                detail: {
                    visible: false,
                    id: '',
                    sql: {
                        'ExecuteAndResultSetHoldTime': 280,
                        'EffectedRowCountHistogram': [1, 0, 0, 0, 0, 0],
                        'Histogram': [0, 0, 0, 1, 0, 0, 0, 0],
                        'InputStreamOpenCount': 0,
                        'BatchSizeTotal': 0,
                        'FetchRowCountMax': 1,
                        'ErrorCount': 0,
                        'BatchSizeMax': 0,
                        'ReaderOpenCount': 0,
                        'EffectedRowCountMax': 0,
                        'InTransactionCount': 0,
                        'ResultSetHoldTime': 13,
                        'TotalTime': 266,
                        'ID': 1,
                        'ConcurrentMax': 1,
                        'RunningCount': 0,
                        'FetchRowCount': 1,
                        'MaxTimespanOccurTime': 1609213373382,
                        'ReadBytesLength': 0,
                        'DbType': 'oracle',
                        SQL: 'SELECT     ZD.ZDDM, ZD.ZL, ZD.ZDMJ, ZD.ZDSZD, ZD.ZDSZN, ZD.ZDSZX, ZD.ZDSZB, ZD.TFH,    ZD.RJL, ZD.JZMD, ZD.JZXG, ZD.QXMC, ZD.DJQMC, ZD.DJZQMC, ZD.BZ,     (SELECT Z.ZSBH FROM BDCK.BDCS_ZS_GZ Z         INNER JOIN BDCK.BDCS_QDZR_XZ L ON Z.ZSID = L.ZSID         INNER JOIN BDCK.BDCS_QL_XZ Q ON L.QLID = Q.QLID         INNER JOIN BDCK.BDCS_DJDY_XZ D ON Q.QLLX = \'3\'  AND Q.DJDYID = D.DJDYID         WHERE  D.BDCDYID = ZD.BDCDYID ) TDZBH,     ( SELECT LISTAGG ( TO_CHAR ( TDYTMC ), \',\' ) within GROUP ( ORDER BY 1 )         FROM BDCK.BDCS_TDYT_LS WHERE BDCDYID = zd.bdcdyid ) TDYT,     ( SELECT CONSTTRANS FROM BDCK.BDCS_CONST         WHERE CONSTSLSID = \'9\' AND CONSTVALUE = zd.qlxz ) SYQZL,     CASE WHEN EXISTS ( SELECT BDCDYID FROM BDCK.BDCS_H_XZ         WHERE ZDBDCDYID = ZD.BDCDYID         UNION ALL SELECT BDCDYID FROM BDCK.BDCS_H_XZY WHERE ZDBDCDYID = ZD.BDCDYID)         THEN \'有房屋\' ELSE \'无房屋\' END FWZT, CASE WHEN EXISTS (SELECT qlid             FROM BDCK.BDCS_QL_XZ Q             INNER JOIN BDCK.BDCS_DJDY_XZ D ON Q.QLLX = \'23\' AND Q.QLID = D.DJDYID             WHERE D.BDCDYID = ZD.BDCDYID )         THEN \'有抵押\' ELSE \'无抵押\' END TDDYZT FROM BDCK.BDCS_SHYQZD_XZ ZD     WHERE  ZDDM = ?',
                        'HASH': 216127831708071550,
                        'MaxTimespan': 266,
                        'BlobOpenCount': 0,
                        'ExecuteCount': 1,
                        'EffectedRowCount': 0,
                        'ReadStringLength': 129,
                        'ExecuteAndResultHoldTimeHistogram': [1, 0, 0, 0, 0, 0, 0, 0],
                        'ClobOpenCount': 0,
                        'LastTime': 1609213373115,
                        'FetchRowCountHistogram': [0, 1, 0, 0, 0, 0],
                    },
                },

                sqlList: [],
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
            reload() {
                jsLib.ajax.post(apiUrl.commonDurid.getDatasources, {}).then((res) => {
                    // console.debug("获取了Druid连接池的数据源信息", res.list)
                    this.list = res.list
                    if (res.list.length > 0) {
                        this.activeTab = '' + res.list[0].Identity
                        this.detail.id = this.activeTab
                        this.reloadSqlList()
                    }
                })
            },

            /** 重新加载 数据源的sql */
            reloadSqlList() {
                console.debug('reloadSqlList', this.detail.id)
                jsLib.ajax.post(apiUrl.commonDurid.getSqlByDatasourceId, {id: this.detail.id}).then((res) => {
                    // console.debug(`获取了Druid连接池的数据源 ${this.activeTab} 的sql列表`, res.list)
                    this.sqlList = res.list
                })
            },

            onTabClick(tabObj) {
                console.debug('onTabClick', tabObj.name)
                this.detail.id = tabObj.name
                this.reloadSqlList()
            },

            /** 查看sql详情 */
            viewSql(row) {
                // console.debug('查看sql', row.Histogram)
                this.detail.sql = row
                this.detail.sql.SQL = sqlFormatter.format(row.SQL)

                this.sqlTimeChart.data = row.Histogram
                this.effectedRowChart.data = row.EffectedRowCountHistogram
                this.fetchRowChart.data = row.FetchRowCountHistogram

                this.detail.visible = true
            },
        },

    }
</script>
