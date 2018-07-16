/**
 * 所有api url的定义，这个定义的内容是直接从后端的开发界面中拷贝出来的，不需要自己手写，没事也不要自己手写
 *
 * Created by liangwj
 */
export default {
  /** 框架管理员 */
  commonAdmin: {
    getServerStatus: '/api/commonAdmin/getServerStatus', //  获取服务器信息
    login: '/api/commonAdmin/login', //  登录
    logout: '/api/commonAdmin/logout', //  登出
    passwordDemo: '/api/commonAdmin/passwordDemo', //  创建密码例子
  },
  /** 字典-公开 */
  dictPublic: {
    getDict: '/api/dictPublic/getDict', //  获得字典定义的所有内容
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
