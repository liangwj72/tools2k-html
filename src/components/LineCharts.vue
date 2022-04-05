<!--
  线性图表
  Created by linQC on 2017/9/13 15:24.
-->

<template>
  <div class="chart-panel">
    <canvas ref="chartCanvas" height="150px"></canvas>
  </div>
</template>

<script>
  import Chart from 'chart.js'

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
    },

    /** 本页面的属性 */
    data () {
      return {
        chart: null,
      }
    },

    /** 构建页面时 */
    mounted () {
      this.createChart()
    },

    /** 本页面可用的方法 */
    methods: {
      /** mount的时候创建图表 */
      createChart () {

        let ctx = this.$refs.chartCanvas
        this.chart = new Chart(ctx, {
          type: 'line',
          data: this.chartData,
          options: this.chartOptions,
        })
      },

      /** 更新图表 */
      updateChart () {
        this.chart.update()
      },
    },
  }
</script>
