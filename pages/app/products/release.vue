<template>
  <div id="page-product-release" class='container mt-3'>

		<!-- page data -->
    <div id="page-head" class='row mt-5'>
      <div id="page-title" class="col-auto mr-auto">
        <h1 class="navbar-brand">{{ product_code }}&nbsp;版本管理</h1>
      </div>
      <div id="page-add-release" class='col-auto'>
        <button id="add_btn" type='button' class='btn btn-create'
          v-if="Rules.product_release" @click="showModal = 'add_version'">
          &nbsp;&nbsp;增加版本&nbsp;&nbsp;
        </button>
      </div>
    </div>

		<!-- page data -->
    <div id="page-data" class='row mt-3 mb-5 table_data'>
      <div class='col-xl-12 col-lg-12 col-md-12'>
        <el-table :data='tableData' :default-sort="{prop: 'date', order: 'descending'}">
          <el-table-column label='产品' prop='product_code'></el-table-column>
          <el-table-column label='版本' prop='version'></el-table-column>
          <el-table-column label='创建者' prop='user'></el-table-column>
          <el-table-column label='创建时间'>
            <template slot-scope="scope">
              <span>{{ scope.row.create_time | date }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    
		<!-- page null -->
		<div id="page-null" class='row' v-if="controlNull">
      <div class="col-xl-12 col-lg-12 col-md-12 text-center mt-5">
        <img src="~/static/pic/happy.png" class="null-icon"/>
        <p class="no-hint">{{ msg }}</p>
      </div>
    </div>

    <!-- create version modal -->
    <Modal id="page-modal" v-if="showModal == 'add_version'" @close="showModal = true" :isFooter="true">
      <h5 slot="header">创建版本号</h5>
      <div class="form-group" slot="body">
        <div class='row col-md-auto'>
          <label for="pg-product-name" class="mx-5">选择产品</label>
          <select class='form-control mx-5 my-1' style="border:1px solid #9E9E9E;background-color:#f5f5f5">
            <option>{{ product_code }}</option>
          </select>
        </div>
        <div class='row col-md-auto'>
          <label for="pg-product-name" class="mx-5">版本</label>
          <input type='text' id='pg-product-name' class='form-control input-lg mx-5 my-1'
            placeholder='输入（不超20个字）' maxlength='20' required 
            v-model='ReleaseData.release'  @keyup.enter="createRelease()" />
        </div>
      </div>
      <button type="submit" class="btn btn-primary" slot="footer" @click="createRelease()">提交</button>
    </Modal>

  </div>
</template>

<script>
import axios from 'axios'

import Modal from "~/components/Modal"

import util from "~/assets/js/util.js"
import rules from "~/assets/js/rules.js"

export default {
  head () {
    return {
      title: "HDesk - 版本管理"
    }
  },
  validate({ query }) {
    return /\w+/.test(query.product_code)
  },

  layout: "head",
  components: {
    Modal
  },

  data() {
    return {
      showModal: false,
			msg: "",
			controlNull: false,
      product_code: this.$route.query.product_code || "",
      release_list: "",
      tableData: [],
      ReleaseData: {
        release: "",
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
  filters: { 
    date: util.date
  },
  watch: {
    tableData: function(val, oldval) {
      if (this.tableData.length) {
        this.controlNull = false
      } else {
        this.msg = this.product_code + "产品下暂时还没有版本哦"
        this.controlNull = true
      }
    }
  },
  created() {
    this.getRelease()
  },
  methods: {
		
    // Gets all versions in the project
    getRelease() {
      axios.get("/api/pm/release/list?product_code=" + this.product_code)
        .then(res => {
          if (res.data["status"] === 20000) {
            this.tableData = res.data["data"]
          } else {
            this.msg = res.data["msg"]
          }
        })
    },
		
    createRelease(row) {
      let release = this.ReleaseData.release
      this.ReleaseData.product_code = this.product_code
      if (release.length > 20 | release.length < 3) {
        this.$notify.error({title: "失败",message: "版本号的有效长度为3-20"})
        return
      }
      axios({
        method: "post",
        url: "/api/pm/release/create",
        data: JSON.stringify(this.ReleaseData)
      }).then(res => {
        if (res.data["status"] === 20000) {
					this.showModal = false
          this.$notify.success({ title: "成功", message: res.data["msg"]})
          this.getRelease()
        }
        if (res.data["status"] !== 20000) {
          this.$notify.error({ title: "错误", message: res.data["msg"] })
        }
      })
    }
  }
}
</script>