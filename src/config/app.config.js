/**
 * 本项目e 的各种配置
 * Created by liangwj on 2017/6/20 0020.
 */

const Chart = require('chart.js')

export default {
  /** 初始化所有 */
  install (Vue) {
    Chart.defaults.global.legend.labels.fontColor='#909399';
    Chart.defaults.global.title.fontColor='#909399';
  },

}
