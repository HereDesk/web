<template>
  <div id="page-product-module" class="container">

    <!-- 标题 -->
    <div id="page-head" class="row pt-5">
      <nav class="navbar navbar-expand-lg mr-auto">
        <a class="navbar-brand">&nbsp;{{ product_code }} 模块管理</a>
      </nav>
    </div>

    <div id="page-data" class="row my-5">

      <!-- 一级模块增加、列表 -->
      <div id="module-a" class="col-md-3 col-sm-12 col-12">
        <h5 class="font-weight-light">一级模块</h5>
        <p class="add_m_a" v-if="Rules.product_modules" @click="showModal = 'add-modules-1'">+ 一级模块</p>
        <p class="divider"></p>
        <ul class="pl-0 ul_module_a">
          <li v-for="(item,index) in AllModules" :key="index" :id="item.m1_id"
            :class="{ 'selected_a_module' : selected_a_module == item.m1_id }"
            @click="selected_a_module = item.m1_id">
            <span class="pl-0">- {{ item.label }}</span>
            <i class="iconfont icon-delete icon-edit size-1-1 float-right"
              v-if="selected_a_module == item.m1_id"
              @click="showModal = 'edit-modules-1', m1_data.m1_id = item.m1_id, m1_data.m1_name=item.label">
            </i>
          </li>
        </ul>
      </div>

      <!-- 二级模块增加、列表 -->
      <div id="module_b" class="col-md-9 col-sm-12 col-12">
        <h5 class="font-weight-light">二级模块</h5>
        <div class="module_b p-3 mb-3">
          <input type="text" class="form-control"
            placeholder="二级模块名称输入后，回车即可保存成功"
            v-if="Rules.product_modules"
            v-model="m2_data.m2_name"
            @keyup.enter="addModuleB()">
        </div>
        <ul class="ul_module_b pl-3">
          <li v-for="item in m2_list" :key="item.m2_id" class="d-flex">
            <span>-&nbsp;&nbsp;</span>
            <span class="flex-grow-1 m2edit" :contenteditable="Rules.product_modules" @keyup="changeData($event,item)">
              {{ item.label }}
            </span>
            <div :class="{ visible: editM2.m2_id === item.m2_id, invisible: editM2.m2_id !== item.m2_id}"
              v-if="Rules.product_modules"
              @click="module_2_edit()">
              <i class="iconfont icon-duigou icon-8a8a8a size-1-5 mr-3"></i>
            </div>
            <div v-if="Rules.product_modules" @click="delM2(item.m2_id)">
              <i class="iconfont icon-delete icon-8a8a8a size-1-5"></i>
            </div>
          </li>
        </ul>
      </div>

    </div>

    <!-- 添加一级模块 -->
    <Modal id="modal-a-module" v-if="showModal == 'add-modules-1'" @close="showModal = true" :isFooter="true">
      <h5 slot="header">添加一级模块</h5>
      <div class="form-group row col-md-auto mx-3" slot="body">
        <label for="ModuleA">模块名称</label>
        <input type="text" class="form-control" rows="5" maxlength="20" placeholder="请输入名称..."
          v-model="m1_data.m1_name"
          @keyup.enter="module_1_edit('add')"
          autofocus />
      </div>
      <button slot="footer" type="submit" class="btn btn-primary" @click="module_1_edit('add')">提交</button>
    </Modal>

    <!-- 修改编辑一级模块 -->
    <Modal id="modal-a-module" v-if="showModal == 'edit-modules-1'" @close="showModal = true" :isFooter="true">
      <h5 slot="header">编辑一级模块</h5>
      <div class="form-group row col-md-auto mx-3" slot="body">
        <label for="ModuleA">模块名称</label>
        <input type="text" class="form-control" rows="5" maxlength="20" placeholder="请输入名称..."
          v-model="m1_data.m1_name"
          @keyup.enter="module_1_edit('edit')"
          autofocus />
      </div>
      <button slot="footer" type="submit" class="btn btn-primary" @click="module_1_edit('edit')">提交修改</button>
      <button slot="footer" type="submit" class="btn btn-cancel" @click="module_1_del()">删除</button>
    </Modal>

  </div>
</template>

<script>
  import rules from "~/assets/js/rules.js"

  export default {
    head() {
      return {
        title: "HDesk - 产品模块维护"
      }
    },
    validate({ query }) {
      let status = query.product_id ? true : false
      return status
    },

    layout: "head",

    data() {
      return {
        showModal: false,
        msg: "",
        product_id: this.$route.query.product_id || "",
        selected_a_module: null,

        // 一级模块
        m1_data: {
          product_id: "",
          m1_name: ""
        },

        // 二级模块
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

    computed: {
      /**
       * 所有模块数据
       */
      AllModules() {
        let moduls = this.$store.state.ProductModulesInfo
        return moduls.data ? moduls.data : []
      },

      product_code() {
        return this.$store.state.ProductModulesInfo.product_code
      },

      /**
       *  为了解决新增一级模块后，将新增模块选中的问题
       */
      m1_list() {
        let m1_list = []
        if (!this.AllModules) return
        for (let i of this.AllModules) {
          m1_list.push(i["m1_id"])
        }
        return m1_list
      },

      /**
       *  二级模块列表： 根据一级模块ID，返回二级模块列表
       */
      m2_list() {
        let m2_list = []
        if (!this.AllModules) return
        for (let i of this.AllModules) {
          if (this.selected_a_module == i["m1_id"]) {
            m2_list = i["children"]
          }
        }
        return m2_list
      },

      /**
       * 权限计算
       */
      Rules: function() {
        let userInfo = this.$store.state.userInfo
        let PagesRules = this.$store.state.PageData
        return rules.RuleManges(userInfo, PagesRules)
      }
    },

    watch: {
      showModal() {
        this.showModal ?
          document.body.classList.add("overflow-hidden") :
          document.body.classList.remove("overflow-hidden")
      },
      m1_list: {
        handler: function(val, oldVal) {
          this.m1_list ? this.selected_a_module = this.m1_list[0] : ''
        },
        deep: true
      }
    },

    created() {
      if (this.product_id) {
        this.$store.dispatch("getProductModules", this.product_id)
      }
    },

    methods: {
      changeData(event, data) {
        this.editM2.m2_id = data.m2_id
        this.editM2.m2_name = event.target.innerText
      },

      /**
       * 新增、修改一级模块
       * @param {string} type=[add|edit] - 类型：新增、修改
       */
      module_1_edit(type) {
        let m1_id_status = this.m1_data.hasOwnProperty("m1_id")
        if (type == "add" && m1_id_status) {
          delete this.m1_data.m1_id
        }
        if (type == "edit" && !m1_id_status) {
          this.$notify.error({
            title: "提示",
            message: "没有获取到模块id，出错了"
          })
          return
        }
        this.m1_data.product_id = this.product_id
        let module_a_name = this.m1_data.m1_name
        if (module_a_name > 20 | module_a_name < 2) {
          this.$notify.error({
            title: "提示",
            message: "模块的有效长度为2到20位"
          })
          return
        }
        this.axios({
          method: "post",
          url: "/api/pm/module/1/edit",
          data: JSON.stringify(this.m1_data)
        }).then(res => {
          if (res.data["status"] === 20000) {
            this.showModal = false
            this.m1_data.m1_name = ""
            this.$notify.success({
              title: "成功",
              message: res.data["msg"]
            })
            this.$store.dispatch("getProductModules", this.product_id)
          } else {
            this.$notify.error({
              title: "提示",
              message: res.data["msg"]
            })
          }
        })
      },

      /**
       * 一级模块删除
       */
      module_1_del() {
        this.axios.get("/api/pm/module/1/del?m1_id=" + this.selected_a_module).then(res => {
          if (res.data["status"] === 20000) {
            this.$notify.success({
              title: "成功",
              message: res.data["msg"]
            })
            this.showModal = false
            this.$store.dispatch("getProductModules", this.product_id)
          } else {
            this.$notify.error({
              title: "提示",
              message: res.data["msg"]
            })
          }
        })
      },

      /**
       * 增加二级模块
       */
      addModuleB() {
        let m2_name = this.m2_data.m2_name
        if (this.selected_a_module) {
          this.m2_data.m1_id = this.selected_a_module
        } else {
          this.$notify.error({
            title: "提示",
            message: "请选择一级模块"
          })
          return
        }
        if (m2_name > 20 | m2_name < 2) {
          this.$notify.error({
            title: "提示",
            message: "模块的有效长度为2到20位"
          })
          return
        }
        this.axios({
          method: "post",
          url: "/api/pm/module/2/edit",
          data: JSON.stringify(this.m2_data)
        }).then(res => {
          if (res.data["status"] === 20000) {
            this.m2_data.m2_name = ""
            // 刷新数据
            this.$store.dispatch("getProductModules", this.product_id)
          } else {
            this.$notify.error({
              title: "提示",
              message: res.data["msg"]
            })
          }
        })
      },

      /**
       * 编辑修改二级模块
       */
      module_2_edit() {
        if (!this.editM2.m2_name.length) {
          this.$notify.error({
            title: "提示",
            message: "不能提交空文白哦，如需删除，请点击删除操作"
          })
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
            this.editM2 = {}
            this.$notify.success({
              title: "成功",
              message: res.data["msg"]
            })
            this.$store.dispatch("getProductModules", this.product_id)
          } else {
            this.$notify.error({
              title: "提示",
              message: res.data["msg"]
            })
          }
        })
      },

      /**
       * 删除二级模块
       */
      delM2(id) {
        this.axios.get("/api/pm/module/2/del?m2_id=" + id).then(res => {
          if (res.data["status"] === 20000) {
            this.$notify.success({
              title: "成功",
              message: res.data["msg"]
            })
            this.$store.dispatch("getProductModules", this.product_id)
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
  @import "~/assets/css/module.css"
</style>
