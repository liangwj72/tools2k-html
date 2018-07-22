/**
 * 所有api url的定义，这个定义的内容是直接从后端的开发界面中拷贝出来的，不需要自己手写，没事也不要自己手写
 *
 * Created by liangwj
 */
export default {
  /** 框架-公开 */
  commonPublic: {
    getServerStatus: '/api/commonPublic/getServerStatus', //  获取服务器信息
    login: '/api/commonPublic/login', //  登录
    logout: '/api/commonPublic/logout', //  登出
    passwordDemo: '/api/commonPublic/passwordDemo', //  创建密码例子
  },
  /** 框架-运行状态 */
  commonRuntime: {
    osInfo: '/api/commonRuntime/osInfo', //  操作系统和虚拟机信息
    runtimeHistory: '/api/commonRuntime/runtimeHistory', //  运行图表
    wsConnectList: '/api/commonRuntime/wsConnectList', //  链接列表
    wsResetCounter: '/api/commonRuntime/wsResetCounter', //  重试ws计数器
  },
  /** 字典-附件文件管理 */
  dictAttachments: {
    delete: '/api/dictAttachments/delete', //  删除
    list: '/api/dictAttachments/list', //  获取所有附件
    save: '/api/dictAttachments/save', //  新增或者保存键值
  },
  /** 字典-词条管理 */
  dictManager: {
    delete: '/api/dictManager/delete', //  删除
    importXml: '/api/dictManager/importXml', //  导入xml
    save: '/api/dictManager/save', //  新增或者保存键值
    search: '/api/dictManager/search', //  根据关键字搜索
  },
  /** JmxInWeb-JMX管理 */
  jmxInWeb: {
    changeAttr: '/api/jmxInWeb/changeAttr', //  改变一个属性
    getMBeanInfo: '/api/jmxInWeb/getMBeanInfo', //  获取一个MBean的详情
    getMBeanList: '/api/jmxInWeb/getMBeanList', //  获取所有的MBean
    invokeOpt: '/api/jmxInWeb/invokeOpt', //  调用一个方法
  },
  /** JmxInWeb-Ws Api状态 */
  jmxInWebWs: {
    wsConnectList: '/api/jmxInWebWs/wsConnectList', //  链接列表
    wsRuntimeHistory: '/api/jmxInWebWs/wsRuntimeHistory', //  运行图表
  },
}
