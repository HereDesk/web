<template>
  <div id="page-case" class="container-fluid">

    <template v-if='page_loading_status'>
      <PageLoading></PageLoading>
    </template>

    <template v-else>
      <div class="row pt-5">

        <ProductModules
          :product_id="product_id"
          :Rules="Rules"
          :query_type="'bug'"
          @getShowModules="getShowModules"
          @getM1M2="getM1M2">
        </ProductModules>

        <!-- 数据列表 -->
        <div id="data-case" :class="[isShowModules ? 'col-lg-10 col-md-12' : 'col-sm-12 col-md-10']">
          <div class="container-fluid">

            <!-- 测试用例查询相关 -->
            <div id="case-head" class="row align-items-center">
              <div id="case-query" class="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-12">

                <ProductInfo :ptype="'case_index'" :showStyle="'dropdown'" @ProductInfo="GetProductInfo">
                </ProductInfo>

                <el-dropdown id="case-query-status" class="pt-2 pl-3" trigger="click">
                  <span>
                    <span class="el-dropdown-desc">状态：</span>
                    <span class="el-dropdown-link bg-edown">
                      {{ selected_status | FilterCaseStatus }}
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(item,index) in status_list" :key="index" :value="item.status_value">
                      <span @click="selected_status = item.status_value">{{ item.status_name }}</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
              <div id="case-search" class="col-xl-3 col-lg-8 col-md-8 col-sm-8 col-12">
                <div class="input-group align-items-center">
                  <div id="ordinary-search" class="input-group-prepend">
                    <span class="input-group-text" style="height: calc(2.05rem + 2px);">
                      <i class="iconfont icon-search icon-E0E0E0"></i>
                    </span>
                  </div>
                  <input id="search-input" type="text" class="form-control search-control"
                    placeholder="搜索ID、或标题..."
                    v-model="wd">
                </div>
              </div>
              <div id="case-action" class="col-xl-3 col-lg-4 col-md-4 col-sm-4 col-12">
                <span title="导入导出" class="mr-3" @click="showModal = 'export'">
                  <i class="iconfont icon-import-export icon-8a8a8a size-1-8"></i>
                </span>
                <span title="测试用例统计" class="mr-3" @click="myToday()">
                  <i class="iconfont icon-web-icon- icon-8a8a8a size-2"></i>
                </span>
                <span title="切换样式" class="mr-3" @click="switchStyle()">
                  <i class="iconfont icon-table-list icon-8a8a8a size-1-5"></i>
                </span>
                <span v-if="Rules.case_create" style="padding-top: -5px;">
                  <nuxt-link :to="{ path: '/app/qa/testcase/add',query: { 'product_id': product_id }}" >
                    <button type="btn" class="btn-create"> + 创建 </button>
                  </nuxt-link>
                </span>
              </div>
            </div>

            <!-- 展示样式：表格 -->
            <div id="case-table-style" class="row mt-3" v-if="DataShowStyle == 'table'">
              <div class="col">
                <el-table :data='tableData' :default-sort="{prop: 'date', order: 'descending'}"
                  @cell-mouse-enter="tableHover" @cell-mouse-leave="tableLeave">
                  <el-table-column label='ID' prop='id' width='60'></el-table-column>
                  <el-table-column label='优先级' sortable width='100'>
                    <template slot-scope="scope">
                      <span class="circle-content"
                        :class="{ 'text-deadly': scope.row.priority == 'P1','text-urgency': scope.row.priority == 'P2' }">
                        {{ scope.row.priority }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column label='用例标题' show-overflow-tooltip>
                    <template slot-scope="scope">
                      <nuxt-link style="color:#424242" :to="{path:'/app/qa/testcase/deatils',query:{'case_id':scope.row.case_id}}">
                        {{ scope.row.title }}
                      </nuxt-link>
                    </template>
                  </el-table-column>
                  <el-table-column label='评审' width='70'>
                    <template slot-scope="scope">
                      {{ scope.row.is_review === 0 ? '-' : scope.row.isReview === 1 ? '通过' : '未通过' }}
                    </template>
                  </el-table-column>
                  <el-table-column label='状态' width='65'>
                    <template slot-scope="scope">
                      {{ scope.row.status === 1 ? '无效' : '' }}
                    </template>
                  </el-table-column>
                  <el-table-column label='变更' width='60'>
                    <template slot-scope="scope">
                      {{ scope.row.is_change === 1 ? '是' : '-' }}
                    </template>
                  </el-table-column>
                  <el-table-column label='创建' prop="creator" sortable width='100'></el-table-column>
                  <el-table-column label='最后更新时间' sortable width='165'>
                    <template slot-scope="scope">
                      <span :class="{ 'hideText' : scope.row.case_id === HoverTestcase_id }">
                        {{ scope.row.last_time | date(6) }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column label='' width="30">
                    <template slot-scope="scope">
                      <div class="display-none pt-2"
                        :class="{ 'showDataOpreate' : scope.row.case_id === HoverTestcase_id}">
                        <span v-if="scope.row.status === 0 && CaseBtnRules.fall" @click="handleFall(scope.row)">
                          <i class="iconfont icon-delete icon-8a8a8a size-1-5"></i>
                        </span>
                        <span class="ml-3" v-if="scope.row.status === 0 && CaseBtnRules.edit" @click="handleEdit(scope.row)">
                          <nuxt-link :to="{path:'/app/qa/testcase/edit',query:{'case_id':scope.row.case_id}}">
                            <i class="iconfont icon-edit icon-8a8a8a size-1-5"></i>
                          </nuxt-link>
                        </span>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>

            <!-- 展示样式：列表 -->
            <div id="case-list-style" class="row mt-3" v-if="DataShowStyle == 'list'">
              <div class="col">
                <ul class="pl-0 ul-none-2">
                  <li v-for="(item,index) in tableData" :Key="index" :id="item.case_id">
                    <p>
                      <nuxt-link style="color:#424242"
                        :to="{path:'/app/qa/testcase/deatils',query:{'case_id':item.case_id}}">
                        {{ item.id }}. {{ item.title }}
                      </nuxt-link>
                    </p>
                    <div id="data-case-info" class="my-2">
                      <div id="data-detailed-information" class="data-liststyle-satellite">
                        <span class="circle-content" :class="{ 'text-deadly': item.priority == 'P1',
                        'text-urgency': item.priority == 'P2' }">
                          &nbsp;{{ item.priority }}
                        </span>
                        <span>
                          #&nbsp;{{ item.isReview === 0 ? '未评审' : item.isReview === 1 ? '评审通过' : '未通过评审' }}
                        </span>
                        <span>@创建: {{ item.creator }}-{{ item.create_time | date(5) }}</span>
                        <span>最后更新: {{ item.last_time | date(5) }}</span>
                      </div>
                      <div id="data-case-action" class="float-right display-inline action" style="margin-top:-1.7rem;">
                        <span class="mr-2" v-if="item.status === 0 && CaseBtnRules.fall" @click="handleFall(item)">
                          <i class="iconfont icon-delete icon-8a8a8a size-1-3" title="无效"></i>
                        </span>
                        <span v-if="item.status === 0 && CaseBtnRules.edit" @click="handleEdit(item)">
                          <i class="iconfont icon-edit icon-8a8a8a size-1-3" title="编辑"></i>
                        </span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <!-- 翻页 -->
            <Pagination :total="total" @PsPn="getPsPn"></Pagination>

            <!-- 无数据样式 -->
            <div id="page-error" class="row" v-if="total === 0 || Msg">
              <div id="page-no-data" class="col text-center">
                <img :src="img_src" class="mt-5 pt-5">
                <p class="text-gray no-hint">{{ Msg }}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </template>

    <!-- 测试用例统计 -->
    <Modal id="modal-my-today" v-if="showModal == 'count-today'"
      @close="showModal = false" :isHeaderClose="true">
      <h5 slot="header" class="modal-title">{{ selected_product }}</h5>
      <div slot="body" class="text-center mb-3">
        <div class="row mt-3 mb-5">
          <div class="col">
            <p class="countdata-num" style="color:#20C997">{{ MyTodayData.create || 0 }}</p>
            <p class="countdata-desc">我今天创建的测试用例</p>
          </div>
        </div>
      </div>
    </Modal>

    <!-- 用例导入导出 -->
    <Modal id="modal-export" v-if="showModal == 'export'" @close="showModal = false" :isHeaderClose="true">
      <h5 slot="header" class="modal-title">{{ selected_product }} 测试用例</h5>
      <div slot="body">
        <div class="row">
          <div class="col text-center">
            <button type="button" class="btn btn-dark mt-3 mb-5" @click="case_export">数据导出</button>
            <p v-if="JSON.stringify(ExportFile) !== '{}'">
              下载地址: <a :href="ExportFile.url">{{ ExportFile.filename }}</a>
            </p>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <p style="font-size:0.88rem;color:#424242;">
              备注：仅支持按照产品、模块这两个查询条件导出; 选择好查询条件，再点击导出; 目前仅支持导出xlsx
            </p>
          </div>
        </div>
      </div>
    </Modal>

  </div>
</template>

<script>
import ProductModules from "~/components/ProductModules"

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
    ProductModules
  },

  data() {
    return {
      // 左侧项目模块
      isShowModules: false,
      page_loading_status: false,
      showModal: false,
      ScreenWidth: 0,
      // 产品、版本
      product_id: this.$route.query.product_id || '',
      selected_product: this.$route.query.product_code || null,
      m1_id: this.$route.query.m1_id || null,
      m2_id: this.$route.query.m2_id || null,
      status_list: [
        { status_name: "正常", status_value: 0 },
        { status_name: "无效", status_value: 1 }
      ],
      selected_status: this.$route.query.status || 0,
      // Bug: 表格数据
      total: null,
      pageNumber: parseInt(this.$route.query.pageNumber) || 1,
      pageSize: parseInt(this.$route.query.pageSize) || 10,
      tableData: [],
      Msg: "",
      img_src: null,
      // Bug: 搜索
      wd: this.$route.query.wd || null,
      isShowSearch: this.$route.query.wd ? true : false,
      // 控制显示
      HoverTestcase: {},
      HoverTestcase_id: "",
      // 数据统计
      MyTodayData: {},
      ExportFile: {}
    }
  },

  filters: {
    date: util.date,
    FilterCaseStatus: util.FilterCaseStatus
  },

  computed: {
    // 权限控制
    CaseBtnRules: function() {
      return rules.TestCaseBtnRules(this.$store.state.userInfo,this.HoverTestcase)
    },
    Rules: function() {
      let userInfo = this.$store.state.userInfo
      let PagesRules = this.$store.state.PageData
      return rules.RuleManges(userInfo,PagesRules)
    },

    // 查询条件
    QueryBuilder: function() {
      let Builder = {}
      Builder["pageNumber"] = this.pageNumber
      Builder["pageSize"] = this.pageSize
      Builder["product_id"] = this.product_id
      Builder["status"] = this.selected_status
      this.m1_id ? (Builder["m1_id"] = this.m1_id) : null
      this.m2_id ? (Builder["m2_id"] = this.m2_id) : null
      this.wd ? (Builder["wd"] = this.wd) : null
      return Builder
    },

    // userinfo group
    uGroup: function() {
      return this.$store.state.userInfo.role === "test" ? this.$store.state.userInfo.role : null
    },

    // show user config: about data style:  table and list
    DataShowStyle: function() {
      let config = this.$store.state.UserConfig
      if (config) {
        if (config["CASE_DATA_SHOW_STYPE"]) {
          return this.ScreenWidth > 768 ? config["CASE_DATA_SHOW_STYPE"] : 'list'
        } else {
          return this.ScreenWidth > 768 ? 'table' : 'list'
        }
      } else {
        return this.ScreenWidth > 768 ? 'table' : 'list'
      }
    }

  },

  watch: {
    wd: function(val, oldVal) {
      this.pageNumber = 1
    },
    m1_id: function(val, oldVal) {
      this.pageNumber = 1
    },
    m2_id: function(val, oldVal) {
      this.pageNumber = 1
    },

    // 查询条件
    QueryBuilder: function(val, oldVal) {
      this.tableData = []
      this.wd ? this.goSearch() : this.getCaseList()
      this.$route.query.product_code
        ? this.$router.push({path: "/app/qa/testcase",query: this.QueryBuilder})
      	: this.$router.replace({path: "/app/qa/testcase",query: this.QueryBuilder})
    },
    total: function() {
      if (this.total === 0) {
        this.img_src = require("static/images/happy.png")
        this.Msg = "没找到数据"
      } else {
        this.Msg = ""
      }
    }
  },

  mounted() {
    this.page_loading_status = false
    this.wd ? this.goSearch() : this.getCaseList()
    this.ScreenWidth = process.server ? 0 : document.body.clientWidth
  },

  methods: {
    // get $emit data
    getShowModules(isShowModules) {
      this.isShowModules = isShowModules
    },

    GetProductInfo (data)  {
      this.product_id = data.product_id
      this.selected_product = data.product_code
      if (Boolean(data.PageMsg)) {
        this.Msg = data.PageMsg
        this.img_src = require("static/images/happy.png")
      }
    },

    getPsPn: function(ps, pn) {
      this.pageSize = ps
      this.pageNumber = pn
    },
    getM1M2: function(m1, m2) {
      this.m1_id = m1
      this.m2_id = m2
    },

    /**
     * 测试用例列表
     */
    getCaseList() {
      if (!this.product_id) { return }
      this.axios
        .get("/api/qa/testcase/list", { params: this.QueryBuilder })
        .then(res => {
          if (res.data["status"] === 20000) {
            this.tableData = res.data["data"]
            this.total = res.data["total"]
          } else {
            this.$notify.success({
              title: "错误", message: res.data["msg"]
            })
          }
        })
    },

    /**
     * 测试用例失效
     */
    handleFall(data) {
      let case_id = data.case_id
      this.axios
        .get("/api/qa/testcase/fall?case_id=" + case_id)
        .then(res => {
          if (res.data["status"] === 20000) {
            this.getCaseList()
            this.$notify.success({ title: "成功", message: res.data["msg"] })
          } else {
            this.$notify.error({ title: "成功", message: res.data["msg"] })
          }
        })
    },

    /**
     * @param {string} case_id
     * 测试用例编辑
     */
    handleEdit(data) {
      let case_id = data.case_id
      this.$router.push("/app/qa/testcase/edit?case_id=" + case_id)
    },

    /**
     * 测试用例评审
     */
    CaseReview(data) {
      this.review_data.result = data
      this.review_data.case_id = this.CaseDetails.case_id
      this.axios({
        method: "post",
        url: "/api/qa/testcase/review",
        data: JSON.stringify(this.review_data)
      }).then(res => {
        if (res.data["status"] === 20000) {
          this.$router.go(-1)
          this.$notify.success({ title: "成功", message: res.data["msg"] })
        } else {
          this.$notify.error({ title: "失败", message: res.data["msg"] })
        }
      })
    },

    /**
     * 测试用例搜索
     */
    goSearch() {
      this.axios
        .get("/api/qa/testcase/search", { params: this.QueryBuilder })
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

    /**
     * 测试用例统计
     */
    myToday() {
      this.showModal = 'count-today'
      if (!this.product_id) { return }
      this.axios
        .get("/api/analyze/testcase/my_today?product_id=" + this.product_id)
        .then(res => {
          if (res.data["status"] === 20000) {
            this.MyTodayData = res.data["data"]
          }
      })
    },

    /**
     * 测试用例导出excel
     */
    case_export () {
      if (!this.product_id) { return }
      this.axios
        .get("/api/qa/testcase/export", { params: this.QueryBuilder })
        .then( res => {
          if (res.data["status"] === 20000) {
            this.ExportFile = res.data
          } else {
            this.$notify.warning({ title: "提示", message: res.data["msg"] })
          }
        }
      )
    },

    // table line hover and leave
    tableHover(row) {
      this.HoverTestcase = row
      this.HoverTestcase_id = row.case_id
    },
    tableLeave(row) {
      this.HoverTestcase = {}
      this.HoverTestcase_id = ""
    },

    /**
     * 切换数据样式 (表格|列表)
     */
    switchStyle() {
      let style = this.DataShowStyle == 'table' ? 'list' : 'table'
      this.axios
        .get('/api/userconfig?CASE_DATA_SHOW_STYPE=' + style)
        .then(res => {
          if (res.data["status"] === 20000) {
            this.$store.dispatch('getUserInfo')
          }
      })
    }

  }
}
</script>

<style>
  @import "~/assets/css/test.css"
</style>
