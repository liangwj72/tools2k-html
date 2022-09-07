import colors from './Colors'
import myUtil from '../MyUtils'

/** 发包-数量 */
export default {
    data: {
        labels: [], // 时间轴数组
        datasets: [
            {
                label: '10秒发包数量',
                fill: 'origin',
                data: [],
                pointRadius: 2.5,
                borderWidth: 1,
                borderColor: colors.sendPacket.count,
                backgroundColor: myUtil.colorHexToRgba(colors.sendPacket.count, 0.4),
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
            text: '10秒发包数量',
        },
        showLines: true,
        scaleGridLineWidth: 2,
        scaleShowGridLines: false,
        scaleShowLabels: false,
        datasetStrokeWidth: 2,
        responsive: true,
    },
}
