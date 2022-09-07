import colors from './Colors'
import myUtil from '../MyUtils'

export default {
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
}

