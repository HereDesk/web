<template>
  <div id="page-testcase-edit">
    <BaseNav :title="title"></BaseNav>

    <div id='page-testcase-edit-input' class="container mt-5 pg-test-edit ">
      <div id="page-body" class="row m-0">

        <div class="col-lg-10 col-md-12 offset-lg-1">
          <div id="case-product" class='form-group row'>
            <label for='CaseInfo' class="col-md-2 col-sm-12 col-12 testcase-label">
              产品与模块
            </label>
            <div class="col-md-6 col-sm-8 col-12">
              <ProductInfo
                :ptype="'case_add'" 
                :editData="CaseData" 
                :showVersionInfo="true" 
                @ProductInfo="GetProductInfo">
              </ProductInfo>
            </div>
          </div>

          <div id="case-info" class='form-group row'>
            <label for='CaseInfo' class="col-md-2 col-sm-12 col-12 testcase-label">
              用例属性
            </label>
            <el-select class='col-md-3 col-sm-4 col-6 e-select-support' placeholder="用例类型" 
              v-model="CaseData.category">
              <el-option value="Functional" label="功能"></el-option>
              <el-option value="compatibility" label="兼容"></el-option>
              <el-option value="UI" label="UI">UI</el-option>
              <el-option value="performance" label="性能"></el-option>
              <el-option value="other" label="其它"></el-option>
            </el-select>
            <el-select class='col-md-3 col-sm-4 col-6' placeholder="优先级" v-model="CaseData.priority">
              <el-option value="P1">P1</el-option>
              <el-option value="P2">P2</el-option>
              <el-option value="P3">P3</el-option>
            </el-select>
          </div>

          <!-- 测试用例：功能测试用例 -->
          <div id="t-testcase-functional">
            <div id="case-title" class='form-group row'>
              <label for='CaseTitle' class="col-lg-2 col-md-2 col-sm-12 testcase-label">用例标题</label>
              <el-input type='text' id='inputTitle' class='col-lg-9 col-md-10 col-sm-12' 
                placeholder='用例标题...' maxlength='50' required v-model.trim='CaseData.title'>
              </el-input>
            </div>
            <div id="case-precondition" class='form-group row'>
              <label for='CasePrecondition' class="col-lg-2 col-md-2 col-sm-12 testcase-label">
                执行前置条件<p class="label-desc">(选填)</p>
              </label>
              <div class="col-lg-9 col-md-10 col-sm-12 no-toolbars">
                <mavon-editor placeholder="测试用例执行前置条件 ~" :toolbarsFlag="false"
                  :subfield="false" v-model.trim="CaseData.precondition">
                </mavon-editor>
              </div>
            </div>
            <div id="case-steps" class='form-group row'>
              <label for='CaseSteps' class="col-lg-2 col-md-2 col-sm-12 testcase-label">操作步骤</label>
              <div class="col-lg-9 col-md-10 col-sm-12 toolbars">
                <mavon-editor placeholder="请输入操作步骤 ~" :toolbars="mavon_md_base_toolbars"
                  :subfield="false" v-model.trim="CaseData.steps">
                </mavon-editor>
              </div>
            </div>
            <div id="case-data-input" class='form-group row'>
              <label for='CaseInput' class="col-lg-2 col-md-2 col-sm-12 testcase-label">
                测试数据<p class="label-desc">(选填)</p>
              </label>
              <div class="col-lg-9 col-md-10 col-sm-12 no-toolbars">
                <mavon-editor placeholder="请输入测试数据 ~" :toolbarsFlag="false"
                  :subfield="false" v-model.trim="CaseData.DataInput">
                </mavon-editor>
              </div>
            </div>
            <div id="case-expected_result" class='form-group row'>
              <label for='CaseOutput' class="col-lg-2 col-md-2 col-sm-12 testcase-label">预期结果</label>
              <div class="col-lg-9 col-md-10 col-sm-12 no-toolbars">
                <mavon-editor placeholder="请输入预期结果 ~" :toolbarsFlag="false"
                  :subfield="false" v-model.trim="CaseData.expected_result">
                </mavon-editor>
              </div>
            </div>
            <div id="case-remark" class='form-group row'>
              <label for='CaseOutput' class="col-lg-2 col-md-2 col-sm-12 testcase-label">
                备注<p class="label-desc">(选填)</p>
              </label>
              <div class="col-lg-9 col-md-10 col-sm-12 no-toolbars">
                <mavon-editor placeholder="请输入备注 ~" :toolbarsFlag="false"
                  :subfield="false" v-model.trim="CaseData.remark">
                </mavon-editor>
              </div>
            </div>

            <div id="case-annex" class='form-group row'>
              <label class="col-lg-2 col-md-2 col-sm-12 bug-label">设计图/原型图</label>
              <form class="col-lg-8 col-md-10 col-sm-12">
                <div v-for="(item,index) in Annex" :key="index" class="annex">
                  <img :src="item.file_path">
                  <span class="annex_delete" @click="annex_delete(item.file_path)">
                    <i class="iconfont icon-bucket-del size-1-5"></i>
                  </span>
                </div>
                <FileUpload :fileLimit="5" @annex="getAnnex"></FileUpload>
              </form>
            </div> 

            <!-- 提交按钮 -->
            <div id="case-button" class='d-flex justify-content-center my-5'>
              <button type='button' class='btn btn-transparent' @click="$router.go(-1)">返回</button>
              <button type='button' class='btn btn-submit mx-5 px-3' :disabled="isButtonDisabled" @click='EditTestCase'>
                提交修改
              </button>
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
      title: 'HDesk - 编辑测试用例'
    }
  },
  validate({ query }) {
    return /\w{2,6}/.test(query.case_id)
  },

  components: {
    FileUpload
  },

  data () {
    return {
      title: '编辑测试用例',
      page_type: 'testcase',
      product_list: [],
      modules_list: [],
      msg: '',
      isButtonDisabled: false,
      case_id: null,
      mavon_md_base_toolbars: data.mavon_md_base_toolbars,
      CaseData: {
        product_code: null,
        category: null,
        priority: null,
        module_id: [],
        annex: []
      },
      fileList: [],
      Annex: [],
      AnnexDelData: {
        file_path: null
      }
    }
  },

  computed: {
    seleted_product () {
      return this.CaseData.product_code
    },
    uploadDisabled:function() {
      return this.fileList.length > 5
    }
  },

  watch: {
    seleted_product: function(val, oldVal) {
      if (this.seleted_product) {
        this.getModule()
      }
    }
  },

  created () {
    if (this.$route.query.case_id) {
      this.case_id = this.$route.query.case_id 
      this.getCaseDetails()   
    } else {
      this.$router.go(-1)
    }
  },

  methods: {
    // get $emit data
    GetProductInfo (data)  {
      this.CaseData.product_code = data.product_code
      this.CaseData.module_id = data.module_id
    },
    getAnnex (data) {
      this.CaseData.annex = data
    },
    
    getCaseDetails () {
      this.axios
        .get('/api/qa/testcase/details?case_id=' + this.case_id)
        .then(res => {
          if (res.data['status'] === 20000) {
            let data = res.data['data']
            this.Annex = res.data['annex']
            Object.assign(this.CaseData,data)
            data['m1_id'] ? this.CaseData.module_id[0] = data['m1_id'] : null
            data['m2_id'] ? this.CaseData.module_id[1] = data['m2_id'] : null
          } else {
            this.$router.go(-1)
          }
      })
    },

    getModule () {
      this.axios
        .get('/api/pm/get_module?product_code=' + this.seleted_product)
        .then(res => {
          if (res.data['status'] === 20000) {
             this.modules_list = res.data['data']
          } else {
             this.Msg = res.data['msg']
          }
        })
    },
    annex_delete (path) {
      this.AnnexDelData.file_path = path
      fileutil.AnnexDelete("testcase",path,this.AnnexDelData,this.Annex)
    },

    EditTestCase (event) {
      let title =  this.CaseData.title
      let DataInput =  this.CaseData.DataInput
      let expected_result =  this.CaseData.expected_result
      let steps =  this.CaseData.steps

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
      if (expected_result.trim().length < 6 | expected_result.trim().length > 500) {
        this.$notify.error({
          title: '错误',
          message: '预期结果的有效长度为6到500位，且不能为空'
        })
        return
      }
      if (steps.trim().length < 10 | steps.trim().length > 5000) {
        this.$notify.error({
          title: '错误',
          message: '操作步骤的有效长度为10到5000'
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
      if (!this.CaseData.module_id[0] && !this.CaseData.module_id[1]){
         this.CaseData.module_id = []
      }
      this.axios({
        method: 'post',
        url: '/api/qa/testcase/edit',
        data: JSON.stringify(this.CaseData),
        transformRequest: [ (data) => {
            this.isButtonDisabled = true
            return data
        }]
      }).then(res => {
        if (res.data['status'] === 20000) {
           this.$router.go(-1)
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