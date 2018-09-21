<template>
  <div class='container px-0 white-background'>
    <div class='row' id='bug'>
      <div class='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12'>
        <form class="container-fluid">
          <h3 style='margin-top:4rem;text-align:center;font-weight:300;'>编辑缺陷</h3>

          <div class='form-group row mt-5'>
            <label for='BugInfo' class="col-sm-2 bug-label">产品与模块<span class="text-red">*</span></label>
            <el-select v-model="Bug.product_code" placeholder="请选择产品" class='col-sm-2'>
              <el-option v-for="item in product_list" :key="item.id" :label="item.product_code" :value="item.product_code"></el-option>
            </el-select>
            <el-select v-model="Bug.release" placeholder="请选择版本" class='col-sm-2'>
              <el-option v-for="item in release_list" :key="item.id" :label="item.version" :value="item.version"></el-option>
            </el-select>
            <el-cascader class="col-sm-4 px-3" :options="modules_list" v-model="Bug.module_id" filterable change-on-select placeholder="选择模块" ></el-cascader>
          </div>

          <div class='form-group row'>
            <label for='BugInfo' class="col-sm-2 testcase-label">缺陷属性信息<span class="text-red">*</span></label>
            <el-select v-model="Bug.assignedTo_id" placeholder="选择指派人" class='col-sm-2'>
              <el-option v-for="item in developer_list" :key="item.id" :label="item.realname" :value="item.user_id"></el-option>
            </el-select>
            <el-select v-model="Bug.priority" placeholder="选择优先级" class='col-sm-2'>
              <el-option v-for="item in bug_priority" :key="item.id" :label="item.name" :value="item.key"></el-option>
            </el-select>
            <el-select v-model="Bug.severity" placeholder="选择严重程度" class='col-sm-2'>
              <el-option v-for="item in bug_severity" :key="item.id" :label="item.name" :value="item.key"></el-option>
            </el-select>
            <el-select v-model="Bug.bug_type" placeholder="选择缺陷类型" class='col-sm-2'>
              <el-option v-for="item in bug_type" :key="item.id" :label="item.name" :value="item.key"></el-option>
            </el-select>
          </div>

          <div id="t-bug-info">
            <div class='form-group row'>
              <label for='bug-title' class="col-sm-2 bug-label">缺陷标题<span class="text-red">*</span></label>
              <el-input type='text' id='bug_title' class='col-sm-8' v-model.trim='Bug.title' placeholder='标题，最多100个字符 ~.' maxlength='100' required ></el-input>
            </div>
            <div class='form-group row'>
              <label for='bug-steps' class="col-sm-2 bug-label">发现步骤<span class="text-red">*</span></label>
              <el-input type="textarea" class="col-sm-8" :autosize="{ minRows: 5}" maxlength="1000" placeholder="请输入发现步骤" v-model.trim='Bug.steps'></el-input>
            </div>
            <div class='form-group row'>
              <label for='bug-reality-result' class="col-sm-2 bug-label">实际结果<span class="text-red">*</span></label>
              <el-input type="textarea" class="col-sm-8" :autosize="{ minRows: 3}" maxlength="1000" placeholder="实际结果..." v-model.trim='Bug.reality_result'></el-input>
            </div>
            <div class='form-group row'>
              <label for='bug-expected-result' class="col-sm-2 bug-label">预期结果</label>
              <el-input type="textarea" class="col-sm-8" :autosize="{ minRows: 3}" maxlength="1000" placeholder="预期结果..." v-model.trim='Bug.expected_result'></el-input>
            </div>
            <div class='form-group row'>
              <label for='bug-remark' class="col-sm-2 bug-label">备注</label>
              <el-input type="textarea" class="col-sm-8" :autosize="{ minRows: 3}" maxlength="1000" placeholder="请输入备注..." v-model.trim='Bug.remark'></el-input>
            </div>
            <div class='form-group row'>
              <label class="col-sm-2 bug-label">附件</label>
              <form class="col-sm-8">
                <div v-for="item in Annex" :key="item.id" class="annex" style="display:inline;">
                  <img :src="item.url" :class="{ 'h-annex' : Bug.annex.length > 0 }">
                  <span class="annex_delete" @click="annex_delete(item.url)">
                    <img src="~assets/images/delete.png" :class="{ 'h-annex' : Bug.annex.length > 0 }">
                  </span>
                </div>
                <el-upload style="display:inline;"
                  name="images"
                  action="/api/support/upload"
                  list-type="picture-card"
                  :limit="3"
                  :on-success="ImageSuccess"
                  :on-remove="handleRemove"
                  :beforeUpload="beforeAvatarUpload"
                  :file-list="fileList">
                  <i class="el-icon-plus"></i>
                </el-upload>
              </form>
            </div>
          </div>

          <!-- 提交按钮 -->
          <div class='d-flex justify-content-center my-5'>
            <button type='button' class='btn btn-transparent' @click="$router.go(-1)">返回</button>
            <button type='button' class='btn btn-submit mx-5 px-3' v-bind:disabled="isButtonDisabled" @click='editBug()'>提交修改</button>
          </div>
            
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {

  layout: 'head',

  head () {
    return {
      title: 'HDesk - 缺陷编辑'
    }
  },

  validate({ query }) {
    return query.bug_id ? true : false
  },

  data () {
    return {
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
    getModule () {
      let that = this
      axios.get('/api/pm/get_module?product_code=' + this.Bug.product_code)
        .then(function (res) {
          if (res.data['status'] === 20000) {
            that.modules_list = res.data['data']
          } else {
            that.Msg = res.data['msg']
          }
        })
    },
    // 获取缺陷详情
    getBugDetails () {
      let that = this
      if (this.currentBugId) {
        axios.get('/api/qa/bug/details?bug_id=' + this.currentBugId)
          .then(function (res) {
            if (res.data['status'] === 20000) {
              let data = res.data['data']
              that.Bug.title = data['title']
              that.Annex = res.data['annex']
              that.Bug.steps = data['steps']
              that.Bug.reality_result = data['reality_result']
              that.Bug.expected_result = data['expected_result']
              that.Bug.remark = data['remark']
              that.Bug.assignedTo_id = data['assignedTo_id']
              that.Bug.bug_type = data['bug_type']
              that.Bug.priority = data['priority']
              that.Bug.severity = data['severity']
              that.Bug.release = data['release']
              that.Bug.product_code = data['product_code']
              that.Bug.bug_id = data['bug_id']
              if (data['m1_id']) {
                that.Bug.module_id[0] = data['m1_id']
              }
              if (data['m2_id']) {
                that.Bug.module_id[1] = data['m2_id']
              }
            } else {
            }
        })
      }
    },

    getProductRelease () {
      let that = this
      axios.get('/api/pm/product_release').then(function (res) {
        if (res.data['status'] === 20000) {
          that.product_list = res.data['data']
          that.release_list = res.data['data'][0]['data']
          that.Bug.product_code = res.data['data'][0]['product_code']
          that.getDeveloper()
        }
      })
    },

    annex_delete (data) {
      let that = this
      that.AnnexDelData.url = data
      axios({
        method: 'post',
        url: '/api/qa/bug/annex/delete',
        data: that.AnnexDelData
      }).then( function (res) {
        if (res.data['status'] === 20000) {
          let tmp = new Array()
          tmp = that.Annex
          for (var i in tmp) {
            if (data == tmp[i]['url']) {
              let index = tmp.indexOf(tmp[i])
              if (index > -1) { 
                tmp.splice(index, 1); 
              }
            }
          }
          that.$notify.success({title: '成功',message: res.data['msg']})
        } else {
          that.$notify.error({title: '失败',message: res.data['msg']})
        }
      })
    },

    handleRemove(file) {
      let beDeleted = file.response['name']
      let annex = this.Bug.annex
      for (var i = 0; i < annex.length; i++) {
        if (annex[i] == beDeleted) {
          annex.splice(i, 1)
        }
      }
    },
    ImageSuccess (response,fileList) {
      this.Bug.annex.push(response['name'])
    },
    beforeAvatarUpload (file) {
      const isLt3M = file.size / 1024 / 1024 < 3
      const PicFormat = file.name.split('.')[1] === 'jpg'
      const PicFormat1 = file.name.split('.')[1] === 'png'
      const PicFormat2 = file.name.split('.')[1] === 'jpeg'
      const PicFormat3 = file.name.split('.')[1] === 'gif'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!PicFormat && !PicFormat1 && !PicFormat2 && !PicFormat3) {
        this.$notify.error({
          title: '上传失败',
          message: '上传图片格式只能为jpg/png/jpeg/gif'
        })
      }
      if (!isLt3M) {
        this.$notify.error({
          title: '上传失败',
          message: '上传文件大小不能超过2.5M'
        })
      }
      return PicFormat || PicFormat1 || PicFormat2 || PicFormat3 && isLt3M
    },
    getBugProperty () {
      let that = this
      axios.get('/api/qa/bug/bug_property').then(function (res) {
        if (res.data['status'] === 20000) {
          that.bug_type = res.data['bug_type']
          that.bug_priority = res.data['bug_priority']
          that.bug_severity = res.data['bug_severity']
        }
      })
    },
    getDeveloper () {
      let that = this
      axios.get('/api/pm/member/list?product_code=' + this.Bug.product_code).then(function (res) {
        if (res.data['status'] === 20000) {
          that.developer_list = res.data['data']
        }
      })
    },
    editBug (event) {
      let _this = this
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
        data: JSON.stringify(_this.Bug),
        transformRequest: [ function (data) {
          _this.isButtonDisabled = true
          return data
        }]
      }).then(function (res) {
        if (res.data['status'] === 20000) {
          _this.$notify.success({title: '成功',message: res.data['msg']})
          _this.$router.go(-1)
        } else {
          _this.isButtonDisabled = false
          _this.$notify.error({title: '失败',message: res.data['msg']})
        }
      })
    }
  }
}
</script>

<style>
  @import '~/static/static/common/css/test.css';
</style>