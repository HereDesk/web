<template>
  <div id="page-testcase-edit" class='container pg-test-edit'>
    <div class='row' style='margin:0;'>
      <div class='col-xl-10 col-lg-10 col-md-12 col-sm-12 col-12 offset-xl-1 offset-lg-1'>
        <form sytle='background-color:#fff;'>
          <h3 class="text-center my-5">编辑测试用例</h3>
          
          <div class='form-group row'>
            <label for='CaseInfo' class="col-md-2 col-sm-12 col-12 testcase-label">
              产品与模块
            </label>
            <el-select class='col-md-3 col-sm-4 col-6' placeholder="请选择产品" 
              v-model="CaseData.product_code" disabled>
              <el-option 
                v-for="item in product_list" 
                :key="item.product_code" 
                :label="item.product_code" 
                :value="item.product_code">
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
            <div class='form-group row'>
              <label for='CaseTitle' class="col-lg-2 col-md-2 col-sm-12 testcase-label">用例标题</label>
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
              <label for='CaseSteps' class="col-lg-2 col-md-2 col-sm-12 testcase-label">操作步骤</label>
              <quill-editor class="col-lg-9 col-md-10 col-sm-12 quill-editor-define" v-model="CaseData.steps">
              </quill-editor>
            </div>
            <div class='form-group row'>
              <label for='CaseInput' class="col-lg-2 col-md-2 col-sm-12 testcase-label">
                测试数据<p class="label-desc">(选填)</p>
              </label>
              <el-input type="textarea" id="inputData" class="col-lg-9 col-md-10 col-sm-12" 
                maxlength="500" placeholder="需要使用的测试数据..." 
                :autosize="{ minRows: 3}" v-model.trim='CaseData.DataInput'>
              </el-input>
            </div>
            <div class='form-group row'>
              <label for='CaseOutput' class="col-lg-2 col-md-2 col-sm-12 testcase-label">预期结果</label>
              <el-input type="textarea" id="inputOutput" class="col-lg-9 col-md-10 col-sm-12"
                maxlength="500" placeholder="测试用例预期结果..."
                :autosize="{ minRows: 4}" v-model.trim='CaseData.expected_result'
                required>
              </el-input>
            </div>
            <div class='form-group row'>
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
              <button type='button' class='btn btn-transparent' @click="$router.go(-1)">返回</button>
              <button type='button' class='btn btn-submit mx-5 px-3' 
                :disabled="isButtonDisabled"
                @click='EditTestCase'>
                提交修改
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  head () {
    return {
      title: 'HDesk - 编辑测试用例'
    }
  },
  validate({ query }) {
    return query.case_id ? true : false
  },
  layout: 'head',
  data () {
    return {
      product_list: [],
      modules_list: [],
      msg: '',
      isButtonDisabled: false,
      case_id: null,
      CaseData: {
        product_code: null,
        category: null,
        priority: null
      }
    }
  },

  computed: {
    seleted_product () {
      return this.CaseData.product_code
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
    getCaseDetails () {
      let that = this
      axios.get('/api/qa/testcase/details?case_id=' + this.case_id)
        .then(function (res) {
          if (res.data['status'] === 20000) {
            var data = res.data['data']
            var module = new Array()
            module[0] = data.m1_id
            module[1] = data.m2_id
            that.CaseData.module_id = module
            that.CaseData.product_code = data.product_code
            that.CaseData.case_id = data.case_id
            that.CaseData.product_code = data.product_code
            that.CaseData.priority = data.priority
            that.CaseData.title = data.title
            that.CaseData.category = data.category
            that.CaseData.precondition = data.precondition
            that.CaseData.DataInput = data.DataInput
            that.CaseData.steps = data.steps
            that.CaseData.expected_result = data.expected_result
            that.CaseData.remark = data.remark
          } else {
            that.$router.go(-1)
          }
      })
    },

    getModule () {
      let that = this
      axios.get('/api/pm/get_module?product_code=' + this.seleted_product)
        .then(function (res) {
          if (res.data['status'] === 20000) {
            that.modules_list = res.data['data']
          } else {
            that.Msg = res.data['msg']
          }
        })
    },

    EditTestCase (event) {
      let _this = this
      var title = _this.CaseData.title
      var DataInput = _this.CaseData.DataInput
      var expected_result = _this.CaseData.expected_result
      var steps = _this.CaseData.steps

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
      if (steps.trim().length < 10 | steps.trim().length > 500) {
        this.$notify.error({
          title: '错误',
          message: '操作步骤的有效长度为10到500'
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
        url: '/api/qa/testcase/edit',
        data: JSON.stringify(_this.CaseData),
        transformRequest: [ function (data) {
          _this.isButtonDisabled = true
          return data
        }]
      }).then(function (rep) {
        if (rep.data['status'] === 20000) {
          _this.$router.go(-1)
        } else {
          _this.isButtonDisabled = false
          _this.$notify.error({
            title: '错误',
            message: rep.data['msg']
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