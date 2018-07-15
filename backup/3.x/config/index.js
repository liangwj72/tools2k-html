'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

// 静态资源的路径前缀，注意，前面不能有 '/'
const assetsPrefix = 'commons-statics/jmx_in_web/'
// 服务器端代码资源目录的根目录
const serverCodeDirPrefix = '../../_commons/spring-jmx/src/main/resources/'
// 服务器端代码资源目录:模板目录
const serverCodeIndexPath = serverCodeDirPrefix + 'templates/index.ftl'
// 服务器端代码资源目录:静态资源目录
const serverCodeAssertDir = serverCodeDirPrefix + 'static/' + assetsPrefix

module.exports = {

  proxyUrls: [
    '/api',     // api请求需要重定向到后端服务器
    '/work',    // 上传的附件
  ],

  dev: {
    /** 默认的后端服务器地址，可以通过环境变量 API_SERVER 修改 */
    defaultApiServer: 'http://127.0.0.1:22000/',

    /** 开发界面的模板 */
    template: 'index.dev.html',

    // Various Dev Server settings
    host: 'localhost', // 监听地址，可以通通过环境变量: HOST 修改
    port: 18080, // 监听端口，可以通过环境变量: PORT 修改
    autoOpenBrowser: false, // 是否自动打开浏览器
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Paths
    assetsSubDirectory: assetsPrefix,
    assetsPublicPath: '/',

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, serverCodeIndexPath),

    /** build的时候用的模板 */
    template: 'index.ftl',

    // Paths
    assetsRoot: path.resolve(__dirname, serverCodeAssertDir),
    assetsSubDirectory: '',
    assetsPublicPath: '/' + assetsPrefix,

    /**
     * Source Maps
     */
    productionSourceMap: false, // 一般情况下，build的时候不要将源码也放出去
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },

  /** 创建代理 */
  createProxyTable: function () {

    // 定义开发环境下，那些目录需要交给后端处理
    let apiServer = this.dev.defaultApiServer
    if (process.env.API_SERVER) {
      // 通过环境变量，可以切换后端的地址，例如 API_SERVER=http://192.168.1.10:20000
      apiServer = process.env.API_SERVER + '/'

      // 自动补上http
      if (apiServer.indexOf('http') === -1) {
        apiServer = 'http://' + apiServer
      }
    }

    let proxyTable = {}
    for (let i = 0; i < this.proxyUrls.length; i++) {
      proxyTable[this.proxyUrls[i]] = {
        target: apiServer,
        secure: apiServer.indexOf('https') === 0,
        changeOrigin: true,
      }
    }
    console.log('后端代理配置:', proxyTable)

    return proxyTable
  },

}
