<template>
  <div id="page-testcase-loader" class="container">
    <div class="row mt-5">
      <div id="no-add" class="col-xl-5 col-lg-5 col-md-5 suitepart">
        <div id="testsuite-head-left" class="testsuite-head">
          <h5 class="testsuite-title">选择 
            <span v-if="LeftTotal">{{ LeftCheckedNum }}/{{ LeftTotal }}</span>
          </h5>
          <el-cascader
            placeholder="按模块选择测试用例"
            :options="modules_list"
            v-model="selected_mod_id"
            filterable
            change-on-select
          ></el-cascader>
        </div>
        <div class="divider"></div>
        <ul class="case_list">
          <li v-for="item in TestCaseList" :key="item.id">
            <input type="checkbox" id="item.case_id" value="item.case_id" @click="LeftCheckedTestCaseID(item.case_id,$event)">&nbsp;&nbsp;{{ item.title }}
          </li>
        </ul>
        <div class="loader-pagination">
          <Pagination :total="LeftTotal" @PsPn="getPsPn1"></Pagination>
        </div>
      </div>
      <div class="col-xl-2 col-lg-2 col-md-2 text-center cell-operate">
        <button type="btn" class="btn btn-load" @click="SaveLeftChecked()"> > 添加已选用例</button>
        <button type="btn" class="btn btn-load-all" @click="SaveLeftModulesAll($event)">添加当前模块<br>所有用例</button>
      </div>
      <div class="col-xl-5 col-lg-5 col-md-5 suitepart">
        <div id="testsuite-head-right" class="testsuite-head">
          <h5 class="testsuite-title">TestSuite测试用例列表</h5>
          <span v-if="RightTotal">{{ RightTotal }}</span>
        </div>
        <div class="divider"></div>
        <ul class="pl-2 mt-3 case_list">
          <li v-for="item in RightListData" :key="item.id">
            {{ item.id }}.&nbsp;&nbsp;{{ item.title }}
          </li>
        </ul>
        <div class="loader-pagination">
          <Pagination :total="RightTotal" @PsPn="getPsPn2"></Pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Pagination from '~/components/Pagination'
  let _ = require('lodash/Array')

  export default {
    layout: 'head',
    components: {
      Pagination
    },
    validate({ query }) {
      return query.suite_id && query.product_code ? true : false
    },

    data () {
      return {
        product_code: this.$route.query.product_code,
        suite_id: this.$route.query.suite_id,
        // right
        RightListData: [],
        RightQueryBuilder: {
          suite_id: this.$route.query.suite_id,
          pageSize: 10,
          pageNumber: 1
        },
        RightTotal: null,
        // left
        modules_list: [],
        selected_mod_id: [],
        LefteQueryBuilder: {
          product_code: null,
          m1_id: null,
          m2_id: null,
          pageSize: 10,
          pageNumber: 1
        },
        LeftTotal: null,
        LeftCheckedNum: 0,
        TestCaseList: [],
        LeftCheckedCellData: {
          suite_id: this.$route.query.suite_id,
          case_data: []
        }
      }
    },

    watch: {
      selected_mod_id: {
        handler: function (val, oldVal) {
          this.LefteQueryBuilder.m1_id = this.selected_mod_id[0]
          this.LefteQueryBuilder.m2_id = this.selected_mod_id[1]
        },
        deep: true
      },
      LefteQueryBuilder: {
        handler: function (val, oldVal) {
          this.getLeftData()
        },
        deep: true
      },
      RightQueryBuilder: {
        handler: function (val, oldVal) {
          this.getRightData()
        },
        deep: true
      }
    },

    created () {
      this.getModule()
      this.getRightData()
    },

    methods: {
      getPsPn1:function (ps,pn) {
        this.LefteQueryBuilder.pageSize = ps
        this.LefteQueryBuilder.pageNumber = pn
      },
      getPsPn2:function (ps,pn) {
        this.RightQueryBuilder.pageSize = ps
        this.RightQueryBuilder.pageNumber = pn
      },
      getModule (product_code) {
        let that = this
        axios.get('/api/pm/get_module?product_code=' + this.product_code)
          .then(function (res) {
            if (res.data['status'] === 20000) {
              that.modules_list = res.data['data']
            } else {
              that.Msg = res.data['msg']
            }
          }
        )
      },
      getLeftData () {
        let that = this
        this.LefteQueryBuilder.product_code = this.product_code
        axios.get('/api/qa/testcase/valid_list', {params: this.LefteQueryBuilder})
          .then(function (res) {
            if (res.data['status'] === 20000) {
              that.TestCaseList = res.data['data']
              that.LeftTotal = res.data['total']
            } else {
              that.$notify.error({title: '提示',message:res.data['msg']})
            }
          }
        )
      },
      getRightData () {
        let that = this
        axios.get('/api/qa/testsuite/cell/brief_list',{params: this.RightQueryBuilder}).then(function (res) {
          if (res.data['status'] === 20000) {
            that.RightListData = res.data['data']
            that.RightTotal = res.data['total']
          } else {
            that.$notify.error({title:'提示',message:res.data['msg']})
          }
        })
      },
      LeftCheckedTestCaseID (case_id,event) {
        let checked = event.target.checked
        var tmp = this.LeftCheckedCellData.case_data
        if (case_id && checked) {
          _.indexOf(tmp,case_id) >= 0 ? null : tmp.push(case_id)
        } else {
          _.pull(tmp,case_id)
        }
        this.LeftCheckedNum = tmp.length
        this.LeftCheckedCellData.case_data = tmp
      },
      SaveLeftChecked () {
        let that = this
        if (this.LeftCheckedCellData.case_data.length === 0) {
          this.$notify.error({title:'错误',message:'请选择后再提交'})
          return
        }
        axios({
          method: 'POST',
          url: '/api/qa/testsuite/cell/add',
          data: JSON.stringify(this.LeftCheckedCellData)
        }).then (function (res) {
          if (res.data['status'] === 20000) {
            that.getRightData()
            that.getLeftData()
            that.$notify.success({title:'成功',message:res.data['msg']})
          } else {
            that.$notify.error({title:'错误',message:res.data['msg']})
          }
        })
      },
      SaveLeftModulesAll (event) {
        let that = this
        if (this.selected_mod_id.length === 0) {
          this.$notify.warning({title:'提示',message:'请先选择模块'})
          return
        }
        if (this.TestCaseList.length === 0) {
          this.$notify.warning({title:'提示',message:'您选择的模块下，没有查任何用例哦'})
          return
        }
        var data = {
          "m1":null,
          "m2":null,
          "suite_id":this.$route.query.suite_id
        }
        data['m1'] = this.selected_mod_id[0]
        data['m2'] = this.selected_mod_id[1]
        axios({
          method: 'POST',
          url: '/api/qa/testsuite/cell/add',
          data: JSON.stringify(data)
        }).then (function (res) {
          if (res.data['status'] === 20000) {
            that.getRightData()
            that.getLeftData()
            that.$notify.success({title:'成功',message:res.data['msg']})
          } else {
            that.$notify.warning({title:'提示',message:res.data['msg']})
          }
        })
      }
    }
  }
</script>

<style>
  @import '~/static/static/common/css/testsuite.css';
</style>