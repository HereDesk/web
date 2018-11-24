<template>
  <div id="page" style="height:100%;">
    <nav id="page-head" class="navbar navbar-expand-lg navbar-light bg-white page-head">
      <a id="navbar-brand" class="navbar-brand" href="#">HDesk</a>
      <button class="navbar-toggler" type="button" 
        data-toggle="collapse" data-target="#navbarSupportedContent" 
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="navbarSupportedContent" class="mx-5 collapse navbar-collapse">
        <ul class="navbar-nav mr-auto head-nav">
          <li class="nav-item">
            <nuxt-link class="nav-link" to="/app/dashboard">首页</nuxt-link>
          </li>
          <li class="nav-item mx-3">
            <el-dropdown trigger="click" style="line-height:2.5rem;font-size:1rem !important;">
              <span data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" :class="{ 'nav-active' : currentRoute.includes('bug') }">缺陷</span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <nuxt-link to="/app/qa/bug/add">提交BUG</nuxt-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <nuxt-link to="/app/qa/bug" exact>缺陷列表</nuxt-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <nuxt-link to="/app/qa/bug/count">缺陷分析</nuxt-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <nuxt-link to="/app/qa/bug/report">缺陷报告</nuxt-link>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
          <li class="nav-item mx-3">
            <el-dropdown trigger="click" style="line-height:2.5rem;font-size:1rem !important;">
              <span data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                 :class="{ 'nav-active' : currentRoute.includes('test') }">测试用例</span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <nuxt-link to="/app/qa/testcase/add">编写用例</nuxt-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <nuxt-link to="/app/qa/testcase" exact>管理用例</nuxt-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <nuxt-link to="/app/qa/testsuite">执行用例</nuxt-link>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" to="/app/products">产品管理</nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" to="/app/user-management/user">用户管理</nuxt-link>
          </li>
          <li class="nav-item media-lg-Logout">
            <a class="nav-link">退出登录</a>
          </li>
        </ul>
        <div id="user-info" class="h-nav">
          <span class="familyname" :class="{ 'name_inline_block': familyname }">{{ familyname }}</span>
          <el-dropdown class="ml-3" trigger="click">
            <span id="dashboard-set" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <i class="iconfont icon-menu size-2 icon_8a8a8a"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <nuxt-link to="/app/help" target="_blank">
                  <i class="iconfont icon-help"></i>&nbsp;&nbsp;帮助文档
                </nuxt-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <nuxt-link to="/app/set/passwd">
                  <i class="iconfont icon-password"></i>&nbsp;&nbsp;修改密码
                </nuxt-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <a @click="HandLogout()">
                  <i class="iconfont icon-logout"></i>&nbsp;&nbsp;退出登录
                </a>
              </el-dropdown-item>
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
        return String(this.$route.path)
      },
      realname: function () {
        return this.$store.state.userInfo.realname
      },
      familyname: function () {
        return this.realname ? this.realname.slice(0,1) : ''
      },
      rules: function () {
        return rules.RuleManges(this.$store.state.userInfo)
      }
    },
    beforeCreate () {
      if (!this.$store.state.isLogin) {
        this.$store.dispatch('getUserInfo')
      }
      if (!this.$store.state.PageData) {
        this.$store.dispatch("getPageData")
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