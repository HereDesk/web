<template>
  <div id="page-product-release" class="container mt-3">

		<!-- page data -->
    <div id="page-head" class="row mt-5">
      <div id="page-title" class="col-auto mr-auto">
        <h1 class="navbar-brand">{{ product_code }}&nbsp;版本管理</h1>
      </div>
      <div id="page-add-release" class="col-auto">
        <button id="add_btn" type="button" class="btn btn-create"
          v-if="Rules.product_release" @click="showModal = 'addversion'">
          &nbsp;&nbsp;增加版本&nbsp;&nbsp;
        </button>
      </div>
    </div>

		<!-- page data -->
    <div id="page-data" class="row mt-3 mb-5 table_data">
      <div class="col-xl-12 col-lg-12 col-md-12">
        <el-table :data="tableData" :default-sort="{prop: 'date', order: 'descending'}">
          <el-table-column label="产品" prop="product_code"></el-table-column>
          <el-table-column label="版本" prop="version"></el-table-column>
          <el-table-column label="创建者" prop="user"></el-table-column>
          <el-table-column label="创建时间">
            <template slot-scope="scope">
              <span>{{ scope.row.create_time | date }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

		<!-- page null -->
		<div id="page-null" class="row" v-if="controlNull">
      <div class="col-xl-12 col-lg-12 col-md-12 text-center mt-5">
        <img src="~/static/images/happy.png" class="null-icon"/>
        <p class="no-hint">{{ msg }}</p>
      </div>
    </div>

    <!-- create version modal -->
    <Modal id="page-modal" v-if="showModal==='addversion'" @close="showModal=true" :isFooter="true">
      <h5 slot="header">创建版本号</h5>
      <div class="form-group" slot="body">
        <div class="row col-md-auto mx-3">
          <span>版本名称</span>
          <input type="text"
            id="pg-product-name" class="form-control input-lg my-1"
            placeholder="输入（不超20个字）" maxlength="20" required
            v-model="ReleaseData.release"
            @keyup.enter="createRelease()" />
          <p class="mt-3 font-size-90 text-gray">备注：提交后无法修改，请慎重填写</p>
        </div>
      </div>
      <button type="submit" class="btn btn-primary" slot="footer" @click="createRelease()">提交</button>
    </Modal>

  </div>
</template>

<script>
import util from "~/assets/js/util.js"
import rules from "~/assets/js/rules.js"

export default {
  head () {
    return {
      title: "HDesk - 版本管理"
    }
  },
  validate({ query }) {
    return /[A-Za-z0-9]+/.test(query.product_id)
  },

  layout: "head",

  data() {
    return {
      showModal: false,
			msg: "",
			controlNull: false,
      product_code: this.$route.query.product_code || "",
      product_id: this.$route.query.product_id || "",
      release_list: "",
      tableData: [],
      ReleaseData: {
        release: "",
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
  filters: {
    date: util.date
  },
  watch: {
    tableData: function(val, oldval) {
      if (this.tableData.length) {
        this.controlNull = false
      } else {
        this.msg = "还没有版本，快创建吧"
        this.controlNull = true
      }
    }
  },

  created() {
    this.getReleaseList()
  },

  methods: {

    // Gets all versions in the project
    getReleaseList() {
      this.axios
        .get("/api/pm/release/list?product_id=" + this.product_id)
        .then(res => {
          if (res.data["status"] === 20000) {
            this.product_code = res.data["product_code"]
            this.tableData = res.data["data"]
          } else {
            this.msg = res.data["msg"]
          }
        })
    },

    createRelease(row) {
      let release = this.ReleaseData.release
      this.ReleaseData.product_id = this.product_id
      if (release.length > 20 | release.length < 3) {
        this.$notify.error({title: "失败",message: "版本号的有效长度为3-20"})
        return
      }
      this.axios({
        method: "post",
        url: "/api/pm/release/create",
        data: JSON.stringify(this.ReleaseData)
      }).then(res => {
        if (res.data["status"] === 20000) {
					this.showModal = false
          this.$notify.success({ title: "成功", message: res.data["msg"]})
          this.getReleaseList()
          this.$store.dispatch("getProductRelease")
        }
        if (res.data["status"] !== 20000) {
          this.$notify.error({ title: "错误", message: res.data["msg"] })
        }
      })
    }
  }
}
</script>
