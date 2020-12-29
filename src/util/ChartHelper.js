/**
 * 图表帮助器
 * Created by liangwj on 2018/7/19 0019.
 */

import myUtil from './MyUtils'

/** 图表的颜色 */
const colors = {
  // 内存
  memory: {
    total: '#5CB85C', // 已分配
    used: '#5BC0DE', // 已使用
  },
  cpu: {
    jvm: '#9418de', // jvm
  },

  thread: '#93b13c',
  action: '#58ee4a',
  wsCount: {
    color0: '#e2cb15',
    color1: '#0f7ee2',
  },
}

export default {
  memoryChart: {
    data: {
      labels: [], // 时间轴数组
      datasets: [
        {
          label: '已分配内存',
          fill: '1',
          data: [],
          pointRadius: 2.5,
          borderWidth: 1,
          borderColor: colors.memory.total,
          backgroundColor: myUtil.colorHexToRgba(colors.memory.total, 0.4),
        },
        {
          label: '已经使用的内存',
          fill: 'origin',
          data: [],
          pointRadius: 2.5,
          borderWidth: 1,
          borderColor: colors.memory.used,
          backgroundColor: myUtil.colorHexToRgba(colors.memory.used, 0.5),
        },
      ],
    },
    options: {
      animation: false,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            callback: function (value) {
              return value + ' MB'
            },
          },
          gridLines: {
            display: false,
          },
        }],
      },
      layout: {
        padding: 15,
      },
      title: {
        display: true,
        text: '内存',
      },
      showLines: true,
      scaleGridLineWidth: 2,
      scaleShowGridLines: false,
      scaleShowLabels: false,
      datasetStrokeWidth: 2,
      responsive: true,
    },
  },

  cpuChart: {
    data: {
      labels: [], // 时间轴数组
      datasets: [
        {
          label: 'JVM负载',
          fill: 'origin',
          data: [],
          pointRadius: 2.5,
          borderWidth: 1,
          borderColor: colors.cpu.jvm,
          backgroundColor: myUtil.colorHexToRgba(colors.cpu.jvm, 0.4),
        },
      ],
    },
    options: {
      animation: false,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            callback: function (value) { // , index, values
              return value.toFixed(0) + '%'
            },
            suggestedMax: 100,
            suggestedMin: 0,
          },
          gridLines: {
            display: true,
          },
        }],
      },
      layout: {
        padding: 15,
      },
      title: {
        display: true,
        text: 'CPU使用情况',
      },
      showLines: true,
      scaleGridLineWidth: 2,
      scaleShowGridLines: false,
      scaleShowLabels: false,
      datasetStrokeWidth: 2,
      responsive: true,
    },
  },

  /** 线程 */
  threadChart: {
    data: {
      labels: [], // 时间轴数组
      datasets: [
        {
          label: '活动线程数',
          fill: 'origin',
          data: [],
          pointRadius: 2.5,
          borderWidth: 1,
          borderColor: colors.thread,
          backgroundColor: myUtil.colorHexToRgba(colors.thread, 0.4),
        },
      ],
    },
    options: {
      animation: false,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            suggestedMax: 100,
          },
          gridLines: {
            display: false,
          },
        }],
      },
      layout: {
        padding: 15,
      },
      title: {
        display: true,
        text: '线程',
      },
      showLines: true,
      scaleGridLineWidth: 2,
      scaleShowGridLines: false,
      scaleShowLabels: false,
      datasetStrokeWidth: 2,
      responsive: true,
    },
  },

  /** http动态请求 */
  actionChart: {
    data: {
      labels: [], // 时间轴数组
      datasets: [
        {
          label: 'HTTP动态请求数',
          fill: 'origin',
          data: [],
          pointRadius: 2.5,
          borderWidth: 1,
          borderColor: colors.action,
          backgroundColor: myUtil.colorHexToRgba(colors.action, 0.4),
        },
      ],
    },
    options: {
      animation: false,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            suggestedMax: 10,
          },
          gridLines: {
            display: false,
          },
        }],
      },
      layout: {
        padding: 5,
      },
      title: {
        display: true,
        text: 'HTTP动态请求数',
      },
      showLines: true,
      scaleGridLineWidth: 2,
      scaleShowGridLines: false,
      scaleShowLabels: false,
      datasetStrokeWidth: 2,
      responsive: true,
    },
  },

  wsCountChart: {
    data: {
      labels: [], // 时间轴数组
      datasets: [
        {
          label: '接收请求数',
          fill: 'false',
          data: [],
          pointRadius: 2.5,
          borderWidth: 1,
          borderColor: colors.wsCount.color0,
          backgroundColor: myUtil.colorHexToRgba(colors.wsCount.color0, 0.4),
        },
        {
          label: '发送消息数',
          fill: 'false',
          data: [],
          pointRadius: 2.5,
          borderWidth: 1,
          borderColor: colors.wsCount.color1,
          backgroundColor: myUtil.colorHexToRgba(colors.wsCount.color1, 0.4),
        },
      ],
    },
    options: {
      animation: false,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            suggestedMax: 10,
          },
          gridLines: {
            display: false,
          },
        }],
      },
      layout: {
        padding: 15,
      },
      title: {
        display: true,
        text: 'Web socket API 接收/发送 次数',
      },
      showLines: true,
      scaleGridLineWidth: 2,
      scaleShowGridLines: false,
      scaleShowLabels: false,
      datasetStrokeWidth: 2,
      responsive: true,
    },
  },

  wsPayloadChart: {
    data: {
      labels: [], // 时间轴数组
      datasets: [
        {
          label: '接收请求流量',
          fill: 'false',
          data: [],
          pointRadius: 2.5,
          borderWidth: 1,
          borderColor: colors.wsCount.color0,
          backgroundColor: myUtil.colorHexToRgba(colors.wsCount.color0, 0.4),
        },
        {
          label: '发送消息流量',
          fill: 'false',
          data: [],
          pointRadius: 2.5,
          borderWidth: 1,
          borderColor: colors.wsCount.color1,
          backgroundColor: myUtil.colorHexToRgba(colors.wsCount.color1, 0.4),
        },
      ],
    },
    options: {
      animation: false,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            suggestedMax: 10,
            callback: function (value) { // , index, values
              return value + ' K'
            },
          },
          gridLines: {
            display: false,
          },
        }],
      },
      layout: {
        padding: 5,
      },
      title: {
        display: true,
        text: 'Web socket API 流量',
      },
      showLines: true,
      scaleGridLineWidth: 2,
      scaleShowGridLines: false,
      scaleShowLabels: false,
      datasetStrokeWidth: 2,
      responsive: true,
    },
  },

  /** sql图表-执行时间 */
  sqlTimeChart: {
    data: {
      labels: [
        '0-1毫秒',
        '1-10毫秒',
        '10-100毫秒',
        '100-1000毫秒',
        '1-10秒次数',
        '10-100秒',
        '100-1000秒',
        '大于1000秒',
      ], // X轴数组
      datasets: [
        {
          label: 'sql执行时间',
          data: [0, 0, 0, 2, 0, 0, 0, 0],
          pointRadius: 2.5,
          borderWidth: 1,
          borderColor: colors.action,
          backgroundColor: myUtil.colorHexToRgba(colors.action, 0.4),
        },
      ],
    },
    options: {
      animation: false,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            suggestedMax: 100,
          },
          gridLines: {
            display: false,
          },
        }],
      },
      layout: {
        padding: 5,
      },
      showLines: true,
      scaleGridLineWidth: 2,
      scaleShowGridLines: false,
      scaleShowLabels: false,
      datasetStrokeWidth: 2,
      responsive: true,
    },
  },

  /** 将内存转为 MB各位 */
  toMemoryM(value) {
    return (value / 1024 / 1024).toFixed(2)
  },


}
