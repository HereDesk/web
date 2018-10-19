<template>
  <div id="page-testcase" class="container-fluid">
    <div class="row">
      <div id="testcase-modules" class="col-xl-2 col-lg-3 col-md-3 col-sm-12 col-12 pg-modules pt-5">
        <div>
          <div class="mb-3">
            <p class="pl-4 display-inline" v-if="!modules_list.length">
              <nuxt-link class="display-inline" 
                :to="{ path: '/app/products/modules',query: {'product_code': selected_product } }">
                <span style="color:#2b2b2b">维护模块</span>
              </nuxt-link>
            </p>
            <p class="pl-4 display-inline" :class="{ 'el-active' : !m1_id && !m2_id }"
              @click="click_all_modules()" v-else>
              全部模块
            </p>
            <nuxt-link class="display-inline manage-modules" 
              :to="{ path: '/app/products/modules',query: {'product_code': selected_product } }">
              &nbsp;&nbsp;&nbsp;&nbsp;<i class="iconfont icon-40 icon-8a8a8a size-1-5"></i>
            </nuxt-link>
          </div>
          <div class="divider"></div>
          <div class="t-modules-list mt-3">
            <ul v-for="item1 in modules_list" :key="item1.id" class="pl-4">
              <li :id="item1.id">
                <span class="line-height-1-8 li-color" 
                  :class="{ 'el-active': m1_id == item1.id }" 
                  @click="clickMoudle1(item1)">
                  <i class="iconfont icon-8a8a8a" 
                    :class="[ m1_id == item1.id ? 'icon-xiaotuziCduan_' : 'icon-xiaotuziCduan_2' ]">
                  </i>
                  &nbsp;&nbsp;{{ item1.label }}
                </span>
                <ul class="ul-display pl-5 mt-3" v-if="m1_id == item1.id">
                  <li style="line-height:2.5rem" 
                    v-for="item2 in item1.children" :key="item2.id" :id="item1.id" 
                    @click="clickMoudle2(item2)">
                    <span class="li-color" :class="{ 'el-active': m2_id == item2.id }">
                      {{ item2.label }}
                    </span>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div id="testcase-list" class="col-xl-10 col-lg-9 col-md-9 col-sm-12 col-12 pt-5">
        <div class="container-fluid">
          <div id="testcase-manage" class="row justify-content-between">
            <div id="testcase-query">
              <el-dropdown id="testcase-query-product" class="pt-2 pl-3" trigger="click">
                <span>
                  <span class="el-dropdown-desc">产品：</span>
                  <span class="el-dropdown-link bg-edown">
                    {{ selected_product }}
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for='item in product_list' :key="item.id">
                    <span @click="handleCommand(item)">{{ item.product_code }}</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown id="testcase-query-status" class="pt-2 pl-3" trigger="click">
                <span>
                  <span class="el-dropdown-desc">状态：</span>
                  <span class="el-dropdown-link bg-edown">
                    {{ selected_status | FilterCaseStatus }}<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for='item in status_list' :key="item.id" :value="item.status_value">
                    <span @click="handleCommand(item)">{{ item.status_name }}</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="mobile-action-bar pt-2 vertical-center">
              <span class="searchIcon mr-4" @click="clickSearch()" title="搜一搜">
                <i class="iconfont icon-search icon-8a8a8a size-1-2"></i>
              </span>
              <span title="导入导出" class="mr-4" data-toggle="modal" data-target="#m-import-export">
                <i class="iconfont icon-import-export icon-8a8a8a size-1-8"></i>
              </span>
              <span title="测试用例统计" class="mr-4" @click="myToday()">
                <i class="iconfont icon-web-icon- icon-8a8a8a size-2"></i>
              </span>
              <span>
                <nuxt-link :to="{ path: '/app/qa/testcase/add' ,query: { 'product_code': selected_product }}">
                  <button type="btn" class="btn btn-create"> + 创建 </button>
                </nuxt-link>
              </span>
            </div>
          </div>

          <div class="row ml-2 mr-5 hiddenSearch" style="border-bottom:1px solid #C5CAE9"
            :class="{ showSearch: isShowSearch }">
            <div class="col-md-10 col-10">
              <input type="text" id="bugSearchInput" class="form-control border-none pt-3" 
                placeholder="请输入ID或标题关键字进行搜索..." 
                v-model.trim="wd" @keyup.enter="goSearch()" autofocus />
            </div>
            <div class="col-md-2 col-2 pt-2 text-center">
              <button type="button" class="btn text-90" @click="goSearch()">搜索</button>
            </div>
          </div>


          <div id="testcase-data" class="row mt-3">
            <div class="col">
              <el-table :data='tableData' :default-sort="{prop: 'date', order: 'descending'}" 
                @cell-mouse-enter="tableHover" @cell-mouse-leave="tableLeave">
                <el-table-column label='ID' prop='id' width='60'></el-table-column>
                <el-table-column label='优先级' sortable width='100'>
                  <template slot-scope="scope">
                    <span v-if="scope.row.priority === 'P1'" class="text-deadly">
                      <span class="circle circle-deadly"></span>&nbsp;&nbsp;{{ scope.row.priority }}
                    </span>
                    <span v-else-if="scope.row.priority === 'P2'" class="text-urgency">
                      <span class="circle circle-urgency"></span>&nbsp;&nbsp;{{ scope.row.priority }}
                    </span>
                    <span v-else class="text-secondary">
                      <span class="circle circle-secondary"></span>&nbsp;&nbsp;{{ scope.row.priority }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label='标题' show-overflow-tooltip>
                  <template slot-scope="scope">
                    <nuxt-link style="color:#424242"
                      :to="{path:'/app/qa/testcase/deatils',query:{'case_id':scope.row.case_id}}">
                      {{ scope.row.title }}
                    </nuxt-link>
                  </template>
                </el-table-column>
                <el-table-column label='评审' width='90'>
                  <template slot-scope="scope">
                    <span v-if="scope.row.isReview === 0">-</span>
                    <span v-if="scope.row.isReview === 1">通过</span>
                    <span v-if="scope.row.isReview === 2">失败</span>
                  </template>
                </el-table-column>
                <el-table-column label='状态' width='60'>
                  <template slot-scope="scope">
                    <span v-if="scope.row.status === 1">失效</span>
                    <span v-else></span>
                  </template>
                </el-table-column>
                <el-table-column label='变更' width='60'>
                  <template slot-scope="scope">
                    <span v-if="scope.row.isChange === 1">是</span>
                    <span v-if="scope.row.isChange === 0">否</span>
                  </template>
                </el-table-column>
                <el-table-column label='创建' sortable width='100'>
                  <template slot-scope="scope">
                    <span :class="{ 'hideText' : scope.row.case_id === HoverTestcase_id }">
                      {{ scope.row.creator }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label='' width="40">
                  <template slot-scope="scope">
                    <div class="tableOpreate pt-2" 
                      :class="{ 'showCaseOpreate' : scope.row.case_id === HoverTestcase_id}">
                      <button v-if="scope.row.status === 0 && Rules.fall" @click="handleFall(scope.row)">
                        <i class="iconfont icon-clear icon-8a8a8a size-1-5"></i>
                      </button>
                      <button v-if="scope.row.status === 0 && Rules.edit" @click="handleEdit(scope.row)">
                        <i class="iconfont icon-edit icon-8a8a8a size-1-5"></i>
                      </button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>

          <!-- 翻页 -->
          <Pagination :total="total" @PsPn="getPsPn"></Pagination>

          <!-- loading -->
          <div id="page-loading" class="row" v-if='total === null'>
            <div class="col text-center">
              <loading></loading>
            </div>
          </div>

          <!-- no data -->
          <div id="page-error" class="row" v-if="total === 0">
            <div id="page-no-data" class="col text-center">
              <img :src="img_src" class="mt-5 pt-5">
              <p class="text-gray no-hint">{{ Msg }}</p>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- 测试用例统计 -->
    <div id="modal-my-today" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content pt-5">
          <div id="test">
            <div class="modal-body text-center pb-5" v-if="MyTodayData">
              <h5 class="countdata-title">今日工作</h5>
              <div class="row mt-5">
                <div class="col">
                  <p class="countdata-num" style="color:#20C997">{{ MyTodayData.create }}</p>
                  <p class="countdata-desc">我今天创建的测试用例</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="m-import-export" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content pt-5">
          <div id="test">
            <div class="modal-body text-center pb-5" v-if="MyTodayData">
              <h5 class="countdata-title">测试用例导入导出</h5>
              <div class="row mt-5">
                <div class="col">
                  <p class="countdata-num" style="color:#20C997">{{ MyTodayData.create }}</p>
                  <p class="countdata-desc">测试用例</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
import loading from "~/components/loading"
import Pagination from "~/components/Pagination"
import util from "~/assets/js/util.js"
import rules from "~/assets/js/rules.js"

export default {
  head() {
    return {
      title: "HDesk - 测试用例"
    }
  },

  layout: "head",
  components: {
    loading,
    Pagination
  },
  data() {
    return {
      // 产品、版本
      product_list: [],
      selected_product: null,
      m2_id: null,
      m1_id: null,
      status_list: [
        { status_name: "正常", status_value: 0 },
        { status_name: "无效", status_value: 1 }
      ],
      selected_status: this.$route.query.status || 0,
      // Bug: 表格数据
      total: null,
      pageNumber: this.$route.query.pageNumber ||  1,
      pageSize: this.$route.query.pageSize || 10,
      tableData: [],
      Msg: false,
      img_src: null,
      // Bug: 搜索
      wd: this.$route.query.wd || null,
      isShowSearch: this.$route.query.wd ? true : false,
      // 控制显示
      HoverTestcase_id: "",
      // 数据统计
      MyTodayData: {},
      // stree
      filterText: "",
      modules_list: [],
      defaultProps: {
        children: "children",
        label: "label"
      }
    }
  },

  filters: {
    date: util.date,
    FilterCaseStatus: util.FilterCaseStatus
  },

  computed: {
    // 权限控制
    Rules: function() {
      return rules.TestCaseRules(this.$store.state.userInfo)
    },

    // 查询条件
    QueryBuilder: function() {
      var QueryBuilder = {}
      // QueryBuilder
      QueryBuilder["pageNumber"] = this.pageNumber
      QueryBuilder["pageSize"] = this.pageSize
      QueryBuilder["product_code"] = this.selected_product
      QueryBuilder["status"] = this.selected_status
      this.m2_id ? (QueryBuilder["m2_id"] = this.m2_id) : null
      this.wd ? (QueryBuilder["wd"] = this.wd) : null
      return QueryBuilder
    },
    // 最后一页
    LastPage: function() {
      return Math.ceil(this.total / this.pageSize)
    },
    // userinfo group
    uGroup: function() {
      return this.$store.state.userInfo.group === "test" ? this.$store.state.userInfo.group : null
    }
  },

  watch: {
    QueryBuilder: function(val, oldVal) {
      this.tableData = []
      this.wd ? this.goSearch() : this.getCaseList()
      this.$router.replace({
        path: "/app/qa/testcase",
        query: this.QueryBuilder
      })
    },
    product_list: function(val, oldVal) {
      if ((this.product_list.length > 0) & !this.selected_product) {
        this.selected_product = this.product_list[0]["product_code"]
      }
    },
    selected_product: function(val, oldVal) {
      this.getModule()
    },
    total: function() {
      if (this.total === 0) {
        this.img_src = require("static/pic/happy.png")
        this.Msg = "没找到数据"
      }
    },
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },

  created() {
    var query = this.$route.query
    if (query["product_code"]) {
      this.selected_product = query["product_code"]
    }
    this.getProductRelease()
  },

  methods: {
    getPsPn: function(ps, pn) {
      this.pageSize = ps
      this.pageNumber = pn
    },
    // get product info and release info
    getProductRelease() {
      axios.get("/api/pm/product_release")
        .then(res => {
          if (res.data["status"] === 20000) {
             this.product_list = res.data["data"]
          } else {
             this.Msg = res.data["msg"]
          }
        })
        .catch(res => {})
    },

    // 获取所有模块
    getModule() {
      axios.get("/api/pm/get_module?product_code=" + this.selected_product)
        .then(res => {
          if (res.data["status"] === 20000) {
             this.modules_list = res.data["data"]
          } else {
             this.Msg = res.data["msg"]
          }
        })
    },

    clickMoudle1 (data) {
      if (this.m1_id == data.id) {
        this.m1_id = ''
        this.m2_id = ''
      } else {
        this.m1_id = data.id
      }
    },
    clickMoudle2 (data) {
      if (this.m2_id == data.id) {
        this.m2_id = ''
      } else {
        this.m2_id = data.id
      }
    },

    click_all_modules() {
      this.m1_id = null
      this.m2_id = null
    },

    // 下拉相关操作
    handleCommand(data) {
      if ("product_code" in data) {
        this.selected_product = data["product_code"]
      }
      if ("status_value" in data) {
        this.selected_status = data["status_value"]
        console.log(this.selected_status)
      }
    },

    // TestCase: 数据列表
    getCaseList() {
      axios.get("/api/qa/testcase/list", { params: this.QueryBuilder })
        .then(res => {
          if (res.data["status"] === 20000) {
             this.tableData = res.data["data"]
             this.total = res.data["total"]
          } else {
             this.Msg = res.data["msg"]
          }
        })
    },

    // Testcase: 失效操作
    handleFall(data) {
      let case_id = data.case_id
      axios.get("/api/qa/testcase/fall?case_id=" + case_id)
        .then(res => {
          if (res.data["status"] === 20000) {
            this.getCaseList()
            this.$notify.success({ title: "成功", message: res.data["msg"] })
          } else {
            this.$notify.error({ title: "成功", message: res.data["msg"] })
          }
        })
    },

    // Testcase: 编辑操作
    handleEdit(data) {
      let case_id = data.case_id
      this.$router.push("/app/qa/testcase/edit?case_id=" + case_id)
    },

    // Testcase: 评审
    CaseReview(data) {
      this.review_data.result = data
      this.review_data.case_id = this.CaseDetails.case_id
      axios({
        method: "post",
        url: "/api/qa/testcase/review",
        data: JSON.stringify(this.review_data)
      }).then(res => {
        if (res.data["status"] === 20000) {
          $("#ModalCaseReview").modal("hide")
           this.$router.go(-1)
           this.$notify.success({ title: "成功", message: res.data["msg"] })
        } else {
           this.$notify.error({ title: "失败", message: res.data["msg"] })
        }
      })
    },

    // Testcase: 搜索
    clickSearch() {
      if (this.isShowSearch) {
        this.isShowSearch = false
        this.wd = null
        this.getBugList()
      } else {
        this.isShowSearch = true
      }
    },

    goSearch() {
      axios.get("/api/qa/testcase/search", { params: this.QueryBuilder })
        .then(res => {
          if (res.data["status"] === 20000) {
            this.tableData = res.data["data"]
            this.total = res.data["total"]
          } else {
            this.total = 0
            this.tableData = []
            this.Msg = res.data["msg"]
          }
        })
        .catch((error) => {})
    },

    // my today
    myToday() {
      $("#modal-my-today").modal("show")
      axios("/api/analyze/testcase/my_today").then(res => {
        if (res.data["status"] === 20000) {
           this.MyTodayData = res.data["data"]
        }
      })
    },

    // table line hover and leave
    tableHover(row) {
      this.HoverTestcase_id = row.case_id
    },
    tableLeave(row) {
      this.HoverTestcase_id = ""
    }
  }
}
</script>

<style>
  @import "~/static/static/common/css/test.css"
</style>