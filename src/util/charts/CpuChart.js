import colors from './Colors'
import myUtil from '../MyUtils'

export default {
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
    }