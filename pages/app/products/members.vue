
<template>
  <div id="page-product-members" class="container mt-3">

    <div id="page-head" class="row mt-5">
      <div id="page-title" class="col-auto mr-auto">
        <a class="navbar-brand">{{ product_code }}&nbsp;成员管理</a>
      </div>
      <div  id="add-members" class="col-auto">
        <button type="button"  id="add-btn" class="btn btn-create mt-2"
          v-if="Rules.product_members" @click="showModal = 'addmembers'">+ 增加成员
        </button>
      </div>
    </div>

    <div id="page-data" class="row mt-3 mb-5 table_data">
      <div class="col-xl-12 col-lg-12 col-md-12">
        <el-table :data="tableData" :default-sort="{prop: 'date', order: 'descending'}">
          <el-table-column label="真实姓名" prop="realname"></el-table-column>
          <el-table-column label="权限" prop="role_name"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 1" class="text-deadly">禁用</span>
              <span v-if="scope.row.status === 0">启用</span>
            </template>
          </el-table-column>
          <el-table-column label="加入时间">
            <template slot-scope="scope">
              <span>{{ scope.row.join_time | date }}</span>
            </template>
          </el-table-column>
          <el-table-column label="禁用时间">
            <template slot-scope="scope">
              <span>{{ scope.row.banned_time | date }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" v-if="Rules.product_members">
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

    <div id="page-null" class="row" v-if="controlNull">
      <div class="col text-center mt-5">
        <img src="~/static/images/happy.png" class="null-icon"/>
        <p class="no-hint">{{ msg }}</p>
      </div>
    </div>

    <!-- add member modal -->
    <Modal id="add_members" v-if="showModal === 'addmembers'" @close="showModal = false" :isFooter="true">
      <h5 slot="header">增加成员</h5>
      <div class="form-group" slot="body">
        <div class="row col-md-auto mx-3">
          <span>产品</span>
          <div style="width:100%;">
            <ProductInfo
              :showStyle="'select'" :ptype="'only-product-name'" @ProductInfo="GetProductInfo">
            </ProductInfo>
          </div>
        </div>
        <div class="row col-md-auto m-3" @change="selectMember($event)">
          <span>人员</span>
          <el-select id="info-product" style="width:100%;" placeholder="选择人员" v-model="MemberJoin.user_id">
            <el-option v-for="(item,index) in AllUser"
              :key="index" :label="item.realname" :value="item.user_id">
            </el-option>
          </el-select>
        </div>
        <div class="row col-md-auto mx-3" @change="selectMember($event)">
          <span>权限</span>
          <el-select id="info-perm" style="width:100%;" placeholder="选择权限" v-model="MemberJoin.role">
            <el-option v-for="(item,index) in group_list"
              :key="index" :label="item.name" :value="item.role">
            </el-option>
          </el-select>
        </div>
      </div>
      <button type="submit" class="btn btn-primary" slot="footer" @click="JoinProduct">提交</button>
    </Modal>

  </div>
</template>

<script>
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
    return /[A-Za-z0-9]+/.test(query.product_id)
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
      product_id: "",
      tableData: [],
      AllUser: [],
      group_list: [],
      MemberJoin: {
        user_id: "",
        product_id: "",
        role: ""
      },
      MemberBanned: {
        user_id: "",
        product_id: ""
      }
    }
  },

  computed: {
    Rules: function() {
      let userInfo = this.$store.state.userInfo
      let PagesRules = this.$store.state.PageData
      return rules.RuleManges(userInfo,PagesRules)
    }
  },

  watch: {
    showModal () {
      this.showModal ?
        document.body.classList.add("overflow-hidden") :
        document.body.classList.remove("overflow-hidden")
    },
    tableData: function(val, oldval) {
      if (this.tableData.length) {
        this.controlNull = false
      } else {
        this.msg = "该产品下暂时还没有成员哦"
        this.controlNull = true
      }
    },
    MemberJoin: {
      handler: function(val,oldVal) {
        let user_id = this.MemberJoin.user_id
        for (const item1 of this.AllUser) {
          if (user_id === item1.user_id) {
            for (const item2 of this.group_list) {
              let tmp = item2.name + item2.group
              if (tmp.includes(item1.position)) {
                this.MemberJoin.role = item2.group
              }
            }
          }
        }
      },
      deep: true
    }
  },

  mounted() {
    let product_id = this.$route.query.product_id
    this.product_id = product_id
    this.MemberJoin.product_id = product_id
    this.MemberBanned.product_id = product_id
    if (product_id) {
      this.getProductMember()
      this.get_group_list()
    } else {
      this.$router.push("/app/products")
    }
    this.getAllUser()
  },

  methods: {
    // get $emit data
    GetProductInfo (data)  {
      this.product_id = data.product_id
    },

    // get current product member
    getProductMember() {
      this.axios.get("/api/pm/member/list?product_id=" + this.product_id)
        .then(res => {
          if (res.data["status"] === 20000) {
            this.tableData = res.data["data"]
          } else {
            this.msg = res.data["msg"]
            this.controlNull = true
          }
        })
    },

    // group
    get_group_list() {
      this.axios.get("/api/user/group").then(res => {
        if (res.data["status"] === 20000) {
          this.group_list = res.data["data"]
        } else {
          this.$notify.error({title: "提示",message: res.data["msg"]})
        }
      })
    },

    // get system all user
    getAllUser() {
      this.axios.get("/api/user/user_list").then(res => {
        if (res.data["status"] === 20000) {
          this.AllUser = res.data["data"]
        } else {
          this.$notify.error({title: "失败",message: res.data["msg"]})
        }
      })
    },

    //  users to Join the project
    JoinProduct(row) {
      if (!this.MemberJoin.user_id) {
        this.$notify.error({title: "失败",message: "请选择用户后再提交"})
        return
      }
      this.axios({
        method: "post",
        url: "/api/pm/member/join",
        data: JSON.stringify(this.MemberJoin)
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
      this.MemberBanned.user_id = rows.user_id
      this.axios({
        method: "post",
        url: "/api/pm/member/ban",
        data: JSON.stringify(this.MemberBanned)
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
      this.MemberBanned.user_id = rows.user_id
      this.axios({
        method: "post",
        url: "/api/pm/member/rejoin",
        data: JSON.stringify(this.MemberBanned)
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
