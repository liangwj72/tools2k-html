<template>
  <div>
    <div class="article-header">
      {{this.$route.meta.title}}
    </div>

    <el-card class="article-small-card">
      <template slot="header" class="clearfix">
        <div>数据库连接池基础信息</div>
      </template>
      <el-form labelPosition="left"
               label-width="120px">
        <el-form-item label="版本:" class="text-caption">{{info.Version}}</el-form-item>
        <el-form-item label="是否运行重置:" class="text-caption">{{info.ResetEnable}}</el-form-item>
        <el-form-item label="重置次数:" class="text-caption">{{info.ResetCount}}</el-form-item>
        <el-form-item label="驱动:" class="text-caption">
          <div v-for="(row,index) in info.Drivers" :key="index">
            {{row}}
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import apiUrl from '../../ApiUrl'
  import jsLib from '@nnland/jslib'

  export default {

    /** 本页面用到的组件 */
    components: {},

    /** 组件的属性，只有是组件的时候才有用 */
    props: {},

    /** 本页面的属性 */
    data() {
      return {
        info: {
          "Version": "1.2.3",
          "Drivers": [
          ],
          "ResetEnable": true,
          "ResetCount": 0,
          "JavaVMName": "Java HotSpot(TM) 64-Bit Server VM",
          "JavaVersion": "11.0.6",
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
        jsLib.ajax.post(apiUrl.commonDurid.getBasic, {}).then((res) => {
          console.debug("获取了Druid连接池的基础信息", res.info)
          this.info = res.info
        })

      }
    },
  }
</script>
