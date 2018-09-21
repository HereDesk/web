<template>
  <div id="page-bug-count">

    <div class="mt-5 container pl-0">
      <nav class="navbar navbar-expand-lg mr-auto">
        <a class="navbar-brand">缺陷统计分析</a>
        <div id="my-cascader">
          <el-cascader
            :options="product_list"
            v-model="SelectedProductReleaseInfo"
            change-on-select
          ></el-cascader>
        </div>
      </nav>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
          <ul class="pl-0 ul_link position-fixed">
            <li><a href="#DataDays">缺陷趋势分析</a></li>
            <li><a href="#DataTest">测试人员BUG统计</a></li>
            <li><a href="#DataDev">研发人员BUG统计</a></li>
            <li><a href="#DataBugStatus">缺陷状态分析</a></li>
            <li><a href="#DataSeverityType">缺陷严重程度分析</a></li>
            <li><a href="#DataPriorityType">缺陷优先级分析</a></li>
            <li><a href="#DataBugType">缺陷类型分析</a></li>
          </ul>
        </div>
        <div class="col-xl-9 col-lg-9 col-md-9 col-sm-12 col-12 py-5">
          <div id="DataDays" class="row">
            <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
              <h5 class="lead pl-3 pt-2">缺陷趋势分析</h5>
            </div>
            <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
              <ul class="ul-inline ul-datetime px-0 mb-0 pl-3" style="float:right;">
                <li @click="ClickDate($event)" :class="{ 'SelectedType': BugCreateDailyChartData.type == 'today' }">今天</li>
                <li @click="ClickDate($event)" :class="{ 'SelectedType': BugCreateDailyChartData.type == 'week' }">本周</li>
                <li @click="ClickDate($event)" :class="{ 'SelectedType': BugCreateDailyChartData.type == 'month' }">本月</li>
                <li @click="ClickDate($event)" :class="{ 'SelectedType': BugCreateDailyChartData.type == 'year' }">今年</li>
                <li id="count_date_input">
                  <input type="date" v-model="QueryBugCreate.start_date" style="width:45%;">
                  <input type="date" v-model="QueryBugCreate.end_date" style="width:45%;">
                </li>
              </ul>
            </div>
            <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12" style="height:22rem;">
              <div id="bug-create-chart" style="width: 100%;height:100%;"></div>
            </div>
          </div>

          <div id="DataTest" class="dropdown-divider my-5"></div>
          <div class="row">
            <div class="col">
              <h5 class="lead pl-3">测试人员BUG统计</h5>
              <div style="height:25rem;">
                <div id="bug-tester-chart" style="height:100%;width:100%;"></div>
              </div>
            </div>
          </div>

          <div id="DataDev" class="dropdown-divider my-5"></div>
          <div class="row">
            <div class="col">
              <h5 class="lead pl-3">研发人员BUG解决情况统计</h5>
              <div class="mt-5" style="height:22rem;">
                <div id="bug-dev-chart" style="height:100%;width:100%;"></div>
              </div>
            </div>
          </div>

          <div id="DataBugStatus" class="dropdown-divider my-5"></div>
          <div class="row">
            <div class="col">
              <h5 class="lead pl-3">缺陷状态分析</h5>
              <div id="bug-status-chart" style="height:22rem;width:100%;"></div>
            </div>
          </div>

          <div id="DataSeverityType" class="dropdown-divider my-5"></div>
          <div class="row">
            <div class="col">
              <h5 class="lead pl-3">缺陷严重程度分析</h5>
              <div id="bug-severity-chart" style="height:22rem;width:100%;"></div>
            </div>
          </div>

          <div id="DataPriorityType" class="dropdown-divider my-5"></div>
          <div class="row">
            <div class="col">
              <h5 class="lead pl-3">缺陷优先级分析</h5>
              <div id="bug-priority-chart" style="height:22rem;width:100%;"></div>
            </div>
          </div>

          <div id="DataBugType" class="dropdown-divider my-5"></div>
          <div class="row">
            <div class="col">
              <h5 class="lead pl-3">缺陷类型分析</h5>
              <div id="bug-type-chart" style="height:22rem;width:100%;"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import chart from '~/assets/js/chart.js'

  export default {
    name: "BugCount",
    head () {
      return {
        title: 'HDesk - 缺陷统计'
      }
    },
    layout: 'head',
    data () {
      return {
        product_list: [],
        // 当前已选的项目/版本信息
        SelectedProductReleaseInfo: [],
        QueryBugCreate: {
          type: 'month',
          start_date: null,
          end_date: null,
          product_code: null,
          version: null,
        },
        QueryBugStatus: {
          type: 'status',
          product_code: null,
          version: null
        },
        QueryBugType: {
          type: 'bug_type',
          product_code: null,
          version: null
        },
        QueryBugSeverity: {
          type: 'severity',
          product_code: null,
          version: null
        },
        QueryBugPriority: {
          type: 'priority',
          product_code: null,
          version: null
        },
        QueryBugTester: {
          product_code: null,
          version: null
        },
        QueryBugDeveloper: {
          product_code: null,
          version: null
        },
        BugCreateDailyChartData: [],
        BugStatusChartData: [],
        BugSeverityChartData: [],
        BugPriorityChartData: [],
        BugTesterChartData: [],
        devloperName: [],
        devFixed: [],
        devNotFixed: [],
        BugTypeChartData: []
      }
    },

    computed: {
      // 缺陷趋势分析
      chart1: function () {
        return chart.BugCreateDailyChartData(this.BugCreateDailyChartData)
      },
      // 缺陷状态分析
      chart2: function () {
        return chart.BugQueryChartData(this.BugStatusChartData)
      },
      // 缺陷严重程度分析
      chart3: function () {
        return chart.BugQueryChartData(this.BugSeverityChartData)
      },
      // 缺陷优先级分析
      chart4: function () {
        return chart.BugQueryChartData(this.BugPriorityChartData)
      },
      // 缺陷类型分析
      chart5: function () {
        return chart.BugQueryChartData(this.BugTypeChartData)
      }
    },

    watch: {

      SelectedProductReleaseInfo: {
        handler: function (val, oldVal) {
          let q = this.SelectedProductReleaseInfo
          this.$router.push({'path':'/app/qa/bug/count',query:{product_code:q[0],version:q[1]}})
          this.QueryBugCreate.product_code = q[0]
          this.QueryBugCreate.version = q[1]
          this.getBugStatusData()
          this.getBugSeverityData()
          this.getBugPriorityData()
          this.getBugTesterData()
          this.getBugDevloperData()
          this.getBugTypeData()
        },
        deep: true
      },

      QueryBugCreate: {
        handler: function (val, oldVal) {
          let qtype = this.QueryBugCreate.type
          let start_date = this.QueryBugCreate.start_date
          let end_date = this.QueryBugCreate.end_date
          if (qtype === 'year' || qtype === 'month' || qtype === 'week' || qtype === 'today') {
            this.getBugCreateDaily()
          }
          if (start_date && end_date) {
            this.QueryBugCreate.type = 'section'
            this.getBugCreateDaily()
          }
        },
        deep: true,
      },
      // 缺陷趋势分析
      chart1: function (val, oldval) {
        let x1 = this.chart1['datetime']
        let y1 = this.chart1['num']
        let width = chart.BigCharBarWidth(y1) 
        this.BugCreateDailyChartData.type === 'year' ? chart.ChartBar('bug-create-chart',x1,y1,width) : chart.ChartLine('bug-create-chart',x1,y1)
      },
      // 缺陷状态分析
      chart2: function (val, oldval) {
        let x2 = this.chart2['name']
        let y2 = this.chart2['value']
        let width = chart.CharBarWidth(y2)  
        chart.ChartBar('bug-status-chart',x2,y2,width)
      },
      // 缺陷严重程度分析
      chart3: function (val, oldval) {
        let x3 = this.chart3['name']
        let y3 = this.chart3['value']
        let width = chart.CharBarWidth(y3) 
        chart.ChartBar('bug-severity-chart',x3,y3,width)
      },
      // 缺陷优先级分析
      chart4: function (val, oldval) {
        let x4 = this.chart4['name']
        let y4 = this.chart4['value']
        let width = chart.CharBarWidth(y4)  
        chart.ChartBar('bug-priority-chart',x4,y4,width)
      },
      // 缺陷类型分析
      chart5: function (val, oldval) {
        let x5 = this.chart5['name']
        let y5 = this.chart5['value']
        let width = chart.CharBarWidth(y5)  
        chart.ChartBar('bug-type-chart',x5,y5,width)
      },
      // 缺陷测试发现数量分析
      BugTesterChartData: {
        handler: function (val, oldVal) {
          chart.ChartPie('bug-tester-chart',this.BugTesterChartData)
        },
        deep: true
      },
      // 缺陷开发人员分析
      devloperName: function (val, oldval) {
        let width = chart.BigCharBarWidth(this.devloperName)
        chart.ChartBarStack('bug-dev-chart',this.devloperName,this.devFixed,this.devNotFixed,width)
      }
    },

    created () {
      if (this.$route.query.product_code) {
        this.SelectedProductReleaseInfo.push(this.$route.query.product_code)
      }
      this.getProductRelease()
    },

    methods: {
      // 数据：产品版本
      getProductRelease () {
        let that = this
        axios.get('/api/pm/new_product_release')
          .then(function (res) {
            if (res.data['status'] === 20000) {
              that.product_list = res.data['data']
              if (res.data['data'].length > 0 && that.SelectedProductReleaseInfo.length === 0) {
                that.SelectedProductReleaseInfo.push(that.product_list[0]['value'])
              }
            } else {
              that.product_msg = res.data['msg']
            }
          }
        )
      },
      // 操作级联下拉框：切换产品与版本
      handleCommand (data) {
        this.current_product_code = data['product_code']
      },
      // 数据：按日期查询新建缺陷
      getBugCreateDaily() {
        let that = this
        axios.get('/api/analyze/bug/date/create',{params: this.QueryBugCreate})
          .then(function (res) {
            that.BugCreateDailyChartData = res.data
          })
      },
      // 数据：缺陷状态
      getBugStatusData() {
        let that = this
        this.QueryBugStatus.product_code = this.SelectedProductReleaseInfo[0]
        this.QueryBugStatus.version = this.SelectedProductReleaseInfo[1]
        axios.get('/api/analyze/bug/query',{params: this.QueryBugStatus})
          .then(function (res) {
            that.BugStatusChartData = res.data['data']
          })
      },
      // 数据：严重程度
      getBugSeverityData() {
        let that = this
        this.QueryBugSeverity.product_code = this.SelectedProductReleaseInfo[0]
        this.QueryBugSeverity.version = this.SelectedProductReleaseInfo[1]
        axios.get('/api/analyze/bug/query',{params: this.QueryBugSeverity})
          .then(function (res) {
            that.BugSeverityChartData = res.data['data']
          })
      },
      // 数据：优先级
      getBugPriorityData() {
        let that = this
        this.QueryBugPriority.product_code = this.SelectedProductReleaseInfo[0]
        this.QueryBugPriority.version = this.SelectedProductReleaseInfo[1]
        axios.get('/api/analyze/bug/query',{params: this.QueryBugPriority})
          .then(function (res) {
            that.BugPriorityChartData = res.data['data']
          })
      },
      // 数据：类型
      getBugTypeData() {
        let that = this
        this.QueryBugType.product_code = this.SelectedProductReleaseInfo[0]
        this.QueryBugType.version = this.SelectedProductReleaseInfo[1]
        axios.get('/api/analyze/bug/query',{params: this.QueryBugType})
          .then(function (res) {
            that.BugTypeChartData = res.data['data']
          })
      },
      // 数据：测试人员
      getBugTesterData() {
        let that = this
        this.QueryBugTester.product_code = this.SelectedProductReleaseInfo[0]
        this.QueryBugTester.version = this.SelectedProductReleaseInfo[1]
        axios.get('/api/analyze/bug/tester',{params: this.QueryBugTester})
          .then(function (res) {
            that.BugTesterChartData = res.data['data']
          })
      },
      // 数据：开发人员
      getBugDevloperData() {
        let that = this
        this.QueryBugDeveloper.product_code = this.SelectedProductReleaseInfo[0]
        this.QueryBugDeveloper.version = this.SelectedProductReleaseInfo[1]
        axios.get('/api/analyze/bug/developer',{params: this.QueryBugDeveloper})
          .then(function (res) {
            if (res.data['status'] === 20000) {
              let tmp_data = res.data['data']
              for (var i in tmp_data) {
                if (tmp_data[i]['name']) {
                  that.devloperName.push(tmp_data[i]['name'])
                  that.devFixed.push(tmp_data[i]['fixed_num'])
                  that.devNotFixed.push(tmp_data[i]['not_fixed_num'])
                }
              }
            } else {
              that.$notify.error({title: '失败',message: res.data['msg']})
            }
          })
      },
      ClickDate (event) {
        this.QueryBugCreate.start_date = null
        this.QueryBugCreate.end_date = null
        var innerText = event.target.innerText
        innerText === '今天' ? this.QueryBugCreate.type='today' : ''
        innerText === '本周' ? this.QueryBugCreate.type='week' : ''
        innerText === '本月' ? this.QueryBugCreate.type='month' : ''
        innerText === '今年' ? this.QueryBugCreate.type='year' : ''
      },
    }
  }
</script>