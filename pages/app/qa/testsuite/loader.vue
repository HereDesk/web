<template>
<div id="page-testcase-loader" class="container">
  <nav class="d-flex my-5">
    <a class="navbar-brand flex-grow-1">已加入的用例</a>
    <div class="vertical-center">
      <button type="btn" class="btn btn-create" @click="showModal = 'create'"> + 添加</button>
    </div>
  </nav>

  <div class="row" v-if="HasJoinedCaseTotal == 0">
    <div class="col text-center" style="margin-top:13%;" @click="showModal = 'create'">
      <i class="iconfont icon-jiaru icon-8a8a8a size-5"></i>
      <p class="lead">还没有数据哦，点击加入</p>
    </div>
  </div>
  <div class="row" v-else>
    <div class="col">
      <!-- <ul class="ul-style-none">
          <li v-for="item in HasJoinedCaseData"  :key="item.id" :id="item.case_id" >
            {{ item.id }}. &nbsp;&nbsp;{{ item.title }}
          </li>
        </ul> -->
      <el-table :data='HasJoinedCaseData' :default-sort="{prop: 'date', order: 'descending'}">
        <el-table-column label='用例标题' prop='title'></el-table-column>
        <el-table-column label='创建者' prop='creator' width="100"></el-table-column>
        <el-table-column label='创建日期' width="175">
          <template slot-scope="scope">
            <span>{{ scope.row.create_time | date }}</span>
          </template>
        </el-table-column>
      </el-table>
      <Pagination :total="HasJoinedCaseTotal" @PsPn="getPsPn2"></Pagination>
    </div>
  </div>

  <Modal :isFooter="isFooter" :isHeaderClose="true" :modalSize="'lg'" :footerDirection="'start'"
    v-if="showModal == 'create'" @close="showModal = false">
    <div slot="header" class="testsuite-head">
      <h5 class="modal-title">用例列表</h5>
      <el-cascader class="ml-3 select-module" placeholder="按模块选择测试用例" :options="modules_list"
        v-model="selected_mod_id" filterable change-on-select>
      </el-cascader>
    </div>
    <div slot="body">
      <div class="text-center" v-if="AllCaseTotal === 0">
        <p class="lead my-5 pb-5">当前模块下，没有找到测试用例，请重新选择</p>
      </div>
      <div v-else>
        <ul class="ul-style-none mb-3 mx-3">
          <li class="case_text" v-for="(item,index) in AllTestCaseList" :key="index">
            <input type="checkbox" id="item.case_id" value="item.case_id"
              @click="CheckedCase(item.case_id,$event)">
              &nbsp;&nbsp;{{ item.id }}.&nbsp;&nbsp;{{ item.title }}
          </li>
        </ul>
        <div class="px-4">
          <Pagination :total="AllCaseTotal" :isModal="isModal" @PsPn="getPsPn1"></Pagination>
        </div>
      </div>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-cancel" @click="ReferCheckedCase()">提交已选用例</button>
      <button type="button" class="btn btn-cancel" @click="ReferCaseForModule()">提交当前模块所有用例</button>
    </div>
  </Modal>
</div>
</template>

<script>
import util from '~/assets/js/util.js'
let _ = require("lodash/Array")

export default {

  validate({query}) {
    return /\w{2,6}/.test(query.suite_id)
  },

  layout: "head",

  data() {
    return {
      isModal: 'Modal',
      showModal: false,
      product_id: this.$route.query.product_id || null,
      product_code: this.$route.query.product_code || null,
      suite_id: this.$route.query.suite_id || null,
      // all test case list
      AllTestCaseList: [],
      AllCaseTotal: null,
      modules_list: [],
      selected_mod_id: [],
      SaveCheckedCaseData: {
        suite_id: this.$route.query.suite_id,
        case_data: []
      },
      QueryBuilder: {
        product_id: null,
        m1_id: null,
        m2_id: null,
        pageSize: 10,
        pageNumber: 1
      },
      // 已加入
      HasJoinedCaseData: [],
      HasJoinedCaseTotal: null,
      HasJoinedCaseQueryBuilder: {
        suite_id: this.$route.query.suite_id,
        pageSize: 10,
        pageNumber: 1
      }
    }
  },

  filters: {
    date: util.date
  },

  watch: {
    selected_mod_id: {
      handler: function (val, oldVal) {
        this.QueryBuilder.m1_id = this.selected_mod_id[0]
        this.QueryBuilder.m2_id = this.selected_mod_id[1]
      },
      deep: true
    },
    QueryBuilder: {
      handler: function (val, oldVal) {
        this.getAllCaseData()
      },
      deep: true
    },
    HasJoinedCaseQueryBuilder: {
      handler: function (val, oldVal) {
        this.getHasJoinedCase()
      },
      deep: true
    }
  },

  computed: {
    isFooter() {
      return this.AllCaseTotal > 0 ? true : false
    }
  },

  created() {
    this.getModule()
    this.getHasJoinedCase()
    this.getAllCaseData()
  },

  methods: {
    getPsPn1: function (ps, pn) {
      this.QueryBuilder.pageSize = ps
      this.QueryBuilder.pageNumber = pn
    },
    getPsPn2: function (ps, pn) {
      this.HasJoinedCaseQueryBuilder.pageSize = ps
      this.HasJoinedCaseQueryBuilder.pageNumber = pn
    },

    // get product module
    getModule(product_code) {
      this.axios
        .get("/api/pm/module/all/list?product_id=" + this.product_id)
        .then(res => {
          if (res.data["status"] === 20000) {
            this.modules_list = res.data["data"]
          } else {
            this.Msg = res.data["msg"]
          }
        })
    },

    // get all testcase list
    getAllCaseData() {
      this.QueryBuilder.product_id = this.product_id
      this.axios
        .get("/api/qa/testcase/valid_list", {params: this.QueryBuilder})
        .then(res => {
          if (res.data["status"] === 20000) {
            this.AllTestCaseList = res.data["data"]
            this.AllCaseTotal = res.data["total"]
          } else {
            this.$notify.error({
              title: "提示",
              message: res.data["msg"]
            })
          }
        })
    },

    // get added testcase list
    getHasJoinedCase() {
      this.axios
        .get("/api/qa/testsuite/cell/loader_list", {params: this.HasJoinedCaseQueryBuilder})
        .then(res => {
          if (res.data["status"] === 20000) {
            this.HasJoinedCaseData = res.data["data"]
            this.HasJoinedCaseTotal = res.data["total"]
          } else {
            this.$notify.error({
              title: "提示",
              message: res.data["msg"]
            })
          }
        })
    },

    // 按条选择测试用例
    CheckedCase(case_id, event) {
      let checked = event.target.checked
      var tmp = this.SaveCheckedCaseData.case_data
      if (case_id && checked) {
        _.indexOf(tmp, case_id) >= 0 ? null : tmp.push(case_id)
      } else {
        _.pull(tmp, case_id)
      }
      this.SaveCheckedCaseData.case_data = tmp
    },

    // submit checked test case
    ReferCheckedCase() {
      if (this.SaveCheckedCaseData.case_data.length === 0) {
        this.$notify.error({
          title: "错误",
          message: "请选择后再提交"
        })
        return
      }
      this.axios({
        method: "POST",
        url: "/api/qa/testsuite/cell/add",
        data: JSON.stringify(this.SaveCheckedCaseData)
      }).then(res => {
        if (res.data["status"] === 20000) {
          this.getHasJoinedCase()
          this.getAllCaseData()
          this.$notify.success({
            title: "成功",
            message: res.data["msg"]
          })
          this.SaveCheckedCaseData.case_data = []
        } else {
          this.$notify.error({
            title: "错误",
            message: res.data["msg"]
          })
        }
      })
    },

    // 将此模块下所有测试用例加入集合
    ReferCaseForModule(event) {
      if (this.selected_mod_id.length === 0) {
        this.$notify.warning({
          title: "提示",
          message: "请先选择模块"
        })
        return
      }
      if (this.AllTestCaseList.length === 0) {
        this.$notify.warning({
          title: "提示",
          message: "您选择的模块下，没有查到任何用例哦"
        })
        return
      }
      let data = {
        m1: null,
        m2: null,
        suite_id: this.$route.query.suite_id
      }
      data["m1"] = this.selected_mod_id[0]
      data["m2"] = this.selected_mod_id[1]
      this.axios({
        method: "POST",
        url: "/api/qa/testsuite/cell/add",
        data: JSON.stringify(data)
      }).then(res => {
        if (res.data["status"] === 20000) {
          this.getHasJoinedCase()
          this.getAllCaseData()
          this.$notify.success({
            title: "成功",
            message: res.data["msg"]
          })
        } else {
          this.$notify.warning({
            title: "提示",
            message: res.data["msg"]
          })
        }
      })
    }
  }
}
</script>

<style scope>
  @import "~/assets/css/testsuite.css"
</style>
