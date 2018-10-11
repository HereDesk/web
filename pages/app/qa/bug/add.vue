<template>
  <div id="page-bug-add">
    <div id="page-bug-add-title" class="container-fluid">
      <div class='row'>
        <div class='col text-center page-bug-add-title'>
          <img src="~assets/images/close_x.png" @click="$router.go(-1)">
          <h3>创建缺陷</h3>
          <div class="dropdown-divider"></div>
        </div>
      </div>
    </div>
    <div id="page-bug-add-input" class='container mt-5'>
      <div class='row'>
        <div class='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12'>
            <div class='form-group row'>
              <label for='BugInfo' class="col-sm-2 bug-label">产品与模块<span class="text-red">*</span></label>
              <el-select v-model="Bug.product_code" placeholder="请选择产品" class='col-sm-2'>
                <el-option v-for="item in product_list" :key="item.id" :label="item.product_code" :value="item.product_code"></el-option>
              </el-select>
              <el-select v-model="Bug.release" placeholder="请选择版本" class='col-sm-2'>
                <el-option v-for="item in release_list" :key="item.id" :label="item.version" :value="item.version"></el-option>
              </el-select>
              <el-cascader class="col-sm-4 px-3" 
                :options="modules_list" 
                v-model="Bug.module_id" 
                filterable change-on-select 
                placeholder="选择模块" >
              </el-cascader>
            </div>

            <div class='form-group row'>
              <label for='BugInfo' class="col-sm-2 testcase-label">缺陷属性信息<span class="text-red">*</span></label>
              <el-select v-model="Bug.assignedTo_id" placeholder="选择指派人" class='col-sm-2'>
                <el-option v-for="item in developer_list" :key="item.id" :label="item.realname" :value="item.user_id"></el-option>
              </el-select>
              <el-select v-model="Bug.priority" placeholder="选择优先级" class='col-sm-2'>
                <el-option v-for="item in BugPriorityList" :key="item.id" :label="item.name" :value="item.key"></el-option>
              </el-select>
              <el-select v-model="Bug.severity" placeholder="选择严重程度" class='col-sm-2'>
                <el-option v-for="item in BugSeverityList" :key="item.id" :label="item.name" :value="item.key"></el-option>
              </el-select>
              <el-select v-model="Bug.bug_type" placeholder="选择缺陷类型" class='col-sm-2'>
                <el-option v-for="item in BugTypeList" :key="item.id" :label="item.name" :value="item.key"></el-option>
              </el-select>
            </div>

            <div id="t-bug-info">
              <div class='form-group row'>
                <label for='bug-title' class="col-sm-2 bug-label">缺陷标题<span class="text-red">*</span></label>
                <el-input type='text' id='bug_title' class='col-sm-8' maxlength='100' 
                  v-model.trim='Bug.title' 
                  placeholder='标题，最多100个字符 ~.' required >
                </el-input>
              </div>
              <div class='form-group row'>
                <label for='bug-steps' class="col-sm-2 bug-label">发现步骤<span class="text-red">*</span></label>
                <el-input type="textarea" class="col-sm-8" maxlength="1000" 
                  :autosize="{ minRows: 5}" 
                  placeholder="请输入发现步骤" 
                  v-model.trim='Bug.steps'>
                </el-input>
              </div>
              <div class='form-group row'>
                <label for='bug-reality-result' class="col-sm-2 bug-label">实际结果<span class="text-red">*</span></label>
                <el-input type="textarea" class="col-sm-8" maxlength="1000"
                  :autosize="{ minRows: 3}" 
                  placeholder="实际结果..."
                  v-model.trim='Bug.reality_result'>
                </el-input>
              </div>
              <div class='form-group row'>
                <label for='bug-expected-result' class="col-sm-2 bug-label">预期结果</label>
                <el-input type="textarea" class="col-sm-8" maxlength="1000" 
                  :autosize="{ minRows: 3}" 
                  placeholder="预期结果..." 
                  v-model.trim='Bug.expected_result'>
                </el-input>
              </div>
              <div class='form-group row'>
                <label for='bug-remark' class="col-sm-2 bug-label">备注</label>
                <el-input type="textarea" class="col-sm-8" maxlength="1000" 
                  :autosize="{ minRows: 3}" 
                  placeholder="请输入备注..." 
                  v-model.trim='Bug.remark'>
                </el-input>
              </div>

              <div class='form-group row'>
                <label for='bug-expected-result' class="col-sm-2 bug-label">附件</label>
                <form class="col-sm-8">
                  <el-upload 
                    name="images" 
                    action="/api/support/upload" 
                    list-type="picture-card" 
                    :limit="3" :on-success="ImageSuccess" 
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
              <button type='button' class='btn btn-submit mx-5 px-3' v-bind:disabled="isButtonDisabled" @click='createBug($event)' value="only-once-commit">保存提交</button>
              <button type='button' class='btn btn-accessories' v-bind:disabled="isButtonDisabled" @click='createBug($event)' value="continue-commit">继续添加</button>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {

  head() {
    return {
      title: "HDesk - 创建缺陷"
    };
  },

  data() {
    return {
      fileList: [],
      developer_list: [],
      product_list: [],
      release_list: [],
      modules_list: [],
      isButtonDisabled: false,
      Bug: {
        case_id: this.$route.query.case_id || null,
        cell_id: this.$route.query.cell_id || null,
        product_code: "",
        release: "",
        module_id: [],
        severity: "Normal",
        priority: "P3",
        bug_type: "other",
        assignedTo_id: "",
        title: "",
        steps: "",
        reality_result: "",
        expected_result: "",
        remark: "",
        annex: []
      }
    };
  },

  computed: {
    uploadDisabled: function() {
      return this.fileList.length > 3;
    },
    selected_product_code: function() {
      return this.Bug.product_code;
    },
    BugTypeList() {
      return this.$store.state.BugProperty.bug_type;
    },
    BugPriorityList() {
      return this.$store.state.BugProperty.bug_priority;
    },
    BugSeverityList() {
      return this.$store.state.BugProperty.bug_severity;
    }
  },

  watch: {
    selected_product_code: function(old, oldVal) {
      this.getModule();
    }
  },

  created() {
    this.getProductRelease();
    if (JSON.stringify(this.$store.state.BugProperty) === "{}") {
      this.$store.dispatch("getBugProperty");
    }
    if (this.$route.query.case_id) {
      this.getCaseDetails();
    }
  },

  methods: {
    getCaseDetails() {
      let that = this;
      axios
        .get("/api/qa/testcase/details?case_id=" + this.$route.query.case_id)
        .then(function(res) {
          if (res.data["status"] === 20000) {
            that.Bug.steps = res.data["data"]["steps"];
            that.Bug.expected_result = res.data["data"]["expected_result"];
          } else {
            console.log(res.data["msg"]);
          }
        });
    },
    handleRemove(file) {
      let beDeleted = file.response["name"];
      let annex = this.Bug.annex;
      for (var i = 0; i < annex.length; i++) {
        if (annex[i] == beDeleted) {
          annex.splice(i, 1);
        }
      }
    },
    ImageSuccess(response, fileList) {
      this.Bug.annex.push(response["name"]);
    },
    beforeAvatarUpload(file) {
      const isLt3M = file.size / 1024 / 1024 < 3;
      const PicFormat = file.name.split(".")[1] === "jpg";
      const PicFormat1 = file.name.split(".")[1] === "png";
      const PicFormat2 = file.name.split(".")[1] === "jpeg";
      const PicFormat3 = file.name.split(".")[1] === "gif";
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!PicFormat && !PicFormat1 && !PicFormat2 && !PicFormat3) {
        this.$notify.error({
          title: "上传失败",
          message: "上传图片格式只能为jpg/png/jpeg/gif"
        });
      }
      if (!isLt3M) {
        this.$notify.error({
          title: "上传失败",
          message: "上传文件大小不能超过2.5M"
        });
      }
      return PicFormat || PicFormat1 || PicFormat2 || (PicFormat3 && isLt3M);
    },
    // 获取产品版本信息
    getProductRelease() {
      let that = this;
      axios.get("/api/pm/product_release").then(function(res) {
        if (res.data["status"] === 20000) {
          that.product_list = res.data["data"];
          that.release_list = res.data["data"][0]["data"];
          that.Bug.product_code = res.data["data"][0]["product_code"];
          that.getDeveloper();
        }
      });
    },
    getModule() {
      let that = this;
      axios
        .get("/api/pm/get_module?product_code=" + this.Bug.product_code)
        .then(function(res) {
          if (res.data["status"] === 20000) {
            that.modules_list = res.data["data"];
          } else {
            that.Msg = res.data["msg"];
          }
        });
    },
    getDeveloper() {
      let that = this;
      axios
        .get(
          "/api/pm/member/list?group=Developer&product_code=" +
            this.Bug.product_code
        )
        .then(function(res) {
          if (res.data["status"] === 20000) {
            that.developer_list = res.data["data"];
          }
        });
    },
    createBug(event) {
      let _this = this;
      if (this.Bug.release.length === 0) {
        this.$notify.error({
          title: "提示",
          message: "请选择版本号"
        });
        return;
      }
      if ((this.Bug.title.length < 6) | (this.Bug.title.length > 100)) {
        this.$notify.error({
          title: "提示",
          message: "标题的有效长度为6到100之间"
        });
        return;
      }
      if (this.Bug.steps.length === 0) {
        this.$notify.error({
          title: "提示",
          message: "操作步骤不能为空哦"
        });
        return;
      }
      if ((this.Bug.steps.length < 10) | (this.Bug.steps.length > 1000)) {
        this.$notify.error({
          title: "提示",
          message: "操作步骤，有效长度需为10到1000"
        });
        return;
      }
      if (this.Bug.reality_result.length === 0) {
        this.$notify.error({
          title: "提示",
          message: "实际结果不能为空哦"
        });
        return;
      }
      if (
        (this.Bug.reality_result.length < 2) |
        (this.Bug.reality_result.length > 500)
      ) {
        this.$notify.error({
          title: "提示",
          message: "实际结果, 有效长度为2到500"
        });
        return;
      }
      if (this.Bug.expected_result.length > 500) {
        this.$notify.error({
          title: "提示",
          message: "预期结果, 长度需小于500"
        });
        return;
      }
      if (this.Bug.remark.length > 1000) {
        this.$notify.error({
          title: "提示",
          message: "备注输入太长了,长度需要小于1000"
        });
        return;
      }
      axios({
        method: "post",
        url: "/api/qa/bug/create",
        data: JSON.stringify(_this.Bug),
        transformRequest: [
          function(data) {
            _this.isButtonDisabled = true;
            return data;
          }
        ]
      }).then(function(res) {
        if (res.data["status"] === 20000) {
          _this.$notify.success({
            title: "成功",
            message: res.data["msg"]
          });
          if (event.target.value === "only-once-commit") {
            _this.$router.go(-1);
          }
          if (event.target.value === "continue-commit") {
            $(document).scrollTop(0);
            _this.Bug.title = "";
            _this.Bug.steps = "";
            _this.Bug.expected_result = "";
            _this.Bug.reality_result = "";
            _this.Bug.assignedTo = "";
            _this.Bug.remark = "";
            _this.Bug.severity = "Normal";
            _this.Bug.priority = "P2";
            _this.isButtonDisabled = false;
          }
        } else {
          _this.isButtonDisabled = false;
          _this.$notify.error({
            title: "失败",
            message: res.data["msg"]
          });
        }
      });
    }
  }
};
</script>

<style>
  @import "~/static/static/common/css/test.css";
</style>