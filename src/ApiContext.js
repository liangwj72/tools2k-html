/**
 * 全局上下文，用于各个控件之间共享的变量
 * Created by liangwj on 2017/5/11 0011.
 */

import apiUrl from './ApiUrl'
import myUtil from './util/MyUtils'

export default {

  /** 当前用户信息 */
  curUser: {
    account: '',
    name: '',
  },

  /** 是否已经登录 */
  logined: false,

  /** 字典 */
  debugMode: false,

  hasWsApiImpl: false,

  /** 字典 */
  dict: {},

  init (callback) {
    const that = this
    myUtil.ajax(apiUrl.commonAdmin.getCurUser, {}, function (res) {
      that.onDataLoaded(res)

      if (typeof callback === 'function') {
        callback()
      }
    })
  },

  /** 登出 */
  onLogout () {
    this.curUser.account = ''
    this.curUser.name = ''
    this.logined = false
  },

  /** 当数据获取成功时 */
  onDataLoaded (res) {
    if (res.curUser) {
      this.curUser = res.curUser
      this.logined = true
    } else {
      this.logined = false
    }

    this.dict = res.dict
    this.debugMode = res.debugMode
    this.hasWsApiImpl = res.hasWsApiImpl

    console.debug(`更新系统状态 是否已登录:${this.logined}, 用户账号：${this.getCurUserName()}`)
  },

  getCurUserName () {
    if (this.logined) {
      return `${this.curUser.account} (${this.curUser.name})`
    } else {
      return '未登录'
    }
  },

  /** 根据key 获取字典值 */
  getDictValue (key) {
    let v = this.dict[key]
    if (v) {
      return v
    } else {
      return `请在后台添加key: ${key}`
    }
  },

}
