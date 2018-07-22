<!--
  自动刷新按钮
-->
<style lang="less">
  .auto-refresh {
    /*width: 92px;*/
    z-index: 10;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);

    .el-button {
      background-color: rgba(255, 255, 255, 0.4);
    }

    .iconfont {
      line-height: 14px;
    }

    .btn-left {
      width: 50px;
      padding: 9px 5px;
      text-align: left;
    }

    &.fixed-refresh {
      position: fixed;
      top: 78px;
      right: 35px;
    }
  }
</style>

<template>

  <el-button-group class="auto-refresh" :class="getClass()">
    <el-button size="medium"
               @click="handleClick">刷新
    </el-button>
    <el-button size="medium"
               @click="playOrPause"
               class="btn-left"><i class="iconfont" :class="getIconClass()"></i>
      <span v-if="playing">{{remainInSec}}</span>
    </el-button>
  </el-button-group>
</template>

<script>
  let timerHandler = null

  export default {
    name: 'auto-refresh', // 只有是组件的时候才有用

    /** 本页面用到的组件 */
    components: {},

    /** 组件的属性，只有是组件的时候才有用 */
    props: {
      // 自动刷新的周期，默认10秒
      interval: {
        type: Number,
        default: 10,
      },

      fixed: {
        type: Boolean,
        default: true,
      },

      timer: {
        type: Boolean,
        default: true,
      },
    },

    /** 本页面的属性 */
    data () {
      return {
        remainInSec: 0,

        /** 是否在倒计时 */
        playing: this.timer,
      }
    },

    /** 计算属性 */
    computed: {},

    /** 每次进入页面时 */
    activated () {
      this.startTimer()
    },

    /** 每次退出页面时 */
    deactivated () {
      this.clearTimer()
    },

    /** 本页面可用的方法 */
    methods: {
      getIconClass () {
        return {
          'icon-play': this.playing,
          'icon-pause': !this.playing,
        }
      },

      getClass () {
        return {
          'fixed-refresh': this.fixed,
        }
      },

      startTimer () {
        this.clearTimer() // 清理原来的定时器
        // 初始化 剩余时间，先加1秒，然后再减
        this.remainInSec = this.interval + 1

        if (this.playing) {
          // 启动计时器
          this.onTimer()
        }
      },

      /** 定时器处理者 */
      onTimer () {
        if (!this.playing) {
          return
        }

        const that = this
        timerHandler = setTimeout(function () {
          that.onTimer()
        }, 1000)

        // 时间减少
        this.remainInSec--

        if (this.remainInSec === 0) {
          // 如果时间到了，就触发事件,并充值计数器
          this.remainInSec = this.interval
          this.fireEvent()
        }
      },

      /** 停止倒计时 */
      clearTimer () {
        if (timerHandler !== null) {
          // 如果原来有定时器存在，就清除
          clearTimeout(timerHandler)
          timerHandler = null
        }
      },

      /** 派发事件 */
      fireEvent () {
        this.$emit('refresh')
      },

      handleClick () {
        this.startTimer()
        this.fireEvent()
      },

      /** 继续，或者暂停 */
      playOrPause () {
        this.playing = !this.playing
        this.startTimer()
      },
    },
  }
</script>
