/**
 * 用elementUi实现的 confirm
 *
 * Created by liangwj on 2018/7/20 0020.
 */
import {
  MessageBox,
} from 'element-ui'

export default {

  init (vue) {
  },

  /** 弹窗确认 */
  confirm (msg, callback) {

    MessageBox.confirm(msg, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      dangerouslyUseHTMLString: true,
      type: 'warning',
      center: true,
    }).then(() => {
      if (typeof callback === 'function') {
        callback()
      }
    })
  },

}
