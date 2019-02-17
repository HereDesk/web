<template>
  <div id="page-bug-add">
    <BaseNav :title="title"></BaseNav>
    <div id="edit-container" class="container mt-5">
      <div id="edit-row" class="row">
        <div class="col">
          
          <!-- bug: product_code and version -->
          <div id="bug-product-version" class="form-group row">
            <label for="bug-product-version" class="col-md-2 col-sm-12 col-12 bug-label">
              产品与模块
              <span class="text-red">*</span>
            </label>
            <div class="col-lg-6 col-md-10 col-sm-12 col-12">
              <ProductInfo :ptype="'bug_edit'" :editData="Bug" :showVersionInfo="true" @ProductInfo="GetProductInfo">
              </ProductInfo>
            </div>
          </div>
          
          <!-- bug: assignedTo and priority and severity -->
          <div id="bug-mini-info" class="form-group row">
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
                v-for="item in BugProperty.bug_priority" :key="item.id" :label="item.name" :value="item.key">
              </el-option>
            </el-select>
            <el-select id="bug-severity" class='col-lg-2 col-md-2 col-sm-3 col-6' v-model="Bug.severity" placeholder="选择严重程度">
              <el-option value="" :disabled="true">请选择严重程度</el-option>
              <el-option 
                v-for="item in BugProperty.bug_severity" :key="item.id" :label="item.name" :value="item.key">
              </el-option>
            </el-select>
          </div>
          
          <!-- bug: source and type -->
          <div id="bug-source-type" class="form-group row">
            <label for='bug-source-type' class="col-lg-2 col-md-2 col-sm-12 col-12 bug-label">
              缺陷来源/类型
            </label>
            <el-select v-model="Bug.bug_source" placeholder="缺陷来源" class='col-lg-2 col-md-2 col-sm-3 col-6'>
              <el-option value="" :disabled="true">请选择缺陷来源</el-option>
              <el-option 
                v-for="(item,index) in BugProperty.bug_source" :key="index" :label="item.name" :value="item.key">
              </el-option>
            </el-select>
            <el-select v-model="Bug.bug_type" placeholder="缺陷类型" class='col-lg-2 col-md-2 col-sm-3 col-6'>
              <el-option value="" :disabled="true">请选择缺陷类型</el-option>
              <el-option 
                v-for="item in BugProperty.bug_type" :key="item.id" :label="item.name" :value="item.key">
              </el-option>
            </el-select>
          </div>

          <!-- bug: title -->
          <div id="bug-title" class="form-group row">
            <label for='bug-title' class="col-lg-2 col-md-2 col-sm-12 bug-label">
              缺陷标题<span class="text-red">*</span>
            </label>
            <el-input type='text' id='bug-title-input' class='col-lg-8 col-md-10 col-sm-12'
              maxlength='100' placeholder='标题，最多100个字符 ~.' 
              v-model.trim='Bug.title' required>
            </el-input>
          </div>
          
          <!-- bug: steps -->
          <div id="bug-steps" class="form-group row">
            <label for='bug-steps' class="col-lg-2 col-md-2 col-sm-12 bug-label">
              发现步骤<span class="text-red">*</span>
            </label>
            <div class="col-lg-8 col-md-10 col-sm-12 toolbars">
              <mavon-editor placeholder="请输入发现步骤 ~" :toolbars="mavon_md_base_toolbars"
                :subfield="false" v-model.trim="Bug.steps">
              </mavon-editor>
            </div>
          </div>
          
          <!-- bug: result -->
          <div id="bug-reality-result" class="form-group row">
            <label for='bug-reality-result' class="col-lg-2 col-md-2 col-sm-12 bug-label">
              实际结果<span class="text-red">*</span>
            </label>
            <div class="col-lg-8 col-md-10 col-sm-12 no-toolbars">
              <mavon-editor placeholder="请输入实际结果 ~" :toolbarsFlag="false"
                :subfield="false" v-model.trim="Bug.reality_result">
              </mavon-editor>
            </div>
          </div>
          
          <!-- bug: result -->
          <div id="bug-expected-result" class="form-group row">
            <label for='bug-expected-result' class="col-lg-2 col-md-2 col-sm-12 bug-label">预期结果</label>
            <div class="col-lg-8 col-md-10 col-sm-12 no-toolbars">
              <mavon-editor placeholder="请输入预期结果 ~" :toolbarsFlag="false"
                :subfield="false" v-model.trim="Bug.expected_result">
              </mavon-editor>
            </div>
          </div>

          <!-- bug: remark -->
          <div id="bug-remark" class="form-group row">
            <label for='bug-remark' class="col-md-2 col-sm-12 bug-label">备注</label>
            <div class="col-lg-8 col-md-10 col-sm-12 no-toolbars">
              <mavon-editor placeholder="请输入附加信息 ~" :toolbarsFlag="false"
                :subfield="false" v-model.trim="Bug.remark">
              </mavon-editor>
            </div>
          </div>
          
          <!-- bug: file -->
          <div id="bug-file" class="form-group row">
            <label for='bug-file' class="col-lg-2 col-md-2 col-sm-12 bug-label">附件</label>
            <form class="col-lg-8 col-md-10 col-sm-12">
							<div v-for="(item,index) in Annex" :key="index" class="annex">
								<img :src="item.url">
								<span class="annex_delete" @click="annex_delete(item.url)">
									<i class="iconfont icon-bucket-del size-1-5"></i>
								</span>
							</div>
              <FileUpload :fileLimit="5" @annex="getAnnex"></FileUpload>
            </form>
          </div> 
          
          <!-- 提交按钮 -->
          <div id="bug-btn" class='d-flex justify-content-center my-5'>
            <button type='button' class='btn btn-transparent' @click="$router.go(-1)">
              返回
            </button>
            <button type='button' class='btn btn-submit mx-5 px-3' 
              :disabled="isButtonDisabled" @click='editBug()'>
              提交修改
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

import BaseNav from '~/components/BaseNav'
import FileUpload from '~/components/FileUpload'

export default {
  head () {
    return {
      title: 'HDesk - 缺陷编辑'
    }
  },

  validate({ query }) {
    return /\w{2,6}/.test(query.bug_id)
  },

  components: {
    BaseNav,
    FileUpload
  },

  data () {
    return {
      title: '编辑缺陷',
      page_type: 'bug',
      fileList: [],
      bug_type: [],
      bug_priority: [],
      bug_severity: [],
      developer_list: [],
      product_list: [],
      release_list: [],
      modules_list: [],
      isButtonDisabled: false,
      isRemarkDisable: false,
      BugDetails: {},
      product_id: '',
      Annex: [],
      AnnexDelData: {
        url: null
      },
      mavon_md_base_toolbars: data.mavon_md_base_toolbars,
      Raw_Data: false,
      Bug: {
        bug_id: null,
        priority: null,
        severity: null,
        bug_source: null,
        bug_type: null,
        product_id: null,
        release: null,
        assignedTo_id: null,
        module_id: ['',''],
        annex: []
      }
    }
  },

  computed: {
    uploadDisabled() {
      return this.fileList.length > 3
    },
    selected_product_id() {
      return this.Bug.product_id
    },
    BugProperty() {
    	return this.$store.state.BugProperty
    }
  },

  watch: {
    selected_product_id: function (old,oldVal) {
      this.getModule()
			this.getDeveloper()
    }
  },

  created () {
    this.currentBugId = this.$route.query.bug_id 
    this.getBugDetails()   
  },

  mounted () {
    if (JSON.stringify(this.$store.state.BugProperty) === "{}") {
    	this.$store.dispatch("getBugProperty")
    }
  },

  methods: {
    // get $emit data
    GetProductInfo (data)  {
      this.Bug.product_id = data.product_id
      this.Bug.release = data.release
      this.Bug.module_id = data.module_id
    },

    // get $emit commponents fileupload data
    getAnnex (data) {
      this.Bug.annex = data
    },
    
		getModule () {
      this.axios.get('/api/pm/module/all/list?product_id=' + this.Bug.product_id)
        .then(res => {
          if (res.data['status'] === 20000) {
            this.modules_list = res.data['data']
          } else {
            this.Msg = res.data['msg']
          }
        })
    },
    
		// get bug_details data
    getBugDetails () {
      if (this.currentBugId) {
        this.axios.get('/api/qa/bug/details?bug_id=' + this.currentBugId)
          .then(res => {
            if (res.data['status'] === 20000) {
              let data = res.data['data']
              this.Raw_Data = res.data
              this.Annex = res.data['annex']
              Object.assign(this.Bug,data)
              data['bug_source'] ? this.Bug.bug_source = data['bug_source'] : this.Bug.bug_source = 'tester'
              data['m1_id'] ? this.Bug.module_id[0] = data['m1_id'] : null
              data['m2_id'] ? this.Bug.module_id[1] = data['m2_id'] : null
            }
        })
      }
    },

    annex_delete (file_path) {
      this.AnnexDelData.url = file_path
      fileutil.AnnexDelete("bug",file_path,this.AnnexDelData,this.Annex)
    },
    
    getDeveloper () {
      this.axios.get('/api/pm/member/list?group=developer&product_id=' + this.Bug.product_id).then(res => {
        if (res.data['status'] === 20000) {
          this.developer_list = res.data['data']
        }
      })
    },
    
		editBug (event) {
      if (!this.Bug.release) {
        this.$notify.error({title: '提示',message: '请选择版本号'})
        return
      }
      if (this.Bug.title.length < 6 | this.Bug.title.length > 100) {
        this.$notify.error({title: '提示',message: '标题的有效长度为6到100之间'})
        return 
      }
      if (!this.Bug.steps) {
        this.$notify.error({title: '提示',message: '操作步骤不能为空哦'})
        return 
      }
      if (this.Bug.steps.length < 10 | this.Bug.steps.length > 100000) {
        this.$notify.error({title: '提示',message: '操作步骤有效长度为10到100000'})
        return 
      }
      if (!this.Bug.reality_result) {
        this.$notify.error({title: '提示',message: '实际结果不能为空哦'})
        return 
      }
      if (this.Bug.reality_result.length < 2 | this.Bug.reality_result.length > 500) {
        this.$notify.error({title: '提示',message: '实际结果长度为2到500'})
        return 
      }
      if (this.Bug.expected_result.length > 500) {
        this.$notify.error({title: '提示',message: '预期结果, 长度需小于500'})
        return 
      }
      if (this.Bug.remark.length > 10000) {
        this.$notify.error({title: '提示',message: '备注输入太长了,长度需要小于10000'})
        return 
      }
      this.axios({
        method: 'post',
        url: '/api/qa/bug/edit',
        data: JSON.stringify(this.Bug),
        transformRequest: [(data) => {
          this.isButtonDisabled = true
          return data
        }]
      }).then(res => {
        if (res.data['status'] === 20000) {
          this.$notify.success({
            title: '成功',
            message: res.data['msg']
          })
          this.$router.go(-1)
        } else {
          this.isButtonDisabled = false
          this.$notify.error({
            title: '失败',
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