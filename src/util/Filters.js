/**
 *
 * 给Vue用的各类filter
 * Created by liangwj on 2018/7/26 0026.
 */

import myUtil from './MyUtils'

export default {

  /** unix时间格式化为  yyyy-MM-dd hh:mm:ss */
  timeFormat (time) {
    return myUtil.timeFormat(time, 'yyyy-MM-dd hh:mm:ss')
  },

  /** 将空间大小转为K，并且用逗号分隔 */
  sizeToK (size) {
    const k = size / 1024
    return myUtil.numFormat(k, true) + 'K'
  },

  /** 将空间大小转为M，并且用逗号分隔 */
  sizeToM (size) {
    if (!size || size === 0) {
      return 0
    }

    const k = size / 1024
    if (k > 1024) {
      const m = k / 1024
      return myUtil.numFormat(m, true) + 'M'
    } else {
      return myUtil.numFormat(k, true) + 'K'
    }
  },

  /** 用逗号分隔显示数字,保留两位小数点 */
  numFormat2 (value) {
    return myUtil.numFormat(value, true)
  },

  /** 用逗号分隔显示数字，取整 */
  numFormat (value) {
    return myUtil.numFormat(value, false)
  },
}
