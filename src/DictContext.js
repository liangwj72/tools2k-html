/**
 * 保存MyKey控件所需要的数据
 * Created by liangwj on 2018/4/3 0003.
 */

import myUtil from './util/MyUtils'
import ApiUrl from './ApiUrl'

export default {

  /** 从服务器获取的数据 */
  data: {},

  /** 是否调试模式 */
  debugMode: false,

  /** 初始化 */
  init () {
    let that = this
    myUtil.ajax(ApiUrl.dictPublic.getDict, {}, function (res) {

      console.debug('获取服务器的字典定义:', res.data)

      that.data = res.data
      that.debugMode = res.debugMode
    })
  },

  /** 根据key 获取值 */
  getValue (key) {
    let v = this.data[key]
    if (v) {
      return v
    } else {
      return `请在后台添加key: ${key}`
    }
  },
}
