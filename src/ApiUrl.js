/**
 * 所有api url的定义，这个定义的内容是直接从后端的开发界面中拷贝出来的，不需要自己手写，没事也不要自己手写
 *
 * Created by liangwj
 */
export default {
  /** 字典-用户 */
  dictAdmin: {
    getCurUser: '/api/dictAdmin/getCurUser', //  获得当前用户的信息，返回内容中包含是是否已登录的信息
    login: '/api/dictAdmin/login', //  登录
    logout: '/api/dictAdmin/logout', //  登出
    passwordDemo: '/api/dictAdmin/passwordDemo', //  创建密码例子
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
    login: '/api/jmxInWeb/login', //  登录
    logout: '/api/jmxInWeb/logout', //  登出
  },
  /** JmxInWeb-Ws Api状态 */
  jmxInWebWs: {
    wsConnectList: '/api/jmxInWebWs/wsConnectList', //  链接列表
    wsRuntimeHistory: '/api/jmxInWebWs/wsRuntimeHistory', //  运行图表
  },
}
