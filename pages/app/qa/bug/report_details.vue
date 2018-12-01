<template>
  <div class="container">
    <div class="row">
      <div class="col-xl-10 col-lg-10 offset-xl-1 offset-lg-1 col-md-12 col-sm-12 col-12">
        <div id="report_title" class="text-center mt-5">
          <h1>{{ Details.product_code }}日报</h1>
          <span>{{ Details.datetime }}</span>
        </div>
        <div class="container-fluid mt-5">
          <h5 class="text-center">今日缺陷</h5>
          <div class="row">
            <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12" style="height:20rem;">
              <div id="bug-chart-today" style="width: 100%;height:100%;"></div>
            </div>
            <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 pt-5" style="height:20rem;">
              <p>如图所示:</p>
              <p class="font-size-93">今日，测试人员，发现了{{ chart1Y[0] }}个bug，
                关闭了{{  chart1Y[1] }}个bug。</p>
              <p v-if="chart1Y[2] > 0">今日，开发人员，解决了{{ chart1Y[2] }}个bug。</p>
            </div>
          </div>
        </div>
        <div class="container-fluid mt-5">
          <h5 class="text-center">未解决缺陷</h5>
          <div class="row">
            <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12" style="height:20rem;">
              <div id="bug-chart-surplus" style="width: 100%;height:100%;"></div>
            </div>
            <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 pt-5" style="height:20rem;">
              <p>如图所示: <br></p>
              <p class="font-size-93">在所有未解决的缺陷中，{{ surplus_bug.name }}类bug，占大多数，共计{{ surplus_bug.value }}个</p>
            </div>
          </div>
        </div>
        <div id="report_bug_fatal" class="my-5">
          <h5 class="mb-5 text-center">一级致命Bug</h5>
          <table class="table">
            <tbody>
              <tr v-for="item in Details.fatal_bug" :key="item.id">
                <td>{{ item.id }}</td>
                <td>{{ item.title }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import chart from "~/assets/js/chart.js"

export default {
  validate({ query }) {
    return /\w{2,6}/.test(query.report_id)
  },

  data() {
    return {
      Details: {},
      bug_today: ["创建", "关闭", "解决", "延期"]
    }
  },

  computed: {
    report_id: function() {
      return this.$route.query.report_id
    },
    chart1Y: function() {
      let data = this.Details.status_data
      var ydata = [0, 0, 0, 0]
      for (var i in data) {
        if (data[i]["create"]) {
          ydata[0] = data[i]["create"]
        }
        if (data[i]["closed"]) {
          ydata[1] = data[i]["closed"]
        }
        if (data[i]["fixed"]) {
          ydata[2] = data[i]["fixed"]
        }
        if (data[i]["hangUp"]) {
          ydata[3] = data[i]["hangUp"]
        }
      }
      return ydata
    },
    chart2: function() {
      let data = this.Details.surplus_bug
      return data
    },
    surplus_bug: function() {
      var data = { name: null, value: "" }
      if (this.Details.surplus_bug) {
        data.name = this.Details.surplus_bug[0]["name"]
        data.value = this.Details.surplus_bug[0]["value"]
      }
      return data
    }
  },

  watch: {
    chart1Y: function(val, oldval) {
      let width = "24%"
      chart.ChartBar("bug-chart-today", this.bug_today, this.chart1Y, width)
    },
    chart2: function(val, oldval) {
      chart.ChartPie("bug-chart-surplus", this.chart2)
    }
  },

  created() {
    this.getReportDetails();
  },

  methods: {
    getReportDetails() {
      axios
        .get("/api/qa/bug/report/details?report_id=" + this.report_id)
        .then(res => {
          if (res.data["status"] === 20000) {
            this.Details = JSON.parse(res.data["data"])
          } else {
            this.$notify.error({
              title: "错误",
              message: res.data["msg"]
            })
          }
        })
    }
  }
}
</script>