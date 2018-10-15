<template>
	<div id="page-bug" class="py-5 container-fluid">
    
    <div class="row">
      <div id="about-modules" class="col-xl-2 col-lg-3 col-md-3 col-sm-12 col-12  pt-3 pg-modules">
        <div>
          <div class="mb-3">
            <p class="pl-4 display-inline" v-if="!modules_list.length">
              <nuxt-link class="display-inline" :to="{ path: '/app/products/modules',query: {'product_code': selected_product } }">
                <span style="color:#2b2b2b;" title="维护模块">维护模块</span>
              </nuxt-link>
            </p>
            <p class="pl-4 display-inline" :class="{ 'el-active' : !m1_id && !m2_id }" @click="click_all_modules()" v-else>显示全部</p>
            <nuxt-link class="display-inline manage-modules" :to="{ path: '/app/products/modules',query: {'product_code': selected_product } }">
              &nbsp;&nbsp;&nbsp;&nbsp;<i class="iconfont icon-40 icon-8a8a8a size-1-5"></i>
            </nuxt-link>
          </div>
          <div class="divider"></div>
          <div class="t-modules-list mt-3">
            <ul v-for="item1 in modules_list" :key="item1.id" class="pl-4">
              <li :id="item1.id">
                <span class="line-height-1-8 li-color" :class="{ 'el-active': m1_id == item1.id }" @click="clickMoudle1(item1)">
                  <i class="iconfont icon-8a8a8a" :class="[ m1_id == item1.id ? 'icon-xiaotuziCduan_' : 'icon-xiaotuziCduan_2' ]"></i>&nbsp;&nbsp;{{ item1.label }}
                </span>
                <ul class="ul-display pl-5 mt-3" v-if="m1_id == item1.id">
                  <li v-for="item2 in item1.children" :key="item2.id" :id="item1.id" style="line-height:2.5rem;" @click="clickMoudle2(item2)">
                    <span class="li-color" :class="{ 'el-active': m2_id == item2.id }">{{ item2.label }}</span>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 查询以及操作相关 -->
      <div class="col-xl-10 col-lg-9 col-md-9 col-sm-12 col-12 px-5">
        <div id="bug-manage" class="row justify-content-between">
          <div id="bug-query">
            <el-dropdown id="page-query-product" class="mr-3 my-3" trigger="click">
              <span>
                <span class="el-dropdown-desc">产品：</span>
                <span class="el-dropdown-link bg-edown">
                  {{ selected_product }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for='item in product_list' :key="item.id">
                  <span @click="handleCommand(item)">{{ item.product_code }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown id="page-query-version" class="mr-3 my-3" trigger="click">
              <span>
                <span class="el-dropdown-desc">版本：</span>
                <span class="el-dropdown-link bg-edown">
                  {{ selected_release | FilterVersion }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in release_list" :key="item.id">
                  <span @click="handleCommand(item)">{{ item.version }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown id="page-query-bugstatus" class="mr-3 my-3" trigger="click">
              <span>
                <span class="el-dropdown-desc">状态：</span>
                <span class="el-dropdown-link bg-edown">
                  {{ selected_status | bugStatusName }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in status_list" :key="item.id">
                  <span @click="handleCommand(item)">{{ item.code | bugStatusName }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown id="page-query-bugstatus" class="mr-3 my-3" trigger="click">
              <span>
                <span class="el-dropdown-desc">优先级：</span>
                <span class="el-dropdown-link bg-edown">
                  {{ selected_priority == 'all' ? "全部" : selected_priority }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in priority_list" :key="item.id">
                  <span @click="handleCommand(item)">{{ item.pname }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown id="page-query-quick" class="mr-3 my-3" trigger="click">
              <span>
                <span class="el-dropdown-desc">快捷操作：</span>
                <span class="el-dropdown-link bg-edown">
                  {{ operate | QuickQperationName }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in QuickQperationList" :key="item.id">
                  <span :id="item.value" @click="SwitchOperate(item)">{{ item.value | QuickQperationName }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>

          <div class="vertical-center">
            <span class="searchIcon mr-4" @click="clickSearch()">
              <i class="iconfont icon-search size-1-3 icon-8a8a8a"></i>
            </span>
            <span  class="searchIcon mr-4" title="今日成就" @click="myToday()">
              <i class="iconfont icon-web-icon- icon-8a8a8a size-2"></i>
            </span>
            <nuxt-link to="/app/qa/bug/add">
              <button type="btn" class="btn btn-create"> + 创建 </button>
            </nuxt-link>
          </div>
        </div>

        <div class="row mt-3 hiddenSearch" :class="{ showSearch: isShowSearch }" style="border-bottom:1px solid #C5CAE9">
          <div class="col-xl-3 col-lg-3 col-md-4 col-sm-5 col-12 pr-0 text-center">
            <el-dropdown id="page-query-product" class="mx-3 my-3" trigger="click">
              <span class="el-dropdown-link bg-edown bg-white text-center">
                {{ SearchCriteria.SearchType  | filterSearchType }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for='item in SearchType' :key="item.id">
                  <span @click="handleCommand(item)">{{ item.tname }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown id="page-query-version" class="mx-3 my-3" trigger="click">
              <span class="el-dropdown-link bg-edown bg-white text-center" style="font-weight:500">
                {{ SearchCriteria.Operators | filterOperators }}
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in OperatorsList" :key="item.id">
                  <span @click="handleCommand(item)">{{ item.OperatorsName }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="col-xl-8 col-lg-8 col-md-6 col-sm-6 col-12 pt-2">
            <input v-if="isShowInput === 'other'" type="text" id="bugSearchInput" class="form-control border-none pt-3" :placeholder="placeholder" v-model.trim="wd" @keyup.enter="goSearch(SearchBuilder)" autofocus />
            <input v-if="isShowInput === 'date'" type="date" class="border-none text-90 pt-3" v-model="SearchCriteria.start_date">
            <input v-if="isShowInput === 'date_range'" type="date" class="border-none text-90 pt-3" v-model="SearchCriteria.start_date">
            <input v-if="isShowInput === 'date_range'" type="date" class="border-none text-90 pt-3" v-model="SearchCriteria.end_date">
          </div>
          <div class="col-xl-1 col-lg-1 col-md-2 col-sm-1 col-12 pt-4  text-center">
            <button type="button" class="btn text-90" @click="goSearch(SearchBuilder)">搜索</button>
          </div>
        </div>

        <!-- table: 数据展示 -->
        <div id="bug-list" class='row mt-3 mb-5 table_data'>
          <div class='col-xl-12 col-lg-12 col-md-12'>
            <el-table :data='tableData' :default-sort="{prop: 'date', order: 'descending'}" @cell-mouse-enter="tableHover" @cell-mouse-leave="tableLeave">
              <el-table-column label='ID' prop='id' sortable width='70'></el-table-column>
              <el-table-column label='状态' width='100'>
                <template slot-scope="scope">
                  <span v-if="scope.row.status === 'Closed'" class="text-secondary">
                    <span class="circle circle-secondary"></span>&nbsp;&nbsp;{{ scope.row.status_name }}
                  </span>
                  <span v-else-if="scope.row.status === 'New'" class="text-urgency">
                    <span class="circle circle-urgency"></span>&nbsp;&nbsp;{{ scope.row.status_name }}
                  </span>
                  <span v-else-if="scope.row.status === 'Open'" class="text-urgency">
                    <span class="circle circle-urgency"></span>&nbsp;&nbsp;{{ scope.row.status_name }}
                  </span>
                  <span v-else-if="scope.row.status === 'Reopen'" class="text-urgency">
                    <span class="circle circle-urgency"></span>&nbsp;&nbsp;{{ scope.row.status_name }}
                  </span>
                  <span v-else-if="scope.row.status === 'Fixed'" class="text-success">
                    <span class="circle circle-success"></span>&nbsp;&nbsp;{{ scope.row.status_name }}
                  </span>
                  <span v-else-if="scope.row.status === 'Hang-up'" class="text-warning">
                    <span class="circle circle-warning"></span>&nbsp;&nbsp;{{ scope.row.status_name }}
                  </span>
                  <span v-else>{{ scope.row.status_name }}</span>
                </template>
              </el-table-column>
              <el-table-column label='标题' show-overflow-tooltip>
                <template slot-scope="scope">
                  <nuxt-link :to="{path:'/app/qa/bug/deatils',query:{'bug_id':scope.row.bug_id}}" style="color:#424242">
                  {{ scope.row.title }}
                  </nuxt-link>
                </template>
              </el-table-column>
              <el-table-column label='优先级' width='85'>
                <template slot-scope="scope">
                  <div @click="BugPriorityDialog(scope.row)">
                    <span v-if="scope.row.priority === 'P1'" class="text-deadly">
                      <span class="circle circle-deadly"></span>&nbsp;&nbsp;{{ scope.row.priority }}
                    </span>
                    <span v-else-if="scope.row.priority === 'P2'" class="text-urgency">
                      <span class="circle circle-urgency"></span>&nbsp;&nbsp;{{ scope.row.priority }}
                    </span>
                    <span v-else class="text-secondary">
                      <span class="circle circle-secondary"></span>&nbsp;&nbsp;{{ scope.row.priority }}
                    </span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label='创建' prop='creator_user' sortable width='90' show-overflow-tooltip></el-table-column>
              <el-table-column label='创建时间' width='120'>
                <template slot-scope="scope">
                  <span>{{ scope.row.create_time | date(5) }}</span>
                </template>
              </el-table-column>
              <el-table-column label='指派' prop='assignedTo_user' sortable width='90' show-overflow-tooltip></el-table-column>
              <el-table-column label='解决方案' width='90'>
                <template slot-scope="scope">
                  <div :class="{ 'hideText' : scope.row.bug_id === HoverBugId && scope.row.status != 'Closed'}">
                    <span v-if="scope.row.solution_name === '已修复'" class="text-success">
                      <span class="circle circle-success"></span>&nbsp;&nbsp;{{ scope.row.solution_name }}
                    </span>
                    <span v-else class="text-secondary">
                      &nbsp;&nbsp;{{ scope.row.solution_name }}
                    </span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label='' width="50">
                <template slot-scope="scope">
                  <div class="tableOpreate" :class="{ 'showBugOpreate' : scope.row.bug_id === HoverBugId, 'hideText': scope.row.status === 'Closed'}">
                    <button @click="skipAssign(scope.row)">
                      <i class="iconfont icon-assign icon-8a8a8a size-2"></i>
                    </button>
                    <button @click="skipResolve(scope.row)" v-if="scope.row.status != 'Fixed'">
                      <i class="iconfont icon-resolve icon-8a8a8a size-1-6"></i>
                    </button>
                    <button @click="BugClosedDialog(scope.row)" v-if="uGroup">
                      <i class="iconfont icon-close-opera icon-8a8a8a size-1-5"></i>
                    </button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <!-- table: 翻页 -->
        <Pagination :total="total" @PsPn="getPsPn"></Pagination>

        <!-- loading -->
        <div id="page-loading" class="row">
          <div class="col text-center" v-if='total === null'>
            <loading></loading>
          </div>
        </div>

        <!-- no data -->
        <div id="page-error" class="row">
          <div id="page-no-data" class="col text-center" v-if="total === 0">
            <img :src="img_src" class="mt-5">
            <p class="text-gray no-hint">{{ Msg }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Bug处理操作：指派 -->
    <div id="bug-list-assign" v-if="showBugAssignBox">
      <BugAssign 
        v-bind:bug_id="selectedBugId" 
        v-bind:product_code="selected_product"
        v-bind:pageSource="pageSource"
        @refreshList="getBugList()">
      </BugAssign>
    </div>

    <!-- Bug处理操作：解决 -->
    <div id="bug-list-resolve" v-if="showBugResolveBox">
      <BugResolve
        v-bind:bug_id="selectedBugId"
        v-bind:OpenBy="HoverBugIdOpenBy"
        v-bind:product_code="selected_product"
        v-bind:pageSource="pageSource"
        v-bind:scheme="scheme"
        @refreshList="getBugList()">
      </BugResolve>
    </div>

    <!-- Bug处理操作：关闭 -->
    <div id="modal-bugClosed" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
        <div class="modal-content">
          <div class="modal-body text-center mt-5 mb-3">
            <h5 class="lead">确定关闭此缺陷?</h5>
          </div>
          <div class="modal-footer modal-footer-center">
            <button type="button" class="btn btn-cancel mr-5" data-dismiss="modal">以后</button>
            <button type="submit" class="btn btn-primary" @click="ClosedBug()">确定</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bug处理操作：修改优先级 -->
    <div id="modal-modify-priority" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">修改优先级</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body text-center">
            <ul class="ul-inline my-5">
              <li class="mr-5 text-150 font-weight-light" v-for="item in priority_list" :key="item.id" v-if="item.pvalue != 'all'" @click="ModifyPriority(item.pvalue)">
                {{ item.pvalue }}
              </li>
            </ul>
            <p class="my-3 text-gray">备注：选择后，即实现提交，无需进行其它操作</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 我的今天bug -->
    <div id="modal-my-today" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content py-5">
          <div id="developer" v-if="MyTodayData.group == 'developer'">
            <div class="modal-body text-center">
              <h5 class="countdata-title">今日</h5>
              <div class="row mt-5">
                <div class="col">
                  <p class="countdata-num">{{ MyTodayData.data.fixed }}</p>
                  <p class="countdata-desc">今日解决</p>
                </div>
                <div class="col">
                  <p class="countdata-num">{{ MyTodayData.data.residue }}</p>
                  <p class="countdata-desc">剩余待解决</p>
                </div>
              </div>
            </div>
          </div>
          <div id="test" v-else-if="MyTodayData.group == 'test'">
            <div class="modal-body text-center pb-5">
              <h5 class="countdata-title">今日工作情况</h5>
              <div class="row mt-5">
                <div class="col">
                  <p class="countdata-num text-success">{{ MyTodayData.data.create }}</p>
                  <p class="countdata-desc">创建</p>
                </div>
                <div class="col">
                  <p class="countdata-num text-success">{{ MyTodayData.data.closed }}</p>
                  <p class="countdata-desc">关闭</p>
                </div>
                <div class="col">
                  <p class="countdata-num text-red">{{ MyTodayData.data.hangUp }}</p>
                  <p class="countdata-desc">挂起延期</p>
                </div>
              </div>
            </div>
          </div>
          <div id="other" class="text-center my-5" v-else>
            <p>您没有相关数据哦</p>
          </div>
        </div>
      </div>
    </div>

	</div>
</template>

<script>
import axios from "axios"
import loading from "~/components/loading"
import BugAssign from "~/components/BugAssign"
import BugResolve from "~/components/BugResolve"
import Pagination from "~/components/Pagination"
import util from "~/assets/js/util.js"
import data from "~/assets/js/data.js"
import rules from "~/assets/js/rules.js"
let _ = require("lodash/Collection")

export default {
  head() {
    return {
      title: "HDesk - 缺陷列表"
    }
  },
  layout: "head",
  components: {
    loading,
    BugAssign,
    BugResolve,
    Pagination
  },

  data() {
    return {
      selectData: false,
      MyTodayData: {},
      // 产品、版本
      product_list: [],
      modules_list: [],
      modules_id: [null,null],
      m1_id: this.$route.query.m1_id || null,
      m2_id: this.$route.query.m2_id || null,
      selected_product: this.$route.query.product_code || null,
      selected_release: this.$route.query.release || "全部",
      // 缺陷状态
      status_list: data.bug_status_list,
      selected_status: this.$route.query.status || "all",
      // 优先级列表
      priority_list: data.priority_list,
      selected_priority: this.$route.query.priority || "all",
      // 更多操作
      operate: 'no',
      QuickQperationList: data.bug_quick_operation_list,
      // 搜索
      SearchType: data.bug_search_type_list,
      SearchCriteria: {
        Operators: "=",
        SearchType: "ID",
        start_date: null,
        end_date: null
      },
      wd: null,
      isShowSearch: false,
      // 表格数据
      total: null,
      pageNumber: this.$route.query.pageNumber || 1,
      pageSize: this.$route.query.pageSize || 10,
      tableData: [],
      Msg: false,
      img_src: null,
      // 控制显示
      isDisplayOperate: true,
      HoverBugId: "",
      selectedBugId: "",
      HoverBugIdOpenBy: "",
      // 组件
      showBugAssignBox: false,
      showBugResolveBox: false,
      scheme: "Fixed",
      pageSource: "page_bug_index",
      // close bug
      ClosedData: {
        bug_id: ""
      },
      ModifyPriorityData: {
        bug_id: "",
        priority: ""
      }
    }
  },

  filters: {
    date: util.date,
    filterOperators: util.getOperatorsName,
    filterSearchType: util.getSearchTypeName,
    bugStatusName: util.bugStatusName,
    QuickQperationName: util.QuickQperationName,
    FilterVersion: function (value) {
      if (value == 'all') {
        return '全部'
      } else {
        return value
      }
    }
  },

  computed: {
    developer_fixed_percentage: function() {
      if (this.MyTodayData.group == "developer") {
        var data = this.MyTodayData.data
        var num = (data.total - data.residue) / data.total * 100
        return num.toFixed(1)
      }
      return 0
    },
    // 版本列表
    release_list: function() {
      var arr = [{ version: "全部" }]
      if (this.selected_product) {
        for (var i in this.product_list) {
          if (this.selected_product === this.product_list[i]["product_code"]) {
            return arr.concat(this.product_list[i]["data"])
          }
        }
      } else {
        return null
      }
    },
    // 查询条件
    QueryBuilder: function() {
      var QueryBuilder = {}
      var tmp_release
      this.selected_release == "全部" ? (tmp_release = "all") : (tmp_release = this.selected_release)
      // QueryBuilder
      QueryBuilder["pageNumber"] = this.pageNumber
      QueryBuilder["pageSize"] = this.pageSize
      QueryBuilder["product_code"] = this.selected_product
      QueryBuilder["release"] = tmp_release
      QueryBuilder["status"] = this.selected_status
      QueryBuilder["priority"] = this.selected_priority
      this.m2_id ? QueryBuilder['m2_id'] = this.m2_id : null
      this.m1_id ? QueryBuilder['m1_id'] = this.m1_id : null
      if (this.operate != "no") {
        QueryBuilder["operate"] = this.operate
      }
      return QueryBuilder
    },
    // 搜索
    OperatorsList: function() {
      var search_type = this.SearchCriteria.SearchType
      var OperatorsList1 = [
        { OperatorsValue: "=", OperatorsName: "=" },
        { OperatorsValue: "!=", OperatorsName: "!=" }
      ]
      var OperatorsList2 = [
        { OperatorsValue: "=", OperatorsName: "=" },
        { OperatorsValue: "!=", OperatorsName: "!=" },
        { OperatorsValue: ">=", OperatorsName: ">=" },
        { OperatorsValue: ">", OperatorsName: ">" },
        { OperatorsValue: "<", OperatorsName: "<" },
        { OperatorsValue: "<=", OperatorsName: "<=" },
        { OperatorsValue: "range", OperatorsName: "范围" }
      ]
      if (search_type.indexOf("time") > 0) {
        return OperatorsList2
      } else {
        return OperatorsList1
      }
    },
    isShowInput: function() {
      if (this.SearchCriteria.SearchType.indexOf("time") > 0) {
        if (this.SearchCriteria.Operators === "range") {
          return "date_range"
        }
        {
          return "date"
        }
      } else {
        return "other"
      }
    },
    placeholder: function() {
      var data = this.SearchCriteria.SearchType
      var symbol = this.SearchCriteria.Operators
      if (data.indexOf("time") < 0) {
        return "输入关键字..."
      } else {
        if (symbol === "range") {
          return "若查询日期范围，在开始日期和结束日期之间，使用#分割"
        } else {
          return "日期格式: 2018-01-01"
        }
      }
    },
    SearchBuilder: function() {
      var result = {}
      var tmp_release
      this.selected_release == "全部" ? (tmp_release = "all") : (tmp_release = this.selected_release)
      result["pageNumber"] = this.pageNumber
      result["pageSize"] = this.pageSize
      result["product_code"] = this.selected_product
      result["release"] = tmp_release
      result["status"] = this.selected_status
      result["Operators"] = this.SearchCriteria.Operators
      result["SearchType"] = this.SearchCriteria.SearchType
      if (this.SearchCriteria.SearchType.indexOf("time") > 0) {
        if (this.SearchCriteria.Operators === "range") {
          var date = new Array()
          date[0] = this.SearchCriteria.start_date
          date[1] = this.SearchCriteria.end_date
          result["wd"] = date
        } else {
          result["wd"] = this.SearchCriteria.start_date
        }
      } else {
        this.wd ? (result["wd"] = this.wd) : null
      }
      return result
    },
    // userinfo group
    uGroup: function() {
      return this.$store.state.userInfo.group === "test" ? this.$store.state.userInfo.group : null
    },
    // show user config
    isShowModules: function() {
      var config = this.$store.state.UserCustomization
      return _.find(config, function(o) { return o.code == 'Bug_isShowMoudles' & o.code_value == 1 }) ? true : false
    }
  },

  watch: {
    QueryBuilder: function(val, oldVal) {
      this.tableData = []
      this.wd ? this.goSearch(this.SearchBuilder) : this.getBugList()
      this.$router.replace({ path: "/app/qa/bug", query: this.QueryBuilder })
    },
    product_list: function(val, oldVal) {
      if ((this.product_list.length > 0) & !this.selected_product) {
        this.selected_product = this.product_list[0]["product_code"]
      }
    },
    selected_product: function (val, oldVal) {
      this.getModule()
    },
    total: function() {
      if (this.total === 0) {
        this.img_src = require("static/pic/happy.png")
        this.Msg = "没找到数据"
      }
    }
  },

  created() {
    var query = this.$route.query
    if (query["status"]) {
      this.selected_status = query["status"]
    }
    if (query["operate"]) {
      this.operate = query["operate"]
    }
    if (query["product_code"]) {
      this.selected_product = query["product_code"]
    }
    this.getProductRelease()
  },

  mounted () {
    this.getBugList()
    this.getModule()
  },

  methods: {
    getPsPn: function(ps, pn) {
      this.pageSize = ps
      this.pageNumber = pn
    },
    // get product info and release info
    getProductRelease() {
      let that = this
      axios.get("/api/pm/product_release")
        .then(function(res) {
          if (res.data["status"] === 20000) {
            that.product_list = res.data["data"]
          } else {
            that.BoxMsg = res.data["msg"]
          }
        })
    },
    // 获取所有模块
    getModule () {
      let that = this
      if (!this.selected_product) { return }
      axios.get('/api/pm/get_module?product_code=' + this.selected_product)
        .then(function (res) {
          if (res.data['status'] === 20000) {
            that.modules_list = res.data['data']
          } else {
            that.Msg = res.data['msg']
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
    click_all_modules () {
      this.m1_id = null
      this.m2_id = null
    },
    // 下拉相关操作
    handleCommand(data) {
      if ("product_code" in data) {
        this.selected_product = data["product_code"]
      }
      if ("version" in data) {
        this.selected_release = data["version"]
      }
      if ("pname" in data) {
        this.selected_priority = data["pvalue"]
      }
      if ("code" in data) {
        this.operate = "no"
        this.selected_status = data["code"]
      }
      if ("OperatorsName" in data) {
        this.SearchCriteria.Operators = data["OperatorsValue"]
      }
      if ("tname" in data) {
        this.SearchCriteria.SearchType = data["tvalue"]
      }
      if ("lable" in data) {
        this.modules_id[0] = data["value"]
      }
      this.pageNumber = 1
    },
    SwitchOperate(item) {
      this.pageNumber = 1
      this.operate = item["value"]
      this.selected_status = "all"
    },

    // Bug: 列表
    getBugList() {
      let that = this
      if (!this.selected_product) { return }
      axios.get("/api/qa/bug/list", { params: this.QueryBuilder })
        .then(function(res) {
          if (res.data["status"] === 20000) {
            that.tableData = res.data["data"]
            that.total = res.data["total"]
          } else {
            that.Msg = res.data["msg"]
          }
        })
    },
    // Bug: 搜索
    clickSearch() {
      if (this.isShowSearch) {
        this.isShowSearch = false
        this.wd = null
        this.getBugList()
      } else {
        this.isShowSearch = true
      }
    },
    goSearch(data) {
      var reg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/
      if (!data.wd && data.SearchType.indexOf("time") < 0) {
        this.$notify.error({ title: "提示", message: "请输入搜索内容" })
        return
      }
      if (data.Operators === "range" && data.SearchType.indexOf("time") > 0) {
        let start_date = data.wd[0]
        let end_date = data.wd[1]
        if (data.wd.length !== 2) {
          this.$notify.error({
            title: "提示",
            message: "请输入开始日期和结束日期"
          })
          return
        }
        if (((data.wd.length === 2) & start_date.match(reg)) | !end_date.match(reg)) {
          this.$notify.error({
            title: "提示",
            message: "请输入有效日期范围,比如:2018-08-08 2018-10-01"
          })
          return
        }
      }
      if ((data.SearchType.indexOf("time") > 0) &(data.Operators !== "range")) {
        let date = data.wd.match(reg)
        if (!date) {
          this.$notify.error({
            title: "提示",
            message: "请输入有效日期,比如:2018-08-08"
          })
          return
        }
      }
      let that = this
      axios({
        method: "POST",
        url: "/api/qa/bug/search?",
        data: data
      }).then(function(res) {
        if (res.data["status"] === 20000) {
          that.tableData = res.data["data"]
          that.total = res.data["total"]
        } else {
          that.tableData = []
          that.total = 0
          that.Msg = res.data["msg"]
        }
      })
    },

    // 操作: bug指派
    skipAssign(row) {
      this.showBugAssignBox = true
      this.selectedBugId = row.bug_id
      $("#componentsAssign").modal("show")
    },
    // 操作: bug解决
    skipResolve(row) {
      this.showBugResolveBox = true
      this.selectedBugId = row.bug_id
      $("#componentsResolve").modal("show")
    },
    // 操作: bug关闭
    BugClosedDialog(row) {
      $("#modal-bugClosed").modal("show")
      this.ClosedData.bug_id = row.bug_id
    },
    ClosedBug(bug_id) {
      let that = this
      axios({
        method: "post",
        url: "/api/qa/bug/close",
        data: JSON.stringify(this.ClosedData)
      }).then(function(res) {
        if (res.data["status"] === 20000) {
          that.getBugList()
          that.$notify.success({ title: "成功", message: res.data["msg"] })
        } else {
          that.$notify.error({ title: "错误", message: res.data["msg"] })
        }
        $("#modal-bugClosed").modal("hide")
      })
    },
    // 操作：bug修改优先级
    BugPriorityDialog(row) {
      $("#modal-modify-priority").modal("show")
      this.ModifyPriorityData.bug_id = row.bug_id
    },
    ModifyPriority(data) {
      let that = this
      that.ModifyPriorityData.priority = data
      axios({
        method: 'post',
        url: '/api/qa/bug/edit',
        data: JSON.stringify(that.ModifyPriorityData),
      }).then(function (res) {
        if (res.data['status'] === 20000) {
          that.$notify.success({title: '成功',message: res.data['msg']})
          $("#modal-modify-priority").modal("hide")
          that.getBugList()
        } else {
          that.$notify.error({title: '失败',message: res.data['msg']})
        }
      })
    },
    // 数据统计
    myToday() {
      $("#modal-my-today").modal("show")
      let that = this
      axios("/api/analyze/bug/my_today").then(function(res) {
        if (res.data["status"] === 20000) {
          that.MyTodayData = res.data
        }
      })
    },
    // table line hover and leave
    tableHover(row) {
      this.HoverBugIdOpenBy = row.openedBy
      this.HoverBugId = row.bug_id
    },
    tableLeave(row) {
      this.HoverBugId = ""
    }
  }
}
</script>

<style>
  @import "~/static/static/common/css/test.css"
</style>