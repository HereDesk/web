<template>
  <div class='container'>
    <div class='row' id='setpasswd' style="margin-top:10%">
      <div class='col-xl-4 col-lg-4 col-md-4 col-12 offset-xl-4 col-lg-4 offset-md-4'>
        <form>
    	    <div class='form-group input-group-control'>
            <label for='user_email'>电子邮箱<span class="text-red">*</span></label>
            <input type='email' id='user_email' name="email" class='form-control'  placeholder='Email' maxlength='30' minlength="8" required v-model.trim='UserData.email' @change="isCheckInput($event)" autocomplete="off" />
          </div>
          <div class='form-group input-group-control'>
            <label for='user_realname'>真实姓名<span class="text-red">*</span></label>
            <input type='text' class='form-control' id='user_realname' name="user_realname" placeholder='真实姓名' maxlength='8' minlength="3" required v-model.trim='UserData.realname' @change="isCheckInput($event)" autocomplete="off" />
          </div>
          <div class='form-group input-group-control'>
            <label for='user_group'>选择群组<span class="text-red">*</span></label>
            <select class="select-control form-border-bottom" v-model="UserData.group"  @change="isCheckInput($event)">
              <option v-for="item in UserGroup" :key="item.id" :value="item.group">{{ item.name }}</option>
            </select>
          </div>
          <div class='form-group input-group-control'>
            <label for='user_position'>岗位/职位<span class="text-red">*</span></label>
            <select class="select-control form-border-bottom" v-model="UserData.position"  @change="isCheckInput($event)">
              <option v-for="item in position_list" :key="item.id" :value="item.value">{{ item.name }}</option>
            </select>
          </div>
          <div class='form-group input-group-control'>
          	<label for='user_init_passwd'>初始密码<span class="text-red">*</span></label>
          	<input type='password' class='form-control' id='user_init_passwd' name="user_init_passwd" placeholder='初始密码不能为纯数字' maxlength='16' minlength="6" required v-model.trim='UserData.password' @change="isCheckInput($event)" autocomplete="off" />
        	</div>
        	<div class='form-group input-group-control'>
          	<button type="button" class="btn-control btn-success" @click="SubmitUser">提交</button>
        	</div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"
export default {
  head() {
    return {
      title: "HDesk - 增加用户"
    }
  },
  layout: "head",
  data() {
    return {
      msg: "",
      isButtonStatus: true,
      showModal: false,
      UserGroup: [],
      position_list: [
        { name: "管理层", value: "manager" },
        { name: "测试", value: "test" },
        { name: "android", value: "android" },
        { name: "ios", value: "ios" },
        { name: "web/H5", value: "web/H5" },
        { name: "产品", value: "pm" },
        { name: "服务端", value: "server" },
        { name: "设计", value: "design" },
        { name: "其它", value: "other" }
      ],
      UserData: {
        email: "",
        password: "",
        realname: "",
        group: "",
        position: ""
      }
    }
  },

  created() {
    axios.get("/api/user/group").then(res => {
      if (res.data["status"] === 20000) {
        this.UserGroup = res.data["data"]
      }
    })
  },

  methods: {
    isCheckInput(event) {
      if (
        (this.UserData.email.length > 0) &
        (this.UserData.group.length > 0) &
        (this.UserData.password.length > 0) &
        (this.UserData.realname.length > 0)
      ) {
        this.isButtonStatus = false
      } else {
        this.isButtonStatus = true
      }
    },
    SubmitUser() {
      const email = this.UserData.email
      const password = this.UserData.password
      const realname = this.UserData.realname
      const group = this.UserData.group
      if ((email.length < 8) | (email.length > 30)) {
        this.$notify.error({
          title: "错误",
          message: "Email的有效长度为8到30位"
        })
        return 
      }
      if ((password.length < 6) | (password.length > 16)) {
        this.$notify.error({
          title: "错误",
          message: "密码的有效长度为6到16位"
        })
        return 
      }
      if ((realname.length < 2) | (realname.length > 8)) {
        this.$notify.error({
          title: "错误",
          message: "姓名的有效长度为2到8位"
        })
        return 
      }
      if (group.length === 0) {
        this.$notify.error({
          title: "错误",
          message: "用户组必须填写，不能为空"
        })
        return
      }
      axios({
        method: "post",
        url: "/api/user/add",
        data: JSON.stringify(this.UserData)
      }).then(res => {
        if (res.data["status"] === 20000) {
          this.$notify.success({
            title: "增加成功",
            message: res.data["msg"]
          })
          this.$router.push("/app/user-management/user")
        } else {
          this.$notify.error({
            title: "增加失败",
            message: res.data["msg"]
          })
        }
      })
    }
  }
}
</script>