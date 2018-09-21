<template>
  <div class='container mt-3'>

    <div class='row mt-5'>
      <div class="col-auto mr-auto">
      </div>
      <div class='col-auto'>
        <nuxt-link to="/app/user-management/user/adduser" v-if="userRules">
          <button type="btn" class="btn btn-create">+ 增加用户</button>
        </nuxt-link>
      </div>
    </div>

    <div class='row mt-3 mb-5 table_data'>
      <div class='col-xl-12 col-lg-12 col-md-12'>
        <el-table :data='tableData' :default-sort="{prop: 'date', order: 'descending'}">
          <el-table-column prop='realname' label='真实姓名' width="120"></el-table-column>
          <el-table-column prop='email' label='E-mail'></el-table-column>
          <el-table-column prop='group_name' label='群组' width="120"></el-table-column>
          <el-table-column prop='position' label='岗位' width="120"></el-table-column>
          <el-table-column label='状态' sortable width="90">
            <template slot-scope="scope">
              <span v-if="scope.row.user_status === 1">正常</span>
              <span v-if="scope.row.user_status === 2" class="text-deadly">封禁</span>
            </template>
          </el-table-column>
          <el-table-column label='建立时间' width="180" show-overflow-tooltip>
            <template slot-scope="scope">
               <span>{{ scope.row.create_time | date }}</span>
            </template>
          </el-table-column>
          <el-table-column label='更新时间' width="180" show-overflow-tooltip>
            <template slot-scope="scope">
               <span>{{ scope.row.update_time | date }}</span>
            </template>
          </el-table-column>
          <el-table-column label='操作' width="120" v-if="userRules">
            <template slot-scope="scope">
              <span @click="banned(scope.row,$event)" v-if="scope.row.group !== 'admin' & scope.row.user_status === 1">
                <button type="button" class="btn btn-outline-danger btn-sm" value="2">封禁</button>
              </span>
              <span @click="banned(scope.row,$event)" v-if="scope.row.group !== 'admin' & scope.row.user_status === 2">
                <button type="button" class="btn btn-outline-success btn-sm" value="1">解封</button>
              </span>
              <span @click="getUserId(scope.row,$event)" v-if="scope.row.group !== 'admin'">
                <button type="button" class="ml-1 btn btn-outline-dark btn-sm" data-toggle="modal" data-target="#reset-password">密码</button>
              </span>
            </template>  
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="modal fade" id="reset-password" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">重置密码</h5>
          </div>
          <div class="modal-body">
            <div class='form-group row col-md-auto'>
              <label for="password" class="mx-5">密码</label>
              <input type='password' v-model='password.passwd' class='form-control input-lg mx-5 my-1' id='password' placeholder='请输入密码' minlength="8" maxlength='16' required >
            </div>
            <div class='form-group row col-md-auto'>
              <label for="t-password" class="mx-5">确认密码</label>
              <input type='password' v-model='password.RepeatPasswd' class='form-control input-lg mx-5 my-1' id='t-password' placeholder='请再次输入密码' minlength="8" maxlength='16' required >
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-cancel" data-dismiss="modal">关闭</button>
            <button type="submit" class="btn btn-primary" @click="ResetPassword()">提交</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from "axios";
import util from "~/assets/js/util.js";
import rules from "~/assets/js/rules.js";

export default {
  head() {
    return {
      title: "HDesk - 用户管理"
    };
  },

  layout: "head",

  filters: {
    date: util.date
  },

  data() {
    return {
      tableData: [],
      msg: "",
      bannedData: {
        user_id: "",
        code: ""
      },
      password: {
        user_id: "",
        passwd: "",
        RepeatPasswd: ""
      }
    };
  },

  computed: {
    userRules: function() {
      return rules.UserMangeRules(this.$store.state.userInfo);
    }
  },

  created() {
    this.getAllUser();
  },

  methods: {
    getAllUser() {
      let that = this;
      axios.get("/api/user/user_list").then(function(rep) {
        if (rep.data["status"] === 20000) {
          that.tableData = rep.data["data"];
        }
      });
    },
    // getUserId
    getUserId(event) {
      this.password.user_id = event.user_id;
    },
    // 重置密码
    ResetPassword(event) {
      if (this.password.passwd === "") {
        this.$notify.error({
          title: "提交失败",
          message: "密码不能为空"
        });
        return;
      }
      if (this.password.passwd !== this.password.RepeatPasswd) {
        this.$notify.error({
          title: "提交失败",
          message: "两次密码输入的不一致"
        });
        return;
      }
      if (
        (this.password.passwd.length < 8) |
        (this.password.passwd.length > 16)
      ) {
        this.$notify.error({
          title: "提交失败",
          message: "密码的有效长度为8-16位"
        });
        return;
      }

      let that = this;
      axios({
        method: "post",
        url: "/api/user/reset_passwd",
        data: JSON.stringify(that.password)
      }).then(function(rep) {
        if (rep.data["status"] === 20000) {
          $("#reset-password").modal("hide");
          that.$notify.success({
            title: "成功",
            message: rep.data["msg"]
          });
          that.getAllUser();
        } else {
          that.$notify.error({
            title: "失败",
            message: rep.data["msg"]
          });
        }
      });
    },
    // 封禁
    banned(rows, event) {
      let that = this;
      that.bannedData.user_id = rows.user_id;
      that.bannedData.code = event.target.value;
      axios({
        method: "post",
        url: "/api/user/banned",
        data: JSON.stringify(that.bannedData)
      }).then(function(rep) {
        if (rep.data["status"] === 10060) {
          that.$notify.success({
            title: "成功",
            message: rep.data["msg"]
          });
          that.getAllUser();
        } else {
          that.$notify.error({
            title: "失败",
            message: rep.data["msg"]
          });
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
