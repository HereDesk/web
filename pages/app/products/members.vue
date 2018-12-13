<template>
  <div id="page-product-members" class='container mt-3'>

    <div id="page-head" class='row mt-5'>
      <div id="page-title" class="col-auto mr-auto">
        <a class="navbar-brand">{{ product_code }}&nbsp;成员管理</a>
      </div>
      <div  id='add-members' class='col-auto'>
        <button type='button'  id='add-btn' class='btn btn-create' 
          v-if="Rules.product_members" @click="showModal = 'add_members'">+ 增加成员
        </button>
      </div>
    </div>

    <div id="page-data" class='row mt-3 mb-5 table_data'>
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

    <div id="page-null" class='row' v-if="controlNull">
      <div class="col-xl-12 col-lg-12 col-md-12 text-center mt-5">
        <img src="~/static/pic/happy.png" class="null-icon"/>
        <p class="no-hint">{{ msg }}</p>
      </div>
    </div>

    <!-- add member modal -->
    <Modal id="add_members" v-if="showModal == 'add_members'" @close="showModal = false" :isFooter="true">
      <h5 slot="header">增加成员</h5>
      <div class="form-group" slot="body">
        <div class='row col-md-auto'>
          <label for="pg-product-name" class="mx-5">产品</label>
          <select class='form-control mx-5 my-1' style="border:1px solid #9E9E9E;">
            <option>{{ product_code }}</option>
          </select>
        </div>
        <div class='row col-md-auto' @change="selectMember($event)">
          <label for="pg-product-name" class="mx-5">选择人员</label>
          <select class='form-control mx-5 my-1' style="border:1px solid #9E9E9E;">
            <option value="">请选择</option>
            <option v-for="item in AllUser" :key="item.id" :value='item.user_id'>{{ item.realname }}</option>
          </select>
        </div>
      </div>
      <button type="submit" class="btn btn-primary" slot="footer" @click="JoinProduct">提交</button>
    </Modal>

  </div>
</template>

<script>
import axios from 'axios'

import Modal from "~/components/Modal"

import util from "~/assets/js/util.js"
import rules from "~/assets/js/rules.js"

export default {
  head() {
    return {
      title: "HDesk - 成员管理"
    }
  },
  
  layout: "head", 

  components: {
    Modal
  },

  validate({ query }) {
    return /\w+/.test(query.product_code)
  },

  filters: {
    date: util.date
  },
  
  data() {
    return {
			showModal: false,
			controlNull: false,
			msg: "",
      product_code: "",
      release_list: "",
      tableData: [],
      AllUser: [],
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
      if (this.tableData.length) {
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
    this.getAllUser()
  },

  methods: {
    // get current product member
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

    // get system all user
    getAllUser() {
      axios.get("/api/user/user_list").then(res => {
        if (res.data["status"] === 20000) {
          this.AllUser = res.data["data"]
        } else {
          this.$notify.error({title: "失败",message: res.data["msg"]})
        }
      })
    },

    // selected user data
    selectMember(event) {
      this.ProductMemberData.user_id = event.target.value
    },

    // add users to the project
    JoinProduct(row) {
      if (!this.ProductMemberData.user_id) {
        this.$notify.error({title: "失败",message: "请选择用户后再提交"})
        return
      }
      axios({
        method: "post",
        url: "/api/pm/member/join",
        data: JSON.stringify(this.ProductMemberData)
      }).then(res => {
        if (res.data["status"] === 20000) {
          this.showModal=false
          this.$notify.success({title: "成功",message: res.data["msg"]})
          this.getProductMember()
        }
        if (res.data["status"] !== 20000) {
          this.$notify.error({title: "失败", message: res.data["msg"]})
        }
      })
    },

    // banned user to the product
    banned(rows, event) {
      this.bannedData.user_id = rows.user_id
      axios({
        method: "post",
        url: "/api/pm/member/ban",
        data: JSON.stringify(this.bannedData)
      }).then(res => {
        if (res.data["status"] === 20000) {
          this.$notify.success({title: "成功",message: res.data["msg"]})
          this.getProductMember()
        } else {
          this.$notify.error({title: "错误",message: res.data["msg"]})
        }
      })
    },

    // rejoin user to the product
    reJoin(rows, event) {
      this.bannedData.user_id = rows.user_id
      axios({
        method: "post",
        url: "/api/pm/member/rejoin",
        data: JSON.stringify(this.bannedData)
      }).then(res => {
        if (res.data["status"] === 20000) {
          this.$notify.success({title: "成功",message: "此用户已重新激活"})
          this.getProductMember()
        } else {
          this.$notify.error({title: "失败",message: res.data["msg"]})
        }
      })
    }
  }
}
</script>