<template>
  <div id="page" style="height:100%;">
    <nav id="page-head" class="navbar navbar-expand-lg navbar-light bg-white page-head">
      <a id="navbar-brand" class="navbar-brand" href="#">HDesk</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div id="navbarSupportedContent" class="mx-5 collapse navbar-collapse">
        <ul class="navbar-nav mr-auto head-nav">
          <li class="nav-item" :class="{ 'nav-active' :  currentRoute == '/app/dashboard' }">
            <nuxt-link class="nav-link" to="/app/dashboard">首页</nuxt-link>
          </li>
          <li class="nav-item dropdown" :class="{ 'nav-active' :  currentRoute.indexOf('/app/qa/bug') >= 0 }">
           <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">缺陷</a>
            <div class="dropdown-menu">
              <nuxt-link class="dropdown-item" to="/app/qa/bug">缺陷列表</nuxt-link>
              <nuxt-link class="dropdown-item" to="/app/qa/bug/count">缺陷分析</nuxt-link>
              <nuxt-link class="dropdown-item" to="/app/qa/bug/report">缺陷报告</nuxt-link>
            </div>
          </li>
          <li class="nav-item dropdown" :class="{ 'nav-active' :  currentRoute.indexOf('/app/qa/testcase') >= 0 }">
            <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">测试用例</a>
            <div class="dropdown-menu">
              <nuxt-link class="dropdown-item" to="/app/qa/testcase">用例管理</nuxt-link>
              <nuxt-link class="dropdown-item" to="/app/qa/testsuite">用例执行</nuxt-link>
            </div>
          </li>
          <li class="nav-item" :class="{ 'nav-active' :  currentRoute.indexOf('/app/products') >= 0 }">
            <nuxt-link class="nav-link" to="/app/products">产品管理</nuxt-link>
          </li>
          <li class="nav-item" :class="{ 'nav-active' :  currentRoute.indexOf('/app/user-management') >= 0 }">
            <nuxt-link class="nav-link" to="/app/user-management/user">用户管理</nuxt-link>
          </li>
          <li class="nav-item media-lg-Logout">
            <a class="nav-link">退出登录</a>
          </li>
        </ul>
        <div id="user-info" class="h-nav">
          <span class="familyname" :class="{ 'fDisplay': familyname }">{{ familyname }}</span>
          <el-dropdown class="ml-3" trigger="click">
            <span id="dashboard-set" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <img src="~/assets/images/more.png" class="head-more-icon">
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <nuxt-link to="/app/help" target="_blank">帮助文档</nuxt-link>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <nuxt-link to="/app/set/passwd">修改密码</nuxt-link>
              </el-dropdown-item>
              <el-dropdown-item divided><a @click="HandLogout()">退出登录</a></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      
    </nav>
    <div id="page-body">
      <nuxt/>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import rules from '~/assets/js/rules.js'

  export default {
    computed: {
      currentRoute: function () {
        return this.$route.path
      },
      realname: function () {
        return this.$store.state.userInfo.realname
      },
      familyname: function () {
        return this.realname ? this.realname.slice(0,1) : ''
      },
      rules: function () {
        return rules.MenuRules(this.$store.state.userInfo)
      }
    },
    beforeCreate () {
      if (!this.$store.state.isLogin) {
        this.$store.dispatch('getUserInfo')
      }
    },
    methods: {
      HandLogout () {
        if (process.client) {
          window.localStorage.removeItem('token')
          document.cookie = 'token' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;' + 'path=/'
          window.location.replace('/')
        }
      }
    }
  }
</script>

<style>
  @import 'static/static/common/css/main.css';
</style>
