<template>
  <div class='container mt-3'>

    <div class='row mt-5'>
      <div class="col-auto mr-auto">
        <h1 class="navbar-brand">版本管理</h1>
      </div>
      <div class='col-auto'>
        <button type='button' class='btn btn-create' id='addRelease' data-toggle="modal" data-target="#modal-create-release">
          &nbsp&nbsp增加版本&nbsp&nbsp
        </button>
      </div>
    </div>

    <div class='row mt-3 mb-5 table_data'>
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
    <div class='row' v-if="controlNull">
      <div class="col-xl-12 col-lg-12 col-md-12 text-center mt-5">
        <img src="~/static/pic/happy.png" class="null-icon"/>
        <p class="no-hint">{{ msg }}</p>
      </div>
    </div>

    <!-- modal -->
    <div class="modal fade" id="modal-create-release" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">创建版本号</h5>
          </div>
          <div class="modal-body">
            <div class='form-group row col-md-auto'>
              <label for="pg-product-name" class="mx-5">选择产品</label>
              <select class='form-control mx-5 my-1' style="border:1px solid #9E9E9Ebackground-color:#f5f5f5">
                <option>{{ product_code }}</option>
              </select>
            </div>
            <div class='form-group row col-md-auto'>
              <label for="pg-product-name" class="mx-5">版本</label>
              <input type='text' v-model='ReleaseData.release' class='form-control input-lg mx-5 my-1' id='pg-product-name' placeholder='输入（不超20个字）' maxlength='20' required >
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-cancel" data-dismiss="modal">关闭</button>
            <button type="submit" class="btn btn-primary" @click="createRelease">提交</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
import util from "~/assets/js/util.js"

export default {
  head() {
    return {
      title: "HDesk - 版本管理"
    }
  },
  layout: "head",
  filters: {
    date: util.date
  },
  data() {
    return {
      product_code: "",
      release_list: "",
      tableData: [],
      msg: "",
      controlNull: false,
      ReleaseData: {
        release: "",
        product_code: ""
      }
    }
  },
  watch: {
    tableData: function(val, oldval) {
      if (this.tableData.length > 0) {
        this.controlNull = false
      } else {
        this.msg = this.product_code + "产品下暂时还没有版本哦"
        this.controlNull = true
      }
    }
  },
  created() {
    this.product_code = this.$route.query.product_code
    if (this.$route.query.product_code) {
      this.getRelease()
    } else {
      this.$router.push("/basic/product")
    }
  },
  methods: {
    // 获取版本
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
      if ((release.length > 20) | (release.length === 0)) {
        this.$notify.error({
          title: "提交失败",
          message: "版本号的有效长度为0-8"
        })
        return
      }
      axios({
        method: "post",
        url: "/api/pm/release/create",
        data: JSON.stringify(this.ReleaseData)
      }).then(res => {
        if (res.data["status"] === 20000) {
          $("#modal-create-release").modal("hide")
          this.$notify.success({ 
            title: "成功", 
            message: res.data["msg"]
          })
          this.getRelease()
        }
        if (res.data["status"] !== 20000) {
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
