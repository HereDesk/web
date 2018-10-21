<template>
  <div id="page-testcase-add">
    <div id="page-testcase-add-title" class="container-fluid">
      <div class='row'>
        <div class='col text-center page-pure-title'>
          <span @click="$router.go(-1)">
            <i class="iconfont icon-close-windows icon-8a8a8a size-2"></i>
          </span>
          <h3>编写测试用例</h3>
          <div class="dropdown-divider"></div>
        </div>
      </div>
    </div>
    <div id='page-testcase-add-input' class='container mt-5 pg-test-edit'>
      <div class='row' style='margin:0;'>
        <div class='col-xl-10 col-lg-10 col-md-12 col-sm-12 col-12 offset-xl-1 offset-lg-1'>
          <form sytle='background-color:#fff;'>
            <div class='form-group row'>
              <label for='CaseInfo' class="col-md-2 col-sm-12 col-12 testcase-label">
                产品与模块<span class="text-red">*</span>
              </label>
              <el-select class='col-md-3 col-sm-4 col-6' placeholder="请选择产品" 
                v-model="CaseData.product_code">
                <el-option 
                  v-for="item in product_list" 
                  :key="item.label" 
                  :label="item.value" 
                  :value="item.value">
                </el-option>
              </el-select>
              <el-cascader
                placeholder="选择模块"
                :options="modules_list"
                v-model="CaseData.module_id"
                filterable
                class="col-md-3 col-sm-4 col-6"
              ></el-cascader>
            </div>

            <div class='form-group row'>
              <label for='CaseInfo' class="col-md-2 col-sm-12 col-12 testcase-label">
                用例属性<span class="text-red">*</span>
              </label>
              <el-select class='col-md-3 col-sm-4 col-6 e-select-support' placeholder="用例类型" 
                v-model="CaseData.category">
                <el-option value="Functional" label="功能"></el-option>
                <el-option value="compatibility" label="兼容"></el-option>
                <el-option value="UI" label="UI">UI</el-option>
                <el-option value="performance" label="性能"></el-option>
                <el-option value="other" label="其它"></el-option>
              </el-select>
              <el-select class='col-md-3 col-sm-4 col-6' placeholder="优先级" 
                v-model="CaseData.priority">
                <el-option value="P1">P1</el-option>
                <el-option value="P2">P2</el-option>
                <el-option value="P3">P3</el-option>
              </el-select>
            </div>

            <!-- 测试用例：功能测试用例 -->
            <div id="t-testcase-functional">
              <div class='form-group row'>
                <label for='CaseTitle' class="col-lg-2 col-md-2 col-sm-12 testcase-label">
                  用例标题<span class="text-red">*</span>
                </label>
                <el-input type='text' id='inputTitle' class='col-lg-9 col-md-10 col-sm-12' 
                  placeholder='用例标题...' maxlength='50' required
                  v-model.trim='CaseData.title'>
                </el-input>
              </div>
              <div class='form-group row'>
                <label for='CasePrecondition' class="col-lg-2 col-md-2 col-sm-12 testcase-label">
                  执行前置条件<p class="label-desc">(选填)</p>
                </label>
                <el-input type="textarea" id="inputPrecondition" class="col-lg-9 col-md-10 col-sm-12" 
                  maxlength="500" placeholder="测试用例执行前置条件..." 
                  :autosize="{ minRows: 2}" 
                  v-model.trim='CaseData.precondition'>
                </el-input>
              </div>
              <div class='form-group row'>
                <label for='CaseSteps' class="col-lg-2 col-md-2 col-sm-12 testcase-label">
                  操作步骤<span class="text-red">*</span>
                </label>
                <quill-editor class="col-lg-9 col-md-10 col-sm-12 quill-editor-define" 
                  v-model.trim="CaseData.steps">
                </quill-editor>
              </div>
              <div class='form-group row mt-3'>
                <label for='CaseInput' class="col-lg-2 col-md-2 col-sm-12 testcase-label">
                  测试数据<p class="label-desc">(选填)</p>
                </label>
                <el-input type="textarea" id="inputData" class="col-lg-9 col-md-10 col-sm-12" 
                  maxlength="500" placeholder="需要使用的测试数据..." 
                  :autosize="{ minRows: 3}" v-model.trim='CaseData.DataInput'>
                </el-input>
              </div>
              <div class='form-group row'>
                <label for='CaseOutput' class="col-lg-2 col-md-2 col-sm-12 testcase-label">
                  预期结果<span class="text-red">*</span>
                </label>
                <el-input type="textarea" id="inputOutput" class="col-lg-9 col-md-10 col-sm-12"
                  maxlength="500" placeholder="测试用例预期结果..."
                  :autosize="{ minRows: 4}" v-model.trim='CaseData.ExpectedResult'
                  required>
                </el-input>
              </div>
              <div class='form-group row'>
                <label for='case-file' class="col-lg-2 col-md-2 col-sm-12 testcase-label">设计图/原型图</label>
                <form id="case-file" class="col-lg-9 col-md-10 col-sm-12 px-0">
                  <el-upload 
                    name="images" 
                    action="/api/support/upload?type=testcase" 
                    list-type="picture-card" 
                    :limit="5" :on-success="ImageSuccess" 
                    :on-remove="handleRemove" 
                    :beforeUpload="beforeAvatarUpload" 
                    :file-list="fileList">
                    <i class="el-icon-plus"></i>
                  </el-upload>
                </form>
              </div>
              <div class='form-group row' v-show="isRemarkDisable">
                <label for='CaseOutput' class="col-lg-2 col-md-2 col-sm-12 testcase-label">
                  备注<p class="label-desc">(选填)</p>
                </label>
                <el-input type="textarea" id="inputOutput" class="col-lg-9 col-md-10 col-sm-12"
                  maxlength="1000" placeholder="请输入备注..."
                  :autosize="{ minRows: 4}" v-model.trim='CaseData.remark'>
                </el-input>
              </div>

              <!-- 提交按钮 -->
              <div class='d-flex justify-content-center my-5'>
                <button type='button' class='btn btn-accessories' @click="isShowRemark">
                  添加备注
                </button>
                <button type='button' class='btn btn-submit mx-3' value="only-once-commit" 
                  :disabled="isButtonDisabled"
                  @click='addTest'>
                  保存提交
                </button>
                <button type='button' class='btn btn-accessories' value="continue-commit" 
                  :disabled="isButtonDisabled"
                  @click='addTest($event)'>
                  继续添加
                </button>
                <button type='button' class='btn btn-accessories' @click="$router.go(-1)">
                  返回
                </button>
              </div>
            </div>
          </form>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import fileutil from "~/assets/js/file.js"

export default {  
  head () {
    return {
      title: 'HDesk - 编写测试用例'
    }
  },

  data () {
    return {
      last_url: '',
      product_list: [],
      modules_list: [],
      msg: '',
      isButtonDisabled: false,
      isRemarkDisable: false,
      CaseData: {
        product_code: null,
        title: '',
        precondition: '',
        DataInput: '',
        ExpectedResult: '',
        steps: '',
        remark: '',
        category: 'Functional',
        priority: 'P1',
        module_id: [],
        annex: []
      },
      fileList: [],
    }
  },

  beforeRouteLeave (to, from, next) {
    this.last_url = to.path
    next()
  },

  computed: {
    selected_product () {
      return this.CaseData.product_code ? this.CaseData.product_code : null
    },
    uploadDisabled:function() {
      return this.fileList.length > 5
    }
  },

  watch: {
    selected_product: function (val, oldVal) {
      this.getModule()
      this.$router.replace({
        path: '/app/qa/testcase/add',
        query: {'product_code': this.CaseData.product_code}
      })
    },
    product_list: function (val, oldVal) {
      if (this.product_list.length > 0 & !this.CaseData.product_code) {
        this.CaseData.product_code = this.product_list[0]['value']
      }
    }
  },

  created () {
    this.getProductList()
    if (this.$route.query.product_code) {
      this.CaseData.product_code = this.$route.query.product_code     
    }
  },

  methods: {
    getProductList () {
      axios.get('/api/pm/new_product_release')
        .then(res => {
          if (res.data['status'] === 20000) {
            this.product_list = res.data['data']
          }
        })
    },
    getModule () {
      axios.get('/api/pm/get_module?product_code=' + this.CaseData.product_code)
        .then(res => {
          if (res.data['status'] === 20000) {
            this.modules_list = res.data['data']
          } else {
            this.Msg = res.data['msg']
          }
        })
    },
    isShowRemark () {
      if (this.isRemarkDisable) {
        this.isRemarkDisable = false
        this.CaseData.remark = ''
      } else {
        this.isRemarkDisable = true
      }
    },
    handleRemove(file) {
      fileutil.FileHandleRemove(file,this.CaseData.annex)
    },
    ImageSuccess(response, fileList) {
      this.CaseData.annex.push(response["name"])
    },
    beforeAvatarUpload(file) {
      fileutil.FileBeforeAvatarUpload(file)
    },
    addTest (event) {
      var title = this.CaseData.title
      var DataInput = this.CaseData.DataInput
      var ExpectedResult = this.CaseData.ExpectedResult
      var steps = this.CaseData.steps

      if (title.length < 5 | title.length > 50) {
        this.$notify.error({
          title: '错误',
          message: '标题有效长度为5到50位'
        })
        return
      }
      if (DataInput.trim().length > 500) {
        this.$notify.error({
          title: '错误',
          message: '测试输入最多为500个字符'
        })
        return
      }
      if (ExpectedResult.trim().length < 2 | ExpectedResult.trim().length > 500) {
        this.$notify.error({
          title: '错误',
          message: '预期结果的有效长度为2到500位，且不能为空'
        })
        return
      }
      if (steps.trim().length < 5 | steps.trim().length > 1000) {
        this.$notify.error({
          title: '错误',
          message: '操作步骤的有效长度为5到1000'
        })
        return
      }
      if (this.CaseData.remark.length > 1000) {
        this.$notify.error({
          title: '错误',
          message: '备注输入太长了,有效最大长度为1000'
        })
        return
      }
      axios({
        method: 'post',
        url: '/api/qa/testcase/add',
        data: JSON.stringify(this.CaseData),
        transformRequest: [ (data) => {
          this.isButtonDisabled = true
          return data
        }]
      }).then(res => {
        if (res.data['status'] === 20000) {
          this.isButtonDisabled = false
          if (event.target.value === 'only-once-commit') {
            if (this.last_url == '/app/qa/testcase') {
              this.$router.go(-1)
            } else {
              this.$router.replace({ 
                path: '/app/qa/testcase', 
                query: { product_code: this.CaseData.product_code }
              })
            }
          }
          if (event.target.value === 'continue-commit') {
            $(document).scrollTop(0)
            this.CaseData.title = ''
            this.CaseData.precondition = ''
            this.CaseData.DataInput = ''
            this.CaseData.remark = ''
            this.CaseData.ExpectedResult = ''
            this.CaseData.steps = '1.\n2.\n'
          } 
        } else {
          this.isButtonDisabled = false
          this.$notify.error({
            title: '错误',
            message: res.data['msg']
          })
        }
      })
    }
  }
}
</script>

<style>
  @import '~/static/static/common/css/test.css'
</style>