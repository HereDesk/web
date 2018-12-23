<template>
  <div id="page-testcase-loader" class="container">
    <nav class="d-flex my-5">
      <a class="navbar-brand flex-grow-1">已加入的用例</a>
      <div class="vertical-center">
        <button type="btn" class="btn btn-create" @click="showModal = 'create'"> + 添加</button>
      </div>
    </nav>
    <div class="row" v-if="AddedTotal == 0">
      <div class="col text-center" style="margin-top:13%;" @click="showModal = 'create'">
        <i class="iconfont icon-jiaru icon-8a8a8a size-5"></i>
        <p class="lead">还没有数据哦，点击加入</p>
      </div>
    </div>
    <div class="row" v-else>
      <div class="col">
        <ul class="ul-style-none">
          <li v-for="item in AddedCaseData"  :key="item.id" :id="item.case_id" >
            {{ item.id }}. &nbsp;&nbsp;{{ item.title }}
          </li>
        </ul>
        <Pagination :total="AddedTotal" @PsPn="getPsPn2"></Pagination>
      </div>
    </div>

    <Modal isFooter="true" v-if="showModal == 'create'" @close="showModal = false">
      <div slot="header" class="testsuite-head">
        <h5 class="modal-title">用例列表</h5>
        <el-cascader class="border-none" placeholder="按模块选择测试用例"
          :options="modules_list"
          v-model="selected_mod_id"
          filterable
          change-on-select
        ></el-cascader>
      </div>
      <div slot="body">
        <ul class="ul-style-none mb-5">
          <li v-for="(item,index) in TestCaseList" :key="index">
            <input type="checkbox" id="item.case_id" value="item.case_id" @click="CheckedCase(item.case_id,$event)">
            &nbsp;&nbsp;{{ item.id }}.&nbsp;&nbsp;{{ item.title }}
          </li>
        </ul>
        <div class="px-4">
          <Pagination :total="AllTotal" :isModal="isModal" @PsPn="getPsPn1"></Pagination>
        </div>
      </div>
      <div slot="footer" class="px-5" style="justify-content:flex-start;">
        <button type="button" class="btn btn-cancel" @click="ReferChecked()">加入</button>
        <button type="button" class="btn btn-cancel" @click="CaseForModuleAdd()">加入当前模块所有用例</button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Pagination from "~/components/Pagination"
let _ = require("lodash/Array")

export default {
  
  validate({ query }) {
    return /\w{2,6}/.test(query.suite_id)
  },
  
  layout: "head",
  components: {
    Pagination,
  },

  data() {
    return {
      isModal: 'Modal',
      showModal: false,
      product_code: this.$route.query.product_code || null,
      suite_id: this.$route.query.suite_id || null,
      // right
      AddedCaseData: [],
      NoAddQueryBuilder: {
        suite_id: this.$route.query.suite_id,
        pageSize: 10,
        pageNumber: 1
      },
      AddedTotal: null,
      // left
      modules_list: [],
      selected_mod_id: [],
      AddedQueryBuilder: {
        product_code: this.$route.query.product_code,
        m1_id: null,
        m2_id: null,
        pageSize: 10,
        pageNumber: 1
      },
      AllTotal: null,
      LeftCheckedNum: 0,
      TestCaseList: [],
      SaveCheckedCaseData: {
        suite_id: this.$route.query.suite_id,
        case_data: []
      }
    }
  },

  watch: {
    showModal () {
      this.showModal ? 
        document.body.classList.add("overflow-hidden") : 
        document.body.classList.remove("overflow-hidden")
    },
    selected_mod_id: {
      handler: function(val, oldVal) {
        this.AddedQueryBuilder.m1_id = this.selected_mod_id[0]
        this.AddedQueryBuilder.m2_id = this.selected_mod_id[1]
      },
      deep: true
    },
    AddedQueryBuilder: {
      handler: function(val, oldVal) {
        this.getAllCaseData()
      },
      deep: true
    },
    NoAddQueryBuilder: {
      handler: function(val, oldVal) {
        this.getAddedCase()
      },
      deep: true
    }
  },

  created() {
    this.getModule()
    this.getAddedCase()
    this.getAllCaseData()
  },

  methods: {
    getPsPn1: function(ps, pn) {
      this.AddedQueryBuilder.pageSize = ps
      this.AddedQueryBuilder.pageNumber = pn
    },
    getPsPn2: function(ps, pn) {
      this.NoAddQueryBuilder.pageSize = ps
      this.NoAddQueryBuilder.pageNumber = pn
    },

    // get product module
    getModule(product_code) {
      this.axios
        .get("/api/pm/get_module?product_code=" + this.product_code)
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
      this.axios
        .get("/api/qa/testcase/valid_list", { params: this.AddedQueryBuilder })
        .then(res => {
          if (res.data["status"] === 20000) {
            this.TestCaseList = res.data["data"]
            this.AllTotal = res.data["total"]
          } else {
            this.$notify.error({ title: "提示", message: res.data["msg"] })
          }
        })
    },


    getAddedCase() {
      this.axios.get("/api/qa/testsuite/cell/brief_list", {params: this.NoAddQueryBuilder})
        .then(res => {
          if (res.data["status"] === 20000) {
            this.AddedCaseData = res.data["data"]
            this.AddedTotal = res.data["total"]
          } else {
            this.$notify.error({ title: "提示", message: res.data["msg"] })
          }
        })
    },


    CheckedCase(case_id, event) {
      let checked = event.target.checked
      var tmp = this.SaveCheckedCaseData.case_data
      if (case_id && checked) {
        _.indexOf(tmp, case_id) >= 0 ? null : tmp.push(case_id)
      } else {
        _.pull(tmp, case_id)
      }
      this.LeftCheckedNum = tmp.length
      this.SaveCheckedCaseData.case_data = tmp
    },


    ReferChecked() {
      if (this.SaveCheckedCaseData.case_data.length === 0) {
        this.$notify.error({ title: "错误", message: "请选择后再提交" })
        return
      }
      this.axios({
        method: "POST",
        url: "/api/qa/testsuite/cell/add",
        data: JSON.stringify(this.SaveCheckedCaseData)
      }).then(res => {
        if (res.data["status"] === 20000) {
          this.getAddedCase()
          this.getAllCaseData()
          this.$notify.success({ title: "成功", message: res.data["msg"] })
        } else {
          this.$notify.error({ title: "错误", message: res.data["msg"] })
        }
      })
    },


    CaseForModuleAdd(event) {
      if (this.selected_mod_id.length === 0) {
        this.$notify.warning({ title: "提示", message: "请先选择模块" })
        return
      }
      if (this.TestCaseList.length === 0) {
        this.$notify.warning({
          title: "提示",
          message: "您选择的模块下，没有查任何用例哦"
        })
        return
      }
      var data = {
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
          this.getAddedCase()
          this.getAllCaseData()
          this.$notify.success({ title: "成功", message: res.data["msg"] })
        } else {
          this.$notify.warning({ title: "提示", message: res.data["msg"] })
        }
      })
    }
  }
}
</script>

<style>
  @import "~/static/static/common/css/testsuite.css"
</style>