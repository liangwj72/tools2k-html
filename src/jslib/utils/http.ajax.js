/**
 * 对axios的封装
 */
import axios from 'axios';
import querystring from 'querystring';
import loading from '../components/my-loading/controller';
import util from './my.utils';

/** 执行请求之前 */
let _onBeforeRequest = function (config) {
  console.debug(`调用 ${config.url} 前，执行onBeforeRequest`);
};

/** 默认的错误处理 */
let _onFail = function (response, config) {
  console.error(`ajax请求,发生逻辑错误 ${config.url}`, response);
};

/** 默认的网络错误事件 */
let _onNetworkError = function (config) {
  console.error(`ajax时，发生网络错误 ${config.url}`);
};

/** 请求之前执行，通常用于放token */
function onBeforeRequest(config) {
  console.debug('onBeforeRequest', config);
  const fn = config.onBeforeRequest;
  if (util.isFunction(fn)) {
    // 如果请求配置中要覆盖 ，就用请求中的
    fn(config);
  } else {
    // 如果没有覆盖，就调用默认的方式
    _onBeforeRequest(config);
  }
}

/**
 * 得到响应后
 * @param data 响应的data
 */
function onResponse(data, config) {
  console.debug(`调用 ${config.url} :`, data);
}

/** 判断返回的请求是否正常 */
function onFail(response, config) {

  // 统一错误处理
  if (response) {
    const data = response.data;
    const status = response.status;
    console.debug(`调用 ${config.url} 出错了:`, data, status);

    // 如果有响应，就调用错误处理
    const fn = config.onFail;
    if (util.isFunction(fn)) {
      // 如果请求配置中要覆盖 ，就用请求中的
      fn(response, config);
    } else {
      // 如果没有覆盖，就调用默认的方式
      _onFail(response, config);
    }
  } else {
    // 如果没有响应，就弹窗
    _onNetworkError('网络发生故障');
  }
}

/** 显示 loading */
function pageLoadingOpen(config) {
  if (!config) {
    loading.pageLoadingOpen();
    return
  }

  const fn = config.pageLoadingOpen;
  if (util.isFunction(fn)) {
    // 如果请求配置中要覆盖 ，就用请求中的
    fn();
  } else {
    // 否则用默认的，全屏遮罩，延迟开启
    loading.pageLoadingOpen();
  }
}

/** 隐藏 loading */
function pageLoadingColse(config) {
  if (!config) {
    loading.pageLoadingClose();
    return
  }

  const fn = config.pageLoadingClose;
  if (util.isFunction(fn)) {
    // 如果请求配置中要覆盖，就用请求中的
    fn();
  } else {
    // 否则用默认的
    loading.pageLoadingClose();
  }
}

// 创建axios实例
function createInstance() {
  const service = axios.create({
    //baseURL: process.env.VUE_APP_BASE_API, // api的base_url
    timeout: 5 * 1000, // 请求超时时间
  });

  /** request拦截器 */
  service.interceptors.request.use(config => {
    // 全屏遮罩，延迟开启
    pageLoadingOpen(config);

    // 看看有没有需要先准备的，就准备一下
    onBeforeRequest(config);
    return config;
  }, error => {
    // Do something with request error
    console.log('request 出错了', error); // for debug
    // Promise.reject(error)
  });

  /** response拦截器 */
  service.interceptors.response.use(
    response => {
      // 关闭loading
      pageLoadingColse(response.config);

      const data = response.data;
      onResponse(data, response.config);
      return data;
    },
    error => {
      // 关闭loading
      pageLoadingColse(error.config);

      // 错误处理
      onFail(error.response, error.config);

      // 有错误时，就reject，然后触发ajax的 onRejected，不让最外层调用then
      return Promise.reject(error);
    }
  );

  return service;
}

const instance = createInstance();

export default {
  /**
   * extConfig: 参数
   * @pageLoadingOpen 覆盖默认的 pageLoading函数
   * @pageLoadingClose 覆盖默认的 pageLoadingClose函数
   * @onFail 覆盖默认的 onFail
   * @returns {*}
   */
  ajax(method, url, params, extConfig) {
    if (method === 'post') {
      return this.post(url, params, extConfig);
    } else {
      return this.get(url, params, extConfig);
    }
  },

  /** 直接返回实例 */
  instance() {
    return instance;
  },

  /** 初始化 onBeforeRequest */
  initOnBeforeRequest(fn) {
    if (util.isFunction(fn)) {
      _onBeforeRequest = fn;
    } else {
      throw new Error('onBeforeRequest 参数类型错误');
    }
  },

  /** 初始化 onFail */
  initOnFail(fn) {
    if (util.isFunction(fn)) {
      _onFail = fn;
    } else {
      throw new Error('onFail 参数类型错误');
    }
  },

  /** 初始化 onNetworkError */
  initOnNetworkError(fn) {
    if (util.isFunction(fn)) {
      _onNetworkError = fn;
    } else {
      throw new Error('onNetworkError 参数类型错误');
    }
  },

  get(url, data, extConfig) {
    let _url = url;
    if (data) {
      const str = querystring.stringify(data);
      _url += (url.indexOf('?') > 0) ? '&' : '?';
      _url += str;
    }
    // 创建实例
    return instance.get(_url, extConfig)
      .then(response => {
        return response;
      }, (error) => {
        // 捕捉错误，还是要reject,否则外面会调用.then，但没有数据
        return Promise.reject(error);
      });
  },

  post(url, params, extConfig) {
    // 构造配置
    const config = {
      transformRequest: [(data, headers) => {
        // headers['Content-Type'] = 'multipart/form-data';
        if (data instanceof self.FormData) {
          return data;
        } else {
          // 普通数据就直接转为formdata
          const formData = util.objToFormData(data);
          return formData;
        }
      }]
    };
    // 将额外的配置拷贝进来
    util.copyAttr(extConfig, config);

    // 创建实例
    return instance.post(url, params, config)
      .then(response => {
        return response;
      }, (error) => {
        // 捕捉错误，还是要reject,否则外面会调用.then，但没有数据
        return Promise.reject(error);
      });
  },

  /** 上传文件 */
  upload(url, params, onUploadProgress, extConfig) {
    const config = {
      timeout: 60 * 1000,     // 超时时间
      pageLoadingOpen() { },  //  关闭全局 加载中提示
      pageLoadingClose() { }, //  关闭全局 加载中提示
      onUploadProgress: onUploadProgress, //  进度条回调
    }

    // 将额外的配置拷贝进来
    util.copyAttr(extConfig, config);

    return this.post(url, params, config)
  },

  /** 测试用的，不显示loading的 配置 */
  noLoadingConfig() {
    return {
      pageLoadingOpen() {
        console.debug('不干活的 pageLoadingOpen');
      },
      pageLoadingClose() {
        console.debug('不干活的 pageLoadingClose');
      },
    };

  }
};
