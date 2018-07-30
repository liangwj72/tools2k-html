/**
 * 用于处理index页面的时间
 * Created by liangwj on 2018/1/23 0023.
 */

export default {
  hideAppLoadingEvent: 'hideAppLoadingEvent', // 隐藏页面加载层

  /** 发送事件 */
  dispatchEvent (eventName, eventData) {
    let event = new Event(eventName, eventData)
    window.dispatchEvent(event)
  },

  /** 派发要显示登录窗口的时间通知 index页面，显示动画 */
  hideAppLoading () {
    this.dispatchEvent(this.hideAppLoadingEvent)
  },

}
