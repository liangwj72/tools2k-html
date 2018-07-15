<template>
  <b-navbar toggleable="md" variant="light">
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

    <b-navbar-brand class="system-name">
      <my-key vkey="system.name"/>
      JMX
    </b-navbar-brand>

    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav>
        <router-link to="../mbean/MBeanList"
                     tag="li"
                     active-class="active">
          <a class="nav-link">MBean</a>
        </router-link>
        <router-link to="../status/WsApi"
                     v-if="hasWsApiImpl"
                     tag="li"
                     active-class="active">
          <a class="nav-link">WsApi</a>
        </router-link>
        <router-link to="../status/Runtime"
                     tag="li"
                     active-class="active">
          <a class="nav-link">系统状态</a>
        </router-link>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">

        <b-nav-item-dropdown :text="userName" right>
          <b-dropdown-item @click="logout">登出</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>

    </b-collapse>

  </b-navbar>
</template>

<script>
  import apiContext from '../ApiContext.js'
  import apiUrl from '../ApiUrl'
  import myUtil from '../util/MyUtils'
  import routeConfig from '../config/RouterConfig'

  export default {
    name: 'my-nav', // 只有是组件的时候才有用

    /** 本页面用到的组件 */
    components: {},

    /** 组件的属性，只有是组件的时候才有用 */
    props: {},

    /** 本页面的属性 */
    data () {
      return {
        userName: apiContext.curUser.account,
        hasWsApiImpl: apiContext.hasWsApiImpl,
      }
    },

    /** 计算属性 */
    computed: {},

    /** 构建页面时 */
    mounted () {
      console.debug('mounted()')
    },

    /** 每次进入页面时 */
    activated () {
      console.debug('activated()')
    },

    /** 每次退出页面时 */
    deactivated () {
      console.debug('activated()')
    },

    /** 本页面可用的方法 */
    methods: {
      logout () {
        const that = this
        myUtil.ajax(apiUrl.commonAdmin.logout, {}, function () {
          console.debug('用户登出成功')
          apiContext.onLogout()

          that.$router.push(routeConfig.getRoutePath('Login'))
        })
      },
    },
  }
</script>

<!--<style scoped>-->
<style>

</style>
