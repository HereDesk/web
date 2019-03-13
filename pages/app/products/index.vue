<template>
  <div class='container mt-5'>
    <div class='row mt-5'>
      <div class="col-auto mr-auto">
      </div>
      <div class='col-auto' >
        <button id='addproduct' type='button' class='btn btn-create' 
          v-if="Rules.product_add" @click="showModal = 'Product'">+ 增加产品
        </button>
      </div>
    </div>

    <div class='row mt-3 mb-5 table_data'>
      <div class='col-xl-12 col-lg-12 col-md-12'>
        <el-table :data='tableData' :default-sort="{prop: 'date', order: 'descending'}">
          <el-table-column prop='product_id' label='ID' show-overflow-tooltip></el-table-column>
          <el-table-column prop='product_name' label='产品名称'></el-table-column>
          <el-table-column prop='product_code' label='产品编码'></el-table-column>
          <el-table-column label='创建时间'>
            <template slot-scope="scope">
              <span>{{ scope.row.create_time | date }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="creator" label="创建人"></el-table-column>
          <el-table-column label="是否本人创建">
            <template slot-scope="scope">
              <span>{{ scope.row.isCreator ? '是' : '否' }}</span>
            </template>
          </el-table-column>
          <el-table-column label='操作' align="center" width="200"
            v-if="Rules.product_members || Rules.product_release || Rules.product_modules">
            <template slot-scope="scope">
              <nuxt-link 
                :to="{ 
                  path: '/app/products/members', 
                  query: { 'product_id': scope.row.product_id } }"
                v-if="Rules.product_members">
                <button type="button" class="btn btn-outline-primary btn-sm">成员</button>
              </nuxt-link>
              <nuxt-link 
                :to="{ 
                  path: '/app/products/release', 
                  query: { 'product_id': scope.row.product_id } }"
                v-if="Rules.product_release">
                <button type="button" class="btn btn-outline-primary btn-sm ml-3">版本</button>
              </nuxt-link>
              <nuxt-link 
                :to="{ 
                  path: '/app/products/modules', 
                  query: { 'product_id': scope.row.product_id } }"
                v-if="Rules.product_modules">
                <button type="button" class="btn btn-outline-primary btn-sm ml-3">模块</button>
              </nuxt-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <Modal v-if="showModal == 'Product'" @close="showModal = false" :isFooter="true">
      <h5 slot="header">创建产品</h5>
      <div class="form-group" slot="body">
        <div class='row col-md-auto'>
          <label for="pg-product-name" class="mx-5">产品名称</label>
          <input type='text' id='pg-product-name' class='form-control input-lg mx-5 my-1' 
            placeholder='输入（不超20个字）' maxlength='20' 
            required autofocus
            v-model='ProductData.product_name' >
        </div>
        <div class='row col-md-auto'>
          <label for="pg-product-name" class="mx-5">产品编号/简称</label>
          <input type='text' id='pg-product-name' class='form-control input-lg mx-5 my-1'
            placeholder='输入（不超20个字）' maxlength='20' 
            required autofocus
            v-model='ProductData.product_code' >
          <p class="mx-5 mt-3 font-size-90 text-gray">备注：提交后无法修改，请慎重填写</p>
        </div>
      </div>
      <button slot="footer" type="submit" class="btn btn-primary" @click="createProduct">提交</button>
    </Modal>

    <div class='row' v-if="controlNull">
      <div class="col-xl-12 col-lg-12 col-md-12 text-center mt-5">
        <img src="~/static/images/happy.png" class="null-icon"/>
        <p class="no-hint">暂时没有项目,快去增加一个项目吧</p>
      </div>
    </div>

  </div>
</template>

<script>
import util from "~/assets/js/util.js"
import rules from "~/assets/js/rules.js"

export default {
  head() {
    return {
      title: "HDesk - 产品管理"
    }
  },
  layout: "head",

  filters: {
    date: util.date
  },
  data() {
    return {
      showModal: false,
      FirstPage: 1,
      LastPage: "",
      pageNumber: 1,
      pageSize: 10,
      total: "",
      loading: true,
      selectedProduct: "",
      first_product: "",
      product_list: "",
      tableData: [],
      errorMsg: "",
      isShowTip: false,
      isShowPaging: false,
      isLook: false,
      msg: "",
      controlNull: false,
      ProductData: {
        product_code: "",
        product_name: ""
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

  created() {
    this.getProductList()
  },

  methods: {
    getProductList() {
      this.axios.get("/api/pm/product/all_list").then(res => {
        if ((res.data["status"] === 20000) & (res.data["data"].length > 0)) {
          this.loading = false
          this.tableData = res.data["data"]
          this.controlNull = false
        } else {
          this.controlNull = true
        }
      })
    },
    handleClick(row) {
      this.isLook = true
      this.modalDetails.product_code = row.product_code
      this.modalDetails.product_name = row.product_name
    },
    createProduct() {
      let productCode = this.ProductData.product_code
      let productName = this.ProductData.product_name
      if ((productName.length > 20) | (productName.length < 3)) {
        this.$notify.error({title: "错误",message: "项目名称的有效长度为3-20"})
        return 
      }
      if ((productCode.length > 20) | (productCode.length < 3)) {
        this.$notify.error({title: "错误",message: "项目编码的有效长度为3-20"})
        return 
      }
      this.axios({
        method: "post",
        url: "/api/pm/product/create",
        data: JSON.stringify(this.ProductData)
      }).then(res => {
        if (res.data["status"] === 20000) {
          this.showModal=false
          this.getProductList()
          this.$notify.success({title: "成功",message: res.data["msg"]})
        } else {
          this.$notify.error({title: "错误",message: res.data["msg"]})
        }
      })
    }
  }
}
</script>