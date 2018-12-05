<template>
  <div id="page-bug-add">
    <BaseNav :title="title"></BaseNav>
    <div id="page-bug-add-input" class='container mt-5'>
      <div class='row'>
        <div class='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12'>
          
          <!-- bug: product_code and version -->
          <div id="bug-product-version" class='form-group row'>
            <label for='bug-product-version' class="col-md-2 col-sm-12 col-12 bug-label">
              产品与模块
              <span class="text-red">*</span>
            </label>
            <el-select id="bug-product" class='col-md-2 col-sm-4 col-6' placeholder="选择产品" v-model="Bug.product_code" >
              <el-option 
                v-for="item in product_list" :key="item.id" :label="item.product_code" :value="item.product_code">
              </el-option>
            </el-select>
            <el-select id="bug-version" class='col-md-2 col-sm-4 col-6' placeholder="选择版本" v-model="Bug.release">
              <el-option 
                v-for="item in release_list" :key="item.id" :label="item.version" :value="item.version">
              </el-option>
              <!-- <el-option>增加新版本</el-option> -->
            </el-select>
            <el-cascader id="bug-modules" class="col-md-2 col-sm-4 col-6 px-3" 
              :options="modules_list" 
              v-model="Bug.module_id" 
              filterable change-on-select 
              placeholder="选择模块" >
            </el-cascader>
          </div>
          
          <!-- bug: assignedTo and priority and severity -->
          <div id="bug-mini-info" class='form-group row'>
            <label for='bug-mini-info' class="col-lg-2 col-md-2 col-sm-12 col-12 bug-label">
              缺陷属性<span class="text-red">*</span>
            </label>
            <el-select id="bug-assignedTo" class='col-lg-2 col-md-2 col-sm-3 col-6' v-model="Bug.assignedTo_id" placeholder="选择指派人">
              <el-option value="" :disabled="true">请选择指派人</el-option>
              <el-option 
                v-for="item in developer_list" :key="item.id" :label="item.realname" :value="item.user_id">
              </el-option>
            </el-select>
            <el-select id="bug-priority" class='col-lg-2 col-md-2 col-sm-3 col-6' v-model="Bug.priority" placeholder="选择优先级">
              <el-option value="" :disabled="true">请选择优先级</el-option>
              <el-option 
                v-for="item in BugPriorityList" :key="item.id" :label="item.name" :value="item.key">
              </el-option>
            </el-select>
            <el-select id="bug-severity" class='col-lg-2 col-md-2 col-sm-3 col-6' v-model="Bug.severity" placeholder="选择严重程度">
              <el-option value="" :disabled="true">请选择严重程度</el-option>
              <el-option 
                v-for="item in BugSeverityList" :key="item.id" :label="item.name" :value="item.key">
              </el-option>
            </el-select>
          </div>
          
          <!-- bug: source and type -->
          <div id="bug-source-type" class='form-group row'>
            <label for='bug-source-type' class="col-lg-2 col-md-2 col-sm-12 col-12 bug-label">
              缺陷来源/类型
            </label>
            <el-select v-model="Bug.source" placeholder="缺陷来源" class='col-lg-2 col-md-2 col-sm-3 col-6'>
              <el-option value="" :disabled="true">请选择缺陷来源</el-option>
              <el-option 
                v-for="(item,index) in BugSourceList" :key="index" :label="item.name" :value="item.key">
              </el-option>
            </el-select>
            <el-select v-model="Bug.bug_type" placeholder="缺陷类型" class='col-lg-2 col-md-2 col-sm-3 col-6'>
              <el-option value="" :disabled="true">请选择缺陷类型</el-option>
              <el-option 
                v-for="item in BugTypeList" :key="item.id" :label="item.name" :value="item.key">
              </el-option>
            </el-select>
          </div>

          <!-- bug: title -->
          <div id="bug-title" class='form-group row'>
            <label for='bug-title' class="col-lg-2 col-md-2 col-sm-12 bug-label">
              缺陷标题<span class="text-red">*</span>
            </label>
            <el-input type='text' id='bug-title-input' class='col-lg-8 col-md-10 col-sm-12'
              maxlength='100' placeholder='标题，最多100个字符 ~.' 
              v-model.trim='Bug.title' required>
            </el-input>
          </div>
          
          <!-- bug: steps -->
          <div id="bug-steps" class='form-group row'>
            <label for='bug-steps' class="col-lg-2 col-md-2 col-sm-12 bug-label">
              发现步骤<span class="text-red">*</span>
            </label>
            <quill-editor class="col-lg-8 col-md-10 col-sm-12 quill-editor-define" 
              v-model.trim="Bug.steps">
            </quill-editor>
          </div>
          
          <!-- bug: result -->
          <div id="bug-reality-result" class='form-group row'>
            <label for='bug-reality-result' class="col-lg-2 col-md-2 col-sm-12 bug-label">
              实际结果<span class="text-red">*</span>
            </label>
            <el-input type="textarea" class="col-lg-8 col-md-10 col-sm-12"
              maxlength="1000" placeholder="实际结果..."
              :autosize="{ minRows: 4}" 
              v-model.trim='Bug.reality_result'>
            </el-input>
          </div>
          
          <!-- bug: result -->
          <div id="bug-expected-result" class='form-group row'>
            <label for='bug-expected-result' class="col-lg-2 col-md-2 col-sm-12 bug-label">预期结果</label>
            <el-input type="textarea" class="col-lg-8 col-md-10 col-sm-12" maxlength="1000" 
              :autosize="{ minRows: 4}" 
              placeholder="预期结果..." 
              v-model.trim='Bug.expected_result'>
            </el-input>
          </div>
          
          <!-- bug: file -->
          <div id="bug-file" class='form-group row'>
            <label for='bug-file' class="col-lg-2 col-md-2 col-sm-12 bug-label">附件</label>
            <form class="col-lg-8 col-md-10 col-sm-12">
              <FileUpload :filetype="page_type" @annex="getAnnex"></FileUpload>
            </form>
          </div> 
          
          <!-- bug: remark -->
          <div id="bug-remark" class='form-group row' v-if="isRemarkDisable">
            <label for='bug-remark' class="col-md-2 col-sm-12 bug-label">备注</label>
            <el-input type="textarea" class="col-lg-8 col-md-10 col-sm-12"
              maxlength="10000" placeholder="请输入备注..."
              :autosize="{ minRows: 4}" 
              v-model.trim='Bug.remark'>
            </el-input>
          </div>
  
          <!-- bug: about button -->
          <div id="bug-btn" class='d-flex justify-content-center my-5'>
            <button type='button' class='btn btn-accessories' @click="isShowRemark">添加备注</button>
            <button type='button' class='btn btn-submit mx-3' value="only-once-commit" 
              :disabled="isButtonDisabled" @click='createBug($event)'>
              保存提交
            </button>
            <button type='button' class='btn btn-accessories' value="continue-commit" 
              :disabled="isButtonDisabled" @click='createBug($event)'>
              继续添加
            </button>
            <button type='button' class='btn btn-accessories' @click="$router.go(-1)">返回</button>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import fileutil from "~/assets/js/file.js"
import BaseNav from '~/components/BaseNav'
import FileUpload from '~/components/FileUpload'

export default {
  head() {
    return {
      title: "HDesk - 创建缺陷"
    }
  },
  components: {
    BaseNav,
    FileUpload
  },
  data() {
    return {
      title: '创建缺陷',
      page_type: 'bug',
      fileList: [],
      developer_list: [],
      product_list: [],
      modules_list: [],
      isButtonDisabled: false,
      isRemarkDisable: false,
      Bug: {
        case_id: this.$route.query.case_id || null,
        cell_id: this.$route.query.cell_id || null,
        product_code: "",
        release: "",
        module_id: [],
        severity: "Normal",
        priority: "P3",
        source: "",
        bug_type: "Function",
        assignedTo_id: "",
        title: "",
        steps: "",
        reality_result: "",
        expected_result: "",
        remark: "",
        annex: []
      }
    }
  },

  computed: {
    selected_product_code () {
      return this.Bug.product_code
    },
    BugSourceList() {
    	return this.$store.state.BugProperty.bug_source
    },
    BugTypeList() {
      return this.$store.state.BugProperty.bug_type
    },
    BugPriorityList() {
      return this.$store.state.BugProperty.bug_priority
    },
    BugSeverityList() {
      return this.$store.state.BugProperty.bug_severity
    },
    release_list () {
      let arr = []
      if (this.Bug.product_code) {
        for (let i in this.product_list) {
          if (this.Bug.product_code === this.product_list[i]["product_code"]) {
            return arr.concat(this.product_list[i]["data"])
          }
        }
      } else {
        return null
      }
    },
  },

  watch: {
    selected_product_code: function(old, oldVal) {
      this.Bug.release = ''
      this.getModule()
      this.getDeveloper()
    }
  },

  created() {
    this.getProductRelease()
    if (JSON.stringify(this.$store.state.BugProperty) === "{}") {
      this.$store.dispatch("getBugProperty")
    }
    if (this.$route.query.case_id) {
      this.getCaseDetails()
    }
  },

  methods: {
    // get commponents fileupload data
    getAnnex (data) {
      this.Bug.annex = data
    },
    // get testcase details
    getCaseDetails() {
      axios.get("/api/qa/testcase/details?case_id=" + this.$route.query.case_id)
        .then(res => {
          if (res.data["status"] === 20000) {
            this.Bug.steps = res.data["data"]["steps"]
            this.Bug.expected_result = res.data["data"]["expected_result"]
          } else {
            this.$notify.error({
              title: '提示',
              message: res.data["msg"]
            })
          }
        })
    },
    // get product_release info
    getProductRelease() {
      axios.get("/api/pm/product_release").then(res => {
        if (res.data["status"] === 20000) {
          this.product_list = res.data["data"]
          this.Bug.product_code = res.data["data"][0]["product_code"]
        }
      })
    },
    getModule() {
      axios.get("/api/pm/get_module?product_code=" + this.Bug.product_code)
        .then(res => {
          if (res.data["status"] === 20000) {
            this.modules_list = res.data["data"]
          } else {
            this.Msg = res.data["msg"]
          }
        })
    },
    getDeveloper() {
      axios.get("/api/pm/member/list?group=Developer&product_code=" + this.Bug.product_code)
        .then(res => {
          if (res.data["status"] === 20000) {
            this.developer_list = res.data["data"]
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
    createBug(event) {
      if (!this.Bug.release) {
        this.$notify.error({
          title: "提示",
          message: "请选择版本号"
        })
        return
      }
      if ((this.Bug.title.length < 6) | (this.Bug.title.length > 100)) {
        this.$notify.error({
          title: "提示",
          message: "标题的有效长度为6到100之间"
        })
        return
      }
      if (!this.Bug.steps) {
        this.$notify.error({
          title: "提示",
          message: "操作步骤不能为空哦"
        })
        return
      }
      if ((this.Bug.steps.length < 10) | (this.Bug.steps.length > 100000)) {
        this.$notify.error({
          title: "提示",
          message: "操作步骤，有效长度需为10到100000"
        })
        return
      }
      if (!this.Bug.reality_result) {
        this.$notify.error({
          title: "提示",
          message: "实际结果不能为空哦"
        })
        return
      }
      if ((this.Bug.reality_result.length < 2) | (this.Bug.reality_result.length > 500)) {
        this.$notify.error({
          title: "提示",
          message: "实际结果, 有效长度为2到500"
        })
        return
      }
      if (this.Bug.expected_result.length > 500) {
        this.$notify.error({
          title: "提示",
          message: "预期结果, 长度需小于500"
        })
        return
      }
      if (this.Bug.remark.length > 10000) {
        this.$notify.error({
          title: "提示",
          message: "备注输入太长了,长度需要小于10000"
        })
        return
      }
      axios({
        method: "post",
        url: "/api/qa/bug/create",
        data: JSON.stringify(this.Bug),
        transformRequest: [
          (data) => {
            this.isButtonDisabled = true
            return data
          }
        ]
      }).then(res => {
        if (res.data["status"] === 20000) {
          this.$notify.success({
            title: "成功",
            message: res.data["msg"]
          })
          if (event.target.value === "only-once-commit") {
            this.$router.go(-1)
          }
          if (event.target.value === "continue-commit") {
            $(document).scrollTop(0)
            this.Bug.title = ""
            this.Bug.annex = []
            this.fileList = []
            this.Bug.steps = ""
            this.Bug.expected_result = ""
            this.Bug.reality_result = ""
            this.Bug.assignedTo = ""
            this.Bug.remark = ""
            this.Bug.severity = "Normal"
            this.Bug.priority = "P2"
            this.isButtonDisabled = false
          }
        } else {
          this.isButtonDisabled = false
          this.$notify.error({
            title: "失败",
            message: res.data["msg"]
          })
        }
      })
    }
  }
}
</script>

<style>
  @import "~/static/static/common/css/test.css"
</style>