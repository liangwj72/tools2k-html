import colors from './Colors'
import myUtil from '../MyUtils'

export default {
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
}

