<template>
  <div id="page-user-index" class='container mt-3'>
    
		<div id="page-head" class='row mt-5'>
      <div class="col-auto mr-auto">
      </div>
      <div id="create-user" class='col-auto'>
        <nuxt-link to="/app/user-management/user/adduser" v-if="Rules.user_create">
          <button type="btn" class="btn btn-create">+ 增加用户</button>
        </nuxt-link>
      </div>
    </div>

    <div id="page-data" class='row mt-3 mb-5 table_data'>
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
          <el-table-column label='创建时间' width="150" show-overflow-tooltip>
            <template slot-scope="scope">
               <span>{{ scope.row.create_time | date }}</span>
            </template>
          </el-table-column>
          <el-table-column label='更新时间' width="150" show-overflow-tooltip>
            <template slot-scope="scope">
               <span>{{ scope.row.update_time | date }}</span>
            </template>
          </el-table-column>
          <el-table-column label='操作' width="150" v-if="Rules.user_create">
            <template slot-scope="scope">
              <span @click="banned(scope.row,$event)" 
                v-if="scope.row.group !== 'admin' & scope.row.user_status === 1">
                <button type="button" class="btn btn-outline-danger btn-sm" value="2">封禁</button>
              </span>
              <span @click="banned(scope.row,$event)" 
                v-if="scope.row.group !== 'admin' & scope.row.user_status === 2">
                <button type="button" class="btn btn-outline-success btn-sm" value="1">解封</button>
              </span>
              <span @click="getUserId(scope.row,$event)" v-if="scope.row.group !== 'admin'">
                <button type="button" class="ml-1 btn btn-outline-dark btn-sm" 
                  @click="showModal = 'ResetPasswd'">密码</button>
              </span>
            </template>  
          </el-table-column>
        </el-table>
      </div>
    </div>

    <Modal id="modal-create-user" v-if="showModal == 'ResetPasswd'" @close="showModal = false" :isFooter="true">
      <h5 slot="header">重置密码</h5>
      <div class="form-group" slot="body">
        <div class='row col-md-auto'>
          <label for="password" class="ml-5">密码</label>
          <input type='password' id='password' class='form-control input-lg mx-5 my-1' 
            placeholder='请输入密码' minlength="8" maxlength='16' required 
            v-model='password.passwd'>
        </div>
        <div class='row col-md-auto'>
          <label for="t-password" class="ml-5">确认密码</label>
          <input type='password' id='t-password' class='form-control input-lg mx-5 my-1' 
            placeholder='请再次输入密码' minlength="8" maxlength='16' required 
            v-model='password.RepeatPasswd' @keyup.enter="ResetPassword()">
          <p class="mb-0 ml-5 mt-3 font-size-85 text-gray">备注：密码有效长度8到16位</p>
        </div>
      </div>
      <button type="submit" class="btn btn-primary" slot="footer" @click="ResetPassword()">提交</button>
    </Modal>

  </div>
</template>

<script>
import axios from "axios";

import Modal from "~/components/Modal";
import util from "~/assets/js/util.js";
import rules from "~/assets/js/rules.js";

export default {
  head() {
    return {
      title: "HDesk - 用户管理"
    };
  },
	
  layout: "head",
  components: {
    Modal
  },
	
  filters: {
    date: util.date
  },

  data() {
    return {
      msg: "",
      showModal: false,
			tableData: [],
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
    Rules: function() {
      let group = this.$store.state.userInfo.group
      let PagesRules = this.$store.state.PageData
      return rules.RuleManges(group,PagesRules)
    }
  },

  watch: {
    showModal () {
      this.showModal ? 
        document.body.classList.add("overflow-hidden") : 
        document.body.classList.remove("overflow-hidden")
    }
  },

  created() {
    this.getAllUser()
  },

  methods: {
		// get all user
    getAllUser() {
      axios.get("/api/user/user_list").then(res => {
        if (res.data["status"] === 20000) {
          this.tableData = res.data["data"]
        }
      })
    },
		
    // getUserId
    getUserId(event) {
      this.password.user_id = event.user_id
    },
		
    // reset password
    ResetPassword(event) {
      if (this.password.passwd === "") {
        this.$notify.error({title: "失败",message: "密码不能为空"})
        return
      }
      if (this.password.passwd !== this.password.RepeatPasswd) {
        this.$notify.error({title: "失败",message: "两次密码输入的不一致"})
        return
      }
      if (this.password.passwd.length < 8 | this.password.passwd.length > 16) {
        this.$notify.error({title: "失败",message: "密码的有效长度为8-16位"})
        return
      }
      axios({
        method: "post",
        url: "/api/user/reset_passwd",
        data: JSON.stringify(this.password)
      }).then(res => {
        if (res.data["status"] === 20000) {
					this.showModal = false
          this.$notify.success({title: "成功",message: res.data["msg"]})
          this.getAllUser();
        } else {
          this.$notify.error({title: "失败",message: res.data["msg"]})
        }
      })
    },
		
    // banned user
    banned(rows, event) {
      this.bannedData.user_id = rows.user_id
      this.bannedData.code = event.target.value
      axios({
        method: "post",
        url: "/api/user/banned",
        data: JSON.stringify(this.bannedData)
      }).then(rep => {
        if (rep.data["status"] === 10060) {
          this.$notify.success({title: "成功",message: rep.data["msg"]})
          this.getAllUser();
        } else {
          this.$notify.error({title: "失败",message: rep.data["msg"]})
        }
      })
    }
  }
}
</script>