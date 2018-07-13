/**
 * toast 的 bootstrap-toastr 实现方法
 *
 * Created by liangwj on 2018/5/18 0018.
 */

import toast from 'toastr'

export default {

  /** 初始化 bootstrap-toastr 的默认配置 */
  init () {
    console.log('初始化 bootstrap-toastr')
    toast.options = {
      'closeButton': true,
      'debug': false,
      'positionClass': 'toast-top-right',
      'onclick': null,
      'showDuration': '1000',
      'hideDuration': '1000',
      'timeOut': '3000',
      'extendedTimeOut': '1000',
      'showEasing': 'swing',
      'hideEasing': 'linear',
      'showMethod': 'fadeIn',
      'hideMethod': 'fadeOut',
    }
    console.debug('ToastToastrImpl.ini() : bootstrap-toastr 初始化完成')
  },

  /** 正常的显示信息 */
  showMsg (msg) {
    toast.success(msg)
  },

  /** 显示错误信息 */
  showErrorMsg (msg) {
    toast.error(msg)
  },

}
