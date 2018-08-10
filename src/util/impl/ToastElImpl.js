/**
 * 用 elementUi 实现 toast
 * Created by liangwj on 2018/7/20 0020.
 */
import {
  Notification,
} from 'element-ui'

export default {

  /** 初始化 */
  init () {

  },

  /** 正常的显示信息 */
  showMsg (msg) {
    Notification({
      message: msg,
      type: 'success',
      duration: 1000,
    })
  },

  /** 显示错误信息 */
  showErrorMsg (msg) {
    Notification({
      message: msg,
      type: 'error',
    })
  },
}
