<template>
  <div id="page-bug-add">
    <BaseNav :title="title"></BaseNav>
    <div id="page-bug-add-input" class='container mt-5'>
      <div class="row">
        <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
          
          <!-- bug: product_code and version -->
          <div id="bug-product-version" class="form-group row">
            <label for='bug-product-version' class="col-lg-2 col-md-2 col-sm-12 col-12 bug-label">
              产品与模块<span class="text-red">*</span>
            </label>
            <div class="col-lg-6 col-md-10 col-sm-12 col-12">
              <ProductInfo :ptype="'bug_create'" :showVersionInfo="true" @ProductInfo="GetProductInfo"></ProductInfo>
            </div>
          </div>
          
          <!-- bug: assignedTo and priority and severity -->
          <div id="bug-mini-info" class="form-group row">
            <label for='bug-mini-info' class="col-lg-2 col-md-2 col-sm-12 col-12 bug-label">
              缺陷属性<span class="text-red">*</span>
            </label>
            <div class="col-lg-6 col-md-10 col-sm-12 col-12">
              <div class="container-fluid px-0">
                <div class="row">
                  <el-select id="bug-assignedTo" class="col" 
                    placeholder="选择指派人" v-model="Bug.assignedTo_id">
                    <el-option value="" :disabled="true">请选择指派人</el-option>
                    <el-option 
                      v-for="item in developer_list" :key="item.id" :label="item.realname" :value="item.user_id">
                    </el-option>
                  </el-select>
                  <el-select id="bug-priority" class="col" 
                    placeholder="选择优先级" v-model="Bug.priority">
                    <el-option value="" :disabled="true">请选择优先级</el-option>
                    <el-option 
                      v-for="item in BugProperty.bug_priority" :key="item.id" :label="item.name" :value="item.key">
                    </el-option>
                  </el-select>
                  <el-select id="bug-severity" class="col" 
                    placeholder="选择严重程度" v-model="Bug.severity">
                    <el-option value="" :disabled="true">请选择严重程度</el-option>
                    <el-option 
                      v-for="item in BugProperty.bug_severity" :key="item.id" :label="item.name" :value="item.key">
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>
          </div>
          
          <!-- bug: source and type -->
          <div id="bug-source-type" class="form-group row">
            <label for="bug-source-type" class="col-lg-2 col-md-2 col-sm-12 col-12 bug-label">
              缺陷来源/类型
            </label>
            <div class="col-lg-4 col-md-10 col-sm-12 col-12">
              <div class="container-fluid px-0">
                <div class="row">
                  <el-select class="col" placeholder="缺陷来源" v-model="Bug.bug_source">
                    <el-option value="" :disabled="true">请选择缺陷来源</el-option>
                    <el-option v-for="(item,index) in BugProperty.bug_source" 
                      :key="index" :label="item.name" :value="item.key">
                    </el-option>
                  </el-select>
                  <el-select class="col" placeholder="缺陷类型" v-model="Bug.bug_type"> 
                    <el-option value="" :disabled="true">请选择缺陷类型</el-option>
                    <el-option v-for="item in BugProperty.bug_type" 
                      :key="item.id" :label="item.name" :value="item.key">
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>
          </div>

          <!-- bug: title -->
          <div id="bug-title" class="form-group row">
            <label for="bug-title" class="col-lg-2 col-md-2 col-sm-12 bug-label">
              缺陷标题<span class="text-red">*</span>
            </label>
            <el-input type="text" id="bug-title-input" class="col-lg-8 col-md-10 col-sm-12"
              maxlength="100" placeholder="标题，最多100个字符 ~." 
              v-model.trim="Bug.title" required autofocus>
            </el-input>
          </div>
          
          <!-- bug: steps -->
          <div id="bug-steps" class="form-group row">
            <label for="bug-steps" class="col-lg-2 col-md-2 col-sm-12 bug-label">
              发现步骤<span class="text-red">*</span>
            </label>
            <div class="col-lg-8 col-md-10 col-sm-12 toolbars">
              <mavon-editor placeholder="请输入发现步骤 ~" 
                :toolbars="mavon_md_base_toolbars"
                :subfield="false"
                :autofocus="false"
                v-model.trim="Bug.steps">
              </mavon-editor>
            </div>
          </div>
          
          <!-- bug: result -->
          <div id="bug-reality-result" class="form-group row">
            <label for="bug-reality-result'" class="col-lg-2 col-md-2 col-sm-12 bug-label">
              实际结果<span class="text-red">*</span>
            </label>
            <div class="col-lg-8 col-md-10 col-sm-12 no-toolbars">
              <mavon-editor placeholder="请输入实际结果 ~" 
                :toolbarsFlag="false"
                :subfield="false"
                :autofocus="false"
                v-model.trim="Bug.reality_result">
              </mavon-editor>
            </div>
          </div>
          
          <!-- bug: result -->
          <div id="bug-expected-result" class="form-group row">
            <label for="bug-expected-result" class="col-lg-2 col-md-2 col-sm-12 bug-label">
              预期结果
            </label>
            <div class="col-lg-8 col-md-10 col-sm-12 no-toolbars">
              <mavon-editor placeholder="请输入预期结果 ~" 
                :toolbarsFlag="false"
                :subfield="false"
                :autofocus="false"
                v-model.trim="Bug.expected_result">
              </mavon-editor>
            </div>
          </div>
          
          <!-- bug: file -->
          <div id="bug-file" class="form-group row">
            <label for="bug-file" class="col-lg-2 col-md-2 col-sm-12 bug-label">附件</label>
            <form class="col-lg-8 col-md-10 col-sm-12">
              <FileUpload :fileLimit="5" @annex="getAnnex"></FileUpload>
            </form>
          </div> 
          
          <!-- bug: remark -->
          <div id="bug-remark" class="form-group row" v-if="isRemarkDisable">
            <label for="bug-remark" class="col-md-2 col-sm-12 bug-label">备注</label>
            <div class="col-lg-8 col-md-10 col-sm-12 no-toolbars">
              <mavon-editor placeholder="请输入附加信息 ~" 
                :toolbarsFlag="false"
                :subfield="false" 
                :autofocus="false"
                v-model.trim="Bug.remark">
              </mavon-editor>
            </div>
          </div>
  
          <!-- bug: about button -->
          <div id="bug-btn" class="d-flex justify-content-center my-5">
            <button type="button" class="btn btn-accessories" @click="isShowRemark">
              添加备注
            </button>
            <button type="button" class="btn btn-submit mx-3" value="only-once-commit" 
              :disabled="isButtonDisabled" @click="createBug($event)">
              保存提交
            </button>
            <button type="button" class="btn btn-accessories" value="continue-commit" 
              :disabled="isButtonDisabled" @click="createBug($event)">
              继续添加
            </button>
            <button type="button" class="btn btn-accessories" @click="$router.go(-1)">
              返回
            </button>
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
  head() {
    return {
      title: "HDesk - 创建缺陷"
    }
  },
  
  components: {
    FileUpload
  },
  
  data() {
    return {
      title: '创建缺陷',
      isButtonDisabled: false,
      isRemarkDisable: false,
      mavon_md_base_toolbars: data.mavon_md_base_toolbars,
      page_type: 'bug',
      fileList: [],
      Bug: {
        case_id: this.$route.query.case_id || null,
        cell_id: this.$route.query.cell_id || null,
        product_id: "",
        release: "",
        module_id: [],
        severity: "Normal",
        priority: "P3",
        bug_source: "tester",
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
    selected_product_id () {
      return this.Bug.product_id
    },
    developer_list () {
      return this.$store.state.ProductMemberList.data
    },
    BugProperty () {
    	return this.$store.state.BugProperty
    }
  },

  watch: {
    selected_product_id: function(old, oldVal) {
      if (this.selected_product_id) {
        const ProductMembersData = this.$store.state.ProductMemberList
        const isThisProduct = ProductMembersData.hasOwnProperty("product_id") 
          ? (ProductMembersData["product_id"] === this.selected_product_id ? true : false) : false
        if (!isThisProduct){
          this.$store.dispatch("getProductMembers",this.selected_product_id)
        }
      }
    }
  },

  created() {
    if (JSON.stringify(this.$store.state.BugProperty) === "{}") {
      this.$store.dispatch("getBugProperty")
    }
    if (this.$route.query.case_id) {
      this.getCaseDetails()
    }
  },

  methods: {
    // get $emit data
    GetProductInfo (data)  {
      this.Bug.product_id = data.product_id
      this.Bug.release = data.release
      this.Bug.module_id = data.module_id
    },
    
    // get commponents fileupload data
    getAnnex (data) {
      this.Bug.annex = data
    },
    
    // get testcase details
    getCaseDetails() {
      this.axios.get("/api/qa/testcase/details?case_id=" + this.$route.query.case_id)
        .then(res => {
          if (res.data["status"] === 20000) {
            this.Bug.product_id = res.data["data"]["product_id"]
            this.Bug.title = res.data["data"]["title"]
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
      this.axios({
        method: "post",
        url: "/api/qa/bug/create",
        data: JSON.stringify(this.Bug),
        transformRequest: [(data) => {
          this.isButtonDisabled = true
          return data
        }]
      }).then(res => {
        if (res.data["status"] === 20000) {
          this.$notify.success({
            title: "成功",
            message: res.data["msg"]
          })
          if (event.target.value === "only-once-commit") {
            this.$router.push({path: "/app/qa/bug"})
          }
          if (event.target.value === "continue-commit") {
            $(document).scrollTop(0)
            this.Bug.title = ""
            this.Bug.annex = []
            this.fileList = []
            this.Bug.steps = ""
            this.Bug.expected_result = ""
            this.Bug.reality_result = ""
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
  @import "~/assets/css/test.css"
</style>