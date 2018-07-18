// see http://vuejs-templates.github.io/webpack for documentation.
const path = require('path')

// 静态资源的路径前缀，注意，前面不能有 '/'
const assetsPrefix = 'commons-statics/common-admin/'
// 服务器端代码资源目录的根目录
const serverCodeDirPrefix = '../../_commons/spring-jmx/src/main/resources/'
// 服务器端代码资源目录:模板目录
const serverCodeIndexPath = serverCodeDirPrefix + 'templates/common-admin/index.ftl'
// 服务器端代码资源目录:静态资源目录
const serverCodeAssertDir = serverCodeDirPrefix + 'static/' + assetsPrefix

// 后端的地址，例如 API_SERVER=http://192.168.1.10:20000，可以通过环境变量 API_SERVER 修改
const defaultApiServer = 'http://127.0.0.1:22000/'
const httpPort = 18080

// 需要走后端的url
const proxyUrls = [
  '/api',     // api请求需要重定向到后端服务器
  '/work',    // 上传的附件
]

module.exports = {

  build: {
    env: require('./prod.env'),

    // index文件输出路径
    index: path.resolve(__dirname, serverCodeIndexPath),

    /** build的时候用的模板 */
    template: 'index.ftl',

    assetsRoot: path.resolve(__dirname, serverCodeAssertDir),
    assetsSubDirectory: '',
    assetsPublicPath: '/' + assetsPrefix,

    productionSourceMap: false, // 一般情况下，build的时候不要将源码也放出去
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report
  },

  dev: {
    env: require('./dev.env'),
    autoOpenBrowser: false, // 启动开发环境时，不要自动打开浏览器

    assetsSubDirectory: assetsPrefix,
    assetsPublicPath: '/',

    // 如果是是微信公众号项目，因为微信JS SDK 验签时只认80和443端口，我们这里就必须用80端口，如果不用微信JS SDK，爱用啥就用啥
    port: httpPort,

    // 我们现在用less写样式表，为了方便查看，我们需要打开源码模式
    cssSourceMap: true
  },

  /** 创建代理 */
  createProxyTable: function () {

    // 定义开发环境下，那些目录需要交给后端处理
    let apiServer = defaultApiServer
    if (process.env.API_SERVER) {
      // 通过环境变量，可以切换后端的地址，例如 API_SERVER=http://192.168.1.10:20000
      apiServer = process.env.API_SERVER + '/'

      // 自动补上http
      if (apiServer.indexOf('http') === -1) {
        apiServer = 'http://' + apiServer
      }
    }

    let proxyTable = {}
    for (let i = 0; i < proxyUrls.length; i++) {
      proxyTable[proxyUrls[i]] = {
        target: apiServer,
        secure: apiServer.indexOf('https') === 0,
        changeOrigin: true,
      }
    }
    console.log('后端代理配置:', proxyTable)

    return proxyTable
  },
}
