<template>
<div id="page-dashboard" class="container">

  <div id="page-head" class="row" style="height:18vh;">
    <nav class="navbar navbar-expand-lg mr-auto">
      <a class="navbar-brand" href="/app/dashboard">测试管理系统</a>
      <div class="ml-3">
        <ProductInfo :showStyle="'no-border-dropdown'" :ptype="'only-product-name'" @ProductInfo="GetProductInfo">
        </ProductInfo>
      </div>
    </nav>
    <div class="navbar">
      <span class="dashboard-username">{{ familyname || '' }}</span>
      <el-dropdown class="ml-3" trigger="click">
        <span
            id="dashboard-set"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <i class="iconfont icon-menu size-2 icon-8a8a8a"></i>
          </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <nuxt-link to="/app/help" target="_blank">
              <i class="iconfont icon-help"></i>&nbsp;&nbsp;帮助文档
            </nuxt-link>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <nuxt-link to="/app/set/passwd">
              <i class="iconfont icon-password"></i>&nbsp;&nbsp;修改密码
            </nuxt-link>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <a @click="HandLogout()">
              <i class="iconfont icon-logout"></i>&nbsp;&nbsp;退出登录
            </a>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>

  <div id="page-body" class="row" style="height:82vh;display:flex;align-items:center;">
    <div style="margin:auto !important;width:100%;">
      <div id="page-data" class="pb-5" v-if="isDisplayBody">
        <!-- page chart -->
        <div id="dashboard-chart" class="row mb-3 align-items-center">
          <div class="col-lg-4 col-md-4 col-sm-12">
            <div class="container">
              <div class="row pt-3">
                <div class="col-6 border-right">
                  <div class="board-view">
                    <nuxt-link :to="{ 
                        path: '/app/qa/bug', 
                        query: { 'operate': 'WaitPending', 'product_id': current_product_id } }">
                      <p class="v-num">{{ BugDashData.WaitPending || '0' }}</p>
                      <p class="v-desc">待我处理</p>
                    </nuxt-link>
                  </div>
                </div>
                <div class="col-6">
                  <div class="board-view">
                    <nuxt-link :to="{ path: '/app/qa/bug', query: { 'operate': 'NotResolved', 'product_id': current_product_id } }">
                      <p class="v-num">{{ BugDashData.NotFixed || '0' }}</p>
                      <p class="v-desc">所有未解决的</p>
                    </nuxt-link>
                  </div>
                </div>
                <div class="col-6 border-right border-top">
                  <div class="board-view">
                    <nuxt-link :to="{ path: '/app/qa/bug', query: { 'operate': 'CreatedByMe', 'product_id': current_product_id } }">
                      <p class="v-num">{{ BugDashData.CreatedByMe || '0' }}</p>
                      <p class="v-desc">我创建的</p>
                    </nuxt-link>
                  </div>
                </div>
                <div class="col-6 border-top">
                  <div class="board-view">
                    <nuxt-link :to="{ path: '/app/qa/bug', query: { 'status': 'Fixed', 'product_id': current_product_id } }">
                      <p class="v-num">{{ BugDashData.Fixed || '0' }}</p>
                      <p class="v-desc">已解决,待关闭</p>
                    </nuxt-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-4 col-sm-12 px-0 text-center my-3" style="height:18rem;">
            <div id="CharBarBugStatus" style="width: 100%;height:100%;"></div>
          </div>
          <div class="col-lg-4 col-md-4 col-sm-12 px-0 text-center my-3" style="height:18rem;">
            <div id="ChartLineBugWeek" style="width: 100%;height:100%;"></div>
          </div>
        </div>

        <!-- page nav -->
        <div id="dashboard-nav" class="row align-items-center">
          <div class="col-lg-3 col-md-3 col-sm-6 col-6 dashboard-nav F4511E">
            <nuxt-link :to="{ 
                  path: '/app/qa/bug', 
                  query: { 'product_id': current_product_id, 'status': 'notClosed' } 
                }" class="n-link">
              <h5><i class="iconfont icon-bug size-2 pr-3"></i>缺陷</h5>
            </nuxt-link>
          </div>
          <div class="col-lg-3 col-md-3 col-sm-6 col-6 dashboard-nav FF6D00">
            <nuxt-link :to="{ 
                  path: '/app/qa/testcase', 
                  query: { 'product_id': current_product_id } 
                }" class="n-link">
              <h5><i class="iconfont icon-T size-2 pr-3"></i>测试用例</h5>
            </nuxt-link>
          </div>
          <div class="col-lg-3 col-md-3 col-sm-6 col-6 dashboard-nav FF7919">
            <nuxt-link to="/app/products" class="n-link">
              <h5><i class="iconfont icon-jingxuanchanpinku size-2 pr-3"></i>产品管理</h5>
            </nuxt-link>
          </div>
          <div class="col-lg-3 col-md-3 col-sm-6 col-6 dashboard-nav FFA726">
            <nuxt-link to="/app/user-management/user" class="n-link">
              <h5><i class="iconfont icon-user-manage size-2 pr-3"></i>用户管理</h5>
            </nuxt-link>
          </div>
        </div>
      </div>
      <div id="page-msg" class="text-center" v-else>
        <img :src="img_src" style="height:72px;width:72px;" v-show="img_src" >
        <p class="mt-5">{{ product_msg }}</p>
      </div>
    </div>
  </div>

</div>
</template>

<script>
import util from "~/assets/js/util.js"
import chart from "~/assets/js/chart.js"

export default {
  head() {
    return {
      title: "HDesk - 首页"
    }
  },

  data() {
    return {
      fullscreenLoading: false,
      current_product_code: null,
      current_product_id: null,
      chartData: {},
      product_list: [],
      chartSettings: {},
      BugDashData: {},
      BugStatusXAxisData: ["待解决", "已解决", "已关闭", "延期"],
      BugStatusData: {},
      BugWeekData: {},
      product_msg: "",
      img_src: ""
    };
  },

  computed: {

    familyname: function () {
      return this.$store.state.userInfo ? this.$store.state.userInfo.realname : ""
    },

    isDisplayBody() {
      return this.$store.state.userInfo.identity === 0 || this.current_product_id ? true : false
    },

    QueryBuilderBugWeek() {
      let query = {
        product_code: null,
        product_id: "",
        type: "section",
        start_date: null,
        end_date: null
      }
      // computed date
      let dateOfToday = Date.now()
      let dayOfToday = (new Date().getDay() + 7 - 1) % 7;
      let daysOfThisWeek = Array.from(new Array(7)).map((_, i) => {
        let date = new Date(dateOfToday + (i - dayOfToday) * 1000 * 60 * 60 * 24)
        return (
          date.getFullYear() +
          "-" + String(date.getMonth() + 1).padStart(2, "0") +
          "-" + String(date.getDate()).padStart(2, "0")
        )
      })
      query.product_id = this.current_product_id
      query.start_date = daysOfThisWeek[0]
      query.end_date = daysOfThisWeek[6]
      return query
    },

    BarYdata() {
      let data = this.BugStatusData
      let ydata = [0, 0, 0, 0]
      for (var i in data) {
        if (data[i]["name"] === "待解决") {
          ydata[0] = data[i]["value"]
        }
        if (data[i]["name"] === "已解决") {
          ydata[1] = data[i]["value"]
        }
        if (data[i]["name"] === "已关闭") {
          ydata[2] = data[i]["value"]
        }
        if (data[i]["name"] === "挂起延期") {
          ydata[3] = data[i]["value"]
        }
      }
      return ydata
    },

    LineYdata() {
      let data = this.BugWeekData
      let ydata = [0, 0, 0, 0, 0, 0, 0]
      for (let i in data) {
        let w = util.getWeek(data[i]["datetime"])
        ydata[w] = data[i]["num"]
      }
      return ydata
    }
  },

  watch: {

    BarYdata: function (val, oldVal) {
      let x = this.BugStatusXAxisData
      let y = this.BarYdata
      let width = chart.CharBarWidth(y)
      chart.ChartBar("CharBarBugStatus", x, y, width, "缺陷状态统计")
    },

    LineYdata: function (val, oldVal) {
      const x = ["日", "一", "二", "三", "四", "五", "六"]
      let y = this.LineYdata
      chart.ChartLine("ChartLineBugWeek", x, y, "每周新建缺陷统计")
    },

    current_product_id: function (val, oldVal) {
      if (this.current_product_id) {
        this.$router.replace({
          path: "/app/dashboard",
          query: {
            product_id: this.current_product_id
          },
        })
        this.getBugDashData()
        this.getBugStatusData()
        this.getBugWeekData()
      }
    },

    product_msg: function (val, oldVal) {
      // if (this.product_msg) {
      //   this.img_src = require("static/images/smiley.png")
      // }
      if (this.product_msg) {
        this.img_src = require("static/images/product_add.png")
      }
    }
  },

  created() {
    if (!this.$store.state.userInfo) {
      this.$store.dispatch("getUserInfo")
    }
  },

  mounted() {
    if (this.current_product_id) {
      this.getBugDashData()
      this.getBugStatusData()
      this.getBugWeekData()
    }
  },

  methods: {
    // get $emit data
    GetProductInfo(data) {
      this.product_msg = data.PageMsg
      this.current_product_id = data.product_id
      this.current_product_code = data.product_code
    },

    // get data：bug DashBoard
    getBugDashData() {
      this.axios.get("/api/dashboard/data_statistics?product_id=" + this.current_product_id)
        .then(res => {
          if (res.data["status"] === 20000) {
            this.BugDashData = res.data["data"]
          }
        })
    },

    // get data：bug status data
    getBugStatusData() {
      this.axios.get("/api/analyze/bug/query?type=status&product_id=" + this.current_product_id)
        .then(res => {
          if (res.data["status"] === 20000) {
            this.BugStatusData = res.data["data"]
          }
        })
    },

    // get data：week bug
    getBugWeekData() {
      this.axios.get("/api/analyze/bug/date/create", {
        params: this.QueryBuilderBugWeek,
      }).then(res => {
        if (res.data["status"] === 20000) {
          this.BugWeekData = res.data["data"]
        }
      })
    },

    // click: user logout
    HandLogout() {
      if (process.browser) {
        window.localStorage.removeItem("token")
        window.localStorage.removeItem("last_visited_product")
        document.cookie = "token" + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;" + "path=/"
        window.location.replace("/")
      }
    }
  }
}
</script>

<style>
@import "~/assets/css/main.css";
</style>
