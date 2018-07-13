/**
 * loading遮罩层的实现方式
 * Created by liangwj on 2018/5/18 0018.
 */

export default {

  /** ajax 完成的时候 */
  onAjaxDone () {
    console.debug('ajax 加载完成')
  },

  /** ajax 开始的时候 */
  onAjaxStart () {
    console.debug('ajax 开始加载')
  },
}
