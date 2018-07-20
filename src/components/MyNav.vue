<template>
  <div class="nav-bar">
    <div class="system-name">
      <my-key vkey="system.name"/>
    </div>
    <div class="menu">
      <el-menu router
               ref="menuEl"
               mode="horizontal">
        <el-menu-item index="mbean"
                      :class="getClass('mbean')"
                      route="../mbean/MBeanList">MBean
        </el-menu-item>
        <!--
        <el-menu-item index="wsapi"
                      :class="getClass('wsapi')"
                      v-if="hasWsApiImpl"
                      route="../status/WsApi">WsApi
        </el-menu-item>
        -->
        <el-menu-item index="runtime"
                      :class="getClass('runtime')"
                      route="../status/Runtime">系统状态
        </el-menu-item>
        <el-menu-item index="keys"
                      :class="getClass('keys')"
                      route="../dict/Keys">字典管理
        </el-menu-item>
        <el-menu-item index="upload"
                      :class="getClass('upload')"
                      route="../dict/Upload">图床
        </el-menu-item>
      </el-menu>
    </div>
    <div class="user-name">
      <span class="mr-10">{{userName}}</span>
      <el-button
        @click="logout"
        size="mini">退出登录
      </el-button>
    </div>
  </div>
</template>

<script>
  import serverContext from '../util/ServerContext'
  import apiUrl from '../ApiUrl'
  import myUtil from '../util/MyUtils'
  import routeConfig from '../config/RouterConfig'

  export default {
    name: 'my-nav', // 只有是组件的时候才有用

    /** 本页面用到的组件 */
    components: {},

    /** 组件的属性，只有是组件的时候才有用 */
    props: {
      // 激活的菜单
      activeName: {
        type: String,
        default: '',
      },
    },

    /** 本页面的属性 */
    data () {
      return {
        userName: serverContext.curUser.account,
        hasWsApiImpl: serverContext.serverInfo.hasWsApiImpl,

        index: '',
      }
    },

    /** 每次进入页面时 */
    activated () {
      this.index = this.activeName
    },

    /** 本页面可用的方法 */
    methods: {

      getClass (name) {
        return {
          'active': this.activeName === name,
        }
      },

      logout () {
        const that = this
        myUtil.ajax(apiUrl.commonPublic.logout, {}, function () {
          console.debug('用户登出成功')
          serverContext.onLogout()

          that.$router.push(routeConfig.getRoutePath('Login'))
        })
      },
    },
  }
</script>
