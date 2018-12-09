<template>
  <div id="page-testcase-edit">
    <BaseNav :title="title"></BaseNav>

    <div id='page-testcase-edit-input' class='container pg-test-edit mt-5'>
      <div id="page-body" class='row' style='margin:0;'>

        <div class='col-xl-10 col-lg-10 col-md-12 col-sm-12 col-12 offset-xl-1 offset-lg-1'>
          <div id="case-product" class='form-group row'>
            <label for='CaseInfo' class="col-md-2 col-sm-12 col-12 testcase-label">
              产品与模块
            </label>
            <el-select class='col-md-3 col-sm-4 col-6' placeholder="请选择产品" 
              v-model="CaseData.product_code" disabled>
              <el-option v-for="item in product_list" :key="item.product_code" 
                :label="item.product_code" :value="item.product_code">
              </el-option>
            </el-select>
            <el-cascader class="col-md-3 col-sm-4 col-6" placeholder="选择模块"
              :options="modules_list" v-model="CaseData.module_id" filterable ></el-cascader>
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
                <div v-for="item in Annex" :key="item.id" class="annex" style="display:inline;">
                  <img :src="item.file_path" :class="{ 'h-annex' : CaseData.annex.length > 0 }">
                  <span class="annex_delete" @click="annex_delete(item.file_path)">
                    <i class="iconfont icon-bucket-del size-1-5" :class="{ 'h-annex' : CaseData.annex.length }"></i>
                  </span>
                </div>
                <FileUpload :filetype="page_type" @annex="getAnnex"></FileUpload>
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
import axios from 'axios'

import fileutil from "~/assets/js/file.js"
import data from '~/assets/js/data.js'

import BaseNav from '~/components/BaseNav'
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
    BaseNav,
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
    getAnnex (data) {
      this.CaseData.annex = data
    },
    getCaseDetails () {
      axios.get('/api/qa/testcase/details?case_id=' + this.case_id)
        .then(res => {
          if (res.data['status'] === 20000) {
            this.Annex = res.data['annex']
            var data = res.data['data']
            var module = new Array()
            module[0] = data.m1_id
            module[1] = data.m2_id
             this.CaseData.module_id = module
             this.CaseData.product_code = data.product_code
             this.CaseData.case_id = data.case_id
             this.CaseData.product_code = data.product_code
             this.CaseData.priority = data.priority
             this.CaseData.title = data.title
             this.CaseData.category = data.category
             this.CaseData.precondition = data.precondition
             this.CaseData.DataInput = data.DataInput
             this.CaseData.steps = data.steps
             this.CaseData.expected_result = data.expected_result
             this.CaseData.remark = data.remark
          } else {
             this.$router.go(-1)
          }
      })
    },

    getModule () {
      axios.get('/api/pm/get_module?product_code=' + this.seleted_product)
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
      var title =  this.CaseData.title
      var DataInput =  this.CaseData.DataInput
      var expected_result =  this.CaseData.expected_result
      var steps =  this.CaseData.steps

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
      axios({
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
  @import '~/static/static/common/css/test.css'
</style>