<template>
  <div id="page-product-members" class='container mt-3'>

    <div class='row mt-5'>
      <div class="col-auto mr-auto">
        <a class="navbar-brand">
          {{ product_code }}&nbsp;成员
        </a>
      </div>
      <div class='col-auto'>
        <button type='button' class='btn btn-create' id='addRelease' 
          data-toggle="modal" data-target="#P-Join-Members"
          v-if="Rules.product_members" 
          @click="getAllUser()">
          + 增加成员
        </button>
      </div>
    </div>

    <div class='row mt-3 mb-5 table_data'>
      <div class='col-xl-12 col-lg-12 col-md-12'>
        <el-table :data='tableData' :default-sort="{prop: 'date', order: 'descending'}">
          <el-table-column label='真实姓名' prop='realname'></el-table-column>
          <el-table-column label='群组' prop='group'></el-table-column>
          <el-table-column label='岗位/职位' prop='position'></el-table-column>
          <el-table-column label='状态'>
            <template slot-scope="scope">
              <span v-if="scope.row.status === 1" class="text-deadly">禁用</span>
              <span v-if="scope.row.status === 0">启用</span>
            </template>
          </el-table-column>
          <el-table-column label='加入时间'>
            <template slot-scope="scope">
              <span>{{ scope.row.join_time | date }}</span>
            </template>
          </el-table-column>
          <el-table-column label='操作' v-if="Rules.product_members">
            <template slot-scope="scope">
              <span @click="banned(scope.row,$event)" v-if="scope.row.status === 0">
                <button type="button" class="btn btn-outline-danger btn-sm" value="1">禁用</button>
              </span>
              <span @click="reJoin(scope.row,$event)" v-if="scope.row.status === 1">
                <button type="button" class="btn btn-outline-success btn-sm" value="0">激活</button>
              </span>
            </template>  
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class='row' v-if="controlNull">
      <div class="col-xl-12 col-lg-12 col-md-12 text-center mt-5">
        <img src="~/static/pic/happy.png" class="null-icon"/>
        <p class="no-hint">{{ msg }}</p>
      </div>
    </div>

    <!-- modal -->
    <div class="modal fade" id="P-Join-Members" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">增加人员</h5>
          </div>
          <div class="modal-body">
            <div class='form-group row col-md-auto'>
              <label for="pg-product-name" class="mx-5">产品</label>
              <select class='form-control mx-5 my-1' style="border:1px solid #9E9E9Ebackground-color:#f5f5f5">
                <option>{{ product_code }}</option>
              </select>
            </div>
            <div class='form-group row col-md-auto' @change="selectMember($event)">
              <label for="pg-product-name" class="mx-5">选择人员</label>
              <select class='form-control mx-5 my-1' style="border:1px solid #9E9E9Ebackground-color:#f5f5f5">
                <option value="">请选择</option>
                <option v-for="item in AllUser" :key="item.id" :value='item.user_id'>{{ item.realname }}</option>
              </select>
            </div>
            <span class="ml-5 ms-msg" v-if="errorMsg">错误提示：{{ errorMsg }}</span>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-cancel" data-dismiss="modal">关闭</button>
            <button type="submit" class="btn btn-primary" @click="JoinProduct">提交</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import util from "~/assets/js/util.js"
import rules from "~/assets/js/rules.js"

export default {
  head() {
    return {
      title: "HDesk - 成员管理"
    }
  },
  
  layout: "head", 

  validate({ query }) {
    console.log(query)
    return query.product_code
  },

  filters: {
    date: util.date
  },
  
  data() {
    return {
      product_code: "",
      release_list: "",
      tableData: [],
      AllUser: [],
      msg: "",
      errorMsg: "",
      controlNull: false,
      ProductMemberData: {
        user_id: "",
        product_code: ""
      },
      bannedData: {
        user_id: "",
        product_code: ""
      }
    }
  },

  computed: {
    Rules: function() {
      let group = this.$store.state.userInfo.group
      let PagesRules = this.$store.state.PageData
      return rules.RuleManges(group,PagesRules)
    }
  },
  watch: {
    tableData: function(val, oldval) {
      if (this.tableData.length > 0) {
        this.controlNull = false
      } else {
        this.msg = this.product_code + "产品下暂时还没有成员哦"
        this.controlNull = true
      }
    }
  },

  mounted() {
    this.product_code = this.$route.query.product_code
    this.ProductMemberData.product_code = this.$route.query.product_code
    this.bannedData.product_code = this.$route.query.product_code
    if (this.$route.query.product_code) {
      this.getProductMember()
    } else {
      this.$router.push("/app/products")
    }
  },

  methods: {
    // 获取人员
    getProductMember() {
      axios.get("/api/pm/member/list?product_code=" + this.product_code)
        .then(res => {
          if (res.data["status"] === 20000) {
            this.tableData = res.data["data"]
          } else {
            this.msg = res.data["msg"]
            this.controlNull = true
          }
        })
    },
    // 获取所有人员
    getAllUser() {
      axios.get("/api/user/user_list").then(res => {
        if (res.data["status"] === 20000) {
          this.AllUser = res.data["data"]
        } else {
          this.$notify.error({ 
            title: "获取失败", 
            message: res.data["msg"] 
          })
        }
      })
    },
    // 获取user
    selectMember(event) {
      this.ProductMemberData.user_id = event.target.value
    },
    JoinProduct(row) {
      if (this.ProductMemberData.user_id === "") {
        this.$notify.error({ 
          title: "提交失败", 
          message: "请选择用户" 
        })
        return
      }
      axios({
        method: "post",
        url: "/api/pm/member/join",
        data: JSON.stringify(this.ProductMemberData)
      }).then(res => {
        if (res.data["status"] === 20000) {
          $("#P-Join-Members").modal("hide")
          this.$notify.success({ 
            title: "加入成功", 
            message: res.data["msg"] 
          })
          this.getProductMember()
        }
        if (res.data["status"] !== 20000) {
          this.$notify.error({ 
            title: "加入失败", message: res.data["msg"] 
          })
        }
      })
    },
    banned(rows, event) {
      this.bannedData.user_id = rows.user_id
      axios({
        method: "post",
        url: "/api/pm/member/ban",
        data: JSON.stringify(this.bannedData)
      }).then(res => {
        if (res.data["status"] === 20000) {
          this.$notify.success({ 
            title: "操作成功", 
            message: res.data["msg"] 
          })
          this.getProductMember()
        } else {
          this.$notify.error({ 
            title: "错误", 
            message: res.data["msg"] 
          })
        }
      })
    },
    reJoin(rows, event) {
      this.bannedData.user_id = rows.user_id
      axios({
        method: "post",
        url: "/api/pm/member/rejoin",
        data: JSON.stringify(this.bannedData)
      }).then(res => {
        if (res.data["status"] === 20000) {
          this.$notify.success({
            title: "操作成功",
            message: "此用户已重新激活"
          })
          this.getProductMember()
        } else {
          this.$notify.error({ 
            title: "激活失败", 
            message: res.data["msg"] 
          })
        }
      })
    }
  }
}
</script>