<template>
  <div class="login">
    <b-navbar variant="light">
      <b-navbar-brand class="system-name">
        <my-key vkey="system.name"/>
        JMX
      </b-navbar-brand>
    </b-navbar>

    <div class="container-fluid">
      <b-card title="用户登录"
              class="login-card">

        <b-form @submit.prevent="onSubmit">
          <b-form-group label="账号">
            <b-form-input type="text"
                          v-model.trim="form.account"
                          required
                          placeholder="请输入账号">
            </b-form-input>
          </b-form-group>
          <b-form-group label="密码">
            <b-form-input type="password"
                          v-model.trim="form.password"
                          required
                          placeholder="请输入密码">
            </b-form-input>
          </b-form-group>
          <b-form-group>
            <b-form-checkbox v-model="form.rememberMe">保存登录</b-form-checkbox>
          </b-form-group>
          <b-button type="submit" variant="info">登录</b-button>
        </b-form>

      </b-card>

    </div>
  </div>
</template>

<script>
  import myUtil from '../util/MyUtils'
  import apiUrl from '../ApiUrl'
  import routerConfig from '../config/RouterConfig.js'

  export default {
    /** 本页面的属性 */
    data () {
      return {
        form: {
          account: '',
          password: '',
          rememberMe: true,
        },
      }
    },

    /** 计算属性 */
    computed: {},

    /** 构建页面时 */
    mounted () {

      if (window.curUser.logined) {
        this.redirect()
      } else {
        if (window.defaultLogin) {
          // 开发环境下，自动填写账号和密码
          this.form.account = window.defaultLogin.account
          this.form.password = window.defaultLogin.password
        }
      }
    },

    /** 本页面可用的方法 */
    methods: {
      onSubmit () {
        console.debug('form', this.form)

        const that = this
        myUtil.ajax(apiUrl.commonAdmin.login, this.form, function (res) {

          window.curUser = res.userInfo
          window.curUser.logined = true

          that.redirect()
        })
      },

      /** 登录成功时，跳转到列表页 */
      redirect () {
        const next = routerConfig.getRoutePath('mbean/MBeanList')

        console.debug('登录成功，准备跳转到', next)

        this.$router.push(next)
      },
    },
  }
</script>
