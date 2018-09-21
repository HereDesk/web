<template>
  <div class="container">
    <div class="row text-center" style="margin-top:15%">
      <div class="col">
        <h3>自动生成缺陷报告</h3>
        <p class="mt-5">按照缺陷信息自动生成报告，反映一定时期内产品质量状况</p>
        <div id="bug_report" class="mt-5">
          <el-select 
            v-model="request_data.product_code"
            v-if="DayReportText === '日报' || DayReportText === '周报'"
            placeholder="选择产品" 
            class='col-sm-3 col-5 px-0 mr-3' style="width:8rem;">
            <el-option 
              v-for="item in product_list" 
              :key="item.product_code" 
              :label="item.product_code" 
              :value="item.product_code">
            </el-option>
          </el-select>
          <button type="btn" class="btn btn-create mr-3 animated"
            v-if="!DayReportId"
            :class="{ 'flipInX infinite bg-00BFA5': DayReportText === '获取中'}"
            @click="generateReport('day')">
            {{ DayReportText }}
          </button>
          <button type="btn" class="btn btn-create mr-3"
            v-if="DayReportId"
            @click="lookReport('day')">
            查看日报
          </button>
          <button type="btn" class="btn btn-create" v-show="WeekDay" @click="generateReport('week')">
            {{ WeekReportText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  layout: 'head',
  data () {
    return {
      product_list: [],
      progress: null,
      DayReportText: '日报',
      WeekReportText: '周报',
      request_data: {
        type: null,
        product_code: null
      },
      DayReportId: null
    }
  },
  computed: {
    WeekDay () {
      let mydate=new Date()
      let WeekDay = mydate.getDay()
      return WeekDay === 5? true : null
    }
  },

  created () {
    this.getProductRelease()
  },

  methods: {
    getProductRelease () {
      let that = this
      axios.get('/api/pm/product_release').then(function (res) {
        if (res.data['status'] === 20000) {
          that.product_list = res.data['data']
          that.request_data.product_code = res.data['data'][0]['product_code']
        }
      })
    },
    lookReport (data) {
      this.$router.push('/app/qa/bug/report_details?report_id=' + this.DayReportId)
    },
    generateReport (data) {
      let t = data
      let that = this
      if (t == 'day') { 
        this.request_data.type = 'day'
        this.DayReportText = '获取中'
      }
      if (t === 'week') { 
        this.request_data.type = 'week'
        this.WeekReportText = '获取中'
      }
      axios.get('/api/qa/bug/report/generate', {params: this.request_data}).then(function (res) {
        if (res.data['status'] === 20000) {
          that.DayReportId = res.data['report_id']
        } else {
          that.DayReportText = '日报'
        }
      })
    }
  }
}
</script>

<style>
  #bug_report input {
    border: none !important;
  }
</style>