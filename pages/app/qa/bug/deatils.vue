<template>
  <div id="page">

    <!-- 页面首次加载动画 -->
    <div id="page-loading" class="col text-center" v-if="isShowLoading">
      <PageLoading></PageLoading>
    </div>

    <!-- Bug: 页面详情 -->
    <div id="page-details" class="container mt-5" v-if="JSON.stringify(BugDetails) !== '{}'">
      <!-- 顶部操作按钮 -->
      <div id="page-details-head" class="row">
        <div class="col-md-10 col-sm-12">
          <div class="row">
            <div id="page-deatails-title" class="col-12">
              <h3 class="details-title">{{ BID }} {{ BugDetails.title }}</h3>
            </div>
            <div id="page-details-opera-btn" class="col-12 my-3">
              <button type="button" class="btn btn-op" @click="showModal = 'tags'">打标签</button>
              <button type="button" class="btn btn-op" @click="BugDelete()" v-if="BtnRules.del">删除</button>
              <button type="button" class="btn btn-op" @click="EditBug()" v-if="BtnRules.edit"> 编辑 </button>
              <button type="button" class="btn btn-op" @click="showModal = 'assign'" v-if="BtnRules.assign">分配</button>
              <button type="button" class="btn btn-op" @click="showModal = 'ReOpen'" v-if="BtnRules.reopen">重新打开</button>
              <div class="btn-group" data-toggle="buttons" v-if="BtnRules.Recovered">
                <label class="btn btn-op mr-0" @click="immediateRecovered()" > 已解决 </label>
                <label class="btn btn-op" @click="showModal = 'resolve'"> 其它解决方案 </label>
              </div>
              <button type="button" class="btn btn-op" @click="showModal = 'hangup'" v-if="BtnRules.hangup"> 延期挂起 </button>
              <button type="button" class="btn btn-op" @click="showModal = 'closed'" v-if="BtnRules.close">关闭</button>
              <button type="button" class="btn btn-op" @click="showModal = 'notes'" v-if="BtnRules.notes">备注</button>
              <button type="button" class="btn btn-op" @click="$router.back(-1)">返回</button>
            </div>
          </div>
        </div>
        <div class="col-md-2 col-sm-12">
          <div class="bug-tags" v-if="BugDetails.bug_label">{{ BugDetails.bug_label }}</div>
        </div>
      </div>

      <!-- 页面主体 -->
      <div id="page-details-body" class="row mt-3">
        <!-- 缺陷：步骤、结果、附加信息 -->
        <div id="page-details-body-main" class="col-md-8 col-sm-12">
          <div id="bug-steps" class="height-7 mb-3" v-if="BugDetails.steps">
            <h5 class="details-minor-title">
              <span class="standline"></span>&nbsp;&nbsp;操作步骤
            </h5>
            <div class="details-block" v-html="convertsMarkdown(BugDetails.steps)"></div>
          </div>
          <div id="bug-reality-result" class="height-7 mb-3" v-if="BugDetails.reality_result">
            <h5 class="details-minor-title">
              <span class="redline"></span>&nbsp;&nbsp;实际结果
            </h5>
            <div class="details-block" v-html="convertsMarkdown(BugDetails.reality_result)"></div>
          </div>
          <div id="bug-expected-result" class="height-7 mb-3" v-if="BugDetails.expected_result">
            <h5 class="details-minor-title">
              <span class="successline"></span>&nbsp;&nbsp;预期结果
            </h5>
            <div class="details-block" v-html="convertsMarkdown(BugDetails.expected_result)"></div>
          </div>
          <div id="bug-remark" class="height-7 mb-5" v-if="BugDetails.remark">
            <h5 class="details-minor-title">
              <span class="grayline"></span>&nbsp;&nbsp;附加信息
            </h5>
            <div class="dropdown-divider"></div>
            <div class="details-block" v-html="convertsMarkdown(BugDetails.remark)"></div>
          </div>

          <!-- 缺陷：图片附件 -->
          <div id="bug-annex" class="height-7" v-if="Annex.length > 0 || BtnRules.upload">
            <h5 class="details-minor-title">
              <span class="grayline"></span>&nbsp;&nbsp;附件
              <span id="icon-upload" @click="showModal = 'upload'" title="上传附件" >
                <i class="iconfont icon-cloudupload size-1-3 mx-3 font-color-2973B7"></i>
              </span>
            </h5>​
            <FileShow :Annex="Annex"></FileShow>
          </div>

          <!-- 缺陷：历史记录 -->
          <div id="bug-details-history" class="height-7 mb-5 font-color-383838 font-size-93">
            <h5 class="details-minor-title">
              <span class="grayline"></span>&nbsp;&nbsp;活动记录
            </h5>
            <div class="dropdown-divider"></div>
            <div id="bug-history-record" class="mt-3">
              <ol class="pl-3">
                <li v-for="(item,index) in history" :key="index" class="my-2">
                  {{ item.create_time | date }} :
                  <span class="log-text-user">{{ item.username }}</span>
                  <span>{{ item.desc }}</span>
                  <span class="font-color-F05945" v-if="item.remark_status === 0">备注已被删除</span>
                  <span class="font-color-2973B7" v-if="item.remark_status === 2">修改过</span>
                  <div class="log-text-remark" v-if="item.remark && item.remark_status !== 0" >
                    <span v-html="convertsMarkdown(item.remark)"></span>
                    <i class="iconfont icon-edit"
                      @click="showModal='edit-notes',
                      EditNotesData.remark=item.remark,
                      EditNotesData.bug_id=item.bug_id,
                      EditNotesData.record_id=item.record_id"
                      v-if="item.user_id === login_user_id"></i>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>

        <!-- 缺陷：附属信息 -->
        <div id="page-details-body-minor" class="col-md-4 col-sm-12">
          <div id="bug-details-of-basic">
            <h5 class="details-minor-title">
              <span class="grayline"></span>&nbsp;&nbsp;详情
            </h5>
            <div class="dropdown-divider"></div>
            <ul class="mt-3 pl-3 ul_satellite">
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
                <span class="border-radius-5"
                  :class="{
                    'text-secondary': BugDetails.status === 'Closed',
                    'text-success': BugDetails.status === 'Fixed',
                    'text-urgency': ['New','Open','Reopen'].includes(BugDetails.status),
                    'text-warning': BugDetails.status === 'Hang-up'}">
                  {{ BugDetails.status_name }}
                </span>
              </li>
              <li id="bug-desc-severity" @click="BugPSDialog('severity')">
                <label>严重程度：</label>
                <span class="font-color-2973B7">
                  {{ BugDetails.severity_name }}
                  <i class="iconfont icon-edit ml-3" v-if="BtnRules.edit"></i>
                </span>
              </li>
              <li id="bug-desc-priority" @click="BugPSDialog('priority')">
                <label>优先级：</label>
                <span class="font-color-2973B7">
                  {{ BugDetails.priority_name }}
                  <i class="iconfont icon-edit ml-3" v-if="BtnRules.edit"></i>
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
            <h5 class="details-minor-title pt-3">
              <span class="grayline"></span>&nbsp;&nbsp;人员/日期
            </h5>
            <div class="dropdown-divider"></div>
            <ul class="mt-3 mb-5 pl-3 ul_satellite">
              <li id="bug-last-time">
                <label>最后操作：</label>
                {{ BugDetails.last_operation_user }}
              </li>
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
              <li id="bug-assignedTo_user" @click="skipAssign(BugDetails)">
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
            <h5 class="details-minor-title">
              <span class="grayline"></span>&nbsp;&nbsp;关联的测试用例
            </h5>
            <div class="dropdown-divider"></div>
            <ul class="mt-3 pl-3 ul_satellite">
              <li>
                <label>关联用例：</label>
                <nuxt-link :to="{
                  path:'/app/qa/testcase/deatils',
                  query:{'case_id':BugDetails.case_id}}
                ">查看
                </nuxt-link>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>

    <!-- Bug处理操作：指派 -->
    <BugAssign id="modal-assign"
      v-if="showModal == 'assign'"
      @close="showModal = false"
      :bug_id="currentBugId"
      :bug_priority="BugDetails.priority_name"
      :product_code="product_code"
      :pageSource="pageSource">
    </BugAssign>

    <!-- Bug处理操作：解决 -->
    <BugResolve id="modal-resolve"
      v-if="showModal == 'resolve'"
      @close="showModal = false"
      :bug_id="currentBugId"
      :bug_creator_id="BugDetails.creator_id"
      :product_id="BugDetails.product_id"
      :scheme="'other'"
      :pageSource="pageSource">
    </BugResolve>

    <!-- Bug处理操作：修改优先级/严重程度 -->
    <BugChange id="modal-change"
      v-if="['priority','severity'].includes(showModal)"
      @close="showModal = false"
      :data_type="components_value"
      :bug_id="currentBugId"
      @refreshList="getBugDetails()">
    </BugChange>

    <!-- Bug上传附件 -->
    <Modal id="modal-upload" v-if="showModal == 'upload'"
      :isHeaderClose="true" @close="showModal = false">
      <h5 slot="header" class="modal-title">上传附件</h5>
      <div slot="body" class="mb-3 text-center">
        <FileUpload :fileLimit="3" @refresh="getBugDetails()"></FileUpload>
        <p class="pt-3 font-size-85 text-gray">备注：删除其它的附件，请点击编辑</p>
      </div>
    </Modal>

    <!-- Bug处理操作：重新打开缺陷 -->
    <Modal id="modal-reopen" class="no-toolbars"
      v-if="showModal == 'ReOpen'" @close="showModal = false" :isFooter="true">
    	<h5 slot="header" class="modal-title">重新打开缺陷</h5>
    	<div slot="body">
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
    	<div slot="footer">
    		<button type="submit" class="btn btn-primary" @click="ReOpen()">提交</button>
    	</div>
    </Modal>

    <!-- Bug处理操作：增加备注 -->
    <Modal id="modal-notes" class="toolbars"
      v-if="showModal == 'notes'" @close="showModal = false" :isFooter="true">
      <h5 slot="header" class="modal-title">增加备注</h5>
      <mavon-editor slot="body" class="mx-3"
        :toolbars="mavon_md_base_toolbars"
        :subfield="false" placeholder="请输入备注 ~ "
        v-model.trim="NotesData.remark">
      </mavon-editor>
      <div slot="footer">
        <button type="submit" class="btn btn-primary" @click="AddNotes()">提交</button>
      </div>
    </Modal>

    <!-- Bug处理操作：修改备注 -->
    <Modal id="modal-edit-notes" class="toolbars"
      v-if="showModal == 'edit-notes'" @close="showModal = false" :isFooter="true">
      <h5 slot="header" class="modal-title">修改备注</h5>
      <mavon-editor slot="body" class="mx-3"
        :toolbars="mavon_md_base_toolbars"
        :subfield="false" placeholder="请输入备注 ~ "
        v-model.trim="EditNotesData.remark">
      </mavon-editor>
      <div slot="footer">
        <button type="submit" class="btn btn-primary" @click="EditRecordRemard()">提交</button>
      </div>
    </Modal>

    <!-- Bug处理操作：关闭 -->
    <Modal id="modal-closed" class="toolbars"
      v-if="showModal == 'closed'" @close="showModal = false" :isFooter="true">
      <h5 slot="header" class="modal-title">关闭原因</h5>
      <div slot="body" class="mx-3">
        <mavon-editor
          :toolbars="mavon_md_base_toolbars"
          :subfield="false"
          placeholder="请输入缺陷关闭原因，且不能少于10个字"
          v-model.trim="ClosedData.remark">
        </mavon-editor>
        <p class="mt-3 mb-0 text-gray" v-if="BugStatus != 'Fixed'">
          备注: 当缺陷状态不是"已解决"时，关闭必须填写原因
        </p>
      </div>
      <div slot="footer">
        <button type="submit" class="btn btn-primary" @click="BugClosed()">提交</button>
      </div>
    </Modal>

    <!-- Bug处理操作：延期挂起 -->
    <Modal id="modal-hangup" class="no-toolbars"
      v-if="showModal == 'hangup'" @close="showModal = false" :isFooter="true">
    	<h5 slot="header" class="modal-title">缺陷延期操作</h5>
      <mavon-editor slot="body" class="mx-3"
        :toolbarsFlag="false"
        :subfield="false"
        placeholder="请输入延期原因 ~ "
        v-model.trim="HangUpData.remark">
      </mavon-editor>
    	<div slot="footer">
    		<button type="submit" class="btn btn-primary" @click="HandUp()">确定延期？</button>
    	</div>
    </Modal>

    <!-- Bug:创建标签 -->
    <Modal id="modal-tags" class="toolbars"
      v-if="showModal == 'tags'" @close="showModal = false" :isFooter="true">
      <h5 slot="header" class="modal-title">创建标签</h5>
      <div slot="body" class="px-5">
        <el-input type="text" id="bug-tags" class="mb-3"
          maxlength="10" placeholder="标签名称，最多6个字符 ~."
          v-model.trim="tag_name" required autofocus @keyup.enter="AddBugTags()">
        </el-input>
        <div class="text-gray">
          标签建议：<span @click="tag_name='疑难Bug'">疑难Bug</span>、
          <span @click="tag_name='无法复现'">无法复现</span>
        </div>
      </div>
      <div slot="footer">
        <button type="submit" class="btn btn-primary" @click="AddBugTags()">提交</button>
      </div>
    </Modal>

  </div>
</template>

<script>
  import Vue from "vue"

  import FileUpload from '~/components/FileUpload'
  import FileShow from '~/components/FileShow'
  import BugAssign from "~/components/BugAssign"
  import BugResolve from "~/components/BugResolve"
  import BugChange from "~/components/BugChange"

  import util from "~/assets/js/util.js"
  import rules from "~/assets/js/rules.js"
  import data from '~/assets/js/data.js'
  import edit from '~/assets/js/edit.js'

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
      FileShow,
      FileUpload
    },

    data() {
      return {
        mavon_md_base_toolbars: edit.mavon_md_base_toolbars,
        components_value: '',
        showModal: false,
        currentBugId: this.$route.query.bug_id || null,
        product_id: "",
        current_product_code: "",
        BugDetails: {},
        Annex: [],
        product_code: "",
        tag_name: "",
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
          bug_id: "",
          remark: ""
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
        EditNotesData: {
          remark: "",
          record_id: "",
          bug_id: ""
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
      // 产品ID
      product_id: function(val, oldVal) {
        if (this.product_id) {
          const ProductMembersData = this.$store.state.ProductMemberList
          const isThisProduct = ProductMembersData.hasOwnProperty("product_id")
            ? (ProductMembersData["product_id"] === this.product_id ? true : false) : false
          if (!isThisProduct){
            this.$store.dispatch("getProductMembers",this.product_id)
          }
        }
      },
      showModal () {
        // 当点击【重新打开】,默认指派人为：上次缺陷解决者
        if (this.showModal === 'ReOpen') {
          this.ReOpenData.assignedTo = this.BugDetails.assignedTo_id
        }
      }
    },

    computed: {
      login_user_id: function() {
        return this.$store.state.userInfo.user_id
      },
      //
      member_list: function() {
        return this.$store.state.ProductMemberList ? this.$store.state.ProductMemberList["data"] : ''
      },
      // 按钮权限
      BtnRules: function() {
        return rules.BugBtnRules(this.BugDetails, this.$store.state.userInfo)
      },
      // 缺陷可视化的ID(即1、2、3....)，主要是为了标题展示
      BID: function() {
        return this.BugDetails["id"] ? this.BugDetails["id"] + "、" : ""
      },
      isShowLoading: function() {
        return JSON.stringify(this.BugDetails) === "{}" ? "1" : null
      },
      // 缺陷状态
      BugStatus: function() {
        return this.BugDetails ? this.BugDetails["status"] : false
      },
      // 转换markdown文本为html
      convertsMarkdown () {
        return function(value) {
          return value ? marked(value) : ""
        }
      }
    },

    created() {
      this.getBugDetails()

      // 获取缺陷属性，比如优先级信息、严重程度信息
      if (JSON.stringify(this.$store.state.BugProperty) === "{}") {
        this.$store.dispatch("getBugProperty")
      }
    },

    methods: {
      /**
       * 缺陷：获取缺陷详情
       */
      getBugDetails() {
        if (this.currentBugId) {
          this.axios
            .get("/api/qa/bug/details?bug_id=" + this.currentBugId)
            .then(res => {
              if (res.data["status"] === 20000) {
                this.BugDetails = res.data["data"]
                this.Annex = res.data["annex"]
                this.product_code = res.data["data"]["product_code"]
                this.product_id = res.data["data"]["product_id"]
                // get history
                this.BugHistory()
              } else {
                this.$notify.error({title: "错误",message: res.data["msg"]})
              }
            })
        }
      },

      /**
       * 缺陷：编辑，跳转到编辑页面
       */
      EditBug() {
        this.$router.push("/app/qa/bug/edit?bug_id=" + this.currentBugId)
      },

      /**
       * modal: bug指派
       */
      skipAssign(row) {
        let bug_status = row.status
        if (bug_status == 'Closed') {
          return;
        }
        this.selectedBugId = row.bug_id
        this.showModal = 'assign'
      },

      /**
       * 缺陷：解决
       */
      immediateRecovered() {
        this.ResolveData.bug_id = this.currentBugId
        this.ResolveData.assignedTo = this.BugDetails.creator_id
        this.axios({
          method: "post",
          url: "/api/qa/bug/resolve",
          data: JSON.stringify(this.ResolveData)
        }).then(res => {
          if (res.data["status"] === 20000) {
            this.showModal=false
            this.$router.go(-1)
            this.$notify.success({ title: "成功", message: res.data["msg"] })
          } else {
            this.$notify.error({ title: "错误", message: res.data["msg"] })
          }
        })
      },

      /**
       * 缺陷：删除
       */
      BugDelete() {
        this.axios.get("/api/qa/bug/delete?bug_id=" + this.currentBugId).then(res => {
          if (res.data["status"] === 20000) {
            this.$router.go(-1)
            this.$notify.success({ title: "成功", message: res.data["msg"] })
          } else {
            this.$notify.error({ title: "失败", message: res.data["msg"] })
          }
        })
      },

      /**
       * modal: bug严重程度、优先级弹框
       * */
      BugPSDialog(data) {
        this.components_value = data
        this.showModal = data
      },

      /*
      * 缺陷：关闭
      */
      BugClosed() {
        this.ClosedData.bug_id = this.currentBugId
        const remark = this.ClosedData.remark
        if (this.BugDetails.status !== 'Fixed') {
          if (!remark.length) {
            this.$notify.error({ title: "错误", message: "缺陷关闭原因的必填哦" })
            return
          }
          if (remark.length < 10) {
            this.$notify.error({ title: "错误", message: "缺陷关闭原因,不能少于10个字" })
            return
          }
        }
        this.axios({
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

      /**
       * 缺陷：重新打开
       */
      ReOpen() {
        this.ReOpenData.bug_id = this.currentBugId
        if (!this.ReOpenData.assignedTo) {
          this.$notify.error({ title: "错误", message: "请选择指派人" })
          return
        }
        if (!this.ReOpenData.remark) {
          this.$notify.error({title: "错误",message: "重新打开缺陷，原因不能为空"})
          return
        }
        if ((this.ReOpenData.remark.length > 1000) |(this.ReOpenData.remark.length < 5)) {
          this.$notify.error({title: "错误",message: "原因的有效长度为：5到1000字符"})
          return
        }
        this.axios({
          method: "post",
          url: "/api/qa/bug/reopen",
          data: JSON.stringify(this.ReOpenData)
        }).then(res => {
          if (res.data["status"] === 20000) {
            this.showModal=false
            this.$router.go(-1)
            this.$notify.success({ title: "成功", message: res.data["msg"] })
          } else {
            this.$notify.error({ title: "错误", message: res.data["msg"] })
          }
        })
      },

      /**
       * 缺陷：挂起操作
       */
      HandUp() {
        this.HangUpData.bug_id = this.currentBugId
        this.axios({
          method: "post",
          url: "/api/qa/bug/hangup",
          data: JSON.stringify(this.HangUpData)
        }).then(res => {
          if (res.data["status"] === 20000) {
            this.showModal=false
            this.$router.go(-1)
            this.$notify.success({title: "成功",message: res.data["msg"]})
          } else {
            this.$notify.error({title: "错误",message: res.data["msg"]})
          }
        })
      },

      /**
       * 缺陷：获取历史操作记录
       */
      BugHistory() {
        this.axios.get("/api/qa/bug/history?bug_id=" + this.currentBugId).then(res => {
          if (res.data["status"] === 20000) {
            this.history = res.data["data"]
          }
        })
      },

      /**
       * 缺陷：打标签
       */
      AddBugTags() {
        let req = {
          "bug_id": this.currentBugId,
          "tag_name":this.tag_name
        }
        if (this.tag_name.length > 6) {
          return this.$notify.error({title: "错误",message: "长度不要大于6"})
        }
        this.axios({
          method: "post",
          url: "/api/qa/bug/tags/add",
          data: JSON.stringify(req)
        }).then(res => {
          if (res.data["status"] === 20000) {
            this.showModal=false
            this.BugHistory()
            this.$notify.success({title: "成功",message: res.data["msg"]})
            this.BugDetails.bug_label = this.tag_name
          } else {
            this.$notify.error({title: "错误",message: res.data["msg"]})
          }
        })
      },

      /**
       * 缺陷：增加备注
       */
      AddNotes() {
        this.NotesData.bug_id = this.currentBugId
        this.axios({
          method: "post",
          url: "/api/qa/bug/remarks",
          data: JSON.stringify(this.NotesData)
        }).then(res => {
          if (res.data["status"] === 20000) {
            this.showModal=false
            this.BugHistory()
            this.$notify.success({title: "成功",message: res.data["msg"]})
          } else {
            this.$notify.error({title: "错误",message: res.data["msg"]})
          }
        })
      },

      /**
       * 缺陷：编辑备注
       */
      EditRecordRemard(item) {
        this.axios({
          method: "post",
          url: "/api/qa/bug/remarks",
          data: JSON.stringify(this.EditNotesData)
        }).then(res => {
          if (res.data["status"] === 20000) {
            this.showModal=false
            this.BugHistory()
            this.$notify.success({title: "成功",message: res.data["msg"]})
          } else {
            this.$notify.error({title: "错误",message: res.data["msg"]})
          }
        })
      }
    }
  }
</script>

<style scoped="scoped">
  @import "~/assets/css/test.css";

  .bug-tags{
    margin:30px;
    width:150px;
    height:50px;
    color: red;
    font-size:1.3rem;
    line-height: 44px;
    text-align: center;
    text-justify: auto;
    border: 3px solid red;
    transform:rotate(15deg);
    -ms-transform:rotate(15deg); /* Internet Explorer */
    -moz-transform:rotate(15deg); /* Firefox */
    -webkit-transform:rotate(15deg); /* Safari 和 Chrome */
    -o-transform:rotate(15deg); /* Opera */
    }
  @media (max-width: 767px) {
    .bug-tags {
      display: none;
    }
  }

  #bug-annex #icon-upload {
    visibility: hidden;
  }
  #bug-annex:hover #icon-upload {
    visibility: initial;
    padding-top: -1rem;
  }
</style>
