<template>
  <div id="page-bug-details" class="mt-5">
    <div id="bug-details" class='container' v-if="JSON.stringify(BugDetails) !== '{}'">
      <div id="page-details-0" class='row'>
        <div class='col-xl-12 col-lg-12 col-md-12'>
          <h3 class="details-title">
            {{ BID }} {{ BugDetails.title }}
          </h3>
        </div>
        <div id="page-details-1" class="col-xl-12 col-lg-12 col-md-12 my-4">
          <button type="btn" class="btn btn-gray mr-3" @click="BugDelete()" v-if="BtnRules.del">删除</button>
          <button type="btn" class="btn btn-gray" v-if="BtnRules.edit" @click="EditBug()">编辑</button>

          <div class="btn-group btn-group-toggle mx-3">
            <label class="btn btn-gray active" v-if="BtnRules.assign">
              <input type="radio" name="options" id="bug-designate" autocomplete="off" @click="skipAssign()">分配
            </label>
            <label class="btn btn-gray" data-toggle="modal" data-target="#modal-reopen" v-if="BtnRules.reopen">
              <input type="radio" name="options" id="bug-open" autocomplete="off">重新打开
            </label>
          </div>

          <div class="btn-group btn-group-toggle" data-toggle="buttons">
            <label class="btn btn-gray" @click="immediateRecovered()" v-if="BtnRules.Recovered">
              <input type="radio" name="options" id="bug-fixed" autocomplete="off">已解决
            </label>
            <label class="btn btn-gray" @click="skipRecovered('other')" v-if="BtnRules.Recovered">
              <input type="radio" name="options" id="bug-other" autocomplete="off">其它解决方案
            </label>
          </div>

          <button type="button" class="btn btn-gray ml-3" @click="BugClosed()" v-if="BtnRules.close">关闭</button>

          <button type="button" class="btn btn-gray ml-3" data-toggle="modal" data-target="#modal-hangup" v-if="BtnRules.hangup">延期挂起</button>

          <button type="button" class="btn btn-gray ml-3" data-toggle="modal" data-target="#modal-notes" v-if="BtnRules.notes">备注</button>
          <button type="button" class="btn btn-gray ml-3" @click="$router.back(-1)">返回</button>
        </div>
      </div>

      <div class="row mt-5">
        <div id="bug-details-2" class='col-xl-8 col-lg-8 col-md-8'>
          <div id="bug-steps" class="height-7 mb-5" v-if="BugDetails.steps">
            <h6 class="bug-details-minor-title"><span class="standline"></span>&nbsp;&nbsp;操作步骤</h6>
            <pre class="details-block" v-html="BugDetails_steps "></pre>
          </div>
          <div id="bug-reality-result" class="height-7 mb-5" v-if="BugDetails.reality_result">
            <h6 class="bug-details-minor-title"><span class="redline"></span>&nbsp;&nbsp;实际结果</h6>
            <pre class="details-block" v-html="reality_result"></pre>
          </div>
          <div id="bug-expected-result" class="height-7 mb-5" v-if="BugDetails.expected_result">
            <h6 class="bug-details-minor-title"><span class="successline"></span>&nbsp;&nbsp;预期结果</h6>
            <pre class="details-block" v-html="expected_result"></pre>
          </div>

          <!-- 图片附件 -->
          <div id="bug-steps" class="height-7 mb-5" v-if="Annex.length > 0">
            <h6 class="bug-details-minor-title"><span class="grayline"></span>&nbsp;&nbsp;附件</h6>
            ​<picture class="container-fluid">
              <div class="row">
                <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-6 images" v-for="p in Annex" :key="p.id" v-viewer>
                  <img class="img-thumbnail" alt="..." :src="p.url" >
                </div>
              </div>
            </picture>
          </div>

          <div id="bug-details-3" class="height-7 mb-5" v-if="BugDetails.remark">
            <h6 class="bug-details-minor-title"><span class="grayline"></span>&nbsp;&nbsp;附加信息</h6>
            <div class="dropdown-divider"></div>
            <pre class="details-block" v-html="BugDetails_remark"></pre>
          </div>
          <div id="bug-details-history" class="height-7 mb-5 text-gray-38 text-93">
            <h6 class="bug-details-minor-title"><span class="grayline"></span>&nbsp;&nbsp;活动记录</h6>
            <div class="dropdown-divider"></div>
            <div id="bug-history-record" class="mt-3">
              <ol class="pl-1">
                <li v-for="(item,index) in history" :key="item.id" class="my-2">
                  {{ index + 1 }}.  {{ item.create_time | date }} :
                  <span class="log-text-user">{{ item.username }}</span>
                  {{ item.desc }}
                  <pre class="log-text-remark text-90" v-if="item.remark">
                    {{ item.remark }}
                  </pre>
                </li>
              </ol>
            </div>
          </div>
        </div>

        <div id="page-details-4" class='col-xl-4 col-lg-4 col-md-4'>
          <div id="bug-details-desc">
            <h6 class="bug-details-minor-title">
              <span class="grayline"></span>&nbsp;&nbsp;详情
            </h6>
            <div class="dropdown-divider"></div>
            <ul class="mt-3 pl-3 satellite_info">
              <li>
                <label>产品版本：</label>{{ BugDetails.product_code }} {{ BugDetails.release }}
              </li>
              <li>
                <label>模块：</label>{{ BugDetails.m1_name }} {{ BugDetails.m2_name }}
              </li>
              <li>
                <label>缺陷状态：</label>{{ BugDetails.status_name }}
              </li>
              <li>
                <label>严重程度：</label>{{ BugDetails.severity_name }}
              </li>
              <li>
                <label>优先级：</label>{{ BugDetails.priority_name }}
              </li>
              <li>
                <label>解决方案：</label>{{ BugDetails.solution_name }}
              </li>
            </ul>
          </div>
          <div id="bug-details-5">
            <h6 class="bug-details-minor-title">
              <span class="grayline"></span>&nbsp;&nbsp;人员/日期
            </h6>
            <div class="dropdown-divider"></div>
            <ul class="mt-3 pl-3 satellite_info">
              <li>
                <label>创建者：</label>{{ BugDetails.creator_user }}
              </li>
              <li>
                <label>创建日期：</label>{{ BugDetails.create_time | date }}
              </li>
              <li>
                <label>指派给：</label>{{ BugDetails.assignedTo_user }}
              </li>
              <li>
                <label>指派日期：</label>{{ BugDetails.assignedTo_time | date }}
              </li>
              <li>
                <label>解决人：</label>{{ BugDetails.fixed_user }}
              </li>
              <li>
                <label>解决日期：</label>{{ BugDetails.fixed_time | date }}
              </li>
              <li>
                <label>关闭：</label>{{ BugDetails.closed_user }}
              </li>
              <li>
                <label>关闭日期：</label>{{ BugDetails.closed_time | date }}
              </li>
            </ul>
          </div>
          <div id="bug-details-relevancy" class="pb-5" v-if="BugDetails.case_id">
            <h6 class="bug-details-minor-title">
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

    <div id="page-loading" class="col text-center" v-if='isShowLoading'>
      <loading></loading>
    </div>

    <!-- Bug处理操作：指派 -->
    <div id="bug-list-assign" v-if="showBugAssignBox">
      <BugAssign 
        v-bind:bug_id="currentBugId"
        v-bind:product_code="product_code"
        v-bind:pageSource="pageSource"
        v-bind:member_list="member_list">
      </BugAssign>
    </div>

    <!-- Bug处理操作：解决 -->
    <div id="bug-list-resolve" v-if="showBugResolveBox">
      <BugResolve
        v-bind:bug_id="currentBugId"
        v-bind:OpenBy="BugDetails.openedBy"
        v-bind:product_code="product_code"
        v-bind:scheme="scheme"
        v-bind:pageSource="pageSource"
        v-bind:member_list="member_list">
      </BugResolve>
    </div>

    <!-- Bug处理操作：重新打开缺陷 -->
    <div id="modal-reopen" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">重新打开缺陷</h5>
          </div>
          <div class="modal-body">
            <div class='form-group row col-md-auto mx-3'>
              <label for="assignedTo">指派给</label>
              <select class='select-control border' v-model="ReOpenData.assignedTo">
                <option disabled value="">请选择</option>
                <option v-for='item in member_list' :key="item.id" :value="item.user_id">{{ item.realname }}</option>
              </select>
            </div>
            <div class='form-group row col-md-auto mx-3'>
              <label for="remark">原因</label>
              <textarea type='text' v-model='ReOpenData.remark' class='textarea-control form-border-bottom' rows="5" placeholder='请输入原因...'></textarea>
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
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">添加备注</h5>
          </div>
          <div class="modal-body">
            <div class='form-group row col-md-auto mx-3'>
              <label for="remark">备注</label>
              <textarea type='text' v-model='NotesData.remark' class='textarea-control form-border-bottom' rows="7" placeholder='请输入备注,2000字以内...'></textarea>
            </div>
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
            <div class='form-group row col-md-auto mx-3'>
              <label for="remark">延期说明</label>
              <textarea type='text' v-model='HangUpData.remark' class='textarea-control form-border-bottom' rows="7" placeholder='请输入备注,2000字以内...'></textarea>
            </div>
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
import Vue from 'vue'
import axios from 'axios'

import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.min.css'

import loading from '~/components/loading'
import BugAssign from '~/components/BugAssign'
import BugResolve from '~/components/BugResolve'

import util from '~/assets/js/util.js'
import rules from '~/assets/js/rules.js'

Vue.use(Viewer,{
  defaultOptions: {
    toolbar:{
      // zoomIn:3,
      zoomOut:3,
      flipVertical: 0,
      rotateLeft: 4,
    }
  }
})

export default {
  head () {
    return {
      title: 'HDesk - ' + this.BID + '缺陷详情'
    }
  },
  validate({ query }) {
    return query.bug_id ? true : false
  },

  layout: 'head',
  components: {
    BugAssign,
    BugResolve,
    loading
  },

  data () {
    return {
      BugDetails: {},
      Annex: [],
      product_code: '',
      ResolveData: {
        bug_id: '',
        assignedTo: '',
        reamrk: '',
        solution: 'Fixed'
      },
      AssignData: {
        bug_id: '',
        assignedTo: '',
        remark: ''
      },
      ClosedData: {
        bug_id: ''
      },
      ReOpenData: {
        bug_id: '',
        assignedTo: '',
        remark: ''
      },
      NotesData: {
        bug_id: '',
        remark: ''
      },
      HangUpData: {
        bug_id: '',
        remark: '',
      },
      member_list: [],
      history: [],
      // 组件数据
      bug_idOpenBy: '',
      showBugAssignBox: false,
      showBugResolveBox: false,
      scheme: '',
      pageSource: 'page_bug_details'
    }
  },

  filters: {
    date: util.date,
    CheckUrl: util.CheckUrl,
  },

  watch: {
    BugStatus: function (val, oldVal) {
      this.BugHistory()
    },
    product_code: function (val, oldVal) {
      this.getMemberList()
    }
  },

  computed: {
    BtnRules: function () {
      return rules.BugRules(this.BugDetails,this.$store.state.userInfo)
    },
    BID: function () {
      return this.BugDetails['id'] ? this.BugDetails['id'] + '、' : ''
    },
    currentBugId: function () {
      return this.$route.query.bug_id
    },
    BugStatus: function () {
      return this.BugDetails ? this.BugDetails['status'] : false
    },
    isShowLoading: function () {
      return JSON.stringify(this.BugDetails) === '{}' ? '1' : null
    },
    expected_result: function () {
      return util.txt_deal_with(this.BugDetails.expected_result)
    },
    BugDetails_remark: function () {
      return util.txt_deal_with(this.BugDetails.remark)
    },
    reality_result: function () {
      return util.txt_deal_with(this.BugDetails.reality_result)
    },
    BugDetails_steps: function () {
      return util.txt_deal_with(this.BugDetails.steps)
    }
  },

  created () {
    this.getBugDetails()
  },

  methods: {
    getBugDetails () {
      let that = this
      if (this.currentBugId) {
        axios.get('/api/qa/bug/details?bug_id=' + this.currentBugId)
          .then(function (res) {
            if (res.data['status'] === 20000) {
              that.BugDetails = res.data['data']
              that.Annex = res.data['annex']
              that.product_code = res.data['data']['product_code']
            } else {

            }
        })
      }
    },
    getMemberList () {
      let that = this
      axios.get('/api/pm/member/list?product_code=' + that.product_code).then(function (res) {
        if (res.data['status'] === 20000) {
          that.member_list = res.data['data']
        }
      })
    },
    // 编辑缺陷
    EditBug () {
      this.$router.push('/app/qa/bug/edit?bug_id=' + this.currentBugId)
    },

    // Bug immediate Recovered
    immediateRecovered () {
      let that = this
      this.ResolveData.bug_id = this.currentBugId
      this.ResolveData.assignedTo = this.BugDetails.creator_id
      axios({
        method: 'post',
        url: '/api/qa/bug/resolve',
        data: JSON.stringify(this.ResolveData)
      }).then(function (res) {
        if (res.data['status'] === 20000) {
          that.$router.go(-1)
          that.$notify.success({title: '成功',message: res.data['msg']})
        } else {
          that.$notify.error({title: '错误',message: res.data['msg']})
        }
      })
    },

    skipRecovered (scheme) {
      this.showBugResolveBox = true
      this.scheme = scheme
      $('#componentsResolve').modal('show')
    },

    // 分配
    skipAssign () {
      this.showBugAssignBox = true
      $('#componentsAssign').modal('show')
    },

    // bug delete
    BugDelete () {
      let that = this
      axios.get('/api/qa/bug/delete?bug_id=' + this.currentBugId).then(function (res) {
        if (res.data['status'] === 20000) {
          that.$router.go(-1)
          that.$notify.success({title: '成功',message: res.data['msg']})
        } else {
          that.$notify.error({title: '失败',message: res.data['msg']})
        }
      })
    },

    // bug closed
    BugClosed () {
      let that = this
      this.ClosedData.bug_id = this.currentBugId
      axios({
        method: 'post',
        url: '/api/qa/bug/close',
        data: JSON.stringify(this.ClosedData)
      }).then(function (res) {
        if (res.data['status'] === 20000) {
          that.$notify.success({title: '成功',message: res.data['msg']})
          that.$router.go(-1)
        } else {
          that.$notify.error({title: '错误',message: res.data['msg']})
        }
      })
    },

    // bug reopen
    ReOpen () {
      this.ReOpenData.bug_id = this.currentBugId
      if (this.ReOpenData.assignedTo === '') {
        return this.$notify.error({title: '错误',message: '请选择指派人'})
      }
      if (this.ReOpenData.remark.length > 1000 | this.ReOpenData.remark.length < 5) {
        return this.$notify.error({title: '错误',message: '重新打开缺陷，原因不能为空哦'})
      }
      let that = this
      axios({
        method: 'post',
        url: '/api/qa/bug/reopen',
        data: JSON.stringify(this.ReOpenData)
      }).then(function (res) {
        if (res.data['status'] === 20000) {
          that.$router.go(-1)
          $('#modal-reopen').modal('hide')
          that.$notify.success({title: '成功',message: res.data['msg']})
        } else {
          that.$notify.error({title: '错误',message: res.data['msg']})
        }
      })
    },

    // bug hand up 
    HandUp () {
      let that = this
      this.HangUpData.bug_id = this.currentBugId
      axios({
        method: 'post',
        url: '/api/qa/bug/hangup',
        data: JSON.stringify(this.HangUpData)
      }).then(function (res) {
        if (res.data['status'] === 20000) {
          that.$router.go(-1)
          $('#modal-hangup').modal('hide')
          that.$notify.success({title: '成功',message: res.data['msg']})
        } else {
          that.$notify.error({title: '错误',message: res.data['msg']})
        }
      })
    },

    // the bug history record
    BugHistory () {
      let that = this
      axios.get('/api/qa/bug/history?bug_id=' + this.currentBugId).then(function (res) {
        if (res.data['status'] === 20000) {
          that.history = res.data['data'] 
        }
      })
    },

    // add notes or remark
    AddNotes () {
      let that = this
      this.NotesData.bug_id = this.currentBugId
      axios({
        method: 'post',
        url: '/api/qa/bug/add_notes',
        data: JSON.stringify(this.NotesData)
      }).then(function (res) {
        if (res.data['status'] === 20000) {
          that.BugHistory()
          $('#modal-notes').modal('hide')
          that.$notify.success({title: '成功',message: res.data['msg']})
        } else {
          that.$notify.error({title: '错误',message: res.data['msg']})
        }
      })
    }
  }
}
</script>

<style>
  @import '~/static/static/common/css/test.css';
</style>