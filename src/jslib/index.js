/**
 * jslib
 */

// 所有的工具类
import ajax from './utils/http.ajax.js';
import utils from './utils/my.utils.js';
import MySetTimeOut from './utils/my.set.timeout'
import filterConfig from './utils/vue.filter.config'
import loadingCtl from './components/my-loading/controller'

import vueScrollOps from './vue.scroll.ops'

// 所有的组件
import AutoRefresh from './components/auto-refresh/index.vue';
import MyLoading from './components/my-loading/index.vue';
import MyElUpload from './components/my-el-upload/index.vue';
import MyElInput from './components/my-el-input/index.vue';
import MyElButtonRemove from './components/my-el-button-remove/index.vue';

const components = [
    AutoRefresh,
    MyLoading,
    MyElUpload,
    MyElInput,
    MyElButtonRemove,
];

/** 用于 Vue.use */
const install = function (Vue) {

    console.debug("被Vue.use调用，初始化JS公用库")

    // 注册组件
    components.forEach(component => {
        Vue.component(component.name, component);
    });

    // 注册filter
    filterConfig.install(Vue)

    // 可通过 $jslib 访问各类工具
    Vue.prototype.$jslib = {
        ajax,
        utils,
        MySetTimeOut,
        loadingCtl,
    }
};

// 默认
export default {
    install,
    ajax,
    utils,
    MySetTimeOut,
    loadingCtl,
    vueScrollOps
};
