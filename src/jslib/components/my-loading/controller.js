/**
 * Loading 的控制器
 * Created by liangwj on 2018/4/29 0029.
 */

const showDelay = 350 // ajax开始时，延时一会才显示文字，避免ajax太快时闪屏

import MySetTimeOut from '../../utils/my.set.timeout'

export default {

    showTextDelayTimeout: new MySetTimeOut(), // 显示文字层的延时

    loadingCount: 0, // 计数器

    /** 用于给vue文件绑定的数据 */
    vueData: {
        showMask: false, // 是否显示mask
        showText: false, // 是否显示文字
    },

    /** 重置为隐藏状态 */
    reset() {
        this.vueData.showMask = false
        this.vueData.showText = false
        this.loadingCount = 0
        this.showTextDelayTimeout.reset()
    },

    /** ajax开始的时候，调用该方法 */
    pageLoadingOpen() {
        // 用一个计数器防止多次ajax请求时，重复执行
        this.loadingCount++; // 计数器+1

        this.showMask(true)

        // 延时显示文字
        if (!this.showTextDelayTimeout.running) {

            // 如果不在延时，才需要创建延时显示
            console.debug('加载中：设置延时显示')
            this.showTextDelayTimeout.start(() => {
                console.debug('加载中：执行显示文字')
                this.showText(true)
            }, showDelay)
        } else {
            console.debug('加载中：已经在延时显示了，无需创建新的延时')
        }
    },

    showMask(visible) {
        this.vueData.showMask = visible
    },

    showText(visible) {
        this.vueData.showText = visible
    },

    /** ajax结束时，调用该方法 */
    pageLoadingClose() {
        this.loadingCount--
        if (this.loadingCount < 0) {
            this.loadingCount = 0
        }

        if (this.loadingCount <= 0) {
            // 如果已经时最后一次请求了
            this.showMask(false)
            this.showText(false)

            // 解除延时显示
            if (this.showTextDelayTimeout.running) {
                this.showTextDelayTimeout.reset()
            }
            console.debug('加载中：隐藏')
        }
    },
}