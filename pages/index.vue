<template>
  <div class="container mt-5" id="p-user-login">
    <div class="row">
      <div class="col-lg-12 col-md-12 col-sm-12 col-12" style="float:right;">
        <h1>HDesk</h1>
      </div>
      <div class="col-lg-12 col-md-12 col-sm-12 col-12 p-user-login-main">
        <div class="col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12 offset-lg-3 offset-md-3 offset-xl-4">
          <h2 class="p-user-login-title">欢迎登录</h2>
          <div class="input-group input-group-lg" id="input-email">
            <input type="email" id="user_name" name="email" v-model="LoginData.username" class="form-control" maxlength="30" minlength="6" placeholder="电子邮件" />
          </div>
          <div class="input-group input-group-lg passwd" id="input-passwd">
            <input type="password" id="user_passwd" name="user_passwd" class="form-control" maxlength="30" minlength="6" placeholder="输入密码" v-model="LoginData.password" @keyup.enter="goLogin" />
          </div>
          <div class="login-btn">
            <button id="user_login_btn"  class="btn btn-login btn-lg btn-block" type="button" @click="goLogin">登录</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { getUserFromLocalStorage } from "~/assets/js/auth";

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
    };
  },
  mounted() {
    const token = getUserFromLocalStorage();
    if (token) {
      this.$router.push("/app/dashboard");
    }
  },
  methods: {
    goLogin() {
      let _this = this;
      const username = _this.LoginData.username;
      const password = _this.LoginData.password;
      if (username.replace(/^s+/g, "").length === 0) {
        _this.$notify.error({
          title: "提交失败",
          message: "用户名不为空哦"
        });
        return;
      }
      if ((username.length > 30) | (username.length < 6)) {
        _this.$notify.error({
          title: "提交失败",
          message: "用户名长度需在6到30位之间"
        });
      }
      if (password.replace(/^s+/g, "").length === 0) {
        _this.$notify.error({
          title: "提交失败",
          message: "密码不能为空哦"
        });
      }
      if ((password.length > 30) | (password.length < 6)) {
        _this.$notify.error({
          title: "提交失败",
          message: "密码长度需在6到30位之间"
        });
        return;
      }
      axios({
        method: "post",
        url: "/api/user/login",
        data: JSON.stringify(this.LoginData)
      })
        .then(function(res) {
          if (res.data["status"] === 10000) {
            // set localStorage and token
            var token = res.data["data"]["token"];
            if (process.browser) {
              window.localStorage.setItem("token", token);
              var Days = 30;
              var exp = new Date();
              exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
              document.cookie =
                "token=" +
                token +
                ";" +
                "expires=" +
                exp.toGMTString() +
                ";" +
                "path=/";
            }
            _this.$store.commit("setUserInfo", res.data);
            _this.$router.replace("/app/dashboard");
          }
          if (res.data["status"] !== 10000) {
            _this.LoginData.username = "";
            _this.LoginData.password = "";
            _this.$notify.error({
              title: "登录失败",
              message: res.data["msg"]
            });
          }
        })
        .catch(function(error) {
          console.log(error);
          alert("请检查网络、或配置文件,或联系管理员");
        });
    }
  }
};
</script>

<style>
@import "../static/static/common/css/login.css";
</style>