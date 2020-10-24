const path = require('path');

module.exports = {
  // 选项...
  //publicPath: '_common_/statics/commonAdmin/',

  // 直接build到发版目录中
  //outputDir: '../../commons/spring-api-server/src/main/resources/',
  outputDir: 'dist/',

  // 打开css的源码模式，方便调试
  css: {
    sourceMap: (process.env.NODE_ENV === 'development')
  },

  productionSourceMap: (process.env.NODE_ENV === 'development'), // 生产环境是否生成 sourceMap 文件

  configureWebpack: (config) => {
    console.log('当前API url:', process.env.VUE_APP_BASE_API);
  }
};
