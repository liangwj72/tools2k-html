/**
 * 图表帮助器
 * Created by liangwj on 2018/7/19 0019.
 */

import MemoryChart from './charts/MemoryChart'
import CpuChart from './charts/CpuChart'
import ThreadChart from './charts/ThreadChart'
import ActionChart from './charts/ActionChart'
import WsCountChart from './charts/WsCountChart'
import WsPayloadChart from './charts/WsPayloadChart'
import SqlTimeChart from './charts/SqlTimeChart'
import SendPacketCountChart from './charts/SendPacketCountChart'
import SendPacketPayloadChart from './charts/SendPacketPayloadChart'
import myUtil from './MyUtils'
import MyUtils from './MyUtils'
import serverContext from "./ServerContext";

export default {

    /** 发包-数量 */
    sendPacketCountChart: SendPacketCountChart,
    /** 发包-流量 */
    sendPacketPayloadChart: SendPacketPayloadChart,
    /** 评价发包-数量 */
    avgSendPacketCount: 0,
    /** 平均发包流量 */
    avgSendPacketPayload: 0,

    memoryChart: MemoryChart, // 内存

    cpuChart: CpuChart, // CPU

    /** 线程 */
    threadChart: ThreadChart,

    /** http动态请求 */
    actionChart: ActionChart,

    /** WS连接数 */
    wsCountChart: WsCountChart,

    /** WS流量 */
    wsPayloadChart: WsPayloadChart,

    /** sql图表-执行时间 */
    sqlTimeChart: SqlTimeChart,

    /** 线图的时长（秒） */
    timeDiff: 0,

    /** 更新图表信息 */
    onDataLoad(list) {
        const labels = [] // 时间轴

        const totalMemory = [] // 已分配内存
        const usedMemory = [] // 已经使用的内存
        const cpuJvm = [] // JVM负载
        const thread = [] // 线程
        const action = [] // http动态请求数
        const wsCountUp = [] // ws请求数
        const wsCountDown = [] // ws发送次数
        const wsPayloadUp = [] // ws上行流行
        const wsPayloadDown = [] // ws下行流量
        const sendPacketCount = [] // 发包数
        const sendPacketPayload = [] // 发包流量

        let minTime = 0
        let maxTime = 0

        for (let row of list) {
            // 找到最大时间和最小时间
            let time = row.recordTime
            if (minTime == 0 || minTime > time) {
                minTime = time
            }
            if (maxTime < time) {
                maxTime = time
            }
            // 获得总时长
            if (maxTime - minTime > 0) {
                this.timeDiff = (maxTime - minTime) / 1000 + 10 // 最大时间和最小时间的差异变成秒，再加10秒
            } else {
                this.timeDiff = 0
            }

            // 时间轴数据
            labels.push(myUtil.timeFormat(time, 'hh:mm:ss'))

            // 内存图表的数据
            totalMemory.push(MyUtils.toMemoryM(row.memory.totalMemory))
            usedMemory.push(MyUtils.toMemoryM(row.memory.usedMemory))

            // CPU 图表
            cpuJvm.push(Math.round(row.processCpuLoad * 100) / 100)

            thread.push(row.threadCount) // 线程
            action.push(row.actionCount) // http动态请求数
            wsCountUp.push(row.wsUpCount)  // ws请求数
            wsCountDown.push(row.wsUpCount) // ws发送次数
            wsPayloadUp.push(this.sizeToK(row.wsUpPayload)) // ws上行流行
            wsPayloadDown.push(this.sizeToK(row.wsDownPayload)) // ws下行流量

            sendPacketCount.push(row.sendPacketCount) // 发包数量
            sendPacketPayload.push(this.sizeToK(row.sendPacketPayload / 10)) // 发包流量
        }


        this.updateMemoryChart(labels, totalMemory, usedMemory) // 更新内存图
        this.updateCpuChart(labels, cpuJvm) // 更新cpu图
        this.updateThreadChart(labels, thread) // 更新线程图
        this.updateActionChart(labels, action) // 更新动态请求图

        if (serverContext.serverInfo.hasWsApiImpl) {
            this.updateWsCountChart(labels, wsCountUp, wsCountDown) // 更新ws次数
            this.updateWsPayloadChart(labels, wsPayloadUp, wsPayloadDown) // 更新ws流量
        }

        if (serverContext.serverInfo.hasSendPacketData) {
            // console.debug("更新发包图表----")
            this.updateSendPacketCountChart(labels, sendPacketCount) // 发包数量
            this.updateSendPacketPayloadChart(labels, sendPacketPayload) // 发包流量
        }

    },

    /** 更新ws 次数图表 */
    updateWsCountChart(labels, data0, data1) {
        const chartData = this.wsCountChart.data
        chartData.datasets[0].data = data0
        chartData.datasets[1].data = data1
        chartData.labels = labels
    },
    /** 更新ws 流量图表 */
    updateWsPayloadChart(labels, data0, data1) {
        const chartData = this.wsPayloadChart.data
        chartData.datasets[0].data = data0
        chartData.datasets[1].data = data1
        chartData.labels = labels
    },

    /** 更新线程图表 */
    updateActionChart(labels, data0) {
        const chartData = this.actionChart.data
        chartData.datasets[0].data = data0
        chartData.labels = labels
    },

    /** 更新发包数量图表 */
    updateSendPacketCountChart(labels, data0) {
        const chartData = this.sendPacketCountChart.data
        chartData.datasets[0].data = data0
        chartData.labels = labels
    },

    /** 更新发包流量图表 */
    updateSendPacketPayloadChart(labels, data0) {
        const chartData = this.sendPacketPayloadChart.data
        chartData.datasets[0].data = data0
        chartData.labels = labels
    },

    /** 更新线程图表 */
    updateThreadChart(labels, data0) {
        const chartData = this.threadChart.data
        chartData.datasets[0].data = data0
        chartData.labels = labels
    },

    /** 更新cpu图表 */
    updateCpuChart(labels, data0) {
        const chartData = this.cpuChart.data
        chartData.datasets[0].data = data0
        chartData.labels = labels

    },

    /** 更新内存图表 */
    updateMemoryChart(labels, totalMemory, usedMemory) {
        const chartData = this.memoryChart.data
        chartData.datasets[0].data = totalMemory
        chartData.datasets[1].data = usedMemory
        chartData.labels = labels

    },

    sizeToK(size) {
        return (size / 1024).toFixed(2)
    },
}
