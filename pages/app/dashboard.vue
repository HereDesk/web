<template>
  <div id="bashboard" class='container'>
  
    <div id="page-head" class="row pt-5">
      <nav class="navbar navbar-expand-lg mr-auto">
        <a class="navbar-brand" href="/app/dashboard">测试管理系统</a>
        <el-dropdown class="ml-3">
          <span class="dashboard-product">
            <span class="el-dropdown-link" v-if="current_product_code"> 
              {{ current_product_code || '' }}&nbsp;&nbsp;
              <i class="iconfont icon-trigon-down icon-8a8a8a"></i>
            </span>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for='item in product_list' :key="item.id">
              <span @click="handleCommand(item)">{{ item.product_code }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </nav>
      <div class="navbar">
        <span class="dashboard-username">{{ familyname || '' }}</span>
        <el-dropdown class="ml-3" trigger="click">
          <span id="dashboard-set" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
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
  
    <div id="page-data" v-if="isDisplayBody" style="margin-top:8%;">
      <div class="row">
        <div class="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12 my-3">
          <div class="container">
            <div class="row pt-3">
              <div class="col-6 border-right">
                <div class="board-view">
                  <nuxt-link :to="{ path: '/app/qa/bug', query: { 'operate': 'WaitPending', 'product_code': current_product_code } }">
                    <p class="v-num">{{ BugDashData.WaitPending || '0' }}</p>
                    <p class="v-desc">待我处理</p>
                  </nuxt-link>
                </div>
              </div>
              <div class="col-6">
                <div class="board-view">
                  <nuxt-link :to="{ path: '/app/qa/bug', query: { 'operate': 'NotResolved', 'product_code': current_product_code } }">
                    <p class="v-num">{{ BugDashData.NotFixed || '0' }}</p>
                    <p class="v-desc">所有未解决的</p>
                  </nuxt-link>
                </div>
              </div>
              <div class="col-6 border-right border-top">
                <div class="board-view">
                  <nuxt-link :to="{ path: '/app/qa/bug', query: { 'operate': 'CreatedByMe', 'product_code': current_product_code } }">
                    <p class="v-num">{{ BugDashData.CreatedByMe || '0' }}</p>
                    <p class="v-desc">我创建的</p>
                  </nuxt-link>
                </div>
              </div>
              <div class="col-6 border-top">
                <div class="board-view">
                  <nuxt-link :to="{ path: '/app/qa/bug', query: { 'status': 'Fixed', 'product_code': current_product_code } }">
                    <p class="v-num">{{ BugDashData.Fixed || '0' }}</p>
                    <p class="v-desc">已解决,待关闭</p>
                  </nuxt-link>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <div class="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12 px-0 text-center my-3" style="height:18rem;">
          <div id="CharBarBugStatus" style="width: 100%;height:100%;"></div>
        </div>
        <div class="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12 px-0 text-center my-3" style="height:18rem;">
          <div id="ChartLineBugWeek" style="width: 100%;height:100%;"></div>
        </div>
      </div>
  
      <div id="dashboard-nav" class="row my-5">
        <div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-6 dashboard-nav F4511E">
          <nuxt-link to="/app/qa/bug" class="n-link">
            <h5><i class="iconfont icon-bug size-2 pr-3"></i>缺陷</h5>
          </nuxt-link>
        </div>
        <div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-6 dashboard-nav FF6D00">
          <nuxt-link to="/app/qa/testcase" class="n-link">
            <h5><i class="iconfont icon-T size-2 pr-3"></i>测试用例</h5>
          </nuxt-link>
        </div>
        <div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-6 dashboard-nav FF7919">
          <nuxt-link to="/app/products" class="n-link">
            <h5><i class="iconfont icon-jingxuanchanpinku size-2 pr-3"></i>产品管理</h5>
          </nuxt-link>
        </div>
        <div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-6 dashboard-nav FFA726">
          <nuxt-link to="/app/user-management/user" class="n-link">
            <h5><i class="iconfont icon-user-manage size-2 pr-3"></i>用户管理</h5>
          </nuxt-link>
        </div>
      </div>
    </div>
  
    <div class="text-center mt-5 pt-5" v-else>
      <img :src="img_src" style="height:72px;width:72px;" v-show="img_src">
      <p class="mt-5">{{ product_msg }}</p>
    </div>
  
  </div>
</template>

<script>
import axios from "axios";
import util from "~/assets/js/util.js";
import chart from "~/assets/js/chart.js";
export default {
  head() {
    return {
      title: "HDesk - 首页"
    };
  },
  data() {
    return {
      fullscreenLoading: false,
      current_product_code: null,
      chartData: {},
      product_list: [],
      chartSettings: {},
      BugDashData: {
        WaitPending: "-",
        CreatedByMe: "-",
        NotFixed: "-",
        Fixed: "-"
      },
      BugStatusXAxisData: ["待解决", "已解决", "已关闭", "延期"],
      BugStatusData: {},
      BugWeekData: {},
      product_msg: "",
      img_src: ""
    };
  },
  computed: {
    familyname: function() {
      return this.$store.state.isLogin ? this.$store.state.userInfo.realname : ""
    },
    isDisplayBody() {
      if (this.$store.state.userInfo.group === "admin") {
        return true;
      } else if (this.current_product_code) {
        return true;
      } else {
        return false;
      }
    },
    QueryBuilderBugWeek() {
      let query = {
        product_code: null,
        type: "section",
        start_date: null,
        end_date: null
      };
      // date
      let dateOfToday = Date.now();
      let dayOfToday = (new Date().getDay() + 7 - 1) % 7;
      let daysOfThisWeek = Array.from(new Array(7)).map((_, i) => {
        let date = new Date(
          dateOfToday + (i - dayOfToday) * 1000 * 60 * 60 * 24
        );
        return (
          date.getFullYear() +
          "-" +
          String(date.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(date.getDate()).padStart(2, "0")
        )
      })
      query.product_code = this.current_product_code
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
    BarYdata: function(val, oldVal) {
      let x = this.BugStatusXAxisData
      let y = this.BarYdata
      let width = chart.CharBarWidth(y)
      chart.ChartBar("CharBarBugStatus", x, y, width, "缺陷状态统计")
    },
    LineYdata: function(val, oldVal) {
      let x = ["日", "一", "二", "三", "四", "五", "六"]
      let y = this.LineYdata
      chart.ChartLine("ChartLineBugWeek", x, y, "每周新建缺陷统计")
    },
    current_product_code: function(val, oldVal) {
      if (this.current_product_code) {
        this.$router.replace({
          path: "/app/dashboard",
          query: {
            product_code: this.current_product_code
          }
        })
        this.getBugDashData()
        this.getBugStatusData()
        this.getBugWeekData()
      }
    },
    product_msg: function(val, oldVal) {
      if (this.product_msg) {
        this.img_src = require("static/pic/smiley.png");
      }
    }
  },
  beforeCreate () {
    if (!this.$store.state.isLogin) {
      this.$store.dispatch("getUserInfo")
      this.$store.dispatch("getPageData")
    }
  },
  created() {
    this.getProductRelease()
  },
  methods: {
    // 获取数据：产品版本
    getProductRelease() {
      axios.get("/api/pm/product_release").then(res => {
        if (res.data["status"] === 20000) {
          this.product_list = res.data["data"];
          if (res.data["data"].length) {
            this.current_product_code = this.product_list[0]["product_code"];
          }
        } else {
          this.product_msg = res.data["msg"];
        }
      });
    },
    // 获取数据：缺陷DashBoard
    getBugDashData() {
      axios.get("/api/dashboard/data_statistics?product_code=" + this.current_product_code)
        .then(res => {
          if (res.data["status"] === 20000) {
            this.BugDashData.WaitPending = res.data["data"]["WaitPending"];
            this.BugDashData.CreatedByMe = res.data["data"]["CreatedByMe"];
            this.BugDashData.NotFixed = res.data["data"]["NotFixed"];
            this.BugDashData.Fixed = res.data["data"]["Fixed"];
          }
        });
    },
    // 获取数据：缺陷状态
    getBugStatusData() {
      axios.get("/api/analyze/bug/query?type=status&product_code=" + this.current_product_code)
        .then(res => {
          if (res.data["status"] === 20000) {
            this.BugStatusData = res.data["data"]
          }
        });
    },
    // 获取数据：每周新建缺陷
    getBugWeekData() {
      axios.get("/api/analyze/bug/date/create", {params: this.QueryBuilderBugWeek})
        .then(res => {
          if (res.data["status"] === 20000) {
            this.BugWeekData = res.data["data"];
          }
        });
    },
    // 操作：切换产品
    handleCommand(data) {
      this.current_product_code = data["product_code"];
    },
    // 操作：用户退出登录
    HandLogout() {
      if (process.browser) {
        window.localStorage.removeItem("token");
        document.cookie =
          "token" + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;" + "path=/";
        window.location.replace("/");
      }
    }
  }
};
</script>

<style>
  @import "~/static/static/common/css/main.css"
</style>
