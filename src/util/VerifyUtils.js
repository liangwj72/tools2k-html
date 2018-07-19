/**
 * Created by liangwj on 2018/7/19 0019.
 */

export default {

  /** 是否是手机号 */
  isPhone (str) {
    if (this.isEmpty(str)) {
      return false
    }

    let isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/
    let isMobile = /^[1][34578][0-9]{9}$/
    return isMobile.test(str) || isPhone.test(str)
  },

  /** 是否是手机号 */
  isSmsCode (str) {
    if (this.isEmpty(str)) {
      return false
    }

    let isCode = /^[0-9]{6}$/
    return isCode.test(str)
  },

  /** 是否邮箱 */
  isEmail (str) {
    if (this.isEmpty(str)) {
      return false
    }

    let reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
    return reg.test(str)
  },

  /** 是否身份证号 */
  isIDCard (str) {
    if (this.isEmpty(str)) {
      return false
    }

    let reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
    return reg.test(str)
  },
}
