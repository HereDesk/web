<template>
  <div id="page">
    <div id="page-details" class="container mt-5" v-if="JSON.stringify(BugDetails) !== '{}'">
      <div id="page-details-head" class="row">
        <div id="page-deatails-title" class="col-12">
          <h3 class="details-title">{{ BID }} {{ BugDetails.title }}</h3>
        </div>
        <div id="page-details-opera-btn" class="col-12 my-3">
          <button type="btn" class="btn btn-gray mr-3" @click="BugDelete()" v-if="BtnRules.del">删除</button>
          <button type="btn" class="btn btn-gray" v-if="BtnRules.edit" @click="EditBug()">编辑</button>
          <div class="btn-group btn-group-toggle mx-3">
            <label class="btn btn-gray active" v-if="BtnRules.assign">
              <input type="radio" name="options" id="bug-designate"
                autocomplete="off" @click="SkipAssign()">分配
            </label>
            <label class="btn btn-gray" data-toggle="modal" data-target="#modal-reopen"
              v-if="BtnRules.reopen">
              <input type="radio" name="options" id="bug-open" autocomplete="off">重新打开
            </label>
          </div>
          <div class="btn-group btn-group-toggle" data-toggle="buttons">
            <label class="btn btn-gray" @click="immediateRecovered()" v-if="BtnRules.Recovered">
              <input type="radio" name="options" id="bug-fixed" autocomplete="off">已解决
            </label>
            <label class="btn btn-gray" @click="SkipRecovered('other')" v-if="BtnRules.Recovered">
              <input type="radio" name="options" id="bug-other" autocomplete="off">其它解决方案
            </label>
          </div>
          <button type="button" class="btn btn-gray ml-3" @click="BugClosed()" v-if="BtnRules.close">
            关闭
          </button>
          <button type="button" class="btn btn-gray ml-3"
            data-toggle="modal" data-target="#modal-hangup" v-if="BtnRules.hangup">
            延期挂起
          </button>
          <button type="button" class="btn btn-gray ml-3"
            data-toggle="modal" data-target="#modal-notes" v-if="BtnRules.notes">
            备注
          </button>
          <button type="button" class="btn btn-gray ml-3" @click="$router.back(-1)">返回</button>
        </div>
      </div>

      <div id="page-details-body" class="row mt-3">
        
        <div id="page-details-body-main" class="col-md-8 col-sm-12">
          <div id="bug-steps" class="height-7 mb-5" v-if="BugDetails.steps">
            <h6 class="details-minor-title">
              <span class="standline"></span>&nbsp;&nbsp;操作步骤
            </h6>
            <div class="details-block" v-html="ConvertsMd(BugDetails.steps)"></div>
          </div>
          <div id="bug-reality-result" class="height-7 mb-5" v-if="BugDetails.reality_result">
            <h6 class="details-minor-title">
              <span class="redline"></span>&nbsp;&nbsp;实际结果
            </h6>
            <div class="details-block" v-html="ConvertsMd(BugDetails.reality_result)"></div>
          </div>
          <div id="bug-expected-result" class="height-7 mb-5" v-if="BugDetails.expected_result">
            <h6 class="details-minor-title">
              <span class="successline"></span>&nbsp;&nbsp;预期结果
            </h6>
            <div class="details-block" v-html="ConvertsMd(BugDetails.expected_result)"></div>
          </div>
          <div id="bug-remark" class="height-7 mb-5" v-if="BugDetails.remark">
            <h6 class="details-minor-title">
              <span class="grayline"></span>&nbsp;&nbsp;附加信息
            </h6>
            <div class="dropdown-divider"></div>
            <div class="details-block" v-html="ConvertsMd(BugDetails.remark)"></div>
          </div>

          <!-- 图片附件 -->
          <div id="bug-annex" class="height-7 mb-5" v-if="Annex.length > 0">
            <h6 class="details-minor-title">
              <span class="grayline"></span>&nbsp;&nbsp;附件
            </h6>​
            <picture class="container-fluid">
              <div class="row">
                <div class="col-lg-2 col-md-3 col-sm-4 images" v-for="p in Annex" :key="p.id" v-viewer>
                  <span class="file-card text-center pt-2" 
                    v-if="['md','log','txt','doc','docx','pdf','json','html'].includes(p.suffix)">
                    <a class="file-link" :href="p.url" target="_blank">
                      <i class="iconfont size-2"
                        :class="{
                          'icon-markdown': p.suffix === 'md',
                          'icon-icon-rizhi font-color-1296db': p.suffix === 'log',
                          'icon-txt font-color-00BFA5': p.suffix === 'txt',
                          'icon-jsonfile': p.suffix === 'json',
                          'icon-html font-color-00BFA5': p.suffix === 'html',
                          'icon-PDF font-color-d81e06': p.suffix === 'pdf',
                          'icon-WORD font-color-007BFF': ['doc','docx'].includes(p.suffix),
                          'icon-excel font-color-00BFA5': ['xls','xlsx'].includes(p.suffix),
                          'icon-PPT font-color-d81e06': ['ppt','pptx'].includes(p.suffix)
                        }"></i>
                      <p class="font-size-85 font-color-757575">下载查看</p>
                    </a>
                  </span>
                  <span v-else-if="['mp4','mov','mp3'].includes(p.suffix)">
                    <a class="display-block" style="width:100%height:100%color:inherit" :href="p.url" target="_blank">
                      <i class="iconfont size-2 icon-video"></i>
                      <p class="font-size-85 font-color-757575">下载查看</p>
                    </a>
                  </span>
                  <span v-else>
                    <img class="img-thumbnail" alt="..." :src="p.url">
                  </span>
                </div>
              </div>
            </picture>
          </div>
          <div id="bug-details-history" class="height-7 mb-5 font-color-383838 font-size-93">
            <h6 class="details-minor-title">
              <span class="grayline"></span>&nbsp;&nbsp;活动记录
            </h6>
            <div class="dropdown-divider"></div>
            <div id="bug-history-record" class="mt-3">
              <ol class="pl-3">
                <li v-for="(item,index) in history" :key="index" class="my-2">
                  {{ item.create_time | date }} : <span class="log-text-user">{{ item.username }}</span>{{ item.desc }}
                  <div class="log-text-remark font-size-93" v-if="item.remark" v-html="ConvertsMd(item.remark)">
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>

        <div id="page-details-body-minor" class="col-md-4 col-sm-12">
          <div id="bug-details-of-basic">
            <h6 class="details-minor-title">
              <span class="grayline"></span>&nbsp;&nbsp;详情
            </h6>
            <div class="dropdown-divider"></div>
            <ul class="mt-3 pl-3 satellite_info">
              <li id="bug-desc-product-version">
                <label>产品版本：</label>
                <span>{{ BugDetails.product_code }} {{ BugDetails.release }}</span>
              </li>
              <li id="bug-desc-modules">
                <label>模块：</label>
                <span>{{ BugDetails.m1_name }} {{ BugDetails.m2_name }}</span>
              </li>
              <li id="bug-desc-status">
                <label>缺陷状态：</label>
                <span  class="border-radius-5"
                  :class="{ 'text-secondary': BugDetails.status === 'Closed',
                    'text-success': BugDetails.status === 'Fixed',
                    'text-urgency': ['New','Open','Reopen'].includes(BugDetails.status),
                    'text-warning': BugDetails.status === 'Hang-up'}">
                  {{ BugDetails.status_name }}
                </span>
              </li>
              <li id="bug-desc-severity" @click="BugPriorityDialog('severity')">
                <label>严重程度：</label>
                <span class="font-color-2973B7">
                  {{ BugDetails.severity_name }} <i class="iconfont icon-edit ml-3" v-if="BtnRules.edit"></i>
                </span>
              </li>
              <li id="bug-desc-priority" @click="BugPriorityDialog('priority')">
                <label>优先级：</label>
                <span class="font-color-2973B7">
                  {{ BugDetails.priority_name }} <i class="iconfont icon-edit ml-3" v-if="BtnRules.edit"></i>
                </span>
              </li>
              <li id="bug-desc-solution">
                <label>解决方案：</label>
                {{ BugDetails.solution_name }}
              </li>
              <li id="bug-desc-type">
              	<label>缺陷类型：</label>
              	{{ BugDetails.bug_type_name }}问题
              </li>
              <li id="bug-desc-source">
              	<label>缺陷来源：</label>
              	{{ BugDetails.bug_source_name }}
              </li>
            </ul>
          </div>
          <div id="bug-details-of-person-date">
            <h6 class="details-minor-title pt-3">
              <span class="grayline"></span>&nbsp;&nbsp;人员/日期
            </h6>
            <div class="dropdown-divider"></div>
            <ul class="mt-3 mb-5 pl-3 satellite_info">
              <li id="bug-last-time">
              	<label>最后操作：</label>
              	{{ BugDetails.last_time | date }}
              </li>
              <li id="bug-creator">
                <label>创建者：</label>
                {{ BugDetails.creator_user }}
              </li>
              <li id="bug-create-time">
                <label>创建日期：</label>
                {{ BugDetails.create_time | date }}
              </li>
              <li id="bug-assignedTo_user">
                <label>指派给：</label>
                {{ BugDetails.assignedTo_user }}
              </li>
              <li id="bug-assignedTo_time">
                <label>指派日期：</label>
                {{ BugDetails.assignedTo_time | date }}
              </li>
              <li id="bug-fixed_user">
                <label>解决人：</label>
                {{ BugDetails.fixed_user }}
              </li>
              <li id="bug-fixed_time">
                <label>解决日期：</label>
                {{ BugDetails.fixed_time | date }}
              </li>
              <li id="bug-closed_user">
                <label>关闭：</label>
                {{ BugDetails.closed_user }}
              </li>
              <li id="bug-closed_time">
                <label>关闭日期：</label>
                {{ BugDetails.closed_time | date }}
              </li>
            </ul>
          </div>
          <div id="bug-details-of-testcase" class="pb-5" v-if="BugDetails.case_id">
            <h6 class="details-minor-title">
              <span class="grayline"></span>&nbsp;&nbsp;关联的测试用例
            </h6>
            <div class="dropdown-divider"></div>
            <ul class="mt-3 pl-3 satellite_info">
              <li>
                <label>关联用例：</label>
                <nuxt-link :to="{ path:'/app/qa/testcase/deatils',query:{'case_id':BugDetails.case_id}}">
                  查看
                </nuxt-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div id="page-loading" class="col text-center" v-if="isShowLoading">
      <PageLoading></PageLoading>
    </div>

    <!-- Bug处理操作：指派 -->
    <div id="bug-list-assign">
      <BugAssign
        :bug_id="currentBugId"
        :product_code="product_code"
        :pageSource="pageSource"
        :member_list="member_list"
      ></BugAssign>
    </div>

    <!-- Bug处理操作：解决 -->
    <div id="bug-list-resolve">
      <BugResolve
        :bug_id="currentBugId"
        :OpenBy="BugDetails.openedBy"
        :product_code="product_code"
        :scheme="scheme"
        :pageSource="pageSource"
        :member_list="member_list">
      </BugResolve>
    </div>

    <!-- Bug处理操作：修改优先级/严重程度 -->
    <div id="bug-list-change">
      <BugChange 
        :data_type="components_value" 
        :bug_id="currentBugId" 
        @refreshList="getBugDetails()">
      </BugChange>
    </div>

    <!-- Bug处理操作：重新打开缺陷 -->
    <div id="modal-reopen" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">重新打开缺陷</h5>
          </div>
          <div class="modal-body">
            <div class="form-group row col-md-auto mx-3">
              <label for="assignedTo">指派给</label>
              <select class="select-control border" v-model="ReOpenData.assignedTo">
                <option disabled value>请选择指派给谁</option>
                <option v-for="item in member_list" :key="item.id" :value="item.user_id">
                  {{ item.realname }}</option>
              </select>
            </div>
            <div class="form-group row col-md-auto mx-3">
              <mavon-editor style="width:100%;" placeholder="请输入原因 ~ "
                :toolbarsFlag="false" :subfield="false" v-model.trim="ReOpenData.remark">
              </mavon-editor>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-cancel" data-dismiss="modal">关闭</button>
            <button type="submit" class="btn btn-primary" @click="ReOpen()">提交</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bug处理操作：备注 -->
    <div id="modal-notes" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">添加备注</h5>
          </div>
          <div class="modal-body">
            <mavon-editor class="mx-3" :toolbars="mavon_md_base_toolbars" :subfield="false" placeholder="请输入备注 ~ "
              v-model.trim="NotesData.remark">
            </mavon-editor>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-cancel" data-dismiss="modal">关闭</button>
            <button type="submit" class="btn btn-primary" @click="AddNotes()">提交</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bug处理操作：延期挂起 -->
    <div id="modal-hangup" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">挂起延期</h5>
          </div>
          <div class="modal-body">
            <mavon-editor class="mx-3" :toolbarsFlag="false" :subfield="false" placeholder="请输入延期原因 ~ "
              v-model.trim="HangUpData.remark">
            </mavon-editor>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-cancel" data-dismiss="modal">关闭</button>
            <button type="submit" class="btn btn-primary" @click="HandUp()">确定延期</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue"
import axios from "axios"

import PageLoading from "~/components/PageLoading"
import BugAssign from "~/components/BugAssign"
import BugResolve from "~/components/BugResolve"
import BugChange from "~/components/BugChange"

import util from "~/assets/js/util.js"
import rules from "~/assets/js/rules.js"
import data from '~/assets/js/data.js'

import hljs from 'highlight.js'
import marked from 'marked'
marked.setOptions({
  renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    highlight: function (code) {
      return hljs.highlightAuto(code).value
    }
})

export default {
  head() {
    return {
      title: "HDesk - 缺陷详情"
    }
  },
  validate({ query }) {
    return /\w{2,6}/.test(query.bug_id)
  },

  layout: "head",

  components: {
    BugAssign,
    BugResolve,
    BugChange,
    PageLoading
  },

  data() {
    return {
      mavon_md_base_toolbars: data.mavon_md_base_toolbars,
      components_value: '',
      currentBugId: this.$route.query.bug_id || null,
      current_product_code: "",
      BugDetails: {},
      Annex: [],
      product_code: "",
      ResolveData: {
        bug_id: "",
        assignedTo: "",
        reamrk: "",
        solution: "Fixed"
      },
      AssignData: {
        bug_id: "",
        assignedTo: "",
        remark: ""
      },
      ClosedData: {
        bug_id: ""
      },
      ReOpenData: {
        bug_id: "",
        assignedTo: "",
        remark: ""
      },
      NotesData: {
        bug_id: "",
        remark: ""
      },
      HangUpData: {
        bug_id: "",
        remark: ""
      },
      history: [],
      // 组件数据
      bug_idOpenBy: "",
      scheme: "",
      pageSource: "page_bug_details"
    }
  },

  filters: {
    date: util.date,
    CheckUrl: util.CheckUrl
  },

  watch: {
    product_code: function(val, oldVal) {
      if (this.product_code) {
        this.getMemberList()
      }
    }
  },

  computed: {
    member_list: function() {
      return this.$store.state.ProductMemberList ? this.$store.state.ProductMemberList["data"] : ''
    },
    BtnRules: function() {
      return rules.BugRules(this.BugDetails, this.$store.state.userInfo)
    },
    BID: function() {
      return this.BugDetails["id"] ? this.BugDetails["id"] + "、" : ""
    },
    BugStatus: function() {
      return this.BugDetails ? this.BugDetails["status"] : false
    },
    isShowLoading: function() {
      return JSON.stringify(this.BugDetails) === "{}" ? "1" : null
    },
    ConvertsMd () {
      return function(value) {
        return value ? marked(value) : ""
      }
    }
  },

  created() {
    this.getBugDetails()
    if (JSON.stringify(this.$store.state.BugProperty) === "{}") {
    	this.$store.dispatch("getBugProperty")
    }
  },

  methods: {
    getBugDetails() {
      if (this.currentBugId) {
        axios
          .get("/api/qa/bug/details?bug_id=" + this.currentBugId)
          .then(res => {
            if (res.data["status"] === 20000) {
              this.BugDetails = res.data["data"]
              this.Annex = res.data["annex"]
              this.product_code = res.data["data"]["product_code"]
              // get history
              this.BugHistory()
            } else {
              this.$notify.error({
                title: "错误",
                message: res.data["msg"]
              })
            }
          })
      }
    },
    getMemberList() {
      axios
        .get("/api/pm/member/list?product_code=" + this.product_code)
        .then(res => {
          if (res.data["status"] === 20000) {
            this.$store.commit("setProductMemberList", res.data)
          }
        })
    },
    // 编辑缺陷
    EditBug() {
      this.$router.push("/app/qa/bug/edit?bug_id=" + this.currentBugId)
    },

    // Bug immediate Recovered
    immediateRecovered() {
      this.ResolveData.bug_id = this.currentBugId
      this.ResolveData.assignedTo = this.BugDetails.creator_id
      axios({
        method: "post",
        url: "/api/qa/bug/resolve",
        data: JSON.stringify(this.ResolveData)
      }).then(res => {
        if (res.data["status"] === 20000) {
          this.$router.go(-1)
          this.$notify.success({ title: "成功", message: res.data["msg"] })
        } else {
          this.$notify.error({ title: "错误", message: res.data["msg"] })
        }
      })
    },

    SkipRecovered(scheme) {
      this.scheme = scheme
      // this.current_product_code = this.product_code
      $("#componentsResolve").modal("show")
    },

    // 分配
    SkipAssign() {
      // this.current_product_code = this.product_code
      $("#componentsAssign").modal("show")
    },

    // bug delete
    BugDelete() {
      axios.get("/api/qa/bug/delete?bug_id=" + this.currentBugId).then(res => {
        if (res.data["status"] === 20000) {
          this.$router.go(-1)
          this.$notify.success({ title: "成功", message: res.data["msg"] })
        } else {
          this.$notify.error({ title: "失败", message: res.data["msg"] })
        }
      })
    },

    // 操作：bug修改优先级
    BugPriorityDialog(data) {
      this.components_value = data
      if (this.components_value && this.BtnRules.edit) {
        $("#modal-modify-priority").modal("show")
      }
    },

    // bug closed
    BugClosed() {
      this.ClosedData.bug_id = this.currentBugId
      axios({
        method: "post",
        url: "/api/qa/bug/close",
        data: JSON.stringify(this.ClosedData)
      }).then(res => {
        if (res.data["status"] === 20000) {
          this.$notify.success({ title: "成功", message: res.data["msg"] })
          this.$router.go(-1)
        } else {
          this.$notify.error({ title: "错误", message: res.data["msg"] })
        }
      })
    },

    // bug reopen
    ReOpen() {
      this.ReOpenData.bug_id = this.currentBugId
      if (this.ReOpenData.assignedTo === "") {
        return this.$notify.error({ title: "错误", message: "请选择指派人" })
      }
      if (
        (this.ReOpenData.remark.length > 1000) |
        (this.ReOpenData.remark.length < 5)
      ) {
        return this.$notify.error({
          title: "错误",
          message: "重新打开缺陷，原因不能为空哦"
        })
      }
      axios({
        method: "post",
        url: "/api/qa/bug/reopen",
        data: JSON.stringify(this.ReOpenData)
      }).then(res => {
        if (res.data["status"] === 20000) {
          this.$router.go(-1)
          $("#modal-reopen").modal("hide")
          this.$notify.success({ title: "成功", message: res.data["msg"] })
        } else {
          this.$notify.error({ title: "错误", message: res.data["msg"] })
        }
      })
    },

    // bug hand up
    HandUp() {
      this.HangUpData.bug_id = this.currentBugId
      axios({
        method: "post",
        url: "/api/qa/bug/hangup",
        data: JSON.stringify(this.HangUpData)
      }).then(res => {
        if (res.data["status"] === 20000) {
          this.$router.go(-1)
          $("#modal-hangup").modal("hide")
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
      })
    },

    // the bug history record
    BugHistory() {
      axios.get("/api/qa/bug/history?bug_id=" + this.currentBugId).then(res => {
        if (res.data["status"] === 20000) {
          this.history = res.data["data"]
        }
      })
    },

    // add notes or remark
    AddNotes() {
      this.NotesData.bug_id = this.currentBugId
      axios({
        method: "post",
        url: "/api/qa/bug/add_notes",
        data: JSON.stringify(this.NotesData)
      }).then(res => {
        if (res.data["status"] === 20000) {
          this.BugHistory()
          $("#modal-notes").modal("hide")
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
      })
    }
  }
}
</script>

<style>
  @import "~/static/static/common/css/test.css"
</style>
