<template>
  <div class="page-upload">
    <my-nav activeName="upload"></my-nav>

    <div>
      <!-- 左边图片列表 -->
      <div class="my-pannel pic-pannel">
        <div class="my-header">
          附件列表
        </div>

        <div>
          <div class="attach_div"
               @click="fileView(vo)"
               v-for="(vo,index) in list"
               :key="index">
            <template v-if="vo.row.imageFile">
              <div class="imgDiv">
                <img :alt="vo.row.memo" :src="vo.fullThumbPath" class="img-responsive center-block">
              </div>
              <p>{{vo.row.key}}.{{vo.row.extName}}</p>
              <p>{{vo.row.imageWidth}} X {{vo.row.imageHeight}}</p>
            </template>

            <template v-else>
              <div class="other-file">{{vo.row.extName}}</div>

              <p>名字:{{vo.row.key}}.{{vo.row.extName}}</p>
            </template>
          </div>
        </div>

      </div>
      <!-- /左边图片列表 -->

      <!-- 右边的编辑区 -->
      <div class="my-pannel edit-pannel">
        <div class="p-header">
          {{panelTitle}}
        </div>

        <div class="p-body">
          <!-- 编辑查看区 -->
          <el-form @submit.native.prevent="onSubmit"
                   labelPosition="top">
            <h4>Key: </h4>
            <el-input v-model="form.key"
                      required
                      placeholder="请输入key"
                      :readonly="editMode"></el-input>

            <div v-if="!editMode">
              <small class="text-muted">上传后，key就是文件名</small>
            </div>
            <div v-else class="text-wrap">
              <!-- 编辑模式下，可查看文件路径 -->
              <small>文件绝对路径: </small>
              <small><a target="_blank" :href="fullPath" class="text-wrap">{{fullPath}}</a></small>
            </div>

            <h4>备注</h4>
            <el-input v-model="form.memo"
                      type="textarea"
                      placeholder="请输入备注">
            </el-input>

            <hr/>
            <h4>请选择附件文件</h4>
            <input type="file"
                   @change="fileSelectd($event.target.files)"/>
            <div>
              <small class="text-muted" v-if="editMode">如果选择了新的文件，原来的文件将会被替换</small>
              <small class="text-muted" v-else>必须选择一个文件上传</small>
            </div>

            <hr/>
            <div>
              <el-button class="w100"
                         nativeType="submit"
                         type="success">保存
              </el-button>
              <el-button class="w100"
                         v-if="editMode"
                         @click="fileDelete"
                         type="danger">删除
              </el-button>
              <el-button class="w100"
                         v-if="editMode"
                         @click="switchToNewKey(true)"
                         type="warning">新建
              </el-button>
            </div>
          </el-form>
          <!-- /编辑查看区 -->
        </div>
      </div>
      <!-- /右边的编辑区 -->
    </div>

  </div>
</template>

<script>
  import apiUrl from '../../ApiUrl'
  import myUtil from '../../util/MyUtils'

  export default {

    components: {},
    /** 组件的属性，只有是组件的时候才有用 */
    props: {},

    /** 本页面的属性 */
    data() {
      return {
        list: [], // 附件列表

        panelTitle: '',
        editMode: false,
        fullPath: '',

        form: {
          key: '',
          file: null,
          memo: '',
        },
      }
    },

    /** 计算属性 */
    computed: {},

    /** 每次进入页面时 */
    activated() {
      this.reload()
      this.switchToNewKey(true)
    },

    /** 本页面可用的方法 */
    methods: {
      /** 刷新页面 */
      reload() {
        myUtil.ajax(apiUrl.dictAttachments.list, {}, (res) => {
          this.onListData(res)
        })
      },

      /** 收到列表数据时 */
      onListData(res) {
        this.list = res.list
      },

      /** 查看 */
      fileView(vo) {
        this.switchToNewKey(false)

        this.form.key = vo.row.key
        this.form.memo = vo.row.memo
        this.fullPath = vo.fullPath
      },

      /** 保存 */
      onSubmit() {
        if (!this.editMode && this.form.file === null) {
          myUtil.showErrorMsg('请选择要上传的文件！')
        }

        const param = new FormData()
        param.append('key', this.form.key)
        param.append('memo', this.form.memo)
        if (this.form.file !== null) {
          param.append('file', this.form.file)
        }

        myUtil.ajax(apiUrl.dictAttachments.save, param, (res) => {
          this.onListData(res)
          myUtil.showMsg('保存成功')
        })
      },

      /** 当选择了文件或者取消选择时 */
      fileSelectd(files) {
        const len = files.length
        if (len > 0) {
          this.form.file = files[0]
        } else {
          this.form.file = null
        }
        console.debug('要上传文件发送了变化', this.form.file)
      },

      /** 删除文件 */
      fileDelete() {
        if (!this.editMode) {
          return
        }

        const key = this.form.key

        myUtil.confirm(`确认删除<code>${key}</code>吗?`, () => {
          // 如果确认删除
          myUtil.ajax(apiUrl.dictAttachments.delete,
            {key: key}, (res) => {
              // 删除成功时, 后端返回的是列表数据
              this.onListData(res) // 刷新右边
              this.switchToNewKey(true) // 将当前切换为新建的状态
              myUtil.showMsg('删除成功')
            }
          )
        })
      },

      switchToNewKey(newMode) {
        this.editMode = !newMode
        if (newMode) {
          this.form.key = ''
          this.form.memo = ''

          this.panelTitle = '新建Key'
        } else {
          this.panelTitle = '编辑Key'
        }
      },
    },
  }
</script>

<!--<style scoped>-->
<style>

</style>
