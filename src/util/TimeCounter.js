/**
 * Created by liangwj on 2017/6/2 0002.
 */

/**
 * 时间计算器对象
 * prop 是vue的数据，需要包含以下内容
 * - remainInSec 剩余秒数
 * - btnText 按钮上的文字
 * - btnStyle 按钮样式
 */
export default function (prop) {

  this.prop = prop

  this.timerHandler = null

  /** 启动定时器 */
  this.start = function (sec) {
    if (this.timerHandler !== null) {
      // 如果原来有定时器存在，就清除
      clearTimeout(this.timerHandler)
      this.timerHandler = null
    }

    // 加1秒，然后再减
    this.prop.remainInSec = sec + 1

    // 启动计数器
    this.onTimer()
  }

  /** 定时器处理者 */
  this.onTimer = function () {
    let that = this

    // 时间减少
    this.prop.remainInSec--
    // 更新按钮上的文字
    this.prop.btnText = this.prop.remainInSec + ' 秒'

    if (this.prop.remainInSec > 0) {
      // 如果时间未到，就继续启动计算器
      this.prop.btnStyle = 'disabled'
      this.timerHandler = setTimeout(function () {
        that.onTimer()
      }, 1000)
    } else {
      this.prop.remainInSec = 0
      this.prop.btnText = '重新发送'
      this.timerHandler = null
      this.prop.btnStyle = ''
    }
  }
}
