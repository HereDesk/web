<template>
  <div id="page-testcase-details" class="mt-5">
    <div id="casedetails" class='container' v-if="JSON.stringify(CaseDetails) !== '{}'">
      <div id="page-details-1" class='row'>
        <div class='col-xl-12 col-lg-12 col-md-12'>
          <h3 class="details-title">
            {{ CID }} {{ CaseDetails.title }}
          </h3>
        </div>
        <div id="page-details-1" class="col-xl-12 col-lg-12 col-md-12 my-4" v-if="CaseDetails.status === 0">
          <button type="btn" class="btn btn-gray" 
            @click="handleEdit()" 
            v-if="Rules.edit">
            编辑
          </button>
          <button type="button" class="btn btn-gray ml-3" 
            @click="CaseDelete(CaseDetails.case_id)"
            v-if="CaseDetails.isDelete === 0 && Rules.del">
            删除
          </button>
          <button type="button" class="btn btn-gray ml-3" 
            @click="handleFall(CaseDetails.case_id)"
            v-if="Rules.fall">
            失效
          </button>
          <button type="button" class="btn btn-gray ml-3" 
            data-toggle="modal" data-target="#ModalCaseReview">
            评审
          </button>
          <button type="button" class="btn btn-gray ml-3" @click="$router.back(-1)">返回</button>
        </div>
      </div>

      <div id="case-details-2" class="row my-5">
        <div id="case-details-2-1" class='col-xl-8 col-lg-8 col-md-8'>
          <div id="case-precondition" class="height-7 mb-3" v-if="CaseDetails.precondition">
            <h6>
              <span class="grayline"></span>&nbsp;&nbsp;执行前置条件
            </h6>
            <pre class="details-block">{{ CaseDetails.precondition }}</pre>
          </div>
          <div id="case-steps" class="height-7 mb-4">
            <h6>
              <span class="standline"></span>&nbsp;&nbsp;操作步骤
            </h6>
            <div class="details-block" v-html="CaseDetails.steps"></div>
          </div>
          <div id="case-input" class="height-7 mb-3" v-if="CaseDetails.DataInput">
            <h6>
              <span class="grayline"></span>&nbsp;&nbsp;测试输入数据
            </h6>
            <pre class="details-block">{{ CaseDetails.DataInput }}</pre>
          </div>
          <div id="case-expected-result" class="height-7 mb-3">
            <h6>
              <span class="successline"></span>&nbsp;&nbsp;预期结果
            </h6>
            <pre class="details-block">{{ CaseDetails.expected_result }}</pre>
          </div>
          <div id="case-remark" class="height-7 mb-3" v-if="CaseDetails.remark">
            <h6>
              <span class="grayline"></span>&nbsp;&nbsp;附加信息
            </h6>
            <pre class="details-block">{{ CaseDetails.remark }}</pre>
          </div>
        </div>

        <div id="page-details-2-2" class='col-xl-4 col-lg-4 col-md-4'>
          <div id="page-details-2-2-1">
            <h6>
              <span class="grayline"></span>&nbsp;&nbsp;详情
            </h6>
            <div class="dropdown-divider"></div>
            <ul class="mt-3 pl-3 satellite_info">
              <li>
                <label>产品：</label>{{ CaseDetails.product_code }}
              </li>
              <li>
                <label>模块：</label>{{ CaseDetails.m1_name }} {{ CaseDetails.m2_n }}
              </li>
              <li>
                <label>状态：</label>{{ case_status }}
              </li>
              <li>
                <label>优先级：</label>{{ CaseDetails.priority }}
              </li>
            </ul>
          </div>
          <div id="page-details-2-2-2">
            <h6 class="bug-details-minor-title">
              <span class="grayline"></span>&nbsp;&nbsp;人员/日期
            </h6>
            <div class="dropdown-divider"></div>
            <ul class="mt-3 pl-3 satellite_info">
              <li>
                <label>创建者：</label>{{ CaseDetails.creator }}
              </li>
              <li>
                <label>创建日期：</label>{{ CaseDetails.create_time | date }}
              </li>
              <li>
                <label>更新日期：</label>{{ CaseDetails.update_time | date }}
              </li>
              <li v-if="CaseDetails.changer">
                <label>修改人</label>{{ CaseDetails.changer }}
              </li>
              <li v-if="CaseDetails.change_time">
                <label>修改日期：</label>{{ CaseDetails.change_time | date }}
              </li>
              <li v-if="CaseDetails.faller">
                <label>失效：</label>{{ CaseDetails.faller }}
              </li>
              <li v-if="CaseDetails.fall_time">
                <label>失效日期：</label>{{ CaseDetails.fall_time | date }}
              </li>
              <li v-if="CaseDetails.deleter">
                <label>删除人：</label>{{ CaseDetails.deleter }}
              </li>
              <li v-if="CaseDetails.DeleteTime">
                <label>删除日期：</label>{{ CaseDetails.delete_time | date }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="row mt-3 mb-5" v-if="CaseReviewDetails.length > 0">
        <div class="col-xl-8 col-lg-8 col-md-8 col-sm-12 col-12">
          <h5>评审记录</h5>
          <div class="dropdown-divider"></div>
          <div id="testcase-record" class="mt-3">
            <ol class="pl-1">
              <li v-for="(item,index) in CaseReviewDetails" :key="item.id" class="my-2">
                {{ index + 1 }}.  
                <span class="log-text-time">{{ item.create_time | date }} : </span>
                <span class="log-text-user">{{ item.realname }}, </span>
                <span v-if="item.result === 1">评审意见：通过</span>
                <span v-if="item.result === 2">评审意见：不通过</span>
                <pre v-if="item.remark" class="log-text-remark text-90">
                  {{ item.remark }}
                </pre>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>

    <div id="page-loading" class="col text-center" v-if='isShowLoading'>
      <loading></loading>
    </div>

    <div id="ModalCaseReview" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">用例评审 </h5>
          </div>
          <div class="modal-body">
            <div class='form-group row col-md-auto mx-3'>
              <label for="remark">评审意见</label>
              <textarea type='text' class='textarea-control form-border-bottom' 
                rows="5" placeholder='请输入评审意见...'
                v-model='review_data.remark'>
              </textarea>
            </div>
          </div>
          <div class="text-center mb-5">
            <button type="submit" class="btn btn-outline-success" @click="CaseReview(1)">通过</button>
            <button type="submit" class="btn btn-outline-danger mx-3" @click="CaseReview(2)">不通过</button>
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">关闭</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
import loading from '~/components/loading'
import util from '~/assets/js/util.js'
import rules from '~/assets/js/rules.js'

export default {
  head () {
    return {
      title: 'HDesk - ' + this.CID + '测试用例详情'
    }
  },
  validate({ query }) {
    return query.case_id ? true : false
  },

  layout: 'head',
  components: {
    loading
  },

  data () {
    return {
      CaseDetails: {},
      CaseReviewDetails: [],
      review_data: {
        case_id: '',
        result: 0,
        remark: ''
      }
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
    }
  },

  created () {
    this.getCaseDetails()
  },

  methods: {
    getCaseDetails () {
      if (this.currentcase_id) {
        axios.get('/api/qa/testcase/details?case_id=' + this.currentcase_id)
          .then(res => {
            if (res.data['status'] === 20000) {
              this.CaseDetails = res.data['data']
              this.CaseReviewDetails = res.data['review']
            } else {
              console.log(res.data['msg'])
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
      axios({
        method: 'post',
        url: '/api/qa/testcase/review',
        data: JSON.stringify(this.review_data)
      }).then(res => {
          if (res.data['status'] === 20000) {
            $('#ModalCaseReview').modal('hide')
            this.$router.go(-1)
            this.$notify.success({title: '成功',message: res.data['msg']})
          } else {
            this.$notify.error({title: '失败',message: res.data['msg']})
          }
        }
      )
    },

    // Testcase: delete
    CaseDelete (id) {
      axios('/api/qa/testcase/delete?case_id=' + id).then(res => {
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
      axios.get('/api/qa/testcase/fall?case_id=' + id)
        .then(res => {
          if (res.data['status'] === 20000) {
            this.$notify.success({"title":"成功","message":res.data['msg']})
          } else {
            this.$notify.error({"title":"成功","message":res.data['msg']})
          }
        })
    },
  }
}
</script>

<style>
  @import '~/static/static/common/css/test.css'
</style>