<template>
  <div id="page" style="height:100%;">
    <nav id="page-head" class="navbar navbar-expand-lg page-head">
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
          <li class="nav-item mx-3 naspan">
            <a class="nav-link">缺陷</a>
            <ul>
              <li><nuxt-link to="/app/qa/bug/add">提交BUG</nuxt-link></li>
              <li><nuxt-link to="/app/qa/bug">缺陷列表</nuxt-link></li>
              <li><nuxt-link to="/app/qa/bug/count">缺陷分析</nuxt-link></li>
              <li><nuxt-link to="/app/qa/bug/report">缺陷报告</nuxt-link></li>
            </ul>
          </li>
          <li class="nav-item mx-3 naspan">
            <a class="nav-link">测试用例</a>
            <ul>
              <li><nuxt-link to="/app/qa/testcase/add">编写用例</nuxt-link></li>
              <li><nuxt-link to="/app/qa/testcase">管理用例</nuxt-link></li>
              <li><nuxt-link to="/app/qa/testsuite">测试计划</nuxt-link></li>
            </ul>
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
          <span id="dashboard-set" class="ml-3 naspan">
            <i class="iconfont icon-menu size-2 icon-fff"></i>
            <ul class="pl-2">
              <li>
                <nuxt-link to="/app/help" target="_blank">
                  <i class="iconfont icon-help mr-2"></i>帮助文档
                </nuxt-link>
              </li>
              <li>
                <nuxt-link to="/app/set/passwd">
                  <i class="iconfont icon-password mr-2"></i>修改密码
                </nuxt-link>
              </li>
              <li>
                <a @click="HandLogout()">
                  <i class="iconfont icon-logout mr-2"></i>退出登录
                </a>
              </li>
            </ul>
          </span>
        </div>
      </div>

    </nav>
    <div id="page-body">
      <nuxt/>
    </div>
  </div>
</template>

<script>
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
      if (!this.$store.state.userInfo) {
        this.$store.dispatch('getUserInfo')
      }
    },

    created() {
      let PageData = this.$store.state.PageData
      let UserIdentity = this.$store.state.userInfo.identity === 1 ? true : false
      let product_id = process.client ? window.localStorage.last_visited_product_id : undefined
      if (product_id) {
        if (JSON.stringify(PageData) === '[]' && !UserIdentity ) {
          this.$store.dispatch("getPageData",product_id)
        }
      }
    },

    methods: {
      HandLogout () {
        if (process.client) {
        	window.localStorage.removeItem("token")
          window.localStorage.removeItem("last_visited_product")
        	document.cookie = "token" + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;" + "path=/"
        	window.location.replace("/")
        }
      }
    }
  }
</script>

<style scoped>
  @import '~/assets/css/main.css';

  .navbar-brand {
    color: #fff;
  }
</style>
