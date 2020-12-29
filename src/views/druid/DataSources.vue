<template>
  <div>
    <el-tabs type="border-card"
             :value="activeTab"
             @tab-click="onTabClick">
      <el-tab-pane
        v-for="(row,index) in list"
        :key="index"
        :name="''+row.Identity"
        :label="row.Name">
        <el-card class="article-small-card">
          <template slot="header" class="clearfix">
            <div>数据库连接池基础信息</div>
          </template>
          <el-form labelPosition="left"
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

        <el-table
          :data="sql.sqlList">
          <el-table-column
            :show-overflow-tooltip="true"
            label="sql">
            <template slot-scope="scope">
              {{scope.row.SQL}}
            </template>

          </el-table-column>
          <el-table-column
            label="执行数"
            prop="ExecuteCount"/>
        </el-table>

      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import apiUrl from '../../ApiUrl'
  import jsLib from '@nnland/jslib'
  import sqlFormatter from 'sql-formatter'

  export default {

    /** 本页面用到的组件 */
    components: {},

    /** 组件的属性，只有是组件的时候才有用 */
    props: {},

    /** 本页面的属性 */
    data() {
      return {
        list: [
          {
            "Identity": 947982595,
            "Name": "DataSource-947982595",
            "DbType": "oracle",
            "DriverClassName": "oracle.jdbc.OracleDriver",
            "URL": "jdbc:oracle:thin:@172.16.3.68:21521/test_nnbdc_gbk",
            "UserName": "bdck",
            "FilterClassNames": [
              "com.alibaba.druid.filter.stat.StatFilter"
            ],
            "WaitThreadCount": 0,
            "NotEmptyWaitCount": 1,
            "NotEmptyWaitMillis": 0,
            "PoolingCount": 0,
            "PoolingPeak": 1,
            "PoolingPeakTime": 1609200521641,
            "ActiveCount": 0,
            "ActivePeak": 1,
            "ActivePeakTime": 1609200521644,
            "InitialSize": 0,
            "MinIdle": 0,
            "MaxActive": 8,
            "QueryTimeout": 0,
            "TransactionQueryTimeout": 0,
            "LoginTimeout": 0,
            "ValidConnectionCheckerClassName": "com.alibaba.druid.pool.vendor.OracleValidConnectionChecker",
            "ExceptionSorterClassName": "com.alibaba.druid.pool.vendor.OracleExceptionSorter",
            "TestOnBorrow": true,
            "TestOnReturn": false,
            "TestWhileIdle": true,
            "DefaultAutoCommit": true,
            "LogicConnectCount": 1,
            "LogicCloseCount": 1,
            "LogicConnectErrorCount": 0,
            "PhysicalConnectCount": 1,
            "PhysicalCloseCount": 1,
            "PhysicalConnectErrorCount": 0,
            "DiscardCount": 0,
            "ExecuteCount": 0,
            "ExecuteUpdateCount": 0,
            "ExecuteQueryCount": 0,
            "ExecuteBatchCount": 0,
            "ErrorCount": 0,
            "CommitCount": 0,
            "RollbackCount": 0,
            "PSCacheAccessCount": 0,
            "PSCacheHitCount": 0,
            "PSCacheMissCount": 0,
            "StartTransactionCount": 0,
            "TransactionHistogram": [
              0,
              0,
              0,
              0,
              0,
              0,
              0
            ],
            "ConnectionHoldTimeHistogram": [
              0,
              0,
              0,
              1,
              0,
              0,
              0,
              0
            ],
            "RemoveAbandoned": false,
            "ClobOpenCount": 0,
            "BlobOpenCount": 0,
            "KeepAliveCheckCount": 0,
            "KeepAlive": false,
            "FailFast": false,
            "MaxWait": -1,
            "MaxWaitThreadCount": -1,
            "PoolPreparedStatements": false,
            "MaxPoolPreparedStatementPerConnectionSize": 10,
            "MinEvictableIdleTimeMillis": 1800000,
            "MaxEvictableIdleTimeMillis": 25200000,
            "LogDifferentThread": true,
            "RecycleErrorCount": 0,
            "PreparedStatementOpenCount": 0,
            "PreparedStatementClosedCount": 0,
            "UseUnfairLock": true,
            "InitGlobalVariants": false,
            "InitVariants": false
          }
        ],

        activeTab: '',

        sql: {
          id: '',
          sqlList: [
            {
              "ExecuteAndResultSetHoldTime": 280,
              "EffectedRowCountHistogram": [
                1,
                0,
                0,
                0,
                0,
                0
              ],
              "Histogram": [
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                0
              ],
              "InputStreamOpenCount": 0,
              "BatchSizeTotal": 0,
              "FetchRowCountMax": 1,
              "ErrorCount": 0,
              "BatchSizeMax": 0,
              "ReaderOpenCount": 0,
              "EffectedRowCountMax": 0,
              "InTransactionCount": 0,
              "ResultSetHoldTime": 13,
              "TotalTime": 266,
              "ID": 1,
              "ConcurrentMax": 1,
              "RunningCount": 0,
              "FetchRowCount": 1,
              "MaxTimespanOccurTime": 1609213373382,
              "ReadBytesLength": 0,
              "DbType": "oracle",
              "SQL": "SELECT     ZD.ZDDM, ZD.ZL, ZD.ZDMJ, ZD.ZDSZD, ZD.ZDSZN, ZD.ZDSZX, ZD.ZDSZB, ZD.TFH,    ZD.RJL, ZD.JZMD, ZD.JZXG, ZD.QXMC, ZD.DJQMC, ZD.DJZQMC, ZD.BZ,     (SELECT Z.ZSBH FROM BDCK.BDCS_ZS_GZ Z         INNER JOIN BDCK.BDCS_QDZR_XZ L ON Z.ZSID = L.ZSID         INNER JOIN BDCK.BDCS_QL_XZ Q ON L.QLID = Q.QLID         INNER JOIN BDCK.BDCS_DJDY_XZ D ON Q.QLLX = '3'  AND Q.DJDYID = D.DJDYID         WHERE  D.BDCDYID = ZD.BDCDYID ) TDZBH,     ( SELECT LISTAGG ( TO_CHAR ( TDYTMC ), ',' ) within GROUP ( ORDER BY 1 )         FROM BDCK.BDCS_TDYT_LS WHERE BDCDYID = zd.bdcdyid ) TDYT,     ( SELECT CONSTTRANS FROM BDCK.BDCS_CONST         WHERE CONSTSLSID = '9' AND CONSTVALUE = zd.qlxz ) SYQZL,     CASE WHEN EXISTS ( SELECT BDCDYID FROM BDCK.BDCS_H_XZ         WHERE ZDBDCDYID = ZD.BDCDYID         UNION ALL SELECT BDCDYID FROM BDCK.BDCS_H_XZY WHERE ZDBDCDYID = ZD.BDCDYID)         THEN '有房屋' ELSE '无房屋' END FWZT, CASE WHEN EXISTS (SELECT qlid             FROM BDCK.BDCS_QL_XZ Q             INNER JOIN BDCK.BDCS_DJDY_XZ D ON Q.QLLX = '23' AND Q.QLID = D.DJDYID             WHERE D.BDCDYID = ZD.BDCDYID )         THEN '有抵押' ELSE '无抵押' END TDDYZT FROM BDCK.BDCS_SHYQZD_XZ ZD     WHERE  ZDDM = ?",
              "HASH": 216127831708071550,
              "MaxTimespan": 266,
              "BlobOpenCount": 0,
              "ExecuteCount": 1,
              "EffectedRowCount": 0,
              "ReadStringLength": 129,
              "ExecuteAndResultHoldTimeHistogram": [
                1,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "ClobOpenCount": 0,
              "LastTime": 1609213373115,
              "FetchRowCountHistogram": [
                0,
                1,
                0,
                0,
                0,
                0
              ]
            },
          ]
        }
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
          console.debug("获取了Druid连接池的数据源信息", res.list)
          this.list = res.list
          if (res.list.length > 0) {
            this.activeTab = '' + res.list[0].Identity
            this.reloadSqlList()
          }
        })
      },

      /** 重新加载 数据源的sql */
      reloadSqlList() {
        console.debug("reloadSqlList", this.activeTab)
        jsLib.ajax.post(apiUrl.commonDurid.getSqlByDatasourceId, {id: this.activeTab}).then((res) => {
          console.debug(`获取了Druid连接池的数据源 ${this.activeTab} 的sql列表`, res.list)
          this.sql.sqlList = res.list
        })
      },

      onTabClick(tabObj) {
        // console.debug("onTabClick", tabObj.name)
        this.reloadSqlList()
      },

      sqlFormat(sql) {
        let res = sqlFormatter.format(sql)
        console.debug(`格式化sql, 原始:${sql}, 格式化后:${res}`)
        return res
      },
    },

  }
</script>
