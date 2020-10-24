<template>
  <div class="nav-bar flex-container">
    <div class="system-name">
      <my-key vkey="system.name"/>
    </div>
    <div class="flex1">
      <el-menu mode="horizontal">
        <el-menu-item v-for="row in menus"
                      v-if="row.checkRights()"
                      :key="row.key"
                      :index="row.key"
                      :class="getClass(row.key)">
          <router-link :to="row.link">{{row.name}}</router-link>
        </el-menu-item>
      </el-menu>
    </div>
    <div>
      <el-menu mode="horizontal">
        <el-menu-item index="ajax">
          <a href="/_common_/dev/" target="_blank">Ajax Api调试</a>
        </el-menu-item>
        <el-menu-item index="ws">
          <a href="/_common_/dev/ws" target="_blank">WS Api调试</a>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="user-name">
      <span class="mr-10 text-caption">{{userName}}</span>
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

  const checkRights = {
    defaultFn () {
      return true
    },

    hasWsApiImpl () {
      return serverContext.serverInfo.hasWsApiImpl
    },
  }

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

        /** 菜单 */
        menus: [
          { // 摘要
            key: 'summary',
            name: '系统摘要',
            link: '../status/Summary',
            checkRights: checkRights.defaultFn,
          },
          { // 查看jmx
            key: 'mbean',
            name: 'JMX',
            link: '../mbean/MBeanList',
            checkRights: checkRights.defaultFn,
          },
          {
            key: 'runtime',
            name: '系统状态',
            link: '../status/Runtime',
            checkRights: checkRights.defaultFn,
          },
          {
            key: 'wsConns',
            name: 'WS连接',
            link: '../status/WsConns',
            checkRights: checkRights.hasWsApiImpl,
          },
          {
            key: 'keys',
            name: '字典管理',
            link: '../dict/Keys',
            checkRights: checkRights.defaultFn,
          },
          {
            key: 'upload',
            name: '图床',
            link: '../dict/Upload',
            checkRights: checkRights.defaultFn,
          },
        ],
      }
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
