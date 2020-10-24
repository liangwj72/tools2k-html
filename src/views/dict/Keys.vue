<template>
  <div class="page-keys">
    <my-nav activeName="keys"></my-nav>

    <div v-if="!loading">
      <!-- 左边栏 -->
      <div class="my-pannel keys-pannel">

        <!-- 搜索 pannel -->
        <div class="p-header flex-container">
          <div class="flex1">
            <form @submit.prevent="reload(false)">
              <el-input size="small"
                        :clearable="true"
                        v-model.trim="searchArea.form.key"
                        placeholder="请输入搜索关键字">
                <div slot="append">
                  <el-button size="small"
                             nativeType="submit"
                             icon="el-icon-search"></el-button>
                </div>
              </el-input>
            </form>
          </div>
          <div>
            <el-button size="small"
                       @click="reload(true)"
                       class="refresh-btn">刷新
            </el-button>
          </div>
        </div>
        <!-- 搜索 pannel -->

        <!-- 列表 -->
        <div class="p-body has-footer">
          <div class="key-row text-link"
               v-for="(row,index) in searchArea.keyList"
               :key="index"
               @click="viewKey(row)">
            <div class="key-name" v-html="row.keyWithMark"></div>
            <div class="key-value">{{row.valueSummary}}</div>
          </div>
        </div>
        <!-- /列表 -->

        <!-- 翻页 -->
        <div class="p-footer">
          <el-pagination
            background
            small
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="searchArea.form.pageNo"
            :page-sizes="[10, 20, 30]"
            :page-size="searchArea.form.pageSize"
            :pager-count="5"
            layout="total, sizes, prev, pager, next, jumper"
            :total="searchArea.itemTotal">
          </el-pagination>
        </div>
        <!-- /翻页 -->
      </div>
      <!-- /左边栏 -->
    </div>

    <!-- 右边栏 -->
    <div class="my-pannel edit-pannel">
      <el-tabs v-model="editArea.activeTab">
        <el-tab-pane
          label="导入/导出"
          name="file">
          <!-- 导入标签页 默认展现的是这个标签-->
          <h4>导入/导出</h4>
          <hr/>

          <el-form
            @submit.native.prevent="submitImport"
            label-width="100px">
            <el-form-item label="导入">
              <div>请选择要导入的XML文件</div>
              <input type="file"
                     required
                     accept="text/xml" capture="camera"
                     @change="fileSelectd($event.target.files)"/>
              <div>
                <el-checkbox v-model="fileArea.form.cleanOld">导入时清除原来的所有内容</el-checkbox>
              </div>
              <div>
                <el-button class="w100"
                           nativeType="submit"
                           type="success">导入
                </el-button>
              </div>
            </el-form-item>
            <hr/>
            <el-form-item label="导出">
              <p>从上传的文件导入数据之前，建议先导出一次作为备份。请用"右键另存为"来保存文件。</p>
              <a href="/dict/export/dict.xml" target="_blank">导出xml文件</a>
            </el-form-item>
            <hr/>
            <el-form-item>
              <p>添加新的key给前端使用。</p>
              <el-button class="w100"
                         @click="switchToNewKey(true)"
                         type="warning">新建Key
              </el-button>
            </el-form-item>
          </el-form>
          <!-- /导入标签页 -->
        </el-tab-pane>

        <el-tab-pane
          :label="editArea.tabName"
          name="edit">
          <h4>{{editArea.tabName}}</h4>
          <hr/>
          <el-form
            @submit.native.prevent="submitSave"
            label-width="100px">
            <el-form-item label="Key" v-if="editArea.newMode">
              <!-- 新建模式下，可以输入key -->
              <el-input v-model.trim="editArea.form.key"
                        required
                        placeholder="请输入KEY"></el-input>
            </el-form-item>
            <el-form-item label="Key" v-else>
              <!-- 编辑模式下，只能查看 -->
              <div class="text-caption">{{editArea.form.key}}</div>
            </el-form-item>
            <el-form-item label="Key的内容">
              <el-input v-model.trim="editArea.form.value"
                        required
                        placeholder="请输入KEY的内容"
                        :rows="4"
                        type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model.trim="editArea.form.memo"
                        placeholder="请输入备注"
                        type="textarea"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="w100"
                         nativeType="submit"
                         type="success">保存
              </el-button>
              <el-button class="w100"
                         @click="deleteKey"
                         v-if="!editArea.newMode"
                         type="danger">删除
              </el-button>
              <el-button class="w100"
                         @click="switchToNewKey(true)"
                         v-if="!editArea.newMode"
                         type="warning">新建Key
              </el-button>

            </el-form-item>
          </el-form>

        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 右边栏 -->
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
        loading: false,

        // 左边区域
        searchArea: {
          form: {
            key: '',
            pageNo: 1,
            pageSize: 10,
          },
          itemTotal: 0, //
          keyList: [],
        },

        // 右边编辑区域
        editArea: {
          activeTab: '',
          newMode: true,
          tabName: '',

          curKey: {},

          form: {
            html: false,
            key: '',
            memo: '',
            type: 0,
            value: '',
          },
        },

        // 右边导入导出
        fileArea: {
          form: {
            cleanOld: false,
            file: null,
          },
        },
      }
    },

    /** 计算属性 */
    computed: {},

    /** 每次进入页面时 */
    activated() {
      this.loading = true
      this.reload(false)
      this.switchToNewKey(true)
    },

    /** 本页面可用的方法 */
    methods: {
      /** 刷新页面 */
      reload(showMsg) {
        let data = this.searchArea

        myUtil.ajax(apiUrl.dictManager.search, data.form, (res) => {
          this.onListData(res)
          this.loading = false

          if (showMsg) {
            myUtil.showMsg('刷新成功')
          }
        })
      },

      /** 收到列表数据时 */
      onListData(res) {
        let data = this.searchArea
        data.keyList = res.list
        data.itemTotal = res.itemTotal
        data.form.pageNo = res.pageNo
        data.form.pageSize = res.pageSize
      },

      handleSizeChange(pageSize) {
        this.searchArea.form.pageSize = pageSize
        this.reload(false)
      },

      handleCurrentChange(pageNo) {
        this.searchArea.form.pageNo = pageNo
        this.reload(false)

      },

      viewKey(row) {
        this.switchToNewKey(false)
        this.editArea.curKey = row
        const form = this.editArea.form
        form.key = row.key
        form.value = row.value
        form.memo = row.memo
      },

      switchToNewKey(newMode) {
        const data = this.editArea
        data.newMode = newMode
        if (newMode) {
          data.tabName = '新建'

          const form = data.form
          form.key = ''
          form.memo = ''
          form.value = ''

        } else {
          data.tabName = '编辑'
        }
        data.activeTab = 'edit'
      },

      /** 当选择文件时 */
      fileSelectd(files) {
        const len = files.length
        if (len > 0) {
          this.fileArea.form.file = files[0]
        }
      },

      /** 保存 */
      submitSave() {
        myUtil.ajax(apiUrl.dictManager.save, this.editArea.form, (res) => {
          // 保存成功时，后端返回的是新的列表数据
          this.onListData(res)
          this.editArea.newMode = false // 变为编辑状态
          myUtil.showMsg('保存成功')
        })
      },

      /** 删除 */
      deleteKey() {
        const key = this.editArea.form.key
        myUtil.confirm(`确认删除<code>${key}</code>吗`, () => {
          // 如果确认删除
          myUtil.ajax(apiUrl.dictManager.delete,
            {key: key}, (res) => {
              // 删除成功时, 后端返回的是列表数据
              this.onListData(res) // 刷新右边
              this.switchToNewKey(true) // 将当前切换为新建的状态
              myUtil.showMsg('删除成功')
            }
          )
        })
      },

      /** 导入 */
      submitImport() {
        const param = new FormData()
        param.append('cleanOld', this.fileArea.form.cleanOld)
        param.append('file', this.fileArea.form.file)

        myUtil.ajax(apiUrl.dictManager.importXml, param, () => {
          this.reload(false)
          myUtil.showMsg('导入成功')
        })
      },
    },
  }
</script>
