/**
 * ajax 的配置
 */
import {Notification} from 'element-ui';
import context from '../server.context';

const duration = 2500;
function showErrorMsg(msg) {
  Notification({
    message: msg,
    type: 'error',
    duration: duration
  });
}

/** 在发起请求之前 , 加token */
function onBeforeRequest(config) {
  if (context.user.xAuthToken) {
    config.headers['x-auth-token'] = context.user.xAuthToken; // 让每个请求携带自定义token 请根据实际情况自行修改
    console.debug('在ajax头中添加 x-auth-token', context.user.xAuthToken, config);
  }
}

function onNetworkError(config) {
  console.error(`ajax时，发生网络错误 ${config.url}`)
  showErrorMsg('网络故障，请检查网络是否连通。')
}

/** 逻辑错误处理 */
function onFail(response) {

  // 统一错误处理
  const data = response.data;

  if (data && data.message) {
    // 如果有错误信息，就显示错误信息
    showErrorMsg(data.message);
  } else {
    // 如果没有返回错误信息，就是未知错误
    showErrorMsg('未知错误');
  }
}

export default {
  install(Vue) {
    console.log('初始化 ajax.config');
    const ajax = Vue.prototype.$jslib.ajax;

    ajax.initOnBeforeRequest(onBeforeRequest);
    ajax.initOnFail(onFail);
    ajax.initOnNetworkError(onNetworkError);
  }
};
