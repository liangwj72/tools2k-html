require('./check-versions')()

let config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

let opn = require('opn')
let path = require('path')
let express = require('express')
let webpack = require('webpack')
let proxyMiddleware = require('http-proxy-middleware')
let webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
let port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
let autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
let proxyTable = config.createProxyTable()

let app = express()
let compiler = webpack(webpackConfig)

// console.log('webpackConfig配置', webpackConfig)

let devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

let hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({action: 'reload'})
    cb()
  })
})

console.log('后端代理配置:', proxyTable)

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  let options = proxyTable[context]
  if (typeof options === 'string') {
    options = {target: options}
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
let staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

let uri = 'http://localhost:' + port

let _resolve
let readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> 正在启动开发web服务器')
devMiddleware.waitUntilValid(() => {
  console.log(`> 监听在本地的 http://localhost:${port}`)
  console.log(`> 监听在本地的 https://localhost:${port + 1}`)

  // 判断是否自动打开浏览器
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

// 同时监听http和https
let fs = require('fs')
let http = require('http')
let https = require('https')
let httpsOption = {
  key: fs.readFileSync('build/localhost.key', 'utf-8'),
  cert: fs.readFileSync('build/localhost.crt', 'utf-8'),
}

// 监听普通的web server
httpServer = http.createServer(app)
httpServer.listen(port)
//let server = app.listen(port)

// 监听 https 服务器
httpsServer = https.createServer(httpsOption, app)
httpsServer.listen(port + 1)

module.exports = {
  ready: readyPromise,
  close: () => {
    console.debug('关闭http和https服务器')
    httpServer.close()
    httpsServer.close()
  }
}
