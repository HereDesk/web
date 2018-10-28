<template>
  <div id='page-edit-bug'>
    <BaseNav :title="title"></BaseNav>
    <div id='page-bug-edit-input' class='container px-0 pt-5 white-background'>
      <div class='row'>
        <div class='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12'>
          <form class="container-fluid">
            <div class='form-group row'>
              <label for='BugInfo' class="col-md-2 col-sm-12 col-12 bug-label">
                产品与模块
                <span class="text-red">*</span>
              </label>
              <el-select v-model="Bug.product_code" placeholder="请选择产品" class='col-md-2 col-sm-4 col-6'>
                <el-option 
                  v-for="item in product_list" :key="item.id" :label="item.product_code" :value="item.product_code">
                </el-option>
              </el-select>
              <el-select v-model="Bug.release" placeholder="请选择版本" class='col-md-2 col-sm-4 col-6'>
                <el-option 
                  v-for="item in release_list" :key="item.id" :label="item.version" :value="item.version">
                </el-option>
              </el-select>
              <el-cascader class="col-md-2 col-sm-4 col-6 px-3" 
                :options="modules_list" v-model="Bug.module_id" filterable change-on-select placeholder="选择模块" >
              </el-cascader>
            </div>

            <div class='form-group row'>
              <label for='BugInfo' class="col-md-2 col-sm-12 col-12 testcase-label">
                缺陷属性
                <span class="text-red">*</span>
              </label>
              <el-select class='col-md-2 col-sm-3 col-6' placeholder="选择指派人" v-model="Bug.assignedTo_id">
                <el-option 
                  v-for="item in developer_list" :key="item.id" :label="item.realname" :value="item.user_id">
                </el-option>
              </el-select>
              <el-select class='col-md-2 col-sm-3 col-6' placeholder="选择优先级" v-model="Bug.priority">
                <el-option 
                  v-for="item in bug_priority" :key="item.id" :label="item.name" :value="item.key">
                </el-option>
              </el-select>
              <el-select class='col-md-2 col-sm-3 col-6' placeholder="选择严重程度" v-model="Bug.severity">
                <el-option 
                  v-for="item in bug_severity" :key="item.id" :label="item.name" :value="item.key">
                </el-option>
              </el-select>
              <el-select class='col-md-2 col-sm-3 col-6' placeholder="选择缺陷类型" v-model="Bug.bug_type" >
                <el-option 
                  v-for="item in bug_type" :key="item.id" :label="item.name" :value="item.key">
                </el-option>
              </el-select>
            </div>

            <div id="t-bug-info">
              <div class='form-group row'>
                <label for='bug-title' class="col-lg-2 col-md-2 col-sm-12 bug-label">
                  缺陷标题
                  <span class="text-red">*</span>
                </label>
                <el-input type='text' id='bug_title' class='col-lg-8 col-md-10 col-sm-12' 
                  placeholder='标题，最多100个字符 ~.' maxlength='100' required 
                  v-model.trim='Bug.title'>
                </el-input>
              </div>
              <div class='form-group row'>
                <label for='bug-steps' class="col-lg-2 col-md-2 col-sm-12 bug-label">
                  发现步骤
                  <span class="text-red">*</span>
                </label>
                <el-input type="textarea" class="col-lg-8 col-md-10 col-sm-12" 
                  :autosize="{ minRows: 5}" maxlength="1000" placeholder="请输入发现步骤"
                  v-model.trim='Bug.steps'>
                </el-input>
              </div>
              <div class='form-group row'>
                <label for='bug-reality-result' class="col-lg-2 col-md-2 col-sm-12 bug-label">
                  实际结果
                  <span class="text-red">*</span>
                </label>
                <el-input type="textarea" class="col-lg-8 col-md-10 col-sm-12" 
                  :autosize="{ minRows: 3}" maxlength="1000" placeholder="实际结果..."
                  v-model.trim='Bug.reality_result'>
                </el-input>
              </div>
              <div class='form-group row'>
                <label for='bug-expected-result' class="col-lg-2 col-md-2 col-sm-12 bug-label">预期结果</label>
                <el-input type="textarea" class="col-lg-8 col-md-10 col-sm-12" 
                  :autosize="{ minRows: 3}" maxlength="1000" placeholder="预期结果..." 
                  v-model.trim='Bug.expected_result'></el-input>
              </div>
              <div class='form-group row'>
                <label for='bug-remark' class="col-lg-2 col-md-2 col-sm-12 bug-label">备注</label>
                <el-input type="textarea" class="col-lg-8 col-md-10 col-sm-12" 
                  :autosize="{ minRows: 3}" maxlength="1000" placeholder="请输入备注..." 
                  v-model.trim='Bug.remark'></el-input>
              </div>
              <div class='form-group row'>
                <label class="col-lg-2 col-md-2 col-sm-12 bug-label">附件</label>
                <form class="col-lg-8 col-md-10 col-sm-12 px-0">
                  <div v-for="item in Annex" :key="item.id" class="annex" style="display:inline;">
                    <img :src="item.url" :class="{ 'h-annex' : Bug.annex.length > 0 }">
                    <span class="annex_delete" @click="annex_delete(item.url)">
                      <i class="iconfont icon-bucket-del size-1-5" :class="{ 'h-annex' : Bug.annex.length }"></i>
                    </span>
                  </div>
                  <FileUpload @annex="getAnnex"></FileUpload>
                </form>
              </div>
            </div>

            <!-- 提交按钮 -->
            <div class='d-flex justify-content-center my-5'>
              <button type='button' class='btn btn-transparent' @click="$router.go(-1)">
                返回
              </button>
              <button type='button' class='btn btn-submit mx-5 px-3' 
                :disabled="isButtonDisabled" @click='editBug()'>
                提交修改
              </button>
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
import BaseNav from '~/components/BaseNav'
import FileUpload from '~/components/FileUpload'

export default {
  head () {
    return {
      title: 'HDesk - 缺陷编辑'
    }
  },

  validate({ query }) {
    return query.bug_id
  },

  components: {
    BaseNav,
    FileUpload
  },

  data () {
    return {
      title: '编辑缺陷',
      fileList: [],
      bug_type: [],
      bug_priority: [],
      bug_severity: [],
      developer_list: [],
      product_list: [],
      release_list: [],
      modules_list: [],
      isButtonDisabled: false,
      BugDetails: {},
      product_code: '',
      Annex: [],
      AnnexDelData: {
        url: null
      },
      Bug: {
        bug_id: null,
        priority: null,
        severity: null,
        bug_type: null,
        product_code: null,
        release: null,
        assignedTo_id: null,
        module_id: [],
        annex: []
      }
    }
  },

  computed: {
    uploadDisabled:function() {
      return this.fileList.length > 3
    },
    selected_product_code: function () {
      return this.Bug.product_code
    }
  },

  watch: {
    selected_product_code: function (old,oldVal) {
      this.getModule()
    }
  },

  created () {
    this.currentBugId = this.$route.query.bug_id 
    this.getBugDetails()   
  },

  mounted () {
    this.getProductRelease()
    this.getBugProperty()
  },

  methods: {
    // get commponents fileupload data
    getAnnex (data) {
      this.Bug.annex = data
    },
    getModule () {
      axios.get('/api/pm/get_module?product_code=' + this.Bug.product_code)
        .then(res => {
          if (res.data['status'] === 20000) {
            this.modules_list = res.data['data']
          } else {
            this.Msg = res.data['msg']
          }
        })
    },
    // 获取缺陷详情
    getBugDetails () {
      if (this.currentBugId) {
        axios.get('/api/qa/bug/details?bug_id=' + this.currentBugId)
          .then(res => {
            if (res.data['status'] === 20000) {
              let data = res.data['data']
              this.Bug.title = data['title']
              this.Annex = res.data['annex']
              this.Bug.steps = data['steps']
              this.Bug.reality_result = data['reality_result']
              this.Bug.expected_result = data['expected_result']
              this.Bug.remark = data['remark']
              this.Bug.assignedTo_id = data['assignedTo_id']
              this.Bug.bug_type = data['bug_type']
              this.Bug.priority = data['priority']
              this.Bug.severity = data['severity']
              this.Bug.release = data['release']
              this.Bug.product_code = data['product_code']
              this.Bug.bug_id = data['bug_id']
              if (data['m1_id']) {
                this.Bug.module_id[0] = data['m1_id']
              }
              if (data['m2_id']) {
                this.Bug.module_id[1] = data['m2_id']
              }
            } else {
            }
        })
      }
    },

    getProductRelease () {
      axios.get('/api/pm/product_release').then(res => {
        if (res.data['status'] === 20000) {
          this.product_list = res.data['data']
          this.release_list = res.data['data'][0]['data']
          this.Bug.product_code = res.data['data'][0]['product_code']
          this.getDeveloper()
        }
      })
    },

    annex_delete (file_path) {
      this.AnnexDelData.url = file_path
      fileutil.AnnexDelete("bug",file_path,this.AnnexDelData,this.Annex)
    },
    getBugProperty () {
      axios.get('/api/qa/bug/bug_property').then(res => {
        if (res.data['status'] === 20000) {
          this.bug_type = res.data['bug_type']
          this.bug_priority = res.data['bug_priority']
          this.bug_severity = res.data['bug_severity']
        }
      })
    },
    getDeveloper () {
      axios.get('/api/pm/member/list?group=developer&product_code=' + this.Bug.product_code).then(res => {
        if (res.data['status'] === 20000) {
          this.developer_list = res.data['data']
        }
      })
    },
    editBug (event) {
      if (this.Bug.release.length === 0) {
        this.$notify.error({title: '提示',message: '请选择版本号'})
        return
      }
      if (this.Bug.title.length < 6 | this.Bug.title.length > 100) {
        this.$notify.error({title: '提示',message: '标题的有效长度为6到100之间'})
        return 
      }
      if (this.Bug.steps.length === 0) {
        this.$notify.error({title: '提示',message: '操作步骤不能为空哦'})
        return 
      }
      if (this.Bug.steps.length < 10 | this.Bug.steps.length > 1000) {
        this.$notify.error({title: '提示',message: '操作步骤有效长度为10到1000'})
        return 
      }
      if (this.Bug.reality_result.length === 0) {
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
      if (this.Bug.remark.length > 1000) {
        this.$notify.error({title: '提示',message: '备注输入太长了,长度需要小于1000'})
        return 
      }
      axios({
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
  @import '~/static/static/common/css/test.css'
</style>