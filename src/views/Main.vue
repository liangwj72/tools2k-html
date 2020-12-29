<template>
  <el-container class="main-frame">
    <el-header class="main-frame-header tc-header"
               height="60px">
      <!-- 标题 -->
      <div class="tc-title">
        <my-key vkey="system.name"/>
      </div>
      <!-- /标题 -->

      <!-- 导航 -->
      <div>
        <el-menu mode="horizontal"
                 router
                 :default-active="$route.path">
          <template v-for="item in topMenuList">
            <el-submenu v-if="!checkIsOne(item)"
                        :key="item.path"
                        :index="item.path">
              <template slot="title">
                <i :class="item.meta.icon"
                   v-if="item.meta.icon"></i> {{ item.meta.title }}
              </template>

              <template v-for="item1 in item.children">
                <el-menu-item :key="item1.path"
                              :index="item1.path"
                              v-if="checkIsHidden(item1)">
                  {{ item1.meta.title }}
                </el-menu-item>
              </template>
            </el-submenu>
            <el-menu-item v-else
                          :key="item.path"
                          :index="item.path">
              <i :class="item.meta.icon"
                 v-if="item.meta.icon"></i> {{ item.meta.title }}
            </el-menu-item>
          </template>

          <el-submenu index="dev">
            <template slot="title">开发调试</template>
            <el-menu-item index="ajax">
              <a href="/_common_/dev/" target="_blank">Ajax Api调试</a>
            </el-menu-item>
            <el-menu-item index="ws">
              <a href="/_common_/dev/ws" target="_blank">WS Api调试</a>
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </div>
      <!-- /导航 -->

      <div class="tc-space"></div>
      <div class="tc-right">
      </div>
      <!-- 用户 -->
      <div class="tc-right">
        <el-menu mode="horizontal"
                 :router="false"
                 default-active="">
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-user"></i>{{userName}}</template>
            <el-menu-item @click="logout">退出登录
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
      <!-- /用户 -->
    </el-header>

    <!-- 下方主体 -->
    <div class="main-frame-body">
      <div>
        <!-- 中间区 -->
        <keep-alive>
          <router-view/>
        </keep-alive>
        <!-- /中间区 -->
      </div>
    </div>
    <!-- /下方主体 -->
  </el-container>
</template>

<script>

  import serverContext from "../util/ServerContext";
  import apiUrl from "../ApiUrl";
  import routeConfig from "../config/router.config";
  import jslib from '@nnland/jslib'

  export default {

    /** 本页面用到的组件 */
    components: {},

    /** 本页面的属性 */
    data() {
      return {
        userName: serverContext.curUser.account,
        topMenuList: [],
      }
    },

    created() {
      this.init()
    },

    /** 本页面可用的方法 */
    methods: {
      init() {
        this.$router.options.routes.forEach(v => {
          let hidden = v.hidden
          if (hidden) {
            // 如果有设置隐藏
            if (jslib.utils.isFunction(hidden)) {
              // 如果设置是函数，就调用一下
              if (hidden()) {
                // 如果调用函数的结果是真，就直接返回
                return
              }
            } else {
              // 如果设置的不是函数，就当是要隐藏
              return
            }
          }
          this.topMenuList.push(v)
        })
        // console.debug(`合计 ${this.topMenuList.length} 个一级菜单`, this.topMenuList)
      },

      checkIsHidden(item) {
        return !(item.hidden)
      },

      checkIsOne(item) {
        let num = 0
        for (let i in item.children) {
          if (!this.checkIsHidden(item.children[i])) {
            continue
          }
          num = num + 1
        }
        return num === 1
      },
      joinRouterPath(p, p1) {
        return p + '/' + p1
      },
      toRouter(path) {
        this.$router.push(path)
      },

      logout() {
        jslib.ajax.post(apiUrl.commonPublic.logout).then(() => {
          console.debug('用户登出成功')
          serverContext.onLogout()

          this.$router.push(routeConfig.getRoutePath('/Login'))
        })
      },
    }
  }
</script>
