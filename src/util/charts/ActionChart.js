import colors from './Colors'
import myUtil from '../MyUtils'

export default {
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
}