<template>
  <div id="page-product-module" class="container">
    <div id="module-product" class="row pt-5">
      <nav class="navbar navbar-expand-lg mr-auto">
        <a class="navbar-brand">
          {{ selected_product }}&nbsp;模块
        </a>
      </nav>
    </div>
    <div id="module_a" class="row my-5">
      <div class="col-xl-3 col-sm-12 col-12">
        <h5 class="font-weight-light">一级模块</h5>
        <p class="add_m_a" data-toggle="modal" data-target="#add_module_a" v-if="Rules.product_modules"> + 一级模块</p>
        <p class="divider"></p>
        <ul class="pl-0 ul_module_a">
          <li v-for="item in m1_list" :key="item.id" :value="item.m1" 
          :class="{ 'selected_a_module' : selected_a_module == item.id }" 
          @click="handleModuleA(item.id)"> * {{ item.m1 }}</li>
        </ul>
      </div>
      <div id="module_b" class="col-xl-9 col-sm-12 col-12">
        <h5 class="font-weight-light">二级模块</h5>
        <div class="module_b p-3 mb-3">
          <input type="text" class="form-control" placeholder="二级模块名称输入后，回车即可保存成功"
            v-if="Rules.product_modules"
            v-model="b_module_data.module_b_name"
            @keyup.enter="addModuleB()">
        </div>
        <ul class="ul_module_b pl-3">
          <li v-for="item in m2_list" :key="item.id" class="d-flex"> 
            <span>-&nbsp;&nbsp;</span>
            <span class="flex-grow-1 m2edit" :contenteditable="Rules.product_modules" @keyup="changeData($event,item)">
              {{ item.m2 }} &nbsp;
            </span>
            <div v-if="Rules.product_modules" 
              :class="{ visible: editM2.id === item.id, invisible: editM2.id !== item.id}"
              @click="SaveEditM2()">
              <i class="iconfont icon-duigou icon-8a8a8a size-1-5 mr-3"></i>
            </div>
            <div v-if="Rules.product_modules" @click="delM2(item)">
              <i class="iconfont icon-delete icon-8a8a8a size-1-5"></i>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div id="add_module_a" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ selected_product }} 添加一级模块 </h5>
          </div>
          <div class="modal-body my-3">
            <div class='form-group row col-md-auto mx-3'>
              <label for="ModuleA">模块名称</label>
              <input type='text' class='form-control' rows="5" maxlength="20" placeholder='请输入名称...' 
                v-model='a_module_data.ModuleA'/>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-cancel" data-dismiss="modal">关闭</button>
            <button type="submit" class="btn btn-primary" @click="addModuleA()">提交</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import loading from "~/components/loading"
import rules from "~/assets/js/rules.js"

export default {
  head() {
    return {
      title: "HDesk - 产品模块维护"
    }
  },
  layout: "head",
  validate({ query }) {
    return query.product_code
  },
  data() {
    return {
      selected_product: this.$route.query.product_code || "",
      product_list: [],
      msg: "",
      selected_a_module: null,
      m1_list: [],
      a_module_data: {
        product_code: "",
        ModuleA: ""
      },
      m2_list: [],
      b_module_data: {
        module_a_id: "",
        module_b_name: ""
      },
      editM2: {
        id: null,
        m2: null
      }
    }
  },

  computed: {
    QueryBuilder: function() {
      var QueryBuilder = {}
      QueryBuilder["product_code"] = this.selected_product
      return QueryBuilder
    },
    Rules: function() {
      let group = this.$store.state.userInfo.group
      let PagesRules = this.$store.state.PageData
      return rules.RuleManges(group,PagesRules)
    }
  },

  watch: {
    selected_product: function(val, oldVal) {
      this.getModuleA()
    },
    QueryBuilder: function(val, oldVal) {
      this.$router.replace({
        path: "/app/products/modules",
        query: this.QueryBuilder
      })
    },
    selected_a_module: function(val, oldVal) {
      this.getModuleB()
    }
  },

  created() {
    this.getProductList()
    this.getModuleA()
  },
  methods: {
    getProductList() {
      axios.get("/api/pm/product/user_list")
        .then(res => {
          if (res.data["status"] === 20000) {
            this.product_list = res.data["data"]
          } else {
            this.msg = res.data["msg"]
          }
        })
        .catch(res => {})
    },
    getModuleA() {
      axios.get("/api/pm/module/1/list?product_code=" + this.selected_product)
        .then(res => {
          if (res.data["status"] === 20000) {
            this.m1_list = res.data["data"]
            if (res.data["data"].length > 0) {
              this.selected_a_module = res.data["data"][0]["id"]
            }
          } else {
            this.msg = res.data["msg"]
          }
        })
    },
    handleModuleA(data) {
      this.selected_a_module = data
    },
    addModuleA() {
      this.a_module_data.product_code = this.selected_product
      axios({
        method: "post",
        url: "/api/pm/module/1/add",
        data: JSON.stringify(this.a_module_data)
      }).then(res => {
        if (res.data["status"] === 20000) {
          $("#add_module_a").modal("hide")
          this.a_module_data.ModuleA = ""
          this.getModuleA()
          this.$notify.success({
            title: "成功",
            message: res.data["msg"]
          })
        } else {
          this.$notify.error({
            title: "提示",
            message: res.data["msg"]
          })
        }
      })
    },
    getModuleB() {
      axios.get("/api/pm/module/2/list?module_a_id=" + this.selected_a_module)
        .then(res => {
          if (res.data["status"] === 20000) {
            this.m2_list = res.data["data"]
          } else {
            this.msg = res.data["msg"]
          }
        })
    },
    addModuleB() {
      if (this.selected_a_module) {
        this.b_module_data.module_a_id = this.selected_a_module
      } else {
        return this.$notify.error({
          title: "提示",
          message: "请选择一级模块"
        })
      }
      axios({
        method: "post",
        url: "/api/pm/module/2/add",
        data: JSON.stringify(this.b_module_data)
      }).then(res => {
        if (res.data["status"] === 20000) {
          this.getModuleB()
          this.b_module_data.module_b_name = ""
          this.$notify.success({
            title: "成功",
            message: res.data["msg"]
          })
        } else {
          this.$notify.error({
            title: "提示",
            message: res.data["msg"]
          })
        }
      })
    },

    changeData(event, data) {
      this.editM2.id = data.id
      this.editM2.m2 = event.target.innerText
    },
    SaveEditM2() {
      if (this.editM2.m2.length === 0) {
        this.$notify.error({
          title: "提示",
          message: "不能提交空文白哦，如需删除，请点击删除操作"
        })
        return
      }
      let tmp = this.editM2.m2
      this.editM2.m2 = tmp.replace(/(^\s*)|(\s*$)/g, "")
      axios({
        method: "post",
        url: "/api/pm/module/2/edit",
        data: JSON.stringify(this.editM2)
      }).then(res => {
        if (res.data["status"] === 20000) {
          this.$notify.success({
            title: "成功",
            message: res.data["msg"]
          })
          this.getModuleB()
        } else {
          this.$notify.error({
            title: "提示",
            message: res.data["msg"]
          })
        }
      })
    },
    delM2(data) {
      axios.get("/api/pm/module/2/del?id=" + data.id).then(res => {
        if (res.data["status"] === 20000) {
          this.$notify.success({
            title: "成功",
            message: res.data["msg"]
          })
          this.getModuleB()
        } else {
          this.$notify.error({
            title: "提示",
            message: res.data["msg"]
          })
        }
      })
    }
  }
}
</script>

<style>
  @import "~/static/static/common/css/module.css"
</style>
