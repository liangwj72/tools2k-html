<!--
  Created by linQC on 2017/9/13 15:24.
-->

<template>
  <div class="chart-panel">
    <canvas :id="cid"></canvas>
  </div>
</template>

<script>
  import Chart from 'chart.js'

  export default {
    /** 本页面用到的组件 */
    components: {
      Chart,
    },
    props: ['chartData', 'chartOptions', 'id'],
    /** 本页面的属性 */
    data () {
      return {
        chart: '',
        data: this.chartData,
        options: this.chartOptions,
        cid: '',
        downData: [],
        isDown: false,
        downIndex: -1,
      }
    },
    watch: {
      chartData: function (newValue) {
        this.updateChart()
      },
    },

    /** 计算属性 */
    computed: {},

    beforeMount () {
      this.cid = this.id
    },
    /** 构建页面时 */
    mounted () {
      this.createChart()
    },

    /** 每次进入页面时 */
    activated () {

    },

    /** 每次退出页面时 */
    deactivated () {
      console.log('ddd')
    },
    beforeDestroy () {
      if (this.isDown) {
        let last = this.data.datasets.length - 1
        this.data.datasets.splice(last, 1)
        this.chart.destroy()
      }
    },
    /** 本页面可用的方法 */
    methods: {
      createChart () {
        let ctx = document.getElementById(this.cid)
        this.chart = new Chart(ctx, {
          type: 'line',
          data: this.data,
          options: this.options,
        })
      },
      updateChart () {
        this.chart.update()
      },
      /** 添加宕机的配置 */
      addDown () {
        this.isDown = true
        this.data.datasets.push({
          label: '宕机',
          fill: 'true',
          data: [],
          pointRadius: 2.5,
          borderWidth: 1,
          borderColor: '#FF6666',
          backgroundColor: '#FF6666',
        })
        this.downIndex = this.data.datasets.length - 1
        this.chart.update()
      },
      /** 添加宕机的数据 并格式化普通数据 */
      updateDown (down) {
        this.downData = down
        let downData = []
        let min = []
        /** 正常数据中过滤掉宕机的数据 并取出所有数据中最小值 */
        for (let x in this.data.datasets) {
          min.push(Math.min.apply(null, this.data.datasets[x].data))
          let arr = []
          for (let i in this.data.datasets[x].data) {
            if (down[i] === 1) {
              arr.push(undefined)
            } else {
              arr.push(this.data.datasets[x].data[i])
            }
          }
          this.data.datasets[x].data = arr
        }
        let result = Math.min.apply(null, min)
        if (isNaN(result)) {
          result = 0
        }
        /** 遍历宕机的数组 为0表示没宕机 不显示数据点 */
        for (let c in down) {
          if (down[c]) {
            downData.push(result)
          } else {
            downData.push(undefined)
          }
        }
        this.data.datasets[this.downIndex].data = downData
        this.chart.update()
      },
    },
  }
</script>

<!--<style scoped>-->
<style>
  .chart-panel {
    width: 50vw;
    border: 1px solid #000;
    border-radius: 4px;
    margin: 10px 0;
    padding: 10px;
  }
</style>
