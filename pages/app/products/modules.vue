<template>
  <div id="page-product-module" class="container">

    <div id="page-head" class="row pt-5">
      <nav class="navbar navbar-expand-lg mr-auto">
        <a class="navbar-brand">{{ selected_product }}&nbsp;模块</a>
      </nav>
    </div>

    <div id="page-data" class="row my-5">

      <div id="module-a" class="col-md-3 col-sm-12 col-12">
        <h5 class="font-weight-light">一级模块</h5>
        <p class="add_m_a" v-if="Rules.product_modules" @click="showModal = 'addmodules'">
           + 一级模块</p>
        <p class="divider"></p>
        <ul class="pl-0 ul_module_a">
          <li v-for="(item,index) in m1_list" :key="index" :id="item.m1_id" :value="item.m1_id"
						:class="{ 'selected_a_module' : selected_a_module == item.m1_id }"
						@click="handleModuleA(item.m1_id)">
						- {{ item.m1_name }}
					</li>
        </ul>
      </div>

			<div id="module_b" class="col-md-9 col-sm-12 col-12">
        <h5 class="font-weight-light">二级模块</h5>
        <div class="module_b p-3 mb-3">
          <input type="text"
            class="form-control"
            placeholder="二级模块名称输入后，回车即可保存成功"
            v-if="Rules.product_modules"
            v-model="m2_data.m2_name"
            @keyup.enter="addModuleB()">
        </div>
        <ul class="ul_module_b pl-3">
          <li v-for="item in m2_list" :key="item.id" class="d-flex">
            <span>-&nbsp;&nbsp;</span>
            <span class="flex-grow-1 m2edit" :contenteditable="Rules.product_modules"
							@keyup="changeData($event,item)">
              {{ item.m2_name }}
            </span>
            <div
              :class="{ visible: editM2.m2_id === item.id, invisible: editM2.m2_id !== item.id}"
              v-if="Rules.product_modules"
              @keyup.enter="SaveEditM2()"
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

    <Modal id="modal-a-module" v-if="showModal == 'addmodules'" @close="showModal = true" :isFooter="true">
      <h5 slot="header">添加一级模块</h5>
      <div class='form-group row col-md-auto mx-3' slot="body">
        <label for="ModuleA">模块名称</label>
        <input type='text' class='form-control' rows="5" maxlength="20" placeholder='请输入名称...'
          v-model='m1_data.m1_name'  @keyup.enter="addModuleA()" autofocus/>
      </div>
      <button slot="footer" type="submit" class="btn btn-primary" @click="addModuleA()">
				提交
			</button>
    </Modal>

  </div>
</template>

<script>
import PageLoading from "~/components/PageLoading"

import rules from "~/assets/js/rules.js"

export default {
  head() {
    return {
      title: "HDesk - 产品模块维护"
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
      product_id: this.$route.query.product_id || "",
      selected_product: this.$route.query.product_code || "",
      selected_a_module: null,
      m1_list: [],
      m1_data: {
        product_id: "",
        m1_name: ""
      },
      m2_list: [],
      m2_data: {
        m1_id: "",
        m2_name: ""
      },
      editM2: {
        m2_id: null,
        m2_name: null
      }
    }
  },

  watch: {
    showModal () {
      this.showModal ?
        document.body.classList.add("overflow-hidden") :
        document.body.classList.remove("overflow-hidden")
    }
  },

  computed: {
    QueryBuilder: function() {
      let QueryBuilder = {}
      QueryBuilder["product_code"] = this.selected_product
      return QueryBuilder
    },
    Rules: function() {
      let userInfo = this.$store.state.userInfo
      let PagesRules = this.$store.state.PageData
      return rules.RuleManges(userInfo,PagesRules)
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
    this.getModuleA()
  },

  methods: {

		getModuleA() {
      this.axios.get("/api/pm/module/1/list?product_id=" + this.product_id)
        .then(res => {
          if (res.data["status"] === 20000) {
            this.m1_list = res.data["data"]
            if (res.data["data"].length) {
              this.selected_a_module = res.data["data"][0]["m1_id"]
            }
          } else {
            this.msg = res.data["msg"]
          }
        })
    },

    handleModuleA(data) {
      console.log(data)
      this.selected_a_module = data
    },

    addModuleA() {
      this.m1_data.product_id = this.product_id
			let module_a_name = this.m1_data.m1_name
			if (module_a_name > 20 | module_a_name < 2) {
				this.$notify.error({title: "提示",message: "模块的有效长度为2到20位"})
				return
			}
      this.axios({
        method: "post",
        url: "/api/pm/module/1/add",
        data: JSON.stringify(this.m1_data)
      }).then(res => {
        if (res.data["status"] === 20000) {
					this.showModal = false
          this.m1_data.m1_name = ""
          this.getModuleA()
          this.$notify.success({title: "成功",message: res.data["msg"]})
        } else {
          this.$notify.error({title: "提示",message: res.data["msg"]})
        }
      })
    },

		getModuleB() {
      this.axios
        .get("/api/pm/module/2/list?m1_id=" + this.selected_a_module + "&product_id=" + this.product_id)
        .then(res => {
          if (res.data["status"] === 20000) {
            this.m2_list = res.data["data"]
          } else {
            this.msg = res.data["msg"]
          }
        })
    },

		addModuleB() {
			let m2_name = this.m2_data.m2_name
      if (this.selected_a_module) {
        this.m2_data.m1_id = this.selected_a_module
      } else {
        this.$notify.error({title: "提示",message: "请选择一级模块"})
				return
      }
			if (m2_name > 20 | m2_name < 2) {
				this.$notify.error({title: "提示",message: "模块的有效长度为2到20位"})
				return
      }
      this.axios({
        method: "post",
        url: "/api/pm/module/2/add",
        data: JSON.stringify(this.m2_data)
      }).then(res => {
        if (res.data["status"] === 20000) {
          this.getModuleB()
          this.m2_data.m2_name = ""
          this.$notify.success({title: "成功",message: res.data["msg"]})
        } else {
          this.$notify.error({title: "提示",message: res.data["msg"]})
        }
      })
    },

    changeData(event, data) {
      this.editM2.m2_id = data.id
      this.editM2.m2_name = event.target.innerText
    },

		SaveEditM2() {
      if (!this.editM2.m2_name.length) {
        this.$notify.error({title: "提示",message: "不能提交空文白哦，如需删除，请点击删除操作"})
        return
      }
      let tmp = this.editM2.m2_name
      this.editM2.m2_name = tmp.replace(/(^\s*)|(\s*$)/g, "")
      this.axios({
        method: "post",
        url: "/api/pm/module/2/edit",
        data: JSON.stringify(this.editM2)
      }).then(res => {
        if (res.data["status"] === 20000) {
          this.$notify.success({title: "成功",message: res.data["msg"]})
          this.getModuleB()
        } else {
          this.$notify.error({title: "提示",message: res.data["msg"]})
        }
      })
    },

		delM2(data) {
      this.axios.get("/api/pm/module/2/del?id=" + data.id).then(res => {
        if (res.data["status"] === 20000) {
          this.$notify.success({title: "成功",message: res.data["msg"]})
          this.getModuleB()
        } else {
          this.$notify.error({title: "提示",message: res.data["msg"]})
        }
      })
    }
  }
}
</script>

<style>
  @import "~/assets/css/module.css"
</style>
