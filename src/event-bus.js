/** 事件总线 */

import Vue from 'vue'

/** 事件名称 */
const eventName = {
  showMBeanDetail: "showMBeanDetail", // 打开MBean详情，需要的参数{objectName}
  showUriStatDetail: "showUriStatDetail", // 查看时长段详情，需要的参数{row}
}

export default {
  /** 事件名称 */
  eventName: eventName,

  install() {
    // 随便起一个变量，用于做事件总线，监听和派发事件
    Vue.prototype.$eventBus = new Vue()
  },

  /**
   * 显示MBean详情
   * @param objectName
   */
  showMBeanDetail(objectName) {
    const param = {
      objectName: objectName,
    }
    Vue.prototype.$eventBus.$emit(eventName.showMBeanDetail, param)
  },

  /**
   * 查看时长段详情，需要的参数{row}
   */
  showUriStatDetail(row) {
    const param = {
      row: row,
    }
    Vue.prototype.$eventBus.$emit(eventName.showUriStatDetail, param)
  },

}
