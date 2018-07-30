/**
 * Loading 的控制器
 * Created by liangwj on 2018/4/29 0029.
 */

const showDelay = 400 // ajax开始时，延时一会才显示文字，避免ajax太快时闪屏
const hideDelay = 400 // ajax结束后，延时一会才隐藏文字，避免在这个时候又发起新ajax时的闪屏

import MySetTimeOut from './MySetTimeOut'

export default {

  showTextDelayTimeout: new MySetTimeOut(), // 显示文字层的延时
  hideTextDelayTimeout: new MySetTimeOut(), // 隐藏文字层的延时

  textShowed: false, // 显示文字层

  /** 用于给vue文件绑定的数据 */
  vueData: {
    showMask: false, // 是否显示mask
    showText: false, // 是否显示文字
  },

  /** 重置为隐藏状态 */
  reset () {
    this.vueData.showMask = false
    this.vueData.showText = false
    this.clearShowTimeout()
    this.clearHideTimeout()
  },

  /** ajax开始的时候，调用该方法 */
  onAjaxStart () {
    this.showMask(true)

    // 延时显示文字
    if (!this.showTextDelayTimeout.running) {
      // 解除延时隐藏
      this.clearHideTimeout()

      // 如果不在延时，才需要创建延时显示
      console.debug('加载中：设置延时显示')
      this.showTextDelayTimeout.start(() => {
        console.debug('加载中：执行显示文字')
        this.showText(true)
        this.showTextDelayTimeout.cancel()
      }, showDelay)
    } else {
      console.debug('加载中：已经在延时显示了，无需创建新的延时')
    }
  },

  showMask (visible) {
    this.vueData.showMask = visible
  },

  showText (visible) {
    this.textShowed = visible
    this.vueData.showText = visible
  },

  /** ajax结束时，调用该方法 */
  onAjaxDone () {
    this.showMask(false)

    // 解除延时显示
    this.clearShowTimeout()

    if (!this.textShowed) {
      console.debug('加载中：ajax速度快，文字未显示出来就结束了')
      return
    }

    if (!this.hideTextDelayTimeout.running) {
      // 延时隐藏文字
      console.debug('加载中：设置延时隐藏')
      this.hideTextDelayTimeout.start(() => {
        console.debug('加载中：执行隐藏文字')
        this.showText(false)
        this.hideTextDelayTimeout.cancel()
      }, hideDelay)
    } else {
      console.debug('加载中：已经在延时隐藏了，无需创建新的延时')
    }
  },

  clearShowTimeout () {
    if (this.showTextDelayTimeout.running) {
      // 如果旧的显示延时还在，就清除
      console.debug('加载中：解除延迟显示')
      this.showTextDelayTimeout.cancel()
    }
  },

  clearHideTimeout () {
    if (this.hideTextDelayTimeout.running) {
      // 如果旧的隐藏延时还在，就清除
      console.debug('加载中：解除延迟隐藏')
      this.hideTextDelayTimeout.cancel()
    }
  },

}
