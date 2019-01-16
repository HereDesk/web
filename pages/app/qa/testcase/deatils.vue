<template>
  <div id="page-testcase-details" class="mt-5">

    <div id="case-details-info" class='container' v-if="JSON.stringify(CaseDetails) !== '{}'">

      <div id="page-head" class='row'>
        <div id="case-title" class='col'>
          <h3 class="details-title">{{ CID }} {{ CaseDetails.title }}</h3>
        </div>
      </div>

      <div id="page-opreate" class="row">
        <div id="case-opreate-button" class="col my-4" v-if="CaseDetails.status === 0">
          <button id="case-edit-btn" ype="btn" class="btn btn-gray" @click="handleEdit()" v-if="Rules.edit">
            编辑
          </button>
          <button id="case-del-btn" type="button" class="btn btn-gray ml-3" 
            @click="CaseDelete(CaseDetails.case_id)" v-if="CaseDetails.isDelete === 0 && Rules.del">
            删除
          </button>
          <button id="case-fall-btn" type="button" class="btn btn-gray ml-3" 
            @click="handleFall(CaseDetails.case_id)" v-if="Rules.fall">
            失效
          </button>
          <button id="case-review-btn" type="button" class="btn btn-gray ml-3" @click="showModal = 'caseReview'">
            评审
          </button>
          <button type="button" class="btn btn-gray ml-3" @click="$router.back(-1)">返回</button>
        </div>
      </div>

      <div id="page-body" class="row my-3">

        <div id="page-body-left" class='col-lg-8 col-md-7 col-sm-12'>
          <div id="case-precondition" class="height-7 mb-3" v-if="CaseDetails.precondition">
            <h6>
              <span class="grayline"></span>&nbsp;&nbsp;执行前置条件
            </h6>
            <div class="details-block" v-html="ConvertsMd(CaseDetails.precondition)"></div>
          </div>
          <div id="case-steps" class="height-7 mb-4">
            <h6>
              <span class="standline"></span>&nbsp;&nbsp;操作步骤
            </h6>
            <div class="details-block" v-html="ConvertsMd(CaseDetails.steps)"></div>
          </div>
          <div id="case-input" class="height-7 mb-3" v-if="CaseDetails.DataInput">
            <h6>
              <span class="grayline"></span>&nbsp;&nbsp;测试输入数据
            </h6>
            <div class="details-block" v-html="ConvertsMd(CaseDetails.DataInput)"></div>
          </div>
          <div id="case-expected-result" class="height-7 mb-3">
            <h6>
              <span class="successline"></span>&nbsp;&nbsp;预期结果
            </h6>
            <div class="details-block" v-html="ConvertsMd(CaseDetails.expected_result)"></div>
          </div>
          <div id="case-remark" class="height-7 mb-3" v-if="CaseDetails.remark">
            <h6>
              <span class="grayline"></span>&nbsp;&nbsp;附加信息
            </h6>
            <div class="details-block" v-html="ConvertsMd(CaseDetails.remark)"></div>
          </div>
          <div id="case-annex" class="height-7 mb-5" v-if="Annex.length">
            <h6>
              <span class="grayline"></span>&nbsp;&nbsp;原型或设计图
            </h6>
            <FileShow :Annex="Annex"></FileShow>
          </div>
        </div>

        <div id="page-body-right" class='col-lg-4 col-md-5 col-sm-12'>
          <div id="case-base-info">
            <h6>
              <span class="grayline"></span>&nbsp;&nbsp;详情
            </h6>
            <div class="dropdown-divider"></div>
            <ul class="mt-3 pl-3 satellite_info">
              <li id="case-product-code">
                <label>产品：</label>{{ CaseDetails.product_code }}
              </li>
              <li id="case-modules">
                <label>模块：</label>{{ CaseDetails.m1_name }} {{ CaseDetails.m2_name }}
              </li>
              <li id="case-status">
                <label>状态：</label>{{ case_status }}
              </li>
              <li id="case-priority">
                <label>优先级：</label>{{ CaseDetails.priority }}
              </li>
            </ul>
          </div>
          <div id="case-operate-info" class="mt-3">
            <h6>
              <span class="grayline"></span>&nbsp;&nbsp;人员/日期
            </h6>
            <div class="dropdown-divider"></div>
            <ul class="mt-3 pl-3 satellite_info">
              <li id="case-creator">
                <label>创建者：</label>{{ CaseDetails.creator }}
              </li>
              <li id="case-create_time">
                <label>创建日期：</label>{{ CaseDetails.create_time | date }}
              </li>
              <li id="case-changer" v-if="CaseDetails.changer">
                <label>修改人</label>{{ CaseDetails.changer }}
              </li>
              <li id="case-change_time" v-if="CaseDetails.change_time">
                <label>修改日期：</label>{{ CaseDetails.change_time | date }}
              </li>
              <li id="case-faller" v-if="CaseDetails.faller">
                <label>失效操作人：</label>{{ CaseDetails.faller }}
              </li>
              <li id="case-fall_time" v-if="CaseDetails.fall_time">
                <label>失效日期：</label>{{ CaseDetails.fall_time | date }}
              </li>
              <li id="case-deleter" v-if="CaseDetails.deleter">
                <label>删除人：</label>{{ CaseDetails.deleter }}
              </li>
              <li id="case-delete_time" v-if="CaseDetails.DeleteTime">
                <label>删除日期：</label>{{ CaseDetails.delete_time | date }}
              </li>
              <li id="case-update_time">
                <label>最后操作：</label>{{ CaseDetails.update_time | date }}
              </li>
            </ul>
          </div>
        </div>
      </div> 

      <div id="case-review-record" class="row mt-3 mb-5" v-if="CaseReviewDetails.length">
        <div class="col-lg-8 col-md-8 col-sm-12 col-12">
          <h5>评审记录</h5>
          <div class="dropdown-divider"></div>
          <div id="case-record" class="mt-3">
            <ol class="pl-1">
              <li v-for="(item,index) in CaseReviewDetails" :key="index" class="my-2">
                <span class="log-text-time">{{ item.create_time | date }} : </span>
                <span class="log-text-user">{{ item.realname }}, </span>
                <span v-if="item.result === 1">评审意见：通过</span>
                <span v-if="item.result === 2">评审意见：不通过</span>
                <div v-if="item.remark" class="log-text-remark font-size-90" v-html="ConvertsMd(item.remark)"></div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>

    <div id="page-loading" class="col text-center" v-if='isShowLoading'>
      <PageLoading></PageLoading>
    </div>
    
    <Modal id="ModalCaseReview"  v-if="showModal == 'caseReview'" @close="showModal = false" :isFooter="true">
      <h5 slot="header">用户评审</h5>
      <div slot="body" class='form-group row col-md-auto mx-3 toolbars'>
      	<mavon-editor style="width:100%;" placeholder="请输入评审意见 ~ "
      		:toolbarsFlag="false" :subfield="false" v-model.trim="review_data.remark">
      	</mavon-editor>
      </div>
      <div slot="footer">
        <button type="submit" class="btn" @click="CaseReview(1)">通过</button>
        <button type="submit" class="btn mx-3" @click="CaseReview(2)">不通过</button>
      </div>
    </Modal>

  </div>
</template>

<script>
import FileShow from '~/components/FileShow'

import util from '~/assets/js/util.js'
import rules from '~/assets/js/rules.js'

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
  head () {
    return {
      title: 'HDesk - ' + this.CID + '测试用例详情'
    }
  },
  
  validate({ query }) {
    return /\w{2,6}/.test(query.case_id)
  },

  layout: 'head',
  components: {
    FileShow
  },

  data () {
    return {
      showModal: false,
      CaseDetails: {},
      CaseReviewDetails: [],
      review_data: {
        case_id: '',
        result: 0,
        remark: ''
      },
      Annex: []
    }
  },

  watch: {
    showModal () {
      this.showModal ? 
        document.body.classList.add("overflow-hidden") : 
        document.body.classList.remove("overflow-hidden")
    }
  },

  filters: {
    date: util.date
  },
  
  computed: {
    // 权限控制
    Rules: function () {
      return rules.TestCaseRules(this.$store.state.userInfo) 
    },
    CID: function () {
      return this.CaseDetails['id'] ? this.CaseDetails['id'] + '、' : ''
    },
    currentcase_id: function () {
      return this.$route.query.case_id
    },
    isShowLoading: function () {
      return JSON.stringify(this.CaseDetails) === '{}' ? '1' : null
    },
    case_status: function () {
      return this.CaseDetails.status === 0 ? '正常' : '已失效'
    },
    ConvertsMd () {
      return function(value) {
        return value ? marked(value) : ""
      }
    }
  },

  created () {
    this.getCaseDetails()
  },

  methods: {
    getCaseDetails () {
      if (this.currentcase_id) {
        this.axios.get('/api/qa/testcase/details?case_id=' + this.currentcase_id)
          .then(res => {
            if (res.data['status'] === 20000) {
              this.CaseDetails = res.data['data']
              this.Annex = res.data['annex']
              this.CaseReviewDetails = res.data['review']
            } else {
              this.$notify.error({title: '失败',message: res.data['msg']})
            }
        })
      }
    },

    // Testcase: 编辑操作
    handleEdit () {
      this.$router.push('/app/qa/testcase/edit?case_id=' + this.currentcase_id)
    },

    // Testcase: 评审
    CaseReview (data) {
      this.review_data.result = data
      this.review_data.case_id = this.CaseDetails.case_id
      this.axios({
        method: 'post',
        url: '/api/qa/testcase/review',
        data: JSON.stringify(this.review_data)
      }).then(res => {
          if (res.data['status'] === 20000) {
            this.getCaseDetails()
            this.$notify.success({title: '评审操作成功',message: res.data['msg']})
          } else {
            this.$notify.error({title: '评审操作失败',message: res.data['msg']})
          }
        }
      )
    },

    // Testcase: delete
    CaseDelete (id) {
      this.axios('/api/qa/testcase/delete?case_id=' + id).then(res => {
        if (res.data['status'] === 20000) {
          this.$notify.success({title: '成功',message: res.data['msg']})
          this.$router.go(-1)
        } else {
          this.$notify.error({title: '失败',message: res.data['msg']})
        }
      })
    },

    // Testcase: 失效操作
    handleFall (id) {
      this.axios.get('/api/qa/testcase/fall?case_id=' + id)
        .then(res => {
          if (res.data['status'] === 20000) {
            this.getCaseDetails()
            this.$notify.success({"title":"成功","message":res.data['msg']})
          } else {
            this.$notify.error({"title":"成功","message":res.data['msg']})
          }
        })
    }
  }
}
</script>

<style>
  @import '~/assets/css/test.css'
</style>