<template>
  <div>
    <my-nav activeName="mbean"></my-nav>

    <div class="main-content mbean-view">

      <!-- 属性列表 vue-->
      <div class="attr_container">
        <b-card>
          <div slot="header" class="col2-container">
            <div class="col1">
              属性
              <button class="btn btn-sm btn-default" @click="allColumn">{{showAllColText}}</button>
            </div>

            <div>
              <button class="btn btn-sm btn-default" @click="reload">刷新</button>
            </div>
          </div>

          <table class="table table-light table-hover">
            <thead>
            <tr>
              <th width="250" v-show="showAllCol">名字</th>
              <th width="150">说明</th>
              <th>值</th>
            </tr>
            </thead>
            <tbody>
            <template v-for="attrVo in attrs">
              <tr>
                <td v-show="showAllCol">
                  <span class="caption">{{attrVo.info.name}}</span>
                  <span class="label label-warning" v-if="attrVo.info.writable && !attrVo.info.readable">只写</span>
                  <span class="label label-success"
                        v-if="!attrVo.info.writable">只读</span> <span class="text-muted" align="right">{{attrVo.info.type}}</span></td>
                <td>{{attrVo.desc}}</td>
                <td class="attr_value">
                  <div v-if="!attrVo.info.writable || !attrVo.inputable">
                    <pre v-if="attrVo.jsonValue" v-html="attrVo.value"></pre>
                    <span class="text-primary" v-if="!attrVo.jsonValue" v-html="attrVo.value"></span>
                  </div>
                  <attr-value :attr-vo="attrVo" v-if="attrVo.info.writable && attrVo.inputable"></attr-value>
                </td>
              </tr>
            </template>
            </tbody>
          </table>
        </b-card>

      </div>
      <!-- /属性列表 -->

    </div>
  </div>
</template>

<script>
  import apiUrl from '../../ApiUrl'
  import myUtil from '../../util/MyUtils'

  export default {

    /** 本页面用到的组件 */
    components: {},

    /** 组件的属性，只有是组件的时候才有用 */
    props: {},

    /** 本页面的属性 */
    data () {
      return {
        objectName: '',

        attrs: [], // 属性列表
        showAllCol: false, // 是否显示所有列

        info: {},

      }
    },

    /** 计算属性 */
    computed: {
      showAllColText: function () {
        return (this.showAllCol) ? '隐藏名字列' : '显示所有列'
      },
    },

    /** 构建页面时 */
    mounted () {
      console.debug('mounted()')
    },

    /** 每次进入页面时 */
    activated () {
      this.objectName = this.$route.query.objectName
      this.reload()
    },

    /** 每次退出页面时 */
    deactivated () {
      console.debug('activated()')
    },

    /** 本页面可用的方法 */
    methods: {
      /** 显示/隐藏 列 */
      allColumn: function () {
        this.showAllCol = !this.showAllCol
      },

      reload () {

        console.debug('刷新 mbean:', this.objectName)

        const that = this
        const param = {
          objectName: this.objectName,
        }

        myUtil.ajax(apiUrl.jmxInWeb.getMBeanInfo, param, function (res) {
          that.info = res.info
          that.attrs = res.info.attrs
        })
      },
    },
  }
</script>
