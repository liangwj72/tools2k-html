<!-- 属性列表组件 -->
<template>
  <div class="my-pannel attr-pannel">
    <div class="p-header flex-container">
      <div class="flex1">
        <el-button @click="backToList" size="mini" type="primary">返回列表</el-button>
        属性
        <span class="text-muted">{{sendTime | timeFormat}}</span>
      </div>
      <div>
        <el-button @click="allColumn" size="mini">{{showAllColText}}</el-button>
      </div>
    </div>

    <div class="p-body">
      <table class="el-table my-table">
        <thead>
        <tr>
          <th v-show="showAllCol">名字</th>
          <th width="150">说明</th>
          <th>值</th>
        </tr>
        </thead>
        <tbody>

        <tr v-for="row in attrs">
          <td v-show="showAllCol">
            <span class="text-caption">{{row.info.name}}</span>
            <el-tag type="warning"
                    size="mini"
                    v-if="row.info.writable && !row.info.readable">只写
            </el-tag>
            <el-tag type="success"
                    size="mini"
                    v-if="!row.info.writable">只读
            </el-tag>
            <span class="text-muted" align="right">{{row.info.type}}</span>
          </td>
          <td>{{row.desc}}</td>
          <td class="attr-value">
            <div v-if="!row.info.writable || !row.inputable">
              <pre v-if="row.jsonValue" v-html="row.value"></pre>
              <span class="text-primary" v-if="!row.jsonValue" v-html="row.value"></span>
            </div>
            <div v-else>
              <div v-if="row.info.type == 'boolean' || row.info.type == 'java.lang.Boolean'">
                <!-- 如果是boolean类型, 用开关方式显示 -->

                {{row._value}}
                <el-switch
                  :disabled="!row.editMode"
                  active-value="true"
                  inactive-value="false"
                  v-model="row._value">
                </el-switch>
                <!-- 编辑模式按钮 -->
                <edit-mode
                  @reset="resetEditMode(row)"
                  @submitChange="submitChange(row)"
                  v-model="row.editMode">
                </edit-mode>

              </div>

              <div v-else>
                <!-- 不是boolean，就用普通的输入框 -->

                <div class="flex-container">

                  <div class="flex1">

                    <div
                      v-if="!row.editMode"
                      class="text-primary" v-html="row.value"></div>

                    <el-input
                      v-else
                      type="textarea"
                      :rows="3"
                      v-model.trim="row._value">
                    </el-input>

                  </div>

                  <div>
                    <!-- 编辑模式按钮 -->
                    <edit-mode
                      @reset="resetEditMode(row)"
                      @submitChange="submitChange(row)"
                      v-model="row.editMode">
                    </edit-mode>
                  </div>

                </div>
              </div>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import EditMode from '../../components/EditMode'
  import apiUri from '../../ApiUrl'
  import myUtil from '../../util/MyUtils'

  export default {
    name: 'mbean-attrs-comp', // 只有是组件的时候才有用

    /** 本页面用到的组件 */
    components: {
      EditMode,
    },

    /** 组件的属性，只有是组件的时候才有用 */
    props: {
      /** 属性的列表 */
      attrs: {
        type: Array,
        required: true,
      },
      objectName: {
        type: String,
        required: true,
      },
      sendTime: {
        type: Number,
        default: 0,
      },
    },

    /** 本页面的属性 */
    data () {
      return {
        showAllCol: false, // 是否显示所有列
      }
    },

    /** 计算属性 */
    computed: {
      showAllColText: function () {
        return (this.showAllCol) ? '隐藏名字列' : '显示所有列'
      },
    },

    /** 本页面可用的方法 */
    methods: {
      /** 显示/隐藏 列 */
      allColumn () {
        this.showAllCol = !this.showAllCol
      },

      /** 重置为查看模式 */
      resetEditMode (row) {
        row._value = row.value
      },

      /** 提交属性变更 */
      submitChange (row) {
        row.editMode = false

        const param = {
          name: row.info.name,
          objectName: this.objectName,
          value: row._value,
        }

        myUtil.ajax(apiUri.jmxInWeb.changeAttr, param, () => {
          // 通知外面刷新
          this.$emit('refresh', false)
        })
      },

      backToList () {
        this.$router.push('MBeanList')
      },
    },
  }
</script>
