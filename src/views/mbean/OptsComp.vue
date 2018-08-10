<!-- MBean 基础信息 -->
<template>
  <div class="my-pannel opt-pannel mbean-info-card">
    <div class="p-header">
      <span class="text-caption">{{info.desc}}</span>
      <code>{{info.className}}</code>
    </div>

    <div class="p-body">
      <!-- 左边opt导航 -->
      <div class="opt-nav">
        <ul>
          <li
            class="text-link"
            v-for="opt in info.opts"
            @click="onNavClick(opt)"
            :key="opt.info.name"
            :index="opt.info.name">
            <div class="text-wrap" style="width: 209px">
              {{opt.info.name}}
              <span class="text-muted">{{opt.info.description}}</span>
            </div>
          </li>
        </ul>
      </div>
      <!-- /左边opt导航 -->

      <!-- 右边的表单 -->
      <div class="opt-forms article" v-if="showForm">
        <h4>
          <span class="label label-success">{{curOpt.info.returnType}}</span>
          <span class="text-caption">{{curOpt.info.name}}</span>
        </h4>
        <div class="text-muted">
          备注: {{curOpt.info.description}}
        </div>

        <hr/>
        <el-form
          @submit.native.prevent="onSubmitOpt"
          label-width="120px">
          <el-form-item
            v-for="param in curOpt.params"
            :key="param.info.name"
            :label="param.info.name">

            <div v-if="param.info.type==='boolean'">
              <el-switch
                active-value="true"
                inactive-value="false"
                v-model="param.defaultValue">
              </el-switch>

            </div>
            <div v-else>
              <el-input v-model.trim="param.defaultValue"
                        size="small"
                        type="textarea"
                        clearable></el-input>
            </div>

            <div>
              <!-- 参数类型 -->
              <span class="label label-success">{{param.info.type}}</span>

              <!-- 参数说明 -->
              <span class="text-muted"> {{param.info.description}}</span>
            </div>

          </el-form-item>

          <el-button
            type="primary"
            nativeType="submit">执行
          </el-button>
        </el-form>

      </div>
    </div>
    <el-dialog
      title="执行返回结果"
      :visible.sync="returnData.show"
      width="60%"
      center>
      <pre>
        {{ returnData.data }}
      </pre>
    </el-dialog>

  </div>
</template>

<script>
  import apiUrl from '../../ApiUrl'
  import myUtil from '../../util/MyUtils'

  export default {
    name: 'opts-comp', // 只有是组件的时候才有用

    /** 本页面用到的组件 */

    /** 组件的属性，只有是组件的时候才有用 */
    props: {
      info: {
        type: Object,
        required: true,
        default: {},
      },
    },

    /** 本页面的属性 */
    data () {
      return {
        showForm: false, // 是否有opt
        curOpt: {}, // 当前在查看的opt

        // 执行opt的返回
        returnData: {
          hasReturn: false,
          data: '',
          show: false,
        },
      }
    },

    /** 计算属性 */
    computed: {},

    /** 每次进入页面时 */
    activated () {
      this.showForm = false
      this.curOpt = {}
    },

    /** 本页面可用的方法 */
    methods: {
      onNavClick (opt) {
        this.showForm = true
        this.curOpt = opt

        console.debug('-------', this.curOpt)
      },

      onSubmitOpt () {
        const param = {
          objectName: this.info.objectName,
          optName: this.curOpt.info.name,
          paramType: [],
          paramValue: [],
        }

        for (let p of this.curOpt.params) {
          param.paramType.push(p.info.type)
          param.paramValue.push(p.defaultValue)
        }

        console.debug('执行mbean 方法', param)

        // 提交前，先重置返回结果
        this.returnData.hasReturn = false
        this.returnData.data = ''

        // 调用ajax 执行 opt
        myUtil.ajax(apiUrl.jmxInWeb.invokeOpt, param, (res) => {
          myUtil.showMsg(`执行 ${param.optName} 成功`)

          this.returnData.hasReturn = res.hasReturn
          this.returnData.data = res.returnData
          this.returnData.show = res.hasReturn

          // 通知外面刷新
          this.$emit('refresh', false)
        })
      },
    },
  }
</script>
