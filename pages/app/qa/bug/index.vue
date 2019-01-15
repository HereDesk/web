<template>
	<div id="page-bug" class="py-5 container-fluid">
    <div class="row"> 
			<!-- Data: Module -->
      <div id="product-modules" :class="[isShowModules ? 'pg-modules col-md-2' : 'col-md-1']">
        <PageModules v-if="isShowModules"
          :product_code="selected_product" 
          :Rules="Rules"
          @getM1M2="getM1M2">
        </PageModules>
      </div>

      <!-- Action: let Module switch -->
      <div id="product-modules-switch" class="pl-4 mt-2 medium-devices-no" style="position: absolute;z-index: 9;"  
        @click="switchModule()">
        <i class="iconfont bg-EEEEEE py-2" style="visibility:hidden;"
          :class="[ isShowModules ? 'icon-arrow-right' : 'icon-arrow-left']"></i>
      </div>

      <!-- Action: Bug Query and Bug Search -->
      <div id="data-bug" :class="[isShowModules ? 'px-5 col-lg-10 col-md-12' : 'col-sm-12 col-md-10']">
        <div class="container-fluid">
					
          <div id="bug-nav-manage" class="row justify-content-between">
            <div id="bug-query-1">
              
              <ProductInfo :type="'bug_index'" :showStyle="'dropdown'" @ProductInfo="GetProductInfo">
              </ProductInfo>

              <el-dropdown id="bug-query-status" class="mr-1 my-1">
                <span>
                  <span class="el-dropdown-desc">状态:</span>
                  <span class="el-dropdown-link bg-edown">
                    {{ selected_status | filterBugStatusName }}
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="item in status_list" :key="item.id">
                    <span @click="handleCommand(item)">{{ item.status_name }}</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown id="bug-query-priority" class="mr-1 my-1">
                <span>
                  <span class="el-dropdown-desc">优先级:</span>
                  <span class="el-dropdown-link bg-edown">
                    {{ selected_priority == 'all' ? "全部" : selected_priority }}
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="item in priority_list" :key="item.id">
                    <span @click="handleCommand(item)">{{ item.priority_name }}</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown id="bug-query-order" class="bug-sort mr-1 my-1">
                <span>
                  <span class="el-dropdown-desc" @click="SortData($event)">
                    按<span class="sort_text">{{sort_text}}</span>序:
                  </span>
                  <span class="el-dropdown-link bg-edown">
                    {{ selected_order.replace('-','') | filterOrder }}
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="item in order_list" :key="item.id">
                    <span @click="handleCommand(item)">{{ item.order_name }}</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown id="bug-query-quick" class="mr-1 my-1">
                <span>
                  <span class="el-dropdown-desc">快捷操作:</span>
                  <span class="el-dropdown-link bg-edown" :class="{ '2973B7': operate != 'no' }">
                    {{ operate | QuickQperationName }}
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="item in QuickQperationList" :key="item.id">
                    <span :id="item.quick_value" @click="handleCommand(item)">
                      {{ item.quick_name }}
                    </span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>

            <div id="bug-query-2" class="vertical-center">
              <span class="searchIcon mr-3" @click="clickSearch()">
                <i class="iconfont icon-search size-1-3 icon-8a8a8a"></i>
              </span>
              <span title="导入导出" class="mr-3" @click="showModal = 'export'">
                <i class="iconfont icon-import-export icon-8a8a8a size-1-8"></i>
              </span>
              <span  class="searchIcon mr-3" title="今日概况" @click="myToday()">
                <i class="iconfont icon-web-icon- icon-8a8a8a size-2"></i>
              </span>
              <span  class="searchIcon mr-3" title="切换样式" @click="switchStyle()">
                <i class="iconfont icon-table-list icon-8a8a8a size-1-5"></i>
              </span>
              <nuxt-link to='/app/qa/bug/add'>
                <button type="btn" class="btn btn-create"> + 创建 </button>
              </nuxt-link>
            </div>
          </div>

          <div id="about-search-input" class="row pt-3 hiddenSearch" style="border-bottom:1px solid #C5CAE9"
            :class="{ showSearch: isShowSearch }">
            <div class="col-xl-2 col-lg-4 col-md-4 col-sm-6 col-6 px-0 text-center">
              <el-dropdown id="page-query-product" class="my-1" trigger="click">
                <span class="el-dropdown-link bg-edown bg-white text-center">
                  {{ SearchCriteria.SearchType  | filterSearchType }}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for='item in SearchType' :key="item.id">
                    <span @click="handleCommand(item)">{{ item.search_name }}</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown id="page-query-version" class="my-1" trigger="click">
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
            <div class="col-xl-10 col-lg-9 col-md-9 col-sm-6 col-6" style="display: flex;justify-content:flex-start;">
              <input type="date" class="border-none font-size-90" 
                v-if="SwitchSearchInput == 'date'" 
                v-model="SearchCriteria.start_date">
              <input type="date" class="border-none font-size-90" 
                v-else-if="SwitchSearchInput == 'date_range'"
                v-model="SearchCriteria.start_date">
              <input type="date" class="border-none font-size-90" 
                v-else-if="SwitchSearchInput == 'date_range'" 
                v-model="SearchCriteria.end_date">
              <input type="text" id="bugSearchInput" class="border-none" 
              	v-else
              	placeholder="输入关键字进行搜索..."
              	v-model="wd" autofocus />
            </div>
          </div>

          <!-- table: 数据展示 -->
          <div id="bug-data-list" class='row mt-3 mb-5 table_data'>
            <!-- style: table -->
            <div id="bug-table-style" class='col px-0' v-if="DataShowStyle == 'table'">
              <el-table :data='tableData' 
                :default-sort="{prop: 'date', order: 'descending'}" 
                @cell-mouse-enter="tableHover" @cell-mouse-leave="tableLeave">
                <el-table-column label='ID' prop='id' sortable width='63'></el-table-column>
                <el-table-column label='状态' prop="status" align="center" width='100' sortable>
                  <template slot-scope="scope">
                    <span class="circle-content" 
                      :class="{ 'text-secondary': scope.row.status === 'Closed',
                      'text-success': scope.row.status === 'Fixed',
                      'text-urgency': ['New','Open','Reopen'].includes(scope.row.status),
                      'text-warning': scope.row.status === 'Hang-up'}">
                      {{ scope.row.status_name }}
                    </span>
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
                <el-table-column label='优先级' prop="priority" align="center" width='95' sortable>
                  <template slot-scope="scope">
                    <div @click="BugPriorityDialog(scope.row)">
                      <span class="circle-content font-color-757575"
                        :class="{'text-deadly': scope.row.priority == 'P1', 'text-urgency': scope.row.priority == 'P2'}">
                        {{ scope.row.priority }}
                      </span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label='创建' prop='creator_user' align="center" sortable width='85' show-overflow-tooltip>
                </el-table-column>
                <el-table-column label='创建时间' width='100'>
                  <template slot-scope="scope">
                    <span>{{ scope.row.create_time | date(5) }}</span>
                  </template>
                </el-table-column>
                <el-table-column label='指派' prop='assignedTo_user' align="center" sortable width='85' show-overflow-tooltip>
                </el-table-column>
                <el-table-column label='解决方案' width='91' align="center">
                  <template slot-scope="scope">
                    <div :class="{ 'hideText' : scope.row.bug_id === HoverBugId && scope.row.status != 'Closed'}">
                      <span :class="[ scope.row.solution_name == '已修复' ? 'text-success' : 'text-secondary' ]">
                        &nbsp;{{ scope.row.solution_name }}
                      </span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label='' width="50">
                  <template slot-scope="scope">
                    <div class="display-none"
                      :class="{ 'showBugOpreate' : scope.row.bug_id == HoverBugId, 'hideText': scope.row.status == 'Closed'}">
                      <button v-if="scope.row.creator_id == myUID">
                        <nuxt-link :to="{path:'/app/qa/bug/edit',query:{'bug_id':scope.row.bug_id}}">
                          <i class="iconfont icon-edit icon-8a8a8a size-1-3"></i>
                        </nuxt-link>
                      </button>
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

            <!-- style: list -->
            <div id="bug-list-style" class="col px-0" v-if="DataShowStyle == 'list'">
              <ul class="pl-0 ul-none-2">
                <li v-for="(item,index) in tableData" :Key="index" :id="index">
                  <p id="data-bugtitle" class="mt-3">
                    <nuxt-link style="color:#424242" 
                      :to="{path:'/app/qa/bug/deatils',query:{'bug_id':item.bug_id}}">
                      {{ item.id }}. {{ item.title }}
                    </nuxt-link>
                  </p>
                  <div id="data-buginfo" class="my-2">
                    <div id="data-detailed-information" class="display-inline data-liststyle-satellite">
                      <span class="circle-content" @click="BugPriorityDialog(item)"
                        :class="{ 'text-deadly': item.priority == 'P1', 'text-urgency': item.priority == 'P2' }">
                        {{ item.priority }}
                      </span>
                      <span :class="{ 'text-secondary': item.status === 'Closed',
                        'text-success': item.status === 'Fixed',
                        'text-urgency': ['New','Open','Reopen'].includes(item.status),
                        'text-warning': item.status === 'Hang-up'}">
                        # {{ item.status_name }}
                      </span>
                      <span>@创建: {{ item.creator_user }}&nbsp;&nbsp;{{ item.create_time | date(5) }}</span>
                      <span>@指派: {{ item.assignedTo_user }}</span>
                      <span v-if="item.fixed_user">
                        @解决: {{ item.fixed_user }}&nbsp;|&nbsp;
                        <p class="display-inline" 
                          :class="[ item.solution_name == '已修复' ? 'text-success' : 'text-secondary' ]">
                        {{ item.solution_name }}</p>
                      </span> 
                      <span>最后更新: {{ item.last_time | date(5) }}</span>
                    </div>
                    <div id="data-action" class="float-right display-inline" style="margin-top:-1rem;"
                      :class="{'display-none': item.status == 'Closed', 'action': item.status != 'Closed' }">
                      <span @click="showModal = 'assign'">
                        <i class="iconfont icon-assign icon-8a8a8a size-1-8 mx-2"></i>
                      </span>
                      <span @click="skipResolve(item)" v-if="item.status != 'Fixed'">
                        <i class="iconfont icon-resolve icon-8a8a8a size-1-6 mx-2"></i>
                      </span>
                      <span @click="BugClosedDialog(item)" v-if="uGroup">
                        <i class="iconfont icon-close-opera icon-8a8a8a size-1-5 mx-2"></i>
                      </span>
                    </div>
                  </div>
                </li>
              </ul> 
            </div>
					</div>

          <!-- table: 翻页 -->
          <Pagination :total="total" @PsPn="getPsPn"></Pagination>

          <!-- loading -->
          <div id="page-loading" class="row">
            <div class="col text-center" v-if='total === null'>
              <PageLoading></PageLoading>
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
    </div>

    <!-- Action：Bug Assign -->
    <BugAssign id="modal-assign"
      v-if="showModal == 'assign'" 
      @close="showModal = false"
      :bug_id="selectedBugId" 
      :product_code="selected_product"
      :pageSource="pageSource"
      @refreshList="getBugList()">
    </BugAssign>

    <!-- Action：Bug Resolve -->
    <BugResolve id="modal-resolve"
      v-if="showModal == 'resolve'" 
      @close="showModal = false"
      :bug_id="selectedBugId"
      :OpenBy="HoverBugIdOpenBy"
      :product_code="selected_product"
      :pageSource="pageSource"
      :scheme="scheme"
      @refreshList="getBugList()">
    </BugResolve>

    <!-- Action：Bug Change Priority -->
    <BugChange id="modal-change-priority" 
      v-if="showModal == 'priority'"
      @close="showModal = false"
      :bug_id="selectedBugId" 
      :data_type="'priority'" 
      @refreshList="getBugList()">
    </BugChange>

    <!-- Action：Bug Closed -->
    <Modal id="modal-bugClosed" v-if="showModal == 'closed'" @close="showModal = false" :isFooter="true">
      <div slot="body" class="text-center my-5">
        <h3 style="font-weight: 300;">确定关闭此缺陷?</h3>
      </div>
      <button slot="footer" type="submit" class="btn btn-primary" @click="ClosedBug()">确定</button>
    </Modal>
    
    <!-- Action: Bug Expoert -->
    <Modal id="modal-export" v-if="showModal == 'export'" @close="showModal = false" :isHeaderClose="true">
      <h5 slot="header" class="modal-title">{{ selected_product }} 缺陷</h5>
      <div slot="body">
        <div class="row">
          <div class="col text-center">
            <button type="button" class="btn btn-dark mt-3 mb-5" @click="bug_export">数据导出</button>
            <p v-if="JSON.stringify(BugExportFile) !== '{}'">
              下载地址: <a :href="BugExportFile.url">{{ BugExportFile.filename }}</a>
            </p>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <p style="font-size:0.88rem;color:#424242;">备注：仅支持按照产品、版本、缺陷状态这三个查询条件导出; 选择好查询条件，再点击导出; 目前仅支持导出xlsx</p>
          </div>
        </div>
      </div>
    </Modal>
  
    <!-- Data: Bug Count -->
    <Modal id="modal-my-today" v-if="showModal == 'count-today'" @close="showModal = false" :isHeaderClose="true">
      <h5 slot="header" class="modal-title">今日概况&nbsp;&nbsp;{{ selected_product }}</h5>
      <div slot="body" class="text-center mb-3">
        <div class="modal-body text-center" v-if="MyTodayData">
          <div class="row mt-5">
            <div class="col">
              <p class="countdata-num">{{ MyTodayData.data.create || 0 }}</p>
              <p class="countdata-desc">今日发现</p>
            </div>
            <div class="col">
              <p class="countdata-num text-success">{{ MyTodayData.data.fixed || 0 }}</p>
              <p class="countdata-desc">今日解决</p>
            </div>
            <div class="col">
              <p class="countdata-num text-success">{{ MyTodayData.data.closed || 0}}</p>
              <p class="countdata-desc">今日关闭</p>
            </div>
            <div class="col" v-if="MyTodayData.group != 'test' && MyTodayData.group != 'developer'">
              <p class="countdata-num text-red">{{ MyTodayData.data.hangUp || 0}}</p>
              <p class="countdata-desc">今日挂起</p>
            </div>
            <div class="col">
              <p class="countdata-num">{{ MyTodayData.data.residue || 0 }}</p>
              <p class="countdata-desc" v-if="MyTodayData.group == 'developer'">待我解决</p>
              <p class="countdata-desc" v-else>剩余待解决</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>

	</div>
</template>

<script>
import PageLoading from "~/components/PageLoading"
import PageModules from "~/components/PageModules"
import BugAssign from "~/components/BugAssign"
import BugResolve from "~/components/BugResolve"
import BugChange from "~/components/BugChange"
import Pagination from "~/components/Pagination"
import ProductInfo from '~/components/ProductInfo'

import util from "~/assets/js/util.js"
import data from "~/assets/js/data.js"
import rules from "~/assets/js/rules.js"

export default {
  head() {
    return {
      title: "HDesk - 缺陷列表"
    }
  },
	
  layout: "head",
  components: {
    PageLoading,
    BugAssign,
    BugResolve,
    BugChange,
    Pagination,
    PageModules,
    ProductInfo
  },

  data() {
    return {
			showModal: false,
      ScreenWidth: 0,
      isDisplayOperate: true,
      
      // Page Body Data
      total: null,
      pageNumber: parseInt(this.$route.query.pageNumber) || 1,
      pageSize: parseInt(this.$route.query.pageSize) || 10,
      tableData: [],
      HoverBugId: "",
      selectedBugId: "",
      HoverBugIdOpenBy: "",
      MyTodayData: false,
      BugExportFile: {},
      
      // Other
      Msg: false,
      img_src: null,
      
      // Define Data: Query and Search field
      product_list: [],
      modules_list: [],
      modules_id: [null, null],
      m1_id: this.$route.query.m1_id || null,
      m2_id: this.$route.query.m2_id || null,
      selected_product: this.$route.query.product_code || "",
      selected_release: this.$route.query.release || "全部",
      
      // Define Data: Bug-Status
      status_list: data.bug_status_list,
      selected_status: this.$route.query.status || "all",
      
      // Define Data: Bug-priority
      priority_list: data.priority_list,
      selected_priority: this.$route.query.priority || "all",
      
      // Define Data: Bug-Order
      sort_text: '倒',
      order_list: data.order_list,
      selected_order: this.$route.query.order || "create_time",
      
      // Define Data: Bug-more-quick-operate
      operate: this.$route.query.operate || "no",
      QuickQperationList: data.bug_quick_operation_list,

      // Define Data: Bug-Search
      SearchType: data.bug_search_type_list,
      SearchCriteria: {
        Operators: this.$route.query.Operators || "=",
        SearchType: this.$route.query.SearchType || "ID",
        start_date: String(this.$route.query.SearchType).includes('time') && 
          (this.$route.query.wd).includes('#') 
            ? String(this.$route.query.wd).split('#')[0]
            : null,
        end_date: String(this.$route.query.SearchType).includes('time') && 
          (this.$route.query.wd).includes('#') 
            ? String(this.$route.query.wd).split('#')[1]
            : null,
      },
      wd: this.$route.query.wd || '',
      isShowSearch: this.$route.query.wd ? true : false,
      
      // Define components Data
      scheme: "Fixed",
      pageSource: "page_bug_index",
    }
  },

  filters: {
    date: util.date,
    filterOperators: util.getOperatorsName,
    filterSearchType: util.getSearchTypeName,
    filterBugStatusName: util.bugStatusName,
    QuickQperationName: util.QuickQperationName,
    filterOrder: util.getOrderName,
    FilterVersion: function(value) {
      return value == "all" ? "全部" : value
    }
  },
  
  computed: {
		
    // page and menu rules
    Rules: function() {
      let group = this.$store.state.userInfo.group
      let PagesRules = this.$store.state.PageData
      return rules.RuleManges(group,PagesRules)
    },
		
    // version list
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
		
    // query condition
    QueryBuilder: function() {
      let Builder = {}
      let tmp_release
      let sort_symbol
      this.sort_text.includes('倒') ? sort_symbol = '-' : sort_symbol = ''
      this.selected_release == "全部" ? (tmp_release = "all") : (tmp_release = this.selected_release)
      Builder["pageNumber"] = this.pageNumber
      Builder["pageSize"] = this.pageSize
      Builder["product_code"] = this.selected_product
      Builder["release"] = tmp_release
      Builder["status"] = this.selected_status
      Builder["priority"] = this.selected_priority
      Builder["order"] = sort_symbol + String(this.selected_order).replace('-','')
      this.m2_id ? (Builder["m2_id"] = this.m2_id) : null
      this.m1_id ? (Builder["m1_id"] = this.m1_id) : null
      if (this.operate != "no") {
        Builder["operate"] = this.operate
      }
      if (this.isShowSearch) {
        if (this.SearchCriteria.start_date && this.SearchCriteria.end_date) {
          this.wd = this.SearchCriteria.start_date + '#' + this.SearchCriteria.end_date
        } 
        if (this.SearchCriteria.start_date && !this.SearchCriteria.end_date) {
          this.wd = this.SearchCriteria.start_date
        }
        if (this.wd) {
          Builder["Operators"] = this.SearchCriteria.Operators
          Builder["SearchType"] = this.SearchCriteria.SearchType
          Builder["wd"] = this.wd
        }
      }
      return Builder
    },
		
    // bug search condition
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
      if (search_type.includes("time")) {
        return OperatorsList2
      } else {
        return OperatorsList1
      }
    },
		
    // switch search input
    SwitchSearchInput: function() {
      if (this.SearchCriteria.SearchType.includes("time")) {
        if (this.SearchCriteria.Operators == "range") {
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
    myUID: function() {
    	let userInfo = this.$store.state.userInfo
    	return userInfo.user_id ? userInfo.user_id : null
    },
		
    // show user config
    DataShowStyle: function() {
      let config = this.$store.state.UserConfig
      if (config) {
        if (config["BUG_DATA_SHOW_STYPE"]) { 
          return this.ScreenWidth > 768 ? config["BUG_DATA_SHOW_STYPE"] : 'list'
        } else {
          return this.ScreenWidth > 768 ? 'table' : 'list' 
        }
      } else {
        return this.ScreenWidth > 768 ? 'table' : 'list'
      }
    },
		
    // show user config : 1: show, 0: hide
    isShowModules: function() {
      let config = this.$store.state.UserConfig
      if (!config) {return false}
      if ("IS_SHOW_MODULE" in config) {
        return (this.ScreenWidth > 768) & (config["IS_SHOW_MODULE"] == 1) ? true : false
      } else {
        return false
      }
    }
  },

  watch: {
    showModal: function(val, oldVal) {
      this.showModal ? 
        document.body.classList.add("overflow-hidden") : 
        document.body.classList.remove("overflow-hidden")
    },
    wd: function(val, oldVal) {
      this.pageNumber = 1
    },
    m1_id: function(val, oldVal) {
      this.pageNumber = 1
    },
    m2_id: function(val, oldVal) {
      this.pageNumber = 1
    },
    product_list: function(val, oldVal) {
      if ((this.product_list.length > 0) & !this.selected_product) {
        this.selected_product = this.product_list[0]["product_code"]
      }
    },
    selected_product: function(val, oldVal) {
      this.getMemberList()
    },
    total: function() {
      if (this.total === 0) {
        this.img_src = require("static/images/happy.png")
        this.Msg = "没找到数据"
      }
    },
		QueryBuilder: function(val, oldVal) {
			if (JSON.stringify(val) != JSON.stringify(oldVal)) {
				this.tableData = []
				this.$route.query.product_code 
					? this.$router.push({path: "/app/qa/bug",query: this.QueryBuilder}) 
					: this.$router.replace({path: "/app/qa/bug",query: this.QueryBuilder})
				this.wd ? this.goSearch() : this.getBugList()
			}
		}
  },

  created() {
    if (JSON.stringify(this.$store.state.BugProperty) === "{}") {
    	this.$store.dispatch("getBugProperty")
    }
  },

  mounted() {
    this.getMemberList()
    this.wd ? this.goSearch() : this.getBugList()
    this.ScreenWidth = process.server ? 0 : document.body.clientWidth
  },

  methods: {
    // get $emit data
    GetProductInfo (data)  {
      this.selected_product = data.product_code
      this.selected_release = data.release
    },
    getPsPn: function(ps, pn) {
      this.pageSize = ps
      this.pageNumber = pn
    },
    getM1M2: function(m1, m2) {
      this.m1_id = m1
      this.m2_id = m2
    },
		
		/* get member user list */
    getMemberList() {
      if (!this.selected_product) {return}
      this.axios.get("/api/pm/member/list?product_code=" + this.selected_product)
        .then(res => {
          if (res.data["status"] === 20000) {
            this.$store.commit("setProductMemberList", res.data)
          }
        })
    },
		
    /* 下拉相关操作 */
    handleCommand(data) {
      if ("order_name" in data) {
        this.selected_order = data["order_value"]
      }
      if ("priority_name" in data) {
        this.selected_priority = data["priority_value"]
      }
      if ("status_name" in data) {
        this.operate = "no"
        this.selected_status = data["status_value"]
      }
      if ("quick_name" in data) {
        this.operate = data["quick_value"]
        this.pageNumber = 1
        this.selected_status = "all"
        this.selected_priority = "all"
      }
      if ("OperatorsName" in data) {
        this.SearchCriteria.start_date = null
        this.SearchCriteria.end_date = null
        this.wd = null
        this.SearchCriteria.Operators = data["OperatorsValue"]
      }
      if ("search_name" in data) {
        this.wd = null
        this.SearchCriteria.start_date = null
        this.SearchCriteria.end_date = null
        this.SearchCriteria.SearchType = data["search_value"]
        if (!(this.SearchCriteria.SearchType).includes('time')) {
          this.SearchCriteria.Operators = '='
        }
      }
      if ("lable" in data) {
        this.modules_id[0] = data["value"]
      }
      this.pageNumber = 1
    },

    /* Bug: get bug list data */
    getBugList() {
      if (!this.selected_product) { return }
      this.axios
				.get("/api/qa/bug/list", { params: this.QueryBuilder })
        .then(res => {
          if (res.data["status"] === 20000) {
            this.tableData = res.data["data"]
            this.total = res.data["total"]
          } else {
            this.total = 0
            this.Msg = res.data["msg"]
          }
        })
    },
		
    /* bug query condition */
    SortData() {
      this.sort_text.includes('倒') ? this.sort_text = '正' : this.sort_text = '倒'
    },
		
		/* Bug: show search input */
    clickSearch() {
      if (this.isShowSearch) {
        this.isShowSearch = false
        this.wd = ""
      } else {
        this.isShowSearch = true
      }
    },
		
		/* bug: search */
    goSearch() {
      let reg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/
      let data = this.QueryBuilder
      if (!data.wd && String(data.SearchType).includes("time")) {
        this.$notify.error({title: "提示",message: "请输入搜索内容"})
        return
      }
      if (data.Operators === "range" && String(data.SearchType).includes("time") && String(data.wd).includes("#")) {
        let start_date = (data.wd).split("#")[0]
        let end_date = (data.wd).split("#")[1]
        if (!start_date && !end_date) {
          this.$notify.error({title: "提示",message: "请输入开始日期和结束日期"})
          return
        }
        if (!start_date.match(reg) || !end_date.match(reg)) {
          this.$notify.error({title: "提示",message: "请输入有效日期范围,比如:2018-08-08 2018-10-01"})
          return
        }
      }
      if (String(data.SearchType).includes("time") && data.Operators !== "range") {
        let date = data.wd
        if (!date.match(reg)) {
          this.$notify.error({title: "提示",message: "请输入有效日期,比如:2018-08-08"})
          return
        }
      }
      this.axios({
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

    /* Acction：bug change priority */
    BugPriorityDialog(row) {
      this.selectedBugId = row.bug_id
      this.showModal = 'priority'
    },
		
    /* modal: bug assign */
    skipAssign(row) {
      this.selectedBugId = row.bug_id
      this.showModal = 'assign'
    },
		
    /* modal: bug resolve */
    skipResolve(row) {
      this.selectedBugId = row.bug_id
      this.showModal = 'resolve'
    },
		
    /* Modal: bug closed */
    BugClosedDialog(row) {
      this.selectedBugId = row.bug_id
      this.showModal = 'closed'
    },
		
		/* bug: closed */
    ClosedBug() {
      let data = {"bug_id": this.selectedBugId}
      this.axios({
        method: "post",
        url: "/api/qa/bug/close",
        data: JSON.stringify(data)
      }).then(res => {
        if (res.data["status"] === 20000) {
          this.showModal = false
          this.getBugList()
          this.$notify.success({title: "成功",message: res.data["msg"]})
        } else {
          this.$notify.error({title: "错误",message: res.data["msg"]})
        }
      })
    },
		
		/* bug: export */
    bug_export () {
      if (!this.selected_product) { return }
      this.axios
				.get("/api/qa/bug/export", { params: this.QueryBuilder })
        .then( res => {
          if (res.data["status"] === 20000) {
            this.BugExportFile = res.data
          } else {
            this.$notify.warning({title: "提示",message: res.data["msg"]})
          }
				})
    },
		
    /* my today data: count */
    myToday() {
      this.showModal = 'count-today'
      if (!this.selected_product) { return }
      this.axios
				.get("/api/analyze/bug/my_today?product_code=" + this.selected_product)
				.then(res => {
					if (res.data["status"] === 20000) {
						this.MyTodayData = res.data
					}
				})
    },
		
    /* table line hover and leave */
    tableHover(row) {
      this.HoverBugIdOpenBy = row.openedBy
      this.HoverBugId = row.bug_id
    },
    tableLeave(row) {
      this.HoverBugId = ""
    },

    /* is show module */
    switchModule() {
      let isDisplay = this.isShowModules ? 0 : 1
      this.axios
				.get('/api/userconfig?IS_SHOW_MODULE=' + isDisplay)
				.then(res => {
					if (res.data["status"] === 20000) {
						this.$store.dispatch('getUserInfo')
					}
				})
    },

    /* page style: switch data style */
    switchStyle() {
      let style = this.DataShowStyle == 'table' ? 'list' : 'table'
      this.axios
				.get('/api/userconfig?BUG_DATA_SHOW_STYPE=' + style)
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