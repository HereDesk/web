<template>
  <div class="container">
    <div class="row text-center" style="margin-top:15%">
      <div class="col">
        <h3>自动生成缺陷报告</h3>
        <p class="mt-5">按照缺陷信息自动生成报告，反映一定时期内产品质量状况</p>
        <div id="bug_report" class="mt-5">
          
          <ProductInfo 
            :showStyle="'no-border-dropdown'" 
            :ptype="'only-product-name'" 
            @ProductInfo="GetProductInfo">
          </ProductInfo>
            
          <button type="btn" class="btn btn-create ml-3 animated"
            v-if="!DayReportId"
            :class="{ 'flipInX infinite bg-00BFA5': DayReportText === '获取中'}"
            @click="generateReport('day')">
            {{ DayReportText }}
          </button>
          <button type="btn" class="btn btn-create ml-3" v-if="DayReportId" @click="lookReport('day')">
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
export default {
  layout: 'head',
  
  data () {
    return {
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

  methods: {
    // get $emit data
    GetProductInfo (data)  {
      this.request_data.product_code = data.product_code
    },
    
    lookReport (data) {
      this.$router.push('/app/qa/bug/report_details?report_id=' + this.DayReportId)
    },
    
    // generate report data
    generateReport (data) {
      let t = data
      if (t === 'day') { 
        this.request_data.type = 'day'
        this.DayReportText = '获取中'
      }
      if (t === 'week') { 
        this.request_data.type = 'week'
        this.WeekReportText = '获取中'
      }
      this.axios
        .get('/api/qa/bug/report/generate', {params: this.request_data})
        .then(res => {
          if (res.data['status'] === 20000) {
            this.DayReportId = res.data['report_id']
          } else {
            this.DayReportText = '日报'
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