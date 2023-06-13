<!--
  线性图表
  Created by linQC on 2017/9/13 15:24.
-->

<template>
  <div class="chart-panel">
    <canvas ref="chartCanvas" height="228px" width="500px"></canvas>
  </div>
</template>

<script>
  const Chart = require('chart.js')
  import myUtil from "../util/MyUtils";

  export default {
    name: 'bar-chart', // 只有是组件的时候才有用

    /** 本页面用到的组件 */
    components: {},

    props: {
      color: {
        type: String,
        required: false,
        default: '#0f7ee2',
      },
      title: {
        type: String,
        required: true,
      },
      labels: {
        type: Array,
        required: true,
      },
      xdata: {
        type: Array,
        required: true,
      },
    },

    /** 本页面的属性 */
    data() {
      return {
        chart: null,
        gradient: null,

        chartData: {
          labels: this.labels, // X轴数组
          datasets: [
            {
              label: this.title,
              data: this.xdata,
              pointRadius: 2.5,
              borderWidth: 1,
              borderColor: this.color,
            },
          ],
        },

        chartOptions: {
          animation: false,
          showScale: false,
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
                suggestedMax: 5,
              },
              gridLines: {
                display: false,
              },
            }],
          },
          layout: {
            padding: 0,
          },
          // showLines: true,
          scaleGridLineWidth: 2,
          scaleShowGridLines: false,
          scaleShowLabels: false,
          datasetStrokeWidth: 2,
          responsive: true,
        },
      }
    },

    watch: {
      xdata(value) {
        this.chartData.datasets[0].data = value
        // console.debug('更新柱图数据 watch:',this.chartData.datasets[0].data)
        this.chart.update()
      },
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
        let gradient = ctx
          .getContext("2d")
          .createLinearGradient(0, 0, 0, 500)
        gradient.addColorStop(0, myUtil.colorHexToRgba(this.color, 0.8))
        gradient.addColorStop(1, myUtil.colorHexToRgba(this.color, 0.25))
        // this.gradient.addColorStop(1, myUtil.colorHexToRgba(this.color,0))
        this.chartData.datasets[0].backgroundColor = gradient

        this.chart = new Chart(ctx, {
          type: 'bar',
          data: this.chartData,
          options: this.chartOptions,
        })

      },

      /** 更新图表 */
      updateChart(labels, data) {
        this.chartData.datasets[0].data = data
        this.chartData.labels = labels
        this.chart.update()
      },
    },
  }
</script>
