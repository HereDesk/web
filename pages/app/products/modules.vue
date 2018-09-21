<template>
  <div id="page-module" class="container">
    <div id="module-product" class="row pt-5">
      <nav class="navbar navbar-expand-lg mr-auto">
        <a class="navbar-brand">模块管理</a>
        <el-dropdown class="ml-3" trigger="click">
          <span class="dashboard-product">
            <span class="el-dropdown-link"> {{ selected_product || '' }}</span>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for='item in product_list' :key="item.id">
              <span @click="handleCommand(item)">{{ item.value }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </nav>
    </div>
    <div id="module_a" class="row mt-5">
      <div class="col-xl-3 col-sm-12 col-12">
        <h5 class="font-weight-light">一级模块</h5>
        <p class="add_m_a" data-toggle="modal" data-target="#add_module_a"> + 一级模块</p>
        <p class="divider"></p>
        <ul class="pl-0 ul_module_a">
          <li v-for="item in m1_list" :key="item.id" :value="item.m1" :class="{ 'selected_a_module' : selected_a_module == item.id }" @click="handleModuleA(item.id)"> - {{ item.m1 }}</li>
        </ul>
      </div>
      <div id="module_b" class="col-xl-9 col-sm-12 col-12">
        <h5 class="font-weight-light">二级模块</h5>
        <div class="module_b p-3 mb-3">
          <input type="text" class="form-control" placeholder="二级模块名称输入后，回车即可保存成功" 
            v-model="b_module_data.module_b_name"
            @keyup.enter="addModuleB()">
        </div>
        <ul class="ul_module_b pl-3">
          <li v-for="item in m2_list" :key="item.id" class="d-flex"> 
            <span>-&nbsp;&nbsp;</span>
            <span class="flex-grow-1 m2edit" contenteditable="true" @keyup="changeData($event,item)">{{ item.m2 }} &nbsp;</span>
            <div :class="{ visible: editM2.id === item.id, invisible: editM2.id !== item.id}" @click="SaveEditM2()">
              <img class="mr-3" src="~assets/images/save.png">
            </div>
            <div @click="delM2(item)">
              <img class="mr-3" src="~assets/images/vaild.png">
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
              <input type='text' v-model='a_module_data.ModuleA' maxlength="20" class='form-control' rows="5" placeholder='请输入名称...' />
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
import loading from "~/components/loading";

export default {
  head() {
    return {
      title: "HDesk - 产品模块维护"
    };
  },
  layout: "head",
  data() {
    return {
      selected_product: "",
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
    };
  },

  computed: {
    QueryBuilder: function() {
      var QueryBuilder = {};
      QueryBuilder["product_code"] = this.selected_product;
      return QueryBuilder;
    }
  },

  watch: {
    product_list: function(val, oldVal) {
      if (this.product_list.length > 0 && !this.selected_product) {
        this.selected_product = this.product_list[0]["product_code"];
        this.getModuleA();
      }
    },
    selected_product: function(val, oldVal) {
      this.getModuleA();
    },
    QueryBuilder: function(val, oldVal) {
      this.$router.replace({
        path: "/app/products/modules",
        query: this.QueryBuilder
      });
    },
    selected_a_module: function(val, oldVal) {
      this.getModuleB();
    }
  },

  created() {
    var query = this.$route.query;
    if (query["product_code"]) {
      this.selected_product = query["product_code"];
    }
    this.getProductList();
  },
  methods: {
    // get product info and release info
    getProductList() {
      let that = this;
      axios
        .get("/api/pm/new_product_release")
        .then(function(res) {
          if (res.data["status"] === 20000) {
            that.product_list = res.data["data"];
          } else {
            that.msg = res.data["msg"];
          }
        })
        .catch(function(res) {});
    },
    getModuleA() {
      let that = this;
      axios
        .get("/api/pm/module/1/list?product_code=" + this.selected_product)
        .then(function(res) {
          if (res.data["status"] === 20000) {
            that.m1_list = res.data["data"];
            if (res.data["data"].length > 0) {
              that.selected_a_module = res.data["data"][0]["id"];
            }
          } else {
            that.msg = res.data["msg"];
          }
        });
    },
    handleModuleA(data) {
      this.selected_a_module = data;
    },
    addModuleA() {
      let that = this;
      that.a_module_data.product_code = that.selected_product;
      axios({
        method: "post",
        url: "/api/pm/module/1/add",
        data: JSON.stringify(that.a_module_data)
      }).then(function(res) {
        if (res.data["status"] === 20000) {
          $("#add_module_a").modal("hide");
          that.a_module_data.ModuleA = "";
          that.getModuleA();
          that.$notify.success({ title: "成功", message: res.data["msg"] });
        } else {
          that.$notify.error({ title: "提示", message: res.data["msg"] });
        }
      });
    },
    getModuleB() {
      let that = this;
      axios
        .get("/api/pm/module/2/list?module_a_id=" + this.selected_a_module)
        .then(function(res) {
          if (res.data["status"] === 20000) {
            that.m2_list = res.data["data"];
          } else {
            that.msg = res.data["msg"];
          }
        });
    },
    addModuleB() {
      let that = this;
      if (that.selected_a_module) {
        that.b_module_data.module_a_id = that.selected_a_module;
      } else {
        return that.$notify.error({ title: "提示", message: "请选择一级模块" });
      }
      axios({
        method: "post",
        url: "/api/pm/module/2/add",
        data: JSON.stringify(that.b_module_data)
      }).then(function(res) {
        if (res.data["status"] === 20000) {
          that.getModuleB();
          that.b_module_data.module_b_name = "";
          that.$notify.success({ title: "成功", message: res.data["msg"] });
        } else {
          that.$notify.error({ title: "提示", message: res.data["msg"] });
        }
      });
    },

    changeData(event, data) {
      this.editM2.id = data.id;
      this.editM2.m2 = event.target.innerText;
    },
    SaveEditM2() {
      if (this.editM2.m2.length === 0) {
        this.$notify.error({
          title: "提示",
          message: "不能提交空文白哦，如需删除，请点击删除操作"
        });
        return;
      }
      let that = this;
      let tmp = this.editM2.m2;
      this.editM2.m2 = tmp.replace(/(^\s*)|(\s*$)/g, "");
      axios({
        method: "post",
        url: "/api/pm/module/2/edit",
        data: JSON.stringify(this.editM2)
      }).then(function(res) {
        if (res.data["status"] === 20000) {
          that.$notify.success({ title: "成功", message: res.data["msg"] });
          that.getModuleB();
        } else {
          that.$notify.error({ title: "提示", message: res.data["msg"] });
        }
      });
    },
    delM2(data) {
      let that = this;
      axios.get("/api/pm/module/2/del?id=" + data.id).then(function(res) {
        if (res.data["status"] === 20000) {
          that.$notify.success({ title: "成功", message: res.data["msg"] });
          that.getModuleB();
        } else {
          that.$notify.error({ title: "提示", message: res.data["msg"] });
        }
      });
    }
  }
};
</script>

<style>
@import "~/static/static/common/css/module.css";
</style>
