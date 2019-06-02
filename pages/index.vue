<template>
  <div id="page-user-login" class="container mt-5" v-cloak>
    <div class="row">
      <div class="col">
        <h1>HDesk</h1>
      </div>
    </div>
    <div class="row justify-content-center" style="margin-top:15%;">
      <div class="col-lg-4 col-md-6 col-sm-8 col-12 text-center">
        <h2 class="p-user-login-title">欢迎登录</h2>
        <div id="input-email" class="input-group input-group-lg">
          <input type="email" id="user_name" name="email" class="form-control" 
            maxlength="30" minlength="6" 
            placeholder="电子邮件"
            v-model.trim="LoginData.username" />
        </div>
        <div id="input-passwd" class="input-group input-group-lg passwd">
          <input type="password" id="user_passwd" name="user_passwd" class="form-control" 
            maxlength="30" minlength="6" 
            placeholder="输入密码" 
            v-model.trim="LoginData.password"
            @keyup.enter="goLogin" />
        </div>
        <div class="login-btn">
          <button type="button" id="user_login_btn" class="btn btn-login btn-lg btn-block"  @click="goLogin">
            登录</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserFromLocalStorage } from "~/assets/js/auth"

export default {
  data() {
    return {
      token: "",
      showModal: false,
      msg: "",
      LoginData: {
        username: "",
        password: ""
      }
    }
  },
  mounted() {
    // const token = getUserFromLocalStorage()
    // if (this.$store.state.isLogin || token) {
    //   this.$router.replace("/app/dashboard")
    // }
  },
  methods: {
    goLogin() {
      let [username,password] = [this.LoginData.username,this.LoginData.password]
      if (username.length === 0) {
        this.$notify.error({
          title: "提交失败",
          message: "用户名不为空哦"
        })
        return
      }
      if ((username.length > 30) | (username.length < 6)) {
        this.$notify.error({
          title: "提交失败",
          message: "用户名长度需在6到30位之间"
        })
        return
      }
      if (password.length === 0) {
        this.$notify.error({
          title: "提交失败",
          message: "密码不能为空哦"
        })
        return
      }
      if ((password.length > 30) | (password.length < 6)) {
        this.$notify.error({
          title: "提交失败",
          message: "密码长度需在6到30位之间"
        })
        return
      }
      this.axios({
        method: "post",
        url: "/api/user/login",
        data: JSON.stringify(this.LoginData)
      }).then(res => {
          if (res.data["status"] === 10000) {
            // set localStorage and token
            let token = res.data["data"]["token"]
            if (process.browser) {
              window.localStorage.setItem("token", token)
              let Days = 30
              let exp = new Date()
              exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
              document.cookie = "token=" + token + ";" + "expires=" + exp.toGMTString() + ";" + "path=/"
            }
            this.$store.commit("setLoginInfo", res.data)
            this.$store.dispatch('getUserInfo')
            this.$router.replace("/app/dashboard")
          }
          if (res.data["status"] !== 10000) {
            this.LoginData.username = ""
            this.LoginData.password = ""
            this.$notify.error({
              title: "登录失败",
              message: res.data["msg"]
            })
          }
        })
        .catch((error) => {
          alert("请检查网络、或配置文件,或联系管理员")
        })
    }
  }
}
</script>

<style>
  @import "~/assets/css/login.css"
</style>