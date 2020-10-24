'use strict'
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

/**
 * 开发服务器的端口
 */
const port = process.env.port || process.env.npm_config_port || 9528 // dev port

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
    '/api', '/upload'
  ]

  // 迭代urls，生成代理规则
  const proxy = {}
  for (let i = 0; i < urls.length; i++) {
    const key = urls[i]
    proxy[key] = {
      target: process.env.VUE_APP_BACKEND_SERVER,
      ws: true,
      changeOrigin: true,
      secure: false,// 如果是https接口，需要配置为false
    }
  }
  console.log('当前用的API代理', process.env.VUE_APP_BACKEND_SERVER, proxy)
  return proxy
}

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  runtimeCompiler: true,
  publicPath: '',
  // outputDir: 'dist/', // 构建文件的目录
  outputDir: '../lib-java/spring-support/src/main/resources/commons_statics/admin/',
  // assetsDir: 'statics/backend/', // 指定生成的 index.html 的输出路径 (相对于 outputDir)
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,

  /** 开发服务器配置 */
  devServer: {
    port: port,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: myProxy(),
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack(config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [{
      rel: 'preload',
      // to ignore runtime.js
      // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
      fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
      include: 'initial'
    }])
  }
}
