import myUtil from '../utils/my.utils';

const dataFormatStr = 'yyyy-MM-dd hh:mm:ss'; // 时间输出格式

/** 格式化输出相关工具集 */
const filterUtil = {

  /** unix时间格式化为  yyyy-MM-dd hh:mm:ss */
  timeFormat(time) {
    return myUtil.timeFormat(time, dataFormatStr);
  },

  /** Date时间格式化为  yyyy-MM-dd hh:mm:ss */
  dateFormat(data) {
    return myUtil.dateFormat(data, dataFormatStr);
  },

  /** 将空间大小转为K，并且用逗号分隔 */
  sizeToK(size) {
    const k = size / 1024;
    return myUtil.numFormat(k, true) + 'K';
  },

  /** 将空间大小转为M，并且用逗号分隔 */
  sizeToM(size) {
    if (!size || size === 0) {
      return 0;
    }

    const k = size / 1024;
    if (k > 1024) {
      const m = k / 1024;
      return myUtil.numFormat(m, true) + 'M';
    } else {
      return myUtil.numFormat(k, true) + 'K';
    }
  },

  /** 将空间大小转为G，不用逗号分隔 */
  sizeToG(size) {
    if (!size || size === 0) {
      return 0;
    }

    const k = size / 1024;
    if (k < 1024) {
      return k.toFixed(2) + 'K';
    }

    const m = k / 1024;
    if (m < 1024) {
      return m.toFixed(2) + 'M';
    }

    const g = m / 1024;
    return g.toFixed(2) + 'G';
  },

  /** 用逗号分隔显示数字,保留两位小数点 */
  numFormat2(value) {
    return myUtil.numFormat(value, true);
  },

  /** 用逗号分隔显示数字，取整 */
  numFormat(value) {
    return myUtil.numFormat(value, false);
  },
};

/** 配置VUE */
export default {

  /** 初始化所有 */
  install(Vue) {
    console.debug("注册各类 filter")
    // 设置格式化输出
    Vue.filter('numFormat', filterUtil.numFormat); // 逗号分隔，取整
    Vue.filter('numFormat2', filterUtil.numFormat2); // 逗号分隔，保留两位小数
    Vue.filter('timeFormat', filterUtil.timeFormat); // unix时间 到年月日时分秒
    Vue.filter('dateFormat', filterUtil.dateFormat); // Date 到年月日时分秒
    Vue.filter('sizeToK', filterUtil.sizeToK); // 转为K
    Vue.filter('sizeToM', filterUtil.sizeToM); // 转为M
    Vue.filter('sizeToG', filterUtil.sizeToG); // 转为G
  },

};
