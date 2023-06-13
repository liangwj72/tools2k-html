/**
 * 常用工具集
 */

export default {
  /**
   * 二维数组排序并按首字母大写区分
   * @param data:array 需要处理的数组
   */
  arraySort(data) {
    let map = {}; // 处理过后的数据对象
    let temps = []; // 临时变量
    // 按字母分组
    for (let key in data) {
      if (data[key].pinyin) {
        let ekey = data[key].pinyin.charAt(0)
          .toUpperCase(); // 根据名称拼音的第一个字母分组，并且转换成大写
        temps = map[ekey] || []; // 如果map里面有这个key了，就取，没有就是空数组
        temps.push(data[key]);
        map[ekey] = temps;
      }
    }
    let list = [];
    for (let gkey in map) {
      list.push({
        gkey: gkey,
        users: map[gkey]
      });
    }
    // 排序
    list = list.sort((li1, li2) => li1.gkey.charCodeAt(0) - li2.gkey.charCodeAt(0));

    return list;
  },

  /** 判断是否是函数 */
  isFunction(fn) {
    return (fn && typeof fn === 'function');
  },

  /** 拷贝属性 */
  copyAttr(src, target) {
    if (src && target) {
      for (let key in src) {
        let value = src[key];
        if (value) {
          if (typeof value === 'object') {
            target[key] = Object.assign({}, value);
          } else {
            target[key] = value;
          }
        }
      }
    }
  },

  /** 拷贝属性 */
  objToFormData(src) {
    const target = new FormData();
    if (src) {
      for (let key in src) {
        let value = src[key];
        if (value instanceof Array) {
          value.map(e => {
            target.append(key + '[]', e)
          })
        } else {
          target.append(key, value)
        }
      }
    }
    return target;
  },

  /** 深拷贝 */
  deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj))
  },

  /** 将对象变成 json字符串 */
  toJsonStr(obj) {
    return JSON.stringify(obj);
  },

  /** 解析 json */
  parserJson(strJSON) {
    return JSON.parse(strJSON);
  },

  /** 生成一个随机id */
  randomId() {
    const len = 20;
    const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz';
    const maxPos = chars.length;
    let str = '';
    for (let i = 0; i < len; i++) {
      str += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return str;
  },

  /**
   * 用逗号分隔显示数字,保留两位小数点
   * @param value:int 要格式的值
   * @param toFixed2:boolean  是否保留2位小数
   */
  numFormat(value, toFixed2) {
    if (!value) {
      if (toFixed2) {
        return '0.00';
      } else {
        return 0;
      }
    }

    const intPart = Number(value)
      .toFixed(0); // 获取整数部分
    const intPartFormat = intPart.toString()
      .replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); // 将整数部分逢三一断

    let floatPart = '';
    if (toFixed2) {
      floatPart = '.' + parseInt(value * 100 % 100); // 小数位保留2位
      if (floatPart.length === 2) {
        // 如果加上小数点才2为长度，就补一个0在后面
        floatPart += '0';
      }
    }

    return intPartFormat + floatPart;
  },

  /** unix时间 到年月日时间格式 */
  timeFormat(time, fmt) {
    const date = new Date(time);
    return this.dateFormat(date, fmt);
  },

  /**
   * 格式时间
   * - Format('yyyy-MM-dd hh:mm:ss.S') ==> 2006-07-02 08:09:04.423
   * - Format('yyyy-M-d h:m:s.S')      ==> 2006-7-2 8:9:4.18
   * @param date Date对象
   * @param fmt 格式字符串
   * @returns {string}
   */
  dateFormat(date, fmt) {
    if (!date) {
      return '';
    }

    const o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度,
      'S': date.getMilliseconds(), // 毫秒
    };
    let res = '';

    if (!this.isEmpty(fmt)) {
      res = fmt;

      if (/(y+)/.test(fmt)) {
        res = res.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
      }

      for (let k in o) {
        if (new RegExp('(' + k + ')').test(res)) {
          res = res.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
      }
    }
    return res;
  },

  /**
   * 获取时间对象
   * n:     需要增加的天数
   */
  getDate(n = 0) {
    //Date()返回当日的日期和时间。
    var days = new Date()

    //getTime()返回 1970 年 1 月 1 日至今的毫秒数。
    var gettimes = days.getTime() + 1000 * 60 * 60 * 24 * + n

    //setTime()以毫秒设置 Date 对象。
    days.setTime(gettimes)

    return days
  },

  /** 判断字符串是否为空 */
  isEmpty(str) {
    if (str === null || str === undefined) {
      return true;
    } else {
      let strValue = str.trim();
      return (strValue === '');
    }
  },

  /** 将字符串型的颜色转为 rgba数组 */
  colorHexToRgba(sColor, alpha) {
    // 十六进制颜色值的正则表达式
    let reg = /^#([0-9a-fA-F]{6})$/;
    // 如果是16进制颜色
    if (sColor && reg.test(sColor)) {
      // 处理六位的颜色值
      let sColorChange = [];
      for (let i = 1; i < 7; i += 2) {
        sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)));
      }

      sColorChange.push(alpha);

      return 'rgba(' + sColorChange.join(',') + ')';
    }
    return sColor;
  },

  /** 友好的硬盘大小字符串, 用 K M G 表示 */
  toSizeStr(size) {
    let k = size / 1024;
    if (k > 1024) {
      let m = k / 1024;
      if (m > 1024) {
        return (m / 1024).toFixed(2) + 'G';
      } else {
        return m.toFixed(2) + 'M';
      }
    } else {
      return k.toFixed(2) + 'K';
    }
  },

  // 获取分页数据
  getPageList(all, list, pageNo, pageSize) {
    const total = all.length

    if ((pageNo - 1) * pageSize > total || pageNo < 1) {
      this.$message({
        type: 'error',
        message: '超出页数范围'
      })
      return
    }

    list.splice(0, list.length)

    let maxPaging = pageNo * pageSize
    if (maxPaging > total) {
      maxPaging = total
    }

    for (let k = (pageNo - 1) * pageSize; k < maxPaging; k++) {
      list.push(all[k])
    }
  },
};
