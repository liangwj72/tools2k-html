import ajax from '../../utils/http.ajax'

export default {
  name: 'my-el-upload', // 只有是组件的时候才有用

  props: {
    apiUrl: {
      type: String,
      required: true,
    },
    fileList: {
      type: Array,
      default() {
        return []
      },
    },
    apiUrlRemove: {
      type: String,
    },
    onSuccess: {
      type: Function,
    },
    beforeRemove: {
      type: Function,
    },
    onRemove: {
      type: Function,
    },
    onChange: {
      type: Function,
    },
  },

  data() {
    return {
      // fileList: [],
      form: {
        raw: null,
      }
    };
  },

  /** 本页面可用的方法 */
  methods: {
    // 请求API，上传文件
    httpRequest() {
      const formData = new self.FormData();
      formData.append('file', this.form.raw);
      const uid = this.form.uid

      // 上传中的回调，用于进度条
      const myUploadProgress = (uid) => (progress) => {
        const percentage = Math.floor((progress.loaded * 100) / progress.total)
        this.setFileProgress(uid, percentage)
      }

      ajax.upload(this.apiUrl, formData, myUploadProgress(uid)).then(res => {
        console.debug('响应信息:', res);
        this.setFileStatus(uid, 'success')
        this.setFileId(uid, res.id)

        if (typeof this.onSuccess === 'function') {
          this.onSuccess(res, this.getByUidFile(uid), this.fileList)
        }
      }).catch(() => {
        this.setFileStatus(uid, 'exception')
      })
    },

    // 选择文件
    onElChange(file) {
      this.fileList.push({
        id: 0,
        name: file.name,
        percentage: 0,
        status: 'warning',
        uid: file.uid,
        url: file.url,
        type: file.raw.type,
      })
      this.form = file

      if (typeof this.onChange === 'function') {
        this.onChange(file, this.fileList)
      }
    },

    // 删除图片
    onElRemove(index) {
      const file = this.fileList[index]

      // 删除之前，如果返回 false，则不删除
      if (typeof this.beforeRemove === 'function') {
        const b = this.beforeRemove(file, this.fileList)
        if (b === false) {
          return
        }
      }

      const removeFun = (res) => {
        this.fileList.splice(index, 1)
        // 删除成功，回调
        if (typeof this.onRemove === 'function') {
          this.onRemove(file, this.fileList, res)
        }
      }

      if (this.apiUrlRemove && file.id) {
        ajax.post(this.apiUrlRemove, { id: file.id }).then(res => {
          removeFun(res)
        })
      } else {
        removeFun()
      }
    },

    // 根据 uid 获取 file
    getByUidFile(uid) {
      for (const k in this.fileList) {
        const file = this.fileList[k]
        if (file.uid == uid) {
          return file
        }
      }
      return null
    },
    // 设置 file 进度条 进展数
    setFileId(uid, id) {
      if (!id) {
        return
      }
      const file = this.getByUidFile(uid)
      if (!file) {
        return
      }
      file.id = id
    },
    // 设置 file 进度条 进展数
    setFileProgress(uid, progress) {
      const file = this.getByUidFile(uid)
      if (!file) {
        return
      }
      file.percentage = progress
    },
    // 设置 file 进度条 状态
    setFileStatus(uid, status) {
      const file = this.getByUidFile(uid)
      if (!file) {
        return
      }
      file.status = status
    },
    // 是否是 图片
    isImage(type) {
      return type.indexOf('image') != -1
    },
  }
};