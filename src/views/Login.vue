<template>
    <el-container class="main-frame">
        <el-header class="main-frame-header tc-header" height="60px">
            <div class="tc-title">
                <my-key vkey="system.name"/>
            </div>
        </el-header>

        <el-container>
            <el-main>
                <el-row :gutter="20">
                    <el-col :span="10">
                        <el-card>
                            <div slot="header">
                                <span>请登录</span>
                            </div>
                            <el-form label-width="100px"
                                     size="mini"
                                     @submit.native.prevent="onSubmit">
                                <el-form-item label="账号" prop="checkPass">
                                    <el-input type="text"
                                              v-model.trim="form.account"
                                              required
                                              placeholder="请输入账号">
                                        auto-complete="on">
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="密码">
                                    <el-input type="password"
                                              required
                                              placeholder="请输入密码"
                                              v-model.trim="form.password"
                                              auto-complete="off"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-checkbox label="保持登录"
                                                 v-model="form.rememberMe"></el-checkbox>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" nativeType="submit">登录</el-button>
                                </el-form-item>
                            </el-form>
                        </el-card>
                    </el-col>
                    <el-col :span="14">

                        <div v-if="adminInProp" class="article">
                            <div>
                                <h4>账号配置:</h4>
                                <p class="color-text-secondary">
                                    账号和密码存储在spring boot的配置文件中，
                                </p>
                                <ul>
                                    <li>login-check.admin.account=管理员账号</li>
                                    <li>login-check.admin.password=密码</li>
                                </ul>
                                <p class="text-muted">
                                    如果不想把账号放在配置文件中，也可以用数据库管理，
                                    只需要一个实现了<span class="color-info">IWebUserProvider&lt;CommonAdminWebUser&gt;</span>接口的类
                                </p>
                            </div>
                        </div>
                        <div v-else>
                            请使用外部账号登陆
                        </div>

                    </el-col>
                </el-row>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import myUtil from '../util/MyUtils'
    import apiUrl from '../ApiUrl'
    import serverContext from '../util/ServerContext.js'
    import routerConfig from '../config/router.config.js'

    export default {
        /** 本页面的属性 */
        data() {
            return {
                form: {
                    account: '',
                    password: '',
                    rememberMe: true,
                },

                form1: {
                    password: '',
                },

                doEncode: {
                    called: false, // 是否执行了密码生成
                    plainPwd: '', // 执行时的密码
                    encodedPwd: '', // 生成的密文
                },

                adminInProp: serverContext.serverInfo.adminInProp,
            }
        },

        /** 计算属性 */
        computed: {},

        /** 构建页面时 */
        mounted() {
        },

        /** 每次进入页面时 */
        activated() {
            if (serverContext.logined) {
                // 如果已经登录了
                this.redirect()
            } else {
                if (window.defaultLogin) {
                    // 开发环境下，自动填写账号和密码
                    this.form.account = window.defaultLogin.account
                    this.form.password = window.defaultLogin.password
                } else {
                    this.form.account = ''
                    this.form.password = ''
                }

                this.doEncode.called = false
            }
        },

        /** 本页面可用的方法 */
        methods: {
            onSubmit() {
                console.debug('form', this.form)

                const that = this
                myUtil.ajax(apiUrl.commonPublic.login, this.form, function (res) {
                    serverContext.onLogin(res)

                    that.redirect()
                })
            },

            createPassword() {
                const param = {
                    password: this.form1.password,
                }

                this.doEncode.encodedPwd = ''
                this.doEncode.plainPwd = ''

                myUtil.ajax(apiUrl.commonPublic.passwordDemo, param, (res) => {
                    this.doEncode.called = true
                    this.doEncode.encodedPwd = res.message
                    this.doEncode.plainPwd = this.form1.password
                })
            },

            /** 登录成功时，跳转到列表页 */
            redirect() {
                const next = routerConfig.getRoutePath('status/Summary')

                console.debug('登录成功，准备跳转到', next)

                this.$router.push(next)
            },
        },
    }
</script>
