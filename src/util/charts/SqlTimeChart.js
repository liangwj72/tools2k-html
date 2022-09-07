import colors from './Colors'
import myUtil from '../MyUtils'

/** sql图表-执行时间 */
export default {
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
}