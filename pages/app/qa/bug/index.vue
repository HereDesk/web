<template>
	<div id="page-bug" class="py-5 container-fluid">
    <div class="row">

      <!-- 项目模块：左侧 -->
      <div id="product-modules" :class="[isShowModules ? 'pg-modules col-md-2' : 'col-md-1']">
        <PageModules v-if="isShowModules"
          :product_id="visited_product_id"
          :Rules="Rules"
          :query_type="'bug'"
          @getM1M2="getM1M2">
        </PageModules>
      </div>

      <!-- Action: let Module switch -->
      <div id="product-modules-switch" class="pl-4 mt-2 dataModule" @click="switchModule()">
        <i class="iconfont Bg-EEEEEE py-2" style="visibility:hidden;"
          :class="[ isShowModules ? 'icon-arrow-right' : 'icon-arrow-left']"></i>
      </div>

      <!-- Action: Bug Query and Bug Search -->
      <div id="data-bug" :class="[isShowModules ? 'px-5 col-lg-10 col-md-12' : 'col-sm-12 col-md-10']">
        <div class="container-fluid">

          <div id="bug-nav-manage" class="row">
            <div id="bug-query-1" class="col-xl-7 col-lg-12 col-md-12 col-sm-12 col-12 my-2">

              <!-- 项目下拉列表 -->
              <ProductInfo :ptype="'bug_index'" :showStyle="'dropdown'" @ProductInfo="GetProductInfo">
              </ProductInfo>
              <!-- 缺陷状态下拉列表 -->
              <el-dropdown id="bug-query-status" class="mr-1 my-1" :class="{ 'd-none': isShowAdSearch === 'yes' }">
                <span>
                  <span class="el-dropdown-desc">状态:</span>
                  <span class="el-dropdown-link bg-edown">
                    {{ selected_status | filterBugStatusName }}
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(item,index) in status_list" :key="index">
                    <span @click="handleCommand(item)">
                      {{ item.status_name }}</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>

              <el-dropdown id="bug-query-quick" class="mr-1 my-1">
                <span>
                  <span class="el-dropdown-desc">快捷:</span>
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
            <div id="bug-query-2" class="col-xl-3 col-lg-8 col-md-8 col-sm-8 col-12 pt-1 px-0 my-2">
              <div class="input-group align-items-center">
                <div id="ordinary-search" class="input-group-prepend">
                  <span id="icon-search" class="input-group-text" style="height: calc(2.05rem + 2px);">
                    <i class="iconfont icon-search icon-E0E0E0"></i>
                  </span>
                </div>
                <input id="id-title-search" type="text"
                  class="form-control search-control"
                  placeholder="搜索ID、标题、标签、或指派人员..."
                  v-model="wd">
              </div>
            </div>

            <div class="col-xl-2 col-lg-4 col-md-4 col-sm-4 col-12 vertical-center my-2">
              <div id="advanced-search" @click="unfoldAdvancedSearch()">
                <i class="iconfont icon-40 size-1-5 icon-8a8a8a ml-3" title="高级筛选"></i>
              </div>
              <nuxt-link to='/app/qa/bug/add' target="_blank" id="bug-create" class="ml-3" v-if="Rules.bug_create">
                <button type="btn" class="btn btn-create">+ 创建</button>
              </nuxt-link>
              <el-dropdown trigger="click">
                <span id="bug-set" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <i class="iconfont icon-more-z size-1-5 mx-2" title="更多操作"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item id="bug-style-switch" class="px-2">
                    <span class="searchIcon" title="切换样式" @click="switchStyle()">
                      <i class="iconfont icon-table-list icon-8a8a8a size-1-2 mr-2"></i>切换样式
                    </span>
                  </el-dropdown-item>
                  <el-dropdown-item id="bug-export" class="px-2">
                    <span title="导入导出" @click="showModal = 'export'">
                      <i class="iconfont icon-import-export icon-8a8a8a size-1-2 mr-2"></i>导入导出
                    </span>
                  </el-dropdown-item>
                  <el-dropdown-item id="bug-today-count" class="px-2">
                    <span  class="searchIcon mr-3" title="今日概况" @click="myToday()">
                      <i class="iconfont icon-web-icon- icon-8a8a8a size-1-5"></i> 今日数据
                    </span>
                  </el-dropdown-item>
                  <el-dropdown-item class="px-2">
                    <span  class="searchIcon mr-3" title="过滤字段" @click="showModal = 'table-filter-field'">
                      <i class="iconfont icon-filter icon-8a8a8a size-1-5"></i> 字段过滤
                    </span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>

          <!-- 高级搜索 -->
          <div id="bug-advanced-search" class="row my-3" :class="{ 'd-none': isShowAdSearch === 'no' }" style="border:1px solid #eee;border-radius:5px; padding: 20px 0;">
            <div id="bug-search-sort" class="col-12 sa-grid-item">
              <span class="sa-desc">顺序：</span>
              <div class="d-inline sc-context">
                <span>
                  <input type="radio" name="sort" :value="'-'" v-model="advanced_search.sort">
                  <label>倒序</label>
                </span>
                <span>
                  <input type="radio" name="sort" :value="'+'" v-model="advanced_search.sort">
                  <label>正序</label>
                </span>
              </div>
            </div>
            <div id="bug-search-sort-field" class="col-12 sa-grid-item">
              <span class="sa-desc">排序字段：</span>
              <div class="d-inline sc-context">
                <div class="d-inline" v-for="(item,index) in order_list" :key="index">
                  <span>
                    <input type="radio" :value="item.order_value"
                      v-model="sort_field">
                    <label>{{item.order_name}}</label>
                  </span>
                </div>
              </div>
            </div>
            <div id="bug-search-status" class="col-12 sa-grid-item">
              <span class="sa-desc">状态：</span>
              <div class="d-inline sc-context">
                <div class="d-inline" v-for="(item,index) in status_list" :key="index">
                  <span v-if="!['all','notClosed'].includes(item.status_value)">
                    <input type="checkbox" :value="item.status_value"
                      v-model="advanced_search.status_list">
                    <label>{{item.status_name}}</label>
                  </span>
                </div>
              </div>
            </div>
            <div id="bug-search-severity" class="col-12 sa-grid-item">
              <span class="sa-desc">严重程度：</span>
              <div class="d-inline sc-context">
                <span v-for="(item,index) in severity_list" :key="index">
                  <input type="checkbox" :value="item.severity_value"
                    v-model="advanced_search.severity_list">
                  <label>{{item.severity_name}}</label>
                </span>
              </div>
            </div>
            <div id="bug-search-priority" class="col-12 sa-grid-item">
              <span class="sa-desc">优先级：</span>
              <div class="d-inline sc-context">
                <div class="d-inline" v-for="(item,index) in priority_list" :key="index">
                  <span v-if="!['all'].includes(item.priority_value)">
                    <input type="checkbox" :value="item.priority_name"
                      v-model="advanced_search.priority_list">
                    <label>{{item.priority_name}}</label>
                  </span>
                </div>
              </div>
            </div>
            <div class="w-100"></div>
            <div id="bug-search-creator" class="col-12 sa-grid-item">
              <span class="sa-desc">创建人员：</span>
              <el-input v-model="advanced_search.creator" placeholder="输入名字，多个以空格分割..."></el-input>
            </div>
            <div id="bug-search-creator" class="col-12 sa-grid-item">
              <span class="sa-desc">指派给谁：</span>
              <el-input v-model="advanced_search.assignedTo_user" placeholder="输入名字，多个以空格分割..."></el-input>
            </div>
            <div class="w-100"></div>
            <div id="bug-search-creator" class="col-12 sa-grid-item">
              <span class="sa-desc">谁解决的：</span>
              <el-input v-model="advanced_search.fixed_user" placeholder="输入名字，多个以空格分割..."></el-input>
            </div>
            <div id="bug-search-creator" class="col-12 sa-grid-item">
              <span class="sa-desc">谁关闭的：</span>
              <el-input v-model="advanced_search.closed_user" placeholder="输入名字，多个以空格分割..."></el-input>
            </div>
            <div class="w-100"></div>

            <div id="bug-search-create-time" class="col-12 sa-grid-item">
              <span class="sa-desc">创建时间：</span>
              <el-date-picker
                v-model="advanced_search.create_time"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </div>
            <div id="bug-search-create-time" class="col-12 sa-grid-item">
              <span class="sa-desc">解决时间：</span>
              <el-date-picker
                v-model="advanced_search.fixed_time"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </div>
            <div id="bug-search-assignedTo-time" class="col-12 sa-grid-item">
              <span class="sa-desc">指派时间：</span>
              <el-date-picker
                v-model="advanced_search.assignedTo_time"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </div>
            <div id="bug-search-closed-time" class="col sa-grid-item">
              <span class="sa-desc">关闭时间：</span>
              <el-date-picker
                v-model="advanced_search.closed_time"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </div>
            <div class="col-12 text-center mt-3">
              <button type="button" class="btn-ad-search" @click="isShowAdSearch = 'no'">隐藏</button>
              <button type="button" class="btn-primary btn-ad-search" @click="getAdvancedSearch()">高级搜索</button>
              <button type="button" class="btn-ad-search" @click="resetAdvancedSearch()">重置</button>
            </div>
          </div>

          <div id="bug-data-list" class="row mt-3 mb-5 table_data">

            <!-- 样式：表格 -->
            <div id="bug-table-style" class="col px-0" v-if="DataShowStyle == 'table'">
              <el-table :data='tableData'
                :default-sort="{prop: 'date', order: 'descending'}"
                @cell-mouse-enter="tableHover" @cell-mouse-leave="tableLeave">
                <el-table-column label="ID" prop="id" width="50" show-overflow-tooltip sortable>
                </el-table-column>
                <el-table-column label="状态" width="85" show-overflow-tooltip sortable>
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
                <el-table-column label="标题" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <nuxt-link style="color:#424242"
                      :to="{path:'/app/qa/bug/deatils',query:{'bug_id':scope.row.bug_id}}">
                    <el-tag v-if="scope.row.bug_label">{{ scope.row.bug_label }}</el-tag>
                    {{ scope.row.title }}
                    </nuxt-link>
                  </template>
                </el-table-column>
                <el-table-column label="优先级" align="center" width="95" sortable v-if="table_field.priority">
                  <template slot-scope="scope">
                    <div @click="BugPriorityDialog(scope.row)">
                      <span class="circle-content font-color-757575"
                        :class="{
                          'text-deadly': scope.row.priority === 'P1',
                          'text-urgency': scope.row.priority === 'P2'
                        }">{{ scope.row.priority }}
                      </span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center" width="110"
                  sortable show-overflow-tooltip v-if="table_field.create_time">
                  <template slot-scope="scope">
                    <span>{{ scope.row.create_time | date(6) }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="创建" prop="creator_user" align="center" width="85"
                  sortable  show-overflow-tooltip v-if="table_field.creator_user">
                </el-table-column>
                <el-table-column label="指派" prop="assignedTo_user" align="center" width="85"
                  sortable show-overflow-tooltip v-if="table_field.assignedTo_user">
                </el-table-column>
                <el-table-column label="最后更新" align="center" width="110">
                  <template slot-scope="scope">
                    <span>{{ scope.row.last_time | date(6) }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="最后操作" align="center" width="85" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span :class="{'display-none': scope.row.bug_id == HoverBugId}">
                      {{scope.row.last_operation_user}}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="" width="48">
                  <template slot-scope="scope">
                    <div class="display-none"
                      :class="{ 'showDataOpreate' : scope.row.bug_id == HoverBugId,
                        'hideText': scope.row.status == 'Closed'}">
                      <span id="icon-bug-edit" v-if="scope.row.creator_id === myUID || BtnRules.bug_edit">
                        <nuxt-link :to="{path:'/app/qa/bug/edit',query:{'bug_id':scope.row.bug_id}}">
                          <i class="iconfont icon-edit icon-8a8a8a size-1-5 mx-1" title="编辑缺陷"></i>
                        </nuxt-link>
                      </span>
                      <span id="icon-bug-resolve" @click="skipResolve(scope.row)" v-if="scope.row.status != 'Fixed'">
                        <i class="iconfont icon-resolve icon-8a8a8a size-1-6" title="解决缺陷"></i>
                      </span>
                      <span id="icon-bug-assign" @click="skipAssign(scope.row)">
                        <i class="iconfont icon-assign icon-8a8a8a size-2" title="指派给他人"></i>
                      </span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <!-- 数据展示样式：列表 -->
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
                    <div id="data-detailed-information" class="d-inline data-liststyle-satellite">
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
                        <p class="d-inline"
                          :class="[ item.solution_name == '已修复' ? 'text-success' : 'text-secondary' ]">
                          {{ item.solution_name }}
                        </p>
                      </span>
                      <span>最后更新: {{ item.last_time | date(6) }}</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
					</div>

          <!-- 数据翻页 -->
          <Pagination :total="total" @PsPn="getPsPn"></Pagination>

          <!-- 加载动画 -->
          <div id="page-loading" class="row">
            <div class="col text-center" v-if='!Msg && total === null'>
              <PageLoading></PageLoading>
            </div>
          </div>

          <!-- no data -->
          <div id="page-error" class="row">
            <div id="page-no-data" class="col text-center" v-if="total == 0 || Msg">
              <img :src="img_src" class="mt-5">
              <p class="text-gray no-hint">{{ Msg }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 缺陷指派 -->
    <BugAssign id="modal-assign"
      v-if="showModal == 'assign'"
      @close="showModal = false"
      :bug_id="selectedBugId"
      :product_id="visited_product_id"
      :pageSource="pageSource"
      @refreshList="getBugList()">
    </BugAssign>

    <!-- 缺陷解决 -->
    <BugResolve id="modal-resolve"
      v-if="showModal == 'resolve'"
      @close="showModal = false"
      :bug_id="selectedBugId"
      :bug_creator_id="HoverBugIdCreatorBy"
      :product_id="visited_product_id"
      :pageSource="pageSource"
      :scheme="scheme"
      @refreshList="getBugList()">
    </BugResolve>

    <!-- 改变缺陷优先级 -->
    <BugChange id="modal-change-priority"
      v-if="showModal == 'priority'"
      @close="showModal = false"
      :bug_id="selectedBugId"
      :data_type="'priority'"
      @refreshList="getBugList()">
    </BugChange>

    <!-- 缺陷关闭 -->
    <Modal id="modal-bugClosed" v-if="showModal == 'closed'" @close="showModal = false" :isFooter="true">
      <div slot="body" class="text-center my-5">
        <h3 style="font-weight: 300;">确定关闭此缺陷?</h3>
      </div>
      <button slot="footer" type="submit" class="btn btn-primary" @click="ClosedBug()">
        确定
      </button>
    </Modal>

    <!-- 缺陷导出 -->
    <Modal id="modal-export" v-if="showModal == 'export'" @close="showModal = false" :isHeaderClose="true">
      <h5 slot="header" class="modal-title">{{ selected_product }} 缺陷</h5>
      <div slot="body">
        <div class="row">
          <div class="col text-center">
            <button type="button" class="btn btn-dark mt-3 mb-5" @click="bug_export">
              数据导出
            </button>
            <p v-if="JSON.stringify(BugExportFile) !== '{}'">
              下载地址: <a :href="BugExportFile.url">{{ BugExportFile.filename }}</a>
            </p>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <p style="font-size:0.88rem;color:#424242;">
              备注：仅支持按照产品、版本、缺陷状态这三个查询条件导出; 选择好查询条件，再点击导出; 目前仅支持导出xlsx
            </p>
          </div>
        </div>
      </div>
    </Modal>

    <!-- 今日数据统计 -->
    <Modal id="modal-my-today" v-if="showModal == 'count-today'"
      @close="showModal = false" :isHeaderClose="true">
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

    <!-- 表格字段过滤 -->
    <Modal id="modal-table-filter" v-if="showModal == 'table-filter-field'"
      @close="showModal = false" :isHeaderClose="true">
      <h5 slot="header" class="modal-title">过滤字段&nbsp;&nbsp;{{ selected_product }}</h5>
      <div slot="body" class="text-center mb-3">
        <div class="modal-body text-center">
          <div class="row">
            <div class="col">
              <div class="form-check form-check-inline" v-for="(value, name) in table_field" :key="name">
                <input class="form-check-input" type="checkbox" :id="name" :value="table_field.name" v-model="table_field[name]" @change="SetTableFilterField('set')">
                <label class="form-check-label">{{ name | filterTableField }}</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>

	</div>
</template>

<script>
import PageModules from "~/components/PageModules"
import BugAssign from "~/components/BugAssign"
import BugResolve from "~/components/BugResolve"
import BugChange from "~/components/BugChange"

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
    BugAssign,
    BugResolve,
    BugChange,
    PageModules
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
      HoverBugInfo: {},
      HoverBugId: "",
      selectedBugId: "",
      HoverBugIdCreatorBy: "",
      MyTodayData: false,
      BugExportFile: {},

      // Other
      Msg: false,
      img_src: null,

      // Define Data: Query and Search field
      modules_list: [],
      modules_id: [null, null],
      m1_id: this.$route.query.m1_id || null,
      m2_id: this.$route.query.m2_id || null,
      visited_product_id: this.$route.query.product_id || "",
      selected_product: this.$route.query.product_code || "",
      selected_release: this.$route.query.release || "all",

      // Define Data: Bug-Status
      status_list: data.bug_status_list,
      selected_status: this.$route.query.status || "notClosed",

      // Define Data: Bug-priority
      priority_list: data.priority_list,
      selected_priority: [],

      // Define Data: Bug-severity_list
      severity_list: data.severity_list,
      selected_severity: [],

      // Define Data: Bug-Order
      sort_field: this.$route.query.sort_field || "last_time",
      order_list: data.order_list,

      // Define Data: Bug-more-quick-operate
      operate: this.$route.query.operate || "no",
      QuickQperationList: data.bug_quick_operation_list,

      wd: this.$route.query.wd || '',
      isShowAdSearch: this.$route.query.isShowAdSearch || "no",

      // 高级搜索
      advanced_search: {
        sort: '-',
        status_list: [],
        priority_list: [],
        severity_list: [],
        create_time: [],
        closed_time: [],
        fiexed_time: [],
        assignedTo_time: [],
        fixed_user: '',
        creator: '',
        closed_user: '',
        assignedTo_user: ''
      },
      // Define components Data
      scheme: "Fixed",
      pageSource: "page_bug_index",

      // 字段过滤
      table_field: {
        "create_time": false,
        "creator_user": true,
        "assignedTo_user": true,
        "fixed_user": false,
        "severity": false,
        "priority": true,
        // "bug_type": false,
        "solution": false,
        "last_operation_user": true,
      }
    }
  },

  filters: {
    date: util.date,
    filterTableField: util.getTableFieldName,
    filterOperators: util.getOperatorsName,
    filterSearchType: util.getSearchTypeName,
    filterBugStatusName: util.bugStatusName,
    QuickQperationName: util.QuickQperationName,
    filterOrder: util.getOrderName
  },

  computed: {

    // 页面权限菜单控制
    Rules: function() {
      let userInfo = this.$store.state.userInfo
      let PagesRules = this.$store.state.PageData
      return rules.RuleManges(userInfo,PagesRules)
    },
    BtnRules: function() {
      let userInfo = this.$store.state.userInfo
      return rules.BugBtnRules(userInfo,this.HoverBugInfo)
    },

    // 查询搜索条件组织
    QueryBuilder: function() {
      const patternNumber = new RegExp("[0-9]+")
      let Builder = {}
      let tmp_release
      Builder["pageNumber"] = this.pageNumber
      Builder["pageSize"] = this.pageSize
      Builder["isShowAdSearch"] = this.isShowAdSearch
      Builder["product_id"] = this.visited_product_id
      Builder["release"] = this.selected_release
      this.selected_status ? (Builder["status"] = this.selected_status) : undefined
      Builder["priority"] = this.selected_priority
      Builder["sort"] = this.advanced_search.sort
      Builder["sort_field"] = this.sort_field
      this.m2_id ? (Builder["m2_id"] = this.m2_id) : null
      this.m1_id ? (Builder["m1_id"] = this.m1_id) : null
      if (this.operate != "no") {
        Builder["operate"] = this.operate
      }
      if (this.wd) {
        Builder["wd"] = this.wd
      }
      return Builder
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
      return userInfo.group !== "test" ? true : false
    },
    myUID: function() {
    	let userInfo = this.$store.state.userInfo
    	return userInfo.user_id ? userInfo.user_id : null
    },

    // show user config
    DataShowStyle: function() {
      return 'table'
      // let config = this.$store.state.UserConfig
      // if (config) {
      //   if (config["BUG_DATA_SHOW_STYPE"]) {
      //     return this.ScreenWidth > 768 ? config["BUG_DATA_SHOW_STYPE"] : 'list'
      //   } else {
      //     return this.ScreenWidth > 768 ? 'table' : 'list'
      //   }
      // } else {
      //   return this.ScreenWidth > 768 ? 'table' : 'list'
      // }
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
    wd: function(val, oldVal) {
      this.pageNumber = 1
    },
    m1_id: function(val, oldVal) {
      this.pageNumber = 1
    },
    m2_id: function(val, oldVal) {
      this.pageNumber = 1
    },
    visited_product_id: function(val, oldVal) {
      if (this.visited_product_id) {
        const ProductMembersData = this.$store.state.ProductMemberList
        const isThisProduct = ProductMembersData.hasOwnProperty("product_id")
          ? (ProductMembersData["product_id"] === this.visited_product_id ? true : false) : false
        if (!isThisProduct){
          this.$store.dispatch("getProductMembers",this.visited_product_id)
        }
      }
    },
    total: function() {
      if (this.total === 0) {
        this.img_src = require("static/images/happy.png")
        this.Msg = "没找到数据"
      } else {
        this.Msg = ""
      }
    },
		QueryBuilder: function(val, oldVal) {
			if (JSON.stringify(val) != JSON.stringify(oldVal)) {
				this.tableData = []
				this.$route.query.product_id
					? this.$router.push({path: "/app/qa/bug",query: this.QueryBuilder})
          : this.$router.replace({path: "/app/qa/bug",query: this.QueryBuilder})
        this.wd
          ? this.goSearch()
          : (this.isShowAdSearch === 'yes' ?  this.getAdvancedSearch() : this.getBugList())
			}
		}
  },

  created() {
    if (JSON.stringify(this.$store.state.BugProperty) === "{}") {
    	this.$store.dispatch("getBugProperty")
    }
  },

  mounted() {
    this.wd && this.visited_product_id ? this.goSearch() : this.getBugList()
    this.ScreenWidth = process.server ? 0 : document.body.clientWidth

    // 页面表格字段过滤
    this.SetTableFilterField('get')

    window.addEventListener("keypress", event => {
      console.log(event)
      if (event.key === 'f' && event.ctrlKey) {
        document.getElementById("id-title-search").focus()
      }
      if (event.key === 'n' && event.ctrlKey) {
        document.getElementById("bug-create").focus()
      }
    })
  },

  methods: {
    // get $emit data
    GetProductInfo (data)  {
      this.visited_product_id = data.product_id
      this.selected_release = data.release
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
     * 下拉相关操作
     */
    handleCommand(data) {
      if ("order_name" in data) {
        this.sort_field = data["order_value"]
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

    /**
     * 缺陷数据
     */
    getBugList() {
      if (!this.visited_product_id) { return }
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

		/**
     * 用于判断是否显示高级搜索区域
     */
    unfoldAdvancedSearch() {
      if (this.isShowAdSearch == 'no') {
        this.isShowAdSearch = 'yes'
      } else {
        this.isShowAdSearch = 'no'
        this.wd = ""
      }
    },

    /**
     * 缺陷高级搜索条件重置
     */
    resetAdvancedSearch () {
      this.advanced_search.sort = '-'
      this.advanced_search.status_list = []
      this.advanced_search.priority_list = []
      this.advanced_search.severity_list = []
      this.advanced_search.create_time = []
      this.advanced_search.closed_time = []
      this.advanced_search.fiexed_time = []
      this.advanced_search.assignedTo_time = []
      this.advanced_search.fixed_user = ''
      this.advanced_search.creator = ''
      this.advanced_search.closed_user = ''
      this.advanced_search.assignedTo_user = ''
    },

    /**
     * 缺陷高级搜索
     */
		getAdvancedSearch() {
      this.wd = ""
      let basic_query = {
        "pageNumber": this.pageNumber,
        "pageSize": this.pageSize,
        "product_id": this.visited_product_id,
        "release": this.selected_release,
        "sort_field": this.sort_field,
        "isShowAdSearch": 'yes'
      }
      if (JSON.stringify(this.advanced_search.status_list) !== '[]') {
        this.selected_status = 'all'
      }

      // 搜索条件合并
      let advanced_search = this.advanced_search
      const merge_search = Object.assign(this.advanced_search, basic_query)

      this.axios({
        method: "POST",
        url: "/api/qa/bug/search",
        data: JSON.stringify(merge_search)
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

		/**
     * 缺陷搜索，目前仅支持搜索：id、标签、标题、指派人员
     */
    goSearch() {
      let data = this.QueryBuilder
      if (!data.wd) {
        this.$notify.error({title: "提示",message: "请输入搜索内容"})
        return
      }
      this.axios({
        method: "POST",
        url: "/api/qa/bug/search",
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

		/**
     * 缺陷关闭
     */
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

		/**
     * 缺陷导出到excel
     */
    bug_export () {
      if (!this.visited_product_id) { return }
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

    /**
     * 今日数据统计
     */
    myToday() {
      this.showModal = 'count-today'
      if (!this.visited_product_id) { return }
      this.axios
				.get("/api/analyze/bug/my_today?product_id=" + this.visited_product_id)
				.then(res => {
					if (res.data["status"] === 20000) {
						this.MyTodayData = res.data
					}
				})
    },

    /**
     * 表格行：数据悬停
     */
    tableHover(row) {
      this.HoverBugInfo = row
      this.HoverBugIdCreatorBy = row.creator_id
      this.HoverBugId = row.bug_id
      this.visited_product_id = row.product_id
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

    /**
     * 页面样式切换: 表格、列表
     */
    switchStyle() {
      let style = this.DataShowStyle == 'table' ? 'list' : 'table'
      this.axios
				.get('/api/userconfig?BUG_DATA_SHOW_STYPE=' + style)
				.then(res => {
					if (res.data["status"] === 20000) {
						this.$store.dispatch('getUserInfo')
					}
				})
    },

    /**
     * 表格字段过滤
     */
    SetTableFilterField(type) {
      if (process.client) {
        if (type === 'set') {
          window.localStorage.setItem("page_bug_table_filter_field", JSON.stringify(this.table_field))
        }
        if (type === 'get') {
          let local_data = window.localStorage.page_bug_table_filter_field
          local_data ? this.table_field = JSON.parse(local_data) : this.table_filter_field
        }
      }
    }

  }
}
</script>

<style scope>
  @import "~/assets/css/test.css";
  .sa-grid-item {
    line-height: 1.8rem;
    font-size:0.92rem;
  }
  .sa-grid-item .el-input {
    width: 50% !important;
    height: 2.2rem !important;
  }

  .sa-grid-item  .el-input__inner {
    width: 50% !important;
    border:none !important;
    border-bottom: 1px solid rgb(229, 229, 229) !important;
    height: 2.2rem !important;
    border-radius: 0px !important;
  }

  .sa-desc {
    width: 5rem;
    display: inline-block;
    font-weight:400;
    color: #5E6D82;
  }
  .sc-context span {
    margin-right: 0.8rem;
    color: #5E6D82;
  }
  .sc-context span > input {
    margin-right: 0.3rem;
  }
  .btn-ad-search {
    font-size:0.88rem;
    /* color: #5E6D82; */
    /* background-color: #ffffff; */
    /* border: 1px solid #eeeeee; */
    border-radius: 5px;
    padding: 4px 8px;
    margin: 9px;
  }
  .ad-search-input{
    display: inline;
    border: none;
    border-bottom: 1px solid rgb(220, 223, 230);
    outline: none;
  }
</style>
