/**
 * 和服务器状态相关的上下文
 * Created by liangwj
 */

import apiUrl from '../ApiUrl'
import myUtil from './MyUtils'

export default {

  /** 当前用户信息 */
  curUser: {
    account: '',
    name: '',
  },

  /** 是否已经登录 */
  logined: false,

  /** 服务器状态 */
  serverInfo: {
    adminInProp: false, // 框架管理账号是否是在配置文件中配置的
    debugMode: false, // 服务器是否debug模式
    hasDruid: false, // 是否有Druid监控
    hasWsApiImpl: false, // 是否有WebSocket Api接口
  },

  /** 字典 */
  dict: {},

  init (callback) {
    const that = this
    myUtil.ajax(apiUrl.commonPublic.getServerStatus, {}, function (res) {
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
    this.onLogin(res)

    this.dict = res.dict
    this.serverInfo = res.serverInfo

    let sysname=this.dict["system.name"];
    if (sysname) {
      document.title="通用后台-" + sysname;
    }

    console.debug(`更新系统状态 是否已登录:${this.logined}, 用户账号：${this.getCurUserName()}`,res.serverInfo)
  },

  /** 等当年成功是 */
  onLogin (res) {
    if (res.curUser) {
      this.curUser = res.curUser
      this.logined = true
    } else {
      this.logined = false
    }
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
