<!--
  线性图表
  Created by linQC on 2017/9/13 15:24.
-->

<template>
    <div class="chart-panel">
        <canvas ref="chartCanvas" height="150px"></canvas>
        <div class="down-txt" v-if="showAvg">平均值: {{avg}} {{avgPostFix}}/ 秒</div>
    </div>
</template>

<script>
    import Chart from 'chart.js'
    import ChartHelper from "../util/ChartHelper";

    export default {
        name: 'line-chart', // 只有是组件的时候才有用

        /** 本页面用到的组件 */
        components: {},

        props: {
            chartData: {
                type: Object,
                required: true,
            },
            chartOptions: {
                type: Object,
                required: true,
            },
            showAvg: {
                type: Boolean,
                default: false
            },
            avgPostFix: {
                type: String,
                default: ""
            }
        },

        /** 本页面的属性 */
        data() {
            return {
                chart: null,
                avg: 0,
            }
        },

        /** 构建页面时 */
        mounted() {
            this.createChart()
        },

        /** 本页面可用的方法 */
        methods: {
            /** mount的时候创建图表 */
            createChart() {

                let ctx = this.$refs.chartCanvas
                this.chart = new Chart(ctx, {
                    type: 'line',
                    data: this.chartData,
                    options: this.chartOptions,
                })
            },

            /** 更新图表 */
            updateChart() {
                this.chart.update()

                // 如果要显示平均值
                if (this.showAvg) {
                    let ds = this.chartData.datasets
                    let total = 0.0
                    if (ds && ds.length > 0) {
                        ds[0].data.forEach(num => {
                            total = total + parseFloat(num)
                        })
                    }
                    let timeDiff = ChartHelper.timeDiff
                    if (timeDiff && timeDiff > 0) {
                        this.avg = (total / timeDiff).toFixed(2)
                    } else {
                        this.avg = 0
                    }
                }
            },
        },
    }
</script>
