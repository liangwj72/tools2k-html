<template>
  <div>
    <!-- 自动刷新按钮 -->
    <auto-refresh
      :timer="false"
      @refresh="reload"></auto-refresh>

    <my-nav activeName="summary"></my-nav>

    <div class="main-content" v-show="!loading">
      <el-row>
        <el-col :span="12">
          <el-card class="article-small-card">
            <template slot="header" class="clearfix">
              <div>主机信息</div>
            </template>
            <el-form labelPosition="left"
                     label-width="120px">
              <el-form-item label="名称:" class="text-caption">{{vm.name}}</el-form-item>
              <el-form-item label="启动时间:" class="text-caption">{{vm.startTime | timeFormat}}</el-form-item>
              <el-form-item label="操作系统:" class="text-caption">{{os.name}}</el-form-item>
              <el-form-item label="体系结构:" class="text-caption">{{os.arch}}</el-form-item>
              <el-form-item label="处理器数量:" class="text-caption">{{os.availableProcessors}}</el-form-item>
            </el-form>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card class="article-small-card">
            <template slot="header" class="clearfix">
              <div>内存信息</div>
            </template>
            <el-form labelPosition="left"
                     label-width="120px">
              <el-form-item label="总物理内存:" class="text-caption">{{os.totalPhysicalMemorySize | sizeToM}}</el-form-item>
              <el-form-item label="空闲物理内存:" class="text-caption">{{os.freePhysicalMemorySize | sizeToM}}</el-form-item>
              <el-form-item label="总交换空间:" class="text-caption">{{os.totalSwapSpaceSize | sizeToM}}</el-form-item>
              <el-form-item label="提交的虚拟内存:" class="text-caption">{{os.committedVirtualMemorySize | sizeToM}}
              </el-form-item>
              <el-form-item label="空闲交换空间:" class="text-caption">{{os.freeSwapSpaceSize | sizeToM}}
              </el-form-item>
            </el-form>
          </el-card>

        </el-col>

      </el-row>

      <el-row>
        <el-col :span="12">
          <el-card class="article-small-card">
            <template slot="header" class="clearfix">
              <div>JRE信息 <small class="text-muted">{{updateTime | dateFormat}}</small></div>
            </template>

            <el-form labelPosition="left"
                     label-width="120px">
              <el-form-item label="JRE版本:" class="text-caption">{{vm.specVersion}}</el-form-item>
              <el-form-item label="型号:" class="text-caption">{{vm.vmName}}</el-form-item>
              <el-form-item label="供应商:" class="text-caption">{{vm.vmVendor}}</el-form-item>
              <el-form-item label="虚拟机版本:" class="text-caption">{{vm.vmVersion}}</el-form-item>
            </el-form>
          </el-card>

        </el-col>

        <el-col :span="12">
          <!-- 线程  -->
          <el-card class="article-small-card">
            <template slot="header" class="clearfix">
              <div>线程</div>
            </template>

            <el-form labelPosition="left"
                     label-width="120px">
              <el-form-item label="活动线程:" class="text-caption">{{threading.threadCount}}</el-form-item>
              <el-form-item label="线程峰值:" class="text-caption">{{threading.peakThreadCount}}</el-form-item>
              <el-form-item label="守护程序线程:" class="text-caption">{{threading.daemonThreadCount}}</el-form-item>
              <el-form-item label="累计启动线程数:" class="text-caption">{{threading.totalStartedThreadCount}}</el-form-item>
            </el-form>
          </el-card>
          <!-- /线程  -->
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">

          <el-card class="article-small-card">
            <template slot="header" class="clearfix">
              <div>类加载</div>
            </template>

            <el-form labelPosition="left"
                     label-width="120px">
              <el-form-item label="当前加载类:" class="text-caption">{{classLoading.loadedClassCount}}</el-form-item>
              <el-form-item label="累计加载类总数:" class="text-caption">{{classLoading.totalLoadedClassCount}}</el-form-item>
              <el-form-item label="已卸载类总数:" class="text-caption">{{classLoading.unloadedClassCount}}</el-form-item>
            </el-form>

          </el-card>
        </el-col>

        <el-col :span="12">

          <el-card class="article-small-card">
            <template slot="header" class="clearfix">
              <div>JRE启动参数</div>
            </template>

            <el-form labelPosition="left"
                     label-width="120px">
              <el-form-item label="启动参数:" class="text-caption">
                <div v-for="(str,index) in vm.inputArguments" :key="index">{{str}}</div>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>

    </div>
  </div>
</template>

<script>
  import apiUrl from '../../ApiUrl'
  import myUtil from '../../util/MyUtils'

  export default {

    /** 本页面的属性 */
    data() {
      return {
        loading: false,

        updateTime: new Date(), // 页面更新时间

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
    activated() {
      this.loading = true
      this.reload(false)
    },

    /** 本页面可用的方法 */
    methods: {

      reload(showMsg) {
        myUtil.ajax(apiUrl.commonRuntime.osInfo, {}, res => {
          this.loading = false
          this.classLoading = res.classLoading
          this.os = res.os
          this.threading = res.threading
          this.vm = res.vm
          this.updateTime = new Date()

          if (showMsg) {
            myUtil.showMsg('刷新成功')
          }
        })
      },
    },
  }
</script>
