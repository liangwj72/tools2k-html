<template>
  <div>
    <!-- 自动刷新按钮 -->
    <auto-refresh
      :timer="false"
      @refresh="reload"></auto-refresh>

    <my-nav activeName="summary"></my-nav>

    <div class="main-content" v-show="!loading">
      <el-card class="article">
        <h4>虚拟机信息</h4>
        <hr/>
        <el-row :gutter="10">
          <el-col :span="12">
            <div class="flex-container">
              <div class="l-width150">名称:</div>
              <div class="flex1 text-caption">{{vm.name}}</div>
            </div>
            <div class="flex-container">
              <div class="l-width150">启动时间:</div>
              <div class="flex1 text-caption">{{vm.startTime | timeFormat}}</div>
            </div>
            <div class="flex-container">
              <div class="l-width150">java版本:</div>
              <div class="flex1 text-caption">{{vm.specVersion}}</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="flex-container">
              <div class="l-width150">型号:</div>
              <div class="flex1 text-caption">{{vm.vmName}}</div>
            </div>
            <div class="flex-container">
              <div class="l-width150">供应商:</div>
              <div class="flex1 text-caption">{{vm.vmVendor}}</div>
            </div>
            <div class="flex-container">
              <div class="l-width150">虚拟机版本:</div>
              <div class="flex1 text-caption">{{vm.vmVersion}}</div>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="flex-container">
              <div class="l-width150">启动参数</div>
              <div class="flex1 text-caption" style="line-height: 25px">
                <div v-for="str in vm.inputArguments">{{str}}</div>
              </div>
            </div>
          </el-col>
        </el-row>

        <h4>线程和类加载</h4>
        <hr/>
        <el-row :gutter="10">
          <el-col :span="12">
            <div class="flex-container">
              <div class="l-width150">活动线程:</div>
              <div class="flex1 text-caption">{{threading.threadCount}}</div>
            </div>
            <div class="flex-container">
              <div class="l-width150">线程峰值:</div>
              <div class="flex1 text-caption">{{threading.peakThreadCount}}</div>
            </div>
            <div class="flex-container">
              <div class="l-width150">守护程序线程:</div>
              <div class="flex1 text-caption">{{threading.daemonThreadCount}}</div>
            </div>
            <div class="flex-container">
              <div class="l-width150">累计启动线程数:</div>
              <div class="flex1 text-caption">{{threading.totalStartedThreadCount}}</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="flex-container">
              <div class="l-width150">当前加载类:</div>
              <div class="flex1 text-caption">{{classLoading.loadedClassCount}}</div>
            </div>
            <div class="flex-container">
              <div class="l-width150">累计加载类总数:</div>
              <div class="flex1 text-caption">{{classLoading.totalLoadedClassCount}}</div>
            </div>
            <div class="flex-container">
              <div class="l-width150">已卸载类总数:</div>
              <div class="flex1 text-caption">{{classLoading.unloadedClassCount}}</div>
            </div>
          </el-col>
        </el-row>

        <h4>硬件和操作系统</h4>
        <hr/>
        <el-row :gutter="10">
          <el-col :span="12">
            <div class="flex-container">
              <div class="l-width150">操作系统:</div>
              <div class="flex1 text-caption">{{os.name}}</div>
            </div>
            <div class="flex-container">
              <div class="l-width150">体系结构:</div>
              <div class="flex1 text-caption">{{os.arch}}</div>
            </div>
            <div class="flex-container">
              <div class="l-width150">处理器数量:</div>
              <div class="flex1 text-caption">{{os.availableProcessors}}</div>
            </div>
            <div class="flex-container">
              <div class="l-width150">提交的虚拟内存:</div>
              <div class="flex1 text-caption">{{os.committedVirtualMemorySize | sizeToM}}</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="flex-container">
              <div class="l-width150">总物理内存:</div>
              <div class="l-width150 text-caption">{{os.totalPhysicalMemorySize | sizeToM}}</div>
              <div class="flex1 text-caption"></div>
            </div>
            <div class="flex-container">
              <div class="l-width150">空闲物理内存:</div>
              <div class="l-width150 text-caption">{{os.freePhysicalMemorySize | sizeToM}}</div>
              <div class="flex1 text-caption"></div>
            </div>
            <div class="flex-container">
              <div class="l-width150">总交换空间:</div>
              <div class="l-width150 text-caption">{{os.totalSwapSpaceSize | sizeToM}}</div>
              <div class="flex1 text-caption"></div>
            </div>
            <div class="flex-container">
              <div class="l-width150">空闲交换空间:</div>
              <div class="l-width150 text-caption">{{os.freeSwapSpaceSize | sizeToM}}</div>
              <div class="flex1 text-caption"></div>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
  import apiUrl from '../../ApiUrl'
  import myUtil from '../../util/MyUtils'

  export default {

    /** 本页面的属性 */
    data () {
      return {
        loading: false,

        classLoading: {
          loadedClassCount: 11296,
          totalLoadedClassCount: 11296,
          unloadedClassCount: 0,
        },
        os: {
          arch: 'amd64',
          availableProcessors: 8,
          committedVirtualMemorySize: 1016954880,
          freePhysicalMemorySize: 9262739456,
          freeSwapSpaceSize: 9011646464,
          name: 'Windows 10',
          processCpuLoad: 0.048939607017920904,
          processCpuTime: 14531250000,
          systemCpuLoad: 0.24856311279013366,
          totalPhysicalMemorySize: 17093902336,
          totalSwapSpaceSize: 19644039168,
          version: 10.0,
        },
        threading: {
          daemonThreadCount: 25,
          peakThreadCount: 32,
          threadCount: 32,
          totalStartedThreadCount: 38,
        },
        vm: {
          inputArguments: [
            '-agentlib:jdwp=transport=dt_socket,suspend=y,address=localhost:6739',
            '-Dcom.sun.management.jmxremote',
            '-Dcom.sun.management.jmxremote.port=6738',
            '-Dcom.sun.management.jmxremote.authenticate=false',
            '-Dcom.sun.management.jmxremote.ssl=false',
            '-Djava.rmi.server.hostname=localhost',
            '-Dspring.application.admin.enabled=true',
            '-Xverify:none',
            '-XX:TieredStopAtLevel=1',
            '-Dfile.encoding=UTF-8',
          ],
          name: '4916@LiangWJ-Z7M',
          specVersion: 1.8,
          startTime: 1532263770344,
          vmName: 'Java HotSpot(TM) 64-Bit Server VM',
          vmVendor: 'Oracle Corporation',
          vmVersion: '25.152-b16',
        },
      }
    },

    /** 计算属性 */
    computed: {},

    /** 每次进入页面时 */
    activated () {
      this.loading = true
      this.reload(false)
    },

    /** 本页面可用的方法 */
    methods: {

      reload (showMsg) {
        myUtil.ajax(apiUrl.commonRuntime.osInfo, {}, res => {
          this.loading = false
          this.classLoading = res.classLoading
          this.os = res.os
          this.threading = res.threading
          this.vm = res.vm

          if (showMsg) {
            myUtil.showMsg('刷新成功')
          }
        })
      },
    },
  }
</script>
