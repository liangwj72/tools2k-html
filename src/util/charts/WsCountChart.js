import colors from './Colors'
import myUtil from '../MyUtils'

export default {
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
}