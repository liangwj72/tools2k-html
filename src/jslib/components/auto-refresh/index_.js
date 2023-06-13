let timerHandler = null;

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

        // 同el-button的size
        size: {
            type: String,
            default: 'mini',
        },

        timer: {
            type: Boolean,
            default: true,
        },
    },

    /** 本页面的属性 */
    data() {
        return {
            remainInSec: 0,

            /** 是否在倒计时 */
            playing: this.timer,
        };
    },

    /** 计算属性 */
    computed: {
        iconClass() {
            return this.playing ? 'el-icon-video-pause' : 'el-icon-video-play';
        },

        fixedClass() {
            return {
                'fixed-refresh': this.fixed,
            };
        },
    },

    /** 构建页面时被调用，如果该页面是keeeoAlive的，接着会调用 activated */
    mounted() {
        this.startTimer();
    },

    /** 每次进入页面时 */
    activated() {
        this.startTimer();
    },

    /** 每次退出页面时 */
    deactivated() {
        this.clearTimer();
    },

    /** 本页面可用的方法 */
    methods: {

        startTimer() {
            this.clearTimer(); // 清理原来的定时器
            // 初始化 剩余时间，先加1秒，然后再减
            this.remainInSec = this.interval + 1;

            if (this.playing) {
                // 启动计时器
                this.onTimer();
            }
        },

        /** 定时器处理者 */
        onTimer() {
            if (!this.playing) {
                return;
            }

            const that = this;
            timerHandler = setTimeout(function () {
                that.onTimer();
            }, 1000);

            // 时间减少
            this.remainInSec--;

            if (this.remainInSec === 0) {
                // 如果时间到了，就触发事件,并充值计数器
                this.remainInSec = this.interval;
                this.fireEvent(false);
            }
        },

        /** 停止倒计时 */
        clearTimer() {
            if (timerHandler !== null) {
                // 如果原来有定时器存在，就清除
                clearTimeout(timerHandler);
                timerHandler = null;
            }
        },

        /** 派发事件 */
        fireEvent(showMsg) {
            this.$emit('refresh', showMsg);
        },

        onClickRefresh() {
            this.startTimer();
            this.fireEvent(true);
        },

        /** 继续，或者暂停 */
        playOrPause() {
            this.playing = !this.playing;
            this.startTimer();
        },
    },
};
