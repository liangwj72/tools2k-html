/**
 * 全局上下文，用于各个控件之间共享的变量
 * Created by liangwj on 2017/5/11 0011.
 */

export default {

  getCurUser () {
    return window.curUser.account + '(' + window.curUser.name + ')'
  },

}
