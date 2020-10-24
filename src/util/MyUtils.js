/**
 * Created by zhangjy on 2017/12/26 1505.
 */

import $ from 'n-zepto'
import RouterConfig from '../config/router.config'
import toastAgent from './impl/ToastElImpl' // toast的实现类
import confirmAgent from './impl/ConfirmElImpl'
import loading from './LoadingController'

export default {

  /** 弹窗确认 */
  confirm (msg, callback) {
    confirmAgent.confirm(msg, callback)
  },

  /** 为baseJsonResponse显示参数错误 **/
  showErrorForJsonResponse (res) {
    console.debug('调用ajax时，返回错误信息', res.message)
    this.showErrorMsg(res.message)
  },

  /** 显示错误信息 */
  showErrorMsg (msg) {
    toastAgent.showErrorMsg(msg)
  },

  /** 正常的显示信息 */
  showMsg (msg) {
    toastAgent.showMsg(msg)
  },

  /** 默认的ajax错误处理方法 */
  onAjaxError (xhr) {
    // 如果没有传入错误处理函数，就用默认的

    let result = this.getJsonFromErrorResponse(xhr)
    if (result !== null) {
      this.showErrorForJsonResponse(result)
    } else {
      this.showErrorMsg('出错了! 状态码:' + xhr.status)
    }
  },

  /** 尝试从错误信息中解析出 json格式的内容， 如果无法解析就返回null */
  getJsonFromErrorResponse (xhr) {
    let result = null
    // 如果没有传入错误处理函数，就用默认的
    if (xhr.readyState === 4) {
      // 服务器有返回内容
      try {
        // api server 返回的是json各式的错误信息
        result = this.parserJson(xhr.responseText)
      } catch (e) {
        console.error(e)
      }
    }
    return result
  },

  /**
   * 重新封装的ajax
   *
   * @param url
   *            ajax访问url
   * @param param
   *            ajax参数
   * @param callback
   *            回调函数，参数是 result, status, xhr
   * @param exOption 用于覆盖回调函数的option，主要是error、complete、apiError、progress
   *
   */
  ajax (url, param, callback, exOption) {
    if (this.isEmpty(url)) {
      return
    }

    let that = this
    let timeKey = 'ajax(url=' + url + ') 调用花费时间'

    let options = {
      type: 'post', // post get
      url: url,
      data: param,
      dataType: 'json',

      // 请求成功之后调用。传入返回后的数据，以及包含成功代码的字符串
      success: function (result, status, xhr) {
        if (!result.success) {
          // 如果失败， 检查是否有 apiError，如果有就调用传入的方法
          if (exOption && exOption['apiError']) {
            let fn = exOption['apiError']
            if (typeof fn === 'function') {
              fn(result)
            }
          } else {
            // 如果没有 apiError，就调用常规的错误处理
            that.showErrorForJsonResponse(result)
          }
        } else {
          // 如果成功
          try {
            callback(result, status, xhr)
          } catch (ex) {
            console.error('success 回调时发生了错误', ex)
          }
        }
      },

      // 请求出错时调用。 (超时，解析错误，或者状态码不在HTTP 2xx)
      error: function (xhr, errorType, error) {
        if (xhr.responseJSON) {
          // let result = JSON.parse(xhr.response)
          let result = xhr.responseJSON
          // 登录失败，跳转到登录页
          if (result.code === 'com.cfido.commons.beans.apiExceptions.InvalidLoginStatusException') {
            window.curUser = null
            RouterConfig.routerPush(RouterConfig.getRoutePath('Login'))
          }
        }

        let errorFn = function (xhr, errorType, error) {
          that.onAjaxError(xhr, errorType, error)
        }
        if (exOption && exOption['error']) {
          const fn = exOption['error']
          if (typeof fn === 'function') {
            errorFn = fn
          }
        }

        try {
          errorFn(xhr, errorType, error)
        } catch (ex) {
          console.error('error 回调时发生了错误', ex)
        }
      },

      // 请求完成时调用，无论请求失败或成功。
      complete: function (xhr, status) {
        // 结束计时
        console.timeEnd(timeKey)
        // 关闭加载动画
        loading.onAjaxDone()

        if (exOption && exOption['complete']) {
          const fn = exOption['complete']
          if (typeof fn === 'function') {
            try {
              fn(xhr, status)
            } catch (ex) {
              console.error('complete 回调时发生了错误', ex)
            }
          }
        }
      },
    }

    if (param instanceof self.FormData) {
      console.debug('ajax 是上传文件，修改options:', param)
      options.contentType = false
      options.processData = false
    }

    if (exOption) {
      // 如果有额外的选项
      const progressFn = exOption['progress']
      if (typeof progressFn === 'function') {
        // 如果需要监听进度
        options.xhr = function () {
          const xhr = $.ajaxSettings.xhr()
          if (xhr.upload) {
            xhr.upload.addEventListener('progress', progressFn, false)
            return xhr
          }
        }
      }
    }

    try {
      // 显示loading
      loading.onAjaxStart()

      // 开始计时
      console.time(timeKey)

      const handler = $.ajax(options)
      return handler
    } catch (e) {
      console.timeEnd(timeKey)
      loading.onAjaxDone()
      console.error('调用ajax时发送了错误', e)
    }
  },

  toJsonStr (obj) {
    return JSON.stringify(obj)
  },

  parserJson (strJSON) {
    return JSON.parse(strJSON)
  },

  /** 生成一个随机id */
  randomId () {
    const len = 20
    const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz'
    const maxPos = chars.length
    let str = ''
    for (let i = 0; i < len; i++) {
      str += chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return str
  },

  /**
   * 用逗号分隔显示数字,保留两位小数点
   * @param value:int 要格式的值
   * @param toFixed2:boolean  是否保留2位小数
   */
  numFormat (value, toFixed2) {
    if (!value) {
      if (toFixed2) {
        return '0.00'
      } else {
        return 0
      }
    }

    const intPart = Number(value).toFixed(0) // 获取整数部分
    const intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断

    let floatPart = ''
    if (toFixed2) {
      floatPart = '.' + parseInt(value * 100 % 100) // 小数位保留2位
      if (floatPart.length === 2) {
        // 如果加上小数点才2为长度，就补一个0在后面
        floatPart += '0'
      }
    }

    return intPartFormat + floatPart
  },

  /** unix时间 到年月日时间格式 */
  timeFormat (time, fmt) {
    const date = new Date(time)
    return this.dateFormat(date, fmt)
  },

  /**
   * 格式时间
   * - Format('yyyy-MM-dd hh:mm:ss.S') ==> 2006-07-02 08:09:04.423
   * - Format('yyyy-M-d h:m:s.S')      ==> 2006-7-2 8:9:4.18
   * @param date Date对象
   * @param fmt 格式字符串
   * @returns {string}
   */
  dateFormat (date, fmt) {
    if (!date) {
      return ''
    }

    const o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度,
      'S': date.getMilliseconds(), // 毫秒
    }
    let res = ''

    if (!this.isEmpty(fmt)) {
      res = fmt

      if (/(y+)/.test(fmt)) {
        res = res.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      }

      for (let k in o) {
        if (new RegExp('(' + k + ')').test(res)) {
          res = res.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
      }
    }
    return res
  },

  /** 判断字符串是否为空 */
  isEmpty (str) {
    if (str === null || str === undefined) {
      return true
    } else {
      let strValue = str.trim()
      return (strValue === '')
    }
  },

  /** 将字符串型的颜色转为 rgba数组 */
  colorHexToRgba (sColor, alpha) {
    // 十六进制颜色值的正则表达式
    let reg = /^#([0-9a-fA-F]{6})$/
    // 如果是16进制颜色
    if (sColor && reg.test(sColor)) {
      // 处理六位的颜色值
      let sColorChange = []
      for (let i = 1; i < 7; i += 2) {
        sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
      }

      sColorChange.push(alpha)

      return 'rgba(' + sColorChange.join(',') + ')'
    }
    return sColor
  },

  /** 友好的硬盘大小字符串, 用 K M G 表示 */
  toSizeStr (size) {
    let k = size / 1024
    if (k > 1024) {
      let m = k / 1024
      if (m > 1024) {
        return (m / 1024).toFixed(2) + 'G'
      } else {
        return m.toFixed(2) + 'M'
      }
    } else {
      return k.toFixed(2) + 'K'
    }
  },

}
