
import colors from './Colors'
import myUtil from '../MyUtils'

export default {
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
}