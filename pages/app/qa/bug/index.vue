<template>
	<div id="page-bug" class="py-5 container-fluid">
    
    <div class="row">
      <div id="about-modules" class="col-xl-2 col-lg-2 col-md-12 col-sm-12 col-12 pt-3 pg-modules">
        <div class="mb-3">
          <p class="pl-4 display-inline" v-if="!modules_list.length">
            <nuxt-link class="display-inline" 
              :to="{ path: '/app/products/modules',query: {'product_code': selected_product } }">
              <span style="color:#2b2b2b" title="维护模块">维护模块</span>
            </nuxt-link>
          </p>
          <p class="pl-4 display-inline" :class="{ 'el-active' : !m1_id && !m2_id }" 
            @click="click_all_modules()" v-else>全部模块</p>
          <nuxt-link 
            class="display-inline manage-modules" 
            :to="{ path: '/app/products/modules',query: {'product_code': selected_product } }"
            v-if="Rules.product_modules">
            &nbsp;&nbsp;&nbsp;&nbsp; 
            <i class="iconfont icon-40 icon-8a8a8a size-1-5"></i>
          </nuxt-link>
        </div>
        <div class="divider"></div>
        <div class="mt-3">
          <ul class="ul-style-none" v-for="item1 in modules_list" :key="item1.id">
            <li :id="item1.id">
              <span class="line-height-1-8 li-color" :class="{ 'el-active': m1_id == item1.id }" 
                @click="clickMoudle1(item1)">
                <i class="iconfont icon-8a8a8a" 
                  :class="[ m1_id == item1.id ? 'icon-trigon-down' : 'icon-trigon-right' ]">
                </i>
                &nbsp;&nbsp;{{ item1.label }}
              </span>
              <ul class="t_module_second pl-5" v-if="m1_id == item1.id">
                <li v-for="item2 in item1.children" :key="item2.id" :id="item1.id" @click="clickMoudle2(item2)">
                  <span class="li-color" :class="{ 'el-active': m2_id == item2.id }">
                    {{ item2.label }}
                  </span>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>

      <!-- 查询以及操作相关 -->
      <div class="col-xl-10 col-lg-10 col-md-12 col-sm-12 col-12 px-5">
        <div id="bug-nav-manage" class="row justify-content-between">
          <div id="bug-query-1">
            <el-dropdown id="page-query-product" class="mr-3 my-1" trigger="click">
              <span>
                <span class="el-dropdown-desc">产品:</span>
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
            <el-dropdown id="page-query-version" class="mr-3 my-1" trigger="click">
              <span>
                <span class="el-dropdown-desc">版本:</span>
                <span class="el-dropdown-link bg-edown">
                  {{ selected_release | FilterVersion }}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in release_list" :key="item.id">
                  <span @click="handleCommand(item)">{{ item.version }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown id="page-query-bugstatus" class="mr-3 my-1" trigger="click">
              <span>
                <span class="el-dropdown-desc">状态:</span>
                <span class="el-dropdown-link bg-edown">
                  {{ selected_status | bugStatusName }}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in status_list" :key="item.id">
                  <span @click="handleCommand(item)">{{ item.code | bugStatusName }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown id="page-query-bugstatus" class="mr-3 my-1" trigger="click">
              <span>
                <span class="el-dropdown-desc">优先级:</span>
                <span class="el-dropdown-link bg-edown">
                  {{ selected_priority == 'all' ? "全部" : selected_priority }}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in priority_list" :key="item.id">
                  <span @click="handleCommand(item)">{{ item.pname }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown id="page-query-quick" class="mr-3 my-1" trigger="click">
              <span>
                <span class="el-dropdown-desc">快捷操作:</span>
                <span class="el-dropdown-link bg-edown" :class="{ 'text-2973B7': operate != 'no' }">
                  {{ operate | QuickQperationName }}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in QuickQperationList" :key="item.id">
                  <span :id="item.value" @click="SwitchOperate(item)">
                    {{ item.value | QuickQperationName }}
                  </span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>

          <div id="bug-query-2" class="vertical-center">
            <span class="searchIcon mr-4" @click="clickSearch()">
              <i class="iconfont icon-search size-1-3 icon-8a8a8a"></i>
            </span>
            <span  class="searchIcon mr-4" title="今日成就" @click="myToday()">
              <i class="iconfont icon-web-icon- icon-8a8a8a size-2"></i>
            </span>
            <nuxt-link to='/app/qa/bug/add'>
              <button type="btn" class="btn btn-create"> + 创建 </button>
            </nuxt-link>
          </div>
        </div>

        <div id="about-search-input" class="row pt-3 hiddenSearch" style="border-bottom:1px solid #C5CAE9"
          :class="{ showSearch: isShowSearch }">
          <div class="col-xl-3 col-lg-3 col-md-4 col-sm-5 col-12 pr-0 text-center">
            <el-dropdown id="page-query-product" class="mx-3 my-1" trigger="click">
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
            <el-dropdown id="page-query-version" class="mx-3 my-1" trigger="click">
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
          <div class="col-xl-8 col-lg-8 col-md-6 col-sm-6 col-12" style="display: flex;justify-content:flex-start;">
            <input type="text" id="bugSearchInput" class="border-none" 
              v-if="SwitchSearchInput === 'other'"
              placeholder="输入关键字..."
              v-model.trim="wd" autofocus />
            <input type="date" class="border-none text-90" 
              v-if="SwitchSearchInput === 'date'" 
              v-model="SearchCriteria.start_date">
            <input type="date" class="border-none text-90" 
              v-if="SwitchSearchInput === 'date_range'"
              v-model="SearchCriteria.start_date">
            <input type="date" class="border-none text-90" 
              v-if="SwitchSearchInput === 'date_range'" 
              v-model="SearchCriteria.end_date">
          </div>
          <div class="col-xl-1 col-lg-1 col-md-2 col-sm-1 col-12 pt-2">
            <button type="button" class="btn text-90" @click="goSearch()">搜索</button>
          </div>
        </div>

        <!-- table: 数据展示 -->
        <div id="bug-list" class='row mt-3 mb-5 table_data'>
          <div class='col-xl-12 col-lg-12 col-md-12'>
            <el-table 
              :data='tableData' 
              :default-sort="{prop: 'date', order: 'descending'}" 
              @cell-mouse-enter="tableHover" 
              @cell-mouse-leave="tableLeave">
              <el-table-column label='ID' prop='id' sortable width='70'></el-table-column>
              <el-table-column label='状态' width='100'>
                <template slot-scope="scope">
                  <span class="text-secondary" v-if="scope.row.status === 'Closed'" >
                    <span class="circle circle-secondary"></span>
                    &nbsp;{{ scope.row.status_name }}
                  </span>
                  <span class="text-urgency" v-else-if="scope.row.status === 'New'" >
                    <span class="circle circle-urgency"></span>
                    &nbsp;{{ scope.row.status_name }}
                  </span>
                  <span class="text-urgency" v-else-if="scope.row.status === 'Open'" >
                    <span class="circle circle-urgency"></span>
                    &nbsp;{{ scope.row.status_name }}
                  </span>
                  <span class="text-urgency" v-else-if="scope.row.status === 'Reopen'">
                    <span class="circle circle-urgency"></span>
                    &nbsp;{{ scope.row.status_name }}
                  </span>
                  <span class="text-success" v-else-if="scope.row.status === 'Fixed'">
                    <span class="circle circle-success"></span>
                    &nbsp;{{ scope.row.status_name }}
                  </span>
                  <span class="text-warning" v-else-if="scope.row.status === 'Hang-up'">
                    <span class="circle circle-warning"></span>
                    &nbsp;{{ scope.row.status_name }}
                  </span>
                  <span v-else>{{ scope.row.status_name }}</span>
                </template>
              </el-table-column>
              <el-table-column label='标题' show-overflow-tooltip>
                <template slot-scope="scope">
                  <nuxt-link 
                    :to="{path:'/app/qa/bug/deatils',query:{'bug_id':scope.row.bug_id}}" style="color:#424242">
                  {{ scope.row.title }}
                  </nuxt-link>
                </template>
              </el-table-column>
              <el-table-column label='优先级' width='80'>
                <template slot-scope="scope">
                  <div @click="BugPriorityDialog(scope.row)">
                    <span v-if="scope.row.priority === 'P1'" class="text-deadly">
                      <span class="circle circle-deadly"></span>
                      &nbsp;{{ scope.row.priority }}
                    </span>
                    <span v-else-if="scope.row.priority === 'P2'" class="text-urgency">
                      <span class="circle circle-urgency"></span>
                      &nbsp;{{ scope.row.priority }}
                    </span>
                    <span v-else class="text-secondary">
                      <span class="circle circle-secondary"></span>
                      &nbsp;{{ scope.row.priority }}
                    </span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label='创建' prop='creator_user' sortable width='85' show-overflow-tooltip>
              </el-table-column>
              <el-table-column label='创建时间' width='100'>
                <template slot-scope="scope">
                  <span>{{ scope.row.create_time | date(5) }}</span>
                </template>
              </el-table-column>
              <el-table-column label='指派' prop='assignedTo_user' sortable width='85' show-overflow-tooltip>
              </el-table-column>
              <el-table-column label='解决方案' width='90'>
                <template slot-scope="scope">
                  <div :class="{ 'hideText' : scope.row.bug_id === HoverBugId && scope.row.status != 'Closed'}">
                    <span v-if="scope.row.solution_name === '已修复'" class="text-success">
                      <span class="circle circle-success"></span>
                      &nbsp;&nbsp;{{ scope.row.solution_name }}
                    </span>
                    <span v-else class="text-secondary">
                      &nbsp;&nbsp;{{ scope.row.solution_name }}
                    </span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label='' width="50">
                <template slot-scope="scope">
                  <div class="tableOpreate"
                    :class="{ 'showBugOpreate' : scope.row.bug_id === HoverBugId, 'hideText': scope.row.status === 'Closed'}">
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
    <div id="bug-list-assign">
      <BugAssign 
        :bug_id="selectedBugId" 
        :product_code="selected_product"
        :pageSource="pageSource"
        @refreshList="getBugList()">
      </BugAssign>
    </div>

    <!-- Bug处理操作：解决 -->
    <div id="bug-list-resolve">
      <BugResolve
        :bug_id="selectedBugId"
        :OpenBy="HoverBugIdOpenBy"
        :product_code="selected_product"
        :pageSource="pageSource"
        :scheme="scheme"
        @refreshList="getBugList()">
      </BugResolve>
    </div>

    <!-- Bug处理操作：修改优先级 -->
    <div id="bug-list-priority">
      <ChangePriority
        :bug_id="selectedBugId"
        @refreshList="getBugList()">
      </ChangePriority>
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
import ChangePriority from "~/components/ChangePriority"
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
    ChangePriority,
    Pagination
  },

  data() {
    return {
      MyTodayData: {},
      // 产品、版本
      product_list: [],
      modules_list: [],
      modules_id: [null, null],
      m1_id: this.$route.query.m1_id || null,
      m2_id: this.$route.query.m2_id || null,
      selected_product: this.$route.query.product_code || "",
      selected_release: this.$route.query.release || "全部",
      // 缺陷状态
      status_list: data.bug_status_list,
      selected_status: this.$route.query.status || "all",
      // 优先级列表
      priority_list: data.priority_list,
      selected_priority: this.$route.query.priority || "all",
      // 更多操作
      operate: "no",
      QuickQperationList: data.bug_quick_operation_list,
      // 搜索
      SearchType: data.bug_search_type_list,
      SearchCriteria: {
        Operators: this.$route.query.Operators || "=",
        SearchType: this.$route.query.SearchType || "ID",
        start_date: String(this.$route.query.SearchType).includes('time') && 
          (this.$route.query.wd).includes('#') 
            ? String(this.$route.query.wd).split('#')[0]
            : this.$route.query.wd,
        end_date: String(this.$route.query.SearchType).includes('time') && 
          (this.$route.query.wd).includes('#') 
            ? String(this.$route.query.wd).split('#')[1]
            : null,
      },
      SearchOperatorSymbol: this.$route.query.Operators || '=',
      wd: null,
      isShowSearch: this.$route.query.wd ? true : false,
      // 表格数据
      total: null,
      pageNumber: parseInt(this.$route.query.pageNumber) || 1,
      pageSize: parseInt(this.$route.query.pageSize) || 10,
      tableData: [],
      Msg: false,
      img_src: null,
      // 控制显示
      isDisplayOperate: true,
      HoverBugId: "",
      selectedBugId: "",
      HoverBugIdOpenBy: "",
      // 组件
      scheme: "Fixed",
      pageSource: "page_bug_index",
      // close bug
      ClosedData: {
        bug_id: ""
      }
    }
  },

  filters: {
    date: util.date,
    filterOperators: util.getOperatorsName,
    filterSearchType: util.getSearchTypeName,
    bugStatusName: util.bugStatusName,
    QuickQperationName: util.QuickQperationName,
    FilterVersion: function(value) {
      if (value == "all") {
        return "全部"
      } else {
        return value
      }
    }
  },
  computed: {
    // page and menu rules
    Rules: function() {
      let group = this.$store.state.userInfo.group
      let PagesRules = this.$store.state.PageData
      return rules.RuleManges(group,PagesRules)
    },
    developer_fixed_percentage: function() {
      if (this.MyTodayData.group == "developer") {
        let data = this.MyTodayData.data
        let num = ((data.total - data.residue) / data.total) * 100
        return num.toFixed(1)
      }
      return 0
    },
    // 版本列表
    release_list: function() {
      let arr = [{ version: "全部" }]
      if (this.selected_product) {
        for (let i in this.product_list) {
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
      let Builder = {}
      let tmp_release
      this.selected_release == "全部" ? (tmp_release = "all") : (tmp_release = this.selected_release)
      Builder["pageNumber"] = this.pageNumber
      Builder["pageSize"] = this.pageSize
      Builder["product_code"] = this.selected_product
      Builder["release"] = tmp_release
      Builder["status"] = this.selected_status
      Builder["priority"] = this.selected_priority
      this.m2_id ? (Builder["m2_id"] = this.m2_id) : null
      this.m1_id ? (Builder["m1_id"] = this.m1_id) : null
      if (this.operate != "no") {
        Builder["operate"] = this.operate
      }
      if (this.isShowSearch) {
        if (this.SearchCriteria.start_date && !this.SearchCriteria.end_date) {
          this.wd = this.SearchCriteria.start_date
        }
        if (this.SearchCriteria.start_date && this.SearchCriteria.end_date) {
          this.wd = this.SearchCriteria.start_date + '#' + this.SearchCriteria.end_date
        } 
        if (this.wd) {
          Builder["Operators"] = this.SearchCriteria.Operators
          Builder["SearchType"] = this.SearchCriteria.SearchType
          Builder["wd"] = this.wd
        }
      }
      return Builder
    },
    // 搜索
    OperatorsList: function() {
      let search_type = this.SearchCriteria.SearchType
      let OperatorsList1 = [
        { OperatorsValue: "=", OperatorsName: "=" },
        { OperatorsValue: "!=", OperatorsName: "!=" }
      ]
      let OperatorsList2 = [
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
    SwitchSearchInput: function() {
      if (this.SearchCriteria.SearchType.indexOf("time") > 0) {
        if (this.SearchCriteria.Operators === "range") {
          return "date_range"
        } else {
          return "date"
        }
      } else {
        return "other"
      }
    },
    // userinfo group
    uGroup: function() {
      let userInfo = this.$store.state.userInfo
      return userInfo.group === "test" ? userInfo.group : null
    },
    // show user config
    isShowModules: function() {
      let config = this.$store.state.UserCustomization
      return _.find(config, function(o) {
        return (o.code == "Bug_isShowMoudles") & (o.code_value == 1)}) ? true : false
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
    QueryBuilder: function(val, oldVal) {
      this.tableData = []
      this.$router.push({path: "/app/qa/bug",query: this.QueryBuilder})
      this.wd ? this.goSearch() : this.getBugList()
    },
    product_list: function(val, oldVal) {
      if ((this.product_list.length > 0) & !this.selected_product) {
        this.selected_product = this.product_list[0]["product_code"]
      }
    },
    selected_product: function(val, oldVal) {
      this.getModule()
      this.getMemberList()
    },
    total: function() {
      if (this.total === 0) {
        this.img_src = require("static/pic/happy.png")
        this.Msg = "没找到数据"
      }
    }
  },

  created() {
    this.getProductRelease()
  },
  mounted() {
    this.getModule()
    this.getMemberList()
    this.wd ? this.goSearch() : this.getBugList()
  },

  methods: {
    getPsPn: function(ps, pn) {
      this.pageSize = ps
      this.pageNumber = pn
    },
    // get product info and release info
    getProductRelease() {
      axios.get("/api/pm/product_release").then(res => {
        if (res.data["status"] === 20000) {
          this.product_list = res.data["data"]
        } else {
          this.BoxMsg = res.data["msg"]
        }
      })
    },
    // 获取所有模块
    getModule() {
      if (!this.selected_product) {return}
      axios.get("/api/pm/get_module?product_code=" + this.selected_product)
        .then(res => {
          if (res.data["status"] === 20000) {
            this.modules_list = res.data["data"]
          } else {
            this.Msg = res.data["msg"]
          }
        })
    },
    getMemberList() {
      if (!this.selected_product) {return}
      axios.get("/api/pm/member/list?product_code=" + this.selected_product)
        .then(res => {
          if (res.data["status"] === 20000) {
            this.$store.commit("setProductMemberList", res.data)
          }
        })
    },
    clickMoudle1(data) {
      if (this.m1_id == data.id) {
        this.m1_id = ""
        this.m2_id = ""
      } else {
        this.m1_id = data.id
      }
    },
    clickMoudle2(data) {
      if (this.m2_id == data.id) {
        this.m2_id = ""
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
        this.SearchCriteria.start_date = null
        this.SearchCriteria.end_date = null
        this.wd = null
        this.SearchCriteria.Operators = data["OperatorsValue"]
      }
      if ("tname" in data) {
        this.wd = null
        this.SearchCriteria.start_date = null
        this.SearchCriteria.end_date = null
        this.SearchCriteria.SearchType = data["tvalue"]
        if (!(this.SearchCriteria.SearchType).includes('time')) {
          this.SearchCriteria.Operators = '='
        }
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
      this.selected_priority = "all"
    },

    // Bug: 列表
    getBugList() {
      if (!this.selected_product) {
        return
      }
      axios.get("/api/qa/bug/list", { params: this.QueryBuilder })
        .then(res => {
          if (res.data["status"] === 20000) {
            this.tableData = res.data["data"]
            this.total = res.data["total"]
          } else {
            this.Msg = res.data["msg"]
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
    goSearch() {
      let reg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/
      let data = this.QueryBuilder
      if (!data.wd && (data.SearchType).includes("time")) {
        this.$notify.error({ 
          title: "提示", 
          message: "请输入搜索内容"
        })
        return
      }
      if (data.Operators === "range" && (data.SearchType).includes("time") && (data.wd).includes("#")) {
        let start_date = (data.wd).split("#")[0]
        let end_date = (data.wd).split("#")[1]
        if (!start_date && !end_date) {
          this.$notify.error({
            title: "提示",
            message: "请输入开始日期和结束日期"
          })
          return
        }
        if (!start_date.match(reg) || !end_date.match(reg)) {
          this.$notify.error({
            title: "提示",
            message: "请输入有效日期范围,比如:2018-08-08 2018-10-01"
          })
          return
        }
      }
      if ((data.SearchType).includes("time") && data.Operators !== "range") {
        let date = data.wd
        if (!date.match(reg)) {
          this.$notify.error({
            title: "提示",
            message: "请输入有效日期,比如:2018-08-08"
          })
          return
        }
      }
      axios({
        method: "POST",
        url: "/api/qa/bug/search?",
        data: JSON.stringify(this.QueryBuilder)
      }).then(res => {
        if (res.data["status"] === 20000) {
          this.tableData = res.data["data"]
          this.total = res.data["total"]
        } else {
          this.tableData = []
          this.total = 0
          this.Msg = res.data["msg"]
        }
      })
    },

    // 操作：bug修改优先级
    BugPriorityDialog(row) {
      $("#modal-modify-priority").modal("show")
      this.selectedBugId = row.bug_id
    },
    // 操作: bug指派
    skipAssign(row) {
      this.selectedBugId = row.bug_id
      $("#componentsAssign").modal("show")
    },
    // 操作: bug解决
    skipResolve(row) {
      this.selectedBugId = row.bug_id
      $("#componentsResolve").modal("show")
    },
    // 操作: bug关闭
    BugClosedDialog(row) {
      $("#modal-bugClosed").modal("show")
      this.ClosedData.bug_id = row.bug_id
    },
    ClosedBug(bug_id) {
      axios({
        method: "post",
        url: "/api/qa/bug/close",
        data: JSON.stringify(this.ClosedData)
      }).then(res => {
        if (res.data["status"] === 20000) {
          this.getBugList()
          this.$notify.success({
            title: "成功",
            message: res.data["msg"]
          })
        } else {
          this.$notify.error({
            title: "错误",
            message: res.data["msg"]
          })
        }
        $("#modal-bugClosed").modal("hide")
      })
    },
    // 数据统计
    myToday() {
      $("#modal-my-today").modal("show")
      axios("/api/analyze/bug/my_today").then(res => {
        if (res.data["status"] === 20000) {
          this.MyTodayData = res.data
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