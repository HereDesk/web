<template>
  <div id="page-testcase-add">
    <BaseNav :title="title"></BaseNav>
    
    <div id="page-testcase-add" class="container mt-5 pg-test-edit">
      <div class="row m-0">
        <div id="page-body" class="col-lg-10 col-md-12 col-sm-12 col-12 offset-xl-1 offset-lg-1">
          
          <div id="case-product" class="form-group row">
            <label for="CaseInfo" class="col-md-2 col-sm-12 col-12 testcase-label">
              产品与模块<span class="text-red">*</span>
            </label>
            <div class="col-md-6 col-sm-8 col-12">
              <ProductInfo :ptype="'case_add'" :showVersionInfo="true" @ProductInfo="GetProductInfo">
              </ProductInfo>
            </div>
          </div>

          <div id="case-info" class="form-group row">
            <label for="CaseInfo" class="col-md-2 col-sm-12 col-12 testcase-label">
              用例属性<span class="text-red">*</span>
            </label>
            <el-select class="col-md-3 col-sm-4 col-6 e-select-support" placeholder="用例类型" 
              v-model="CaseData.category">
              <el-option value="Functional" label="功能"></el-option>
              <el-option value="compatibility" label="兼容"></el-option>
              <el-option value="UI" label="UI">UI</el-option>
              <el-option value="performance" label="性能"></el-option>
              <el-option value="other" label="其它"></el-option>
            </el-select>
            <el-select class="col-md-3 col-sm-4 col-6" placeholder="优先级" v-model="CaseData.priority">
              <el-option value="P1">P1</el-option>
              <el-option value="P2">P2</el-option>
              <el-option value="P3">P3</el-option>
            </el-select>
          </div>

          <div id="case-functional">
            <div id="case-title" class="form-group row">
              <label for="CaseTitle" class="col-lg-2 col-md-2 col-sm-12 testcase-label">
                用例标题<span class="text-red">*</span>
              </label>
              <el-input type="text" id="inputTitle" class="col-lg-9 col-md-10 col-sm-12" 
                placeholder="用例标题..."
                maxlength="50" required 
                v-model.trim="CaseData.title">
              </el-input>
            </div>

            <div id="case-precondition" class="form-group row">
              <label for="CasePrecondition" class="col-lg-2 col-md-2 col-sm-12 testcase-label">
                执行前置条件<p class="label-desc">(选填)</p>
              </label>
              <div class="col-lg-9 col-md-10 col-sm-12 no-toolbars">
                <mavon-editor placeholder="测试用例执行前置条件 ~" 
                  :toolbarsFlag="false" :subfield="false" v-model.trim="CaseData.precondition">
                </mavon-editor>
              </div>
            </div>

            <div id="case-steps" class="form-group row">
              <label for="CaseSteps" class="col-lg-2 col-md-2 col-sm-12 testcase-label">
                操作步骤<span class="text-red">*</span>
              </label>
              <div class="col-lg-9 col-md-10 col-sm-12 toolbars">
                <mavon-editor placeholder="请输入操作步骤 ~" 
                  :toolbars="mavon_md_base_toolbars" :subfield="false" v-model.trim="CaseData.steps">
                </mavon-editor>
              </div>
            </div>

            <div id="case-data-input" class="form-group row mt-3">
              <label for="CaseInput" class="col-lg-2 col-md-2 col-sm-12 testcase-label">
                测试数据<p class="label-desc">(选填)</p>
              </label>
              <div class="col-lg-9 col-md-10 col-sm-12 no-toolbars">
                <mavon-editor placeholder="需要使用的测试数据 ~" 
                  :toolbarsFlag="false" :subfield="false" :autofocus="false"
                  v-model.trim="CaseData.DataInput">
                </mavon-editor>
              </div>
            </div>

            <div id="case-ExpectedResult" class="form-group row">
              <label for="CaseOutput" class="col-lg-2 col-md-2 col-sm-12 testcase-label">
                预期结果<span class="text-red">*</span>
              </label>
              <div class="col-lg-9 col-md-10 col-sm-12 no-toolbars">
                <mavon-editor placeholder="测试用例预期结果 ~" 
                  :toolbarsFlag="false" :subfield="false" :autofocus="false"
                  v-model.trim="CaseData.ExpectedResult">
                </mavon-editor>
              </div>
            </div>

            <div id="case-annex" class="form-group row">
              <label for="case-file" class="col-lg-2 col-md-2 col-sm-12 testcase-label">
                设计图/原型图
              </label>
              <form id="case-file" class="col-lg-9 col-md-10 col-sm-12">
                <FileUpload :fileLimit="5" @annex="getAnnex"></FileUpload>
              </form>
            </div>

            <div id="case-remark" class="form-group row" v-show="isRemarkDisable">
              <label for="CaseOutput" class="col-lg-2 col-md-2 col-sm-12 testcase-label">
                备注<p class="label-desc">(选填)</p>
              </label>
              <div class="col-lg-9 col-md-10 col-sm-12 no-toolbars">
                <mavon-editor placeholder="请输入备注 ~" 
                  :toolbarsFlag="false" :subfield="false" v-model.trim="CaseData.remark">
                </mavon-editor>
              </div>
            </div>

            <div class="d-flex justify-content-center my-5">
              <button type="button" class="btn btn-accessories" @click="isShowRemark">添加备注</button>
              <button type="button" class="btn btn-submit mx-3" value="only-once-commit" 
                :disabled="isButtonDisabled" @click="addTest">保存提交
              </button>
              <button type="button" class="btn btn-accessories" value="continue-commit" 
                :disabled="isButtonDisabled" @click="addTest($event)">继续添加
              </button>
              <button type="button" class="btn btn-accessories" @click="$router.go(-1)">返回</button>
            </div>
          </div>
        
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import fileutil from "~/assets/js/file.js"
import data from '~/assets/js/data.js'

import FileUpload from '~/components/FileUpload'

export default {  
  head () {
    return {
      title: 'HDesk - 编写测试用例'
    }
  },

  components: {
    FileUpload
  },

  data () {
    return {
      mavon_md_base_toolbars: data.mavon_md_base_toolbars,
      page_type: 'testcase',
      title: '增加测试用例',
      last_url: '',
      msg: '',
      isButtonDisabled: false,
      isRemarkDisable: false,
      CaseData: {
        product_id: null,
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
      }
    }
  },

  beforeRouteLeave (to, from, next) {
    this.last_url = to.path
    next()
  },

  computed: {
  },

  created () {
  },

  methods: {

    // get $emit data
    GetProductInfo (data)  {
      this.CaseData.product_id = data.product_id
      this.CaseData.module_id = data.module_id
    },
    
    // page: is show remark input
    isShowRemark () {
      if (this.isRemarkDisable) {
        this.isRemarkDisable = false
        this.CaseData.remark = ''
      } else {
        this.isRemarkDisable = true
      }
    },

    /*
    ** testcase create
    */
    getAnnex (data) {
      this.CaseData.annex = data
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
      this.axios({
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
  @import '~/assets/css/test.css'
</style>