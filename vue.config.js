const path = require('path')
const {defineConfig} = require('@vue/cli-service')

/** 发版时静态资源的路径前缀 */
const assetsPrefix = '_common_/statics/admin/'

/** 是否热更新，为false的时候，页面是刷新，而不是动态更新，可避免动画卡死的现象 */
const hotReload = true

/**
 * 我们的代理设置
 */
function myProxy() {
    if (process.env.NODE_ENV === 'production') {
        // build的时候，不需要配置代理
        return {}
    }

    // 以下url要转发到后端
    const urls = [
        '/api/', '/upload/', '/_common_/',
    ]

    // 迭代urls，生成代理规则
    const proxy = {}
    for (let i = 0; i < urls.length; i++) {
        const key = urls[i]
        proxy[key] = {
            target: process.env.VUE_APP_BACKEND_SERVER,
            ws: true,
            changeOrigin: true,
            secure: process.env.DEV_SERVER_HTTPS === 'true', // 如果是https接口，需要配置为 true
        }
    }
    console.log('当前用的API代理', process.env.VUE_APP_BACKEND_SERVER, proxy)
    return proxy
}

module.exports = defineConfig({
    transpileDependencies: true,
    outputDir: '../lib-java/spring-support/src/main/resources/commons_statics/admin/',

    publicPath: process.env.NODE_ENV === 'production' ? assetsPrefix : '/',

    chainWebpack: config => {
        config.module
            .rule('vue')
            .use('vue-loader')
            .loader('vue-loader')
            .tap(options => {
                options.hotReload = hotReload
                return options
            })
    },

    devServer: {
        hot: hotReload,
        proxy: myProxy(),
    },
})
