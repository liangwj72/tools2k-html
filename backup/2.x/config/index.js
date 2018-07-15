// see http://vuejs-templates.github.io/webpack for documentation.
const path = require('path')

// 服务器端代码资源目录的根目录
const serverCodeDirPrefix = '../../server/src/main/resources/'
// 服务器端代码资源目录:模板目录
const serverCodeDirTemplate = serverCodeDirPrefix + 'templates/'
// 服务器端代码资源目录:静态资源目录
const serverCodeDirStatic = serverCodeDirPrefix + 'static/'

// 需要走后端的url
const proxyUrls = [
  '/api',     // api请求需要重定向到后端服务器
  '/work',    // 上传的附件
  '/dict',    // 字典
]

let build = {
  env: require('./prod.env'),
  index: path.resolve(__dirname, serverCodeDirTemplate + 'backend.ftl'),
  assetsRoot: path.resolve(__dirname, serverCodeDirStatic + 'statics/backend/'),
  assetsSubDirectory: '',
  assetsPublicPath: '/commons-statics/jmx_in_web/', // 发版时，静态文件url前缀
  productionSourceMap: false, // 打开源码模式，方便在正式版中调试
  productionGzip: false,
  productionGzipExtensions: ['js', 'css'],
  bundleAnalyzerReport: process.env.npm_config_report
}

let dev = {
  env: require('./dev.env'),
  autoOpenBrowser: false, // 启动开发环境时，不要自动打开浏览器
  assetsSubDirectory: 'commons-statics/jmx_in_web/',
  assetsPublicPath: '/',

  // 如果是是微信公众号项目，因为微信JS SDK 验签时只认80和443端口，我们这里就必须用80端口，如果不用微信JS SDK，爱用啥就用啥
  port: 18080,

  proxyTable: [],

  // 我们现在用less写样式表，为了方便查看，我们需要打开源码模式
  cssSourceMap: true
}

// 定义开发环境下，那些目录需要交给后端处理
let apiServer = 'http://127.0.0.1:22000/'
if (process.env.API_SERVER) {
  // 通过环境变量，可以切换后端的地址，例如 API_SERVER=127.0.0.1:20000
  apiServer = process.env.API_SERVER + '/'

  // 自动补上http
  if (apiServer.indexOf('http') === -1) {
    apiServer = 'http://' + apiServer
  }
}
for (let i = 0; i < proxyUrls.length; i++) {
  dev.proxyTable[proxyUrls[i]] = {
    target: apiServer,
    secure: apiServer.indexOf('https') === 0,
    changeOrigin: true,
  }
}

module.exports = {
  build: build,
  dev: dev,
}
