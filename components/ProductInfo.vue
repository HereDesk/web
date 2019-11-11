<template>
  <div id="components-product-info" class="display-inline">

    <!-- 缺陷/用例：创建、编辑 -->
    <div id="product-version-module" class="container-fluid px-0"
      v-if="['bug_edit','bug_create','case_add'].includes(ptype)">
      <div class="row">
        <el-select id="info-product" class="col" placeholder="选择产品" v-model="product_id" >
          <el-option
            v-for="(item,index) in product_list"
            :key="index"
            :label="item.product_code"
            :value="item.product_id">
          </el-option>
        </el-select>
        <el-select id="info-version" class="col" placeholder="选择版本" v-model="release"
          v-if="['bug_edit','bug_create'].includes(ptype)">
          <el-option
            v-for="(item,index) in release_list"
            :key="index"
            :label="item.label"
            :value="item.version">
          </el-option>
        </el-select>
        <el-cascader id="info-modules" class="col"
          :options="modules_list"
          v-model="module_id"
          filterable
          change-on-select
          placeholder="选择模块" >
        </el-cascader>
      </div>
    </div>

    <!-- 仅包含项目列表的下拉菜单 -->
    <div class="display-inline" v-if="showStyle === 'no-border-dropdown' & ptype === 'only-product-name'">
      <el-dropdown>
        <span class="dashboard-product">
          <span class="el-dropdown-link">
            {{ product_code || '' }}&nbsp;&nbsp;
            <i class="iconfont icon-trigon-down icon-8a8a8a"></i>
          </span>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item,index) in product_list" :key="index">
            <span @click="product_id = item.product_id">
              {{ item.product_code }}
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!-- 仅包含项目列表的下拉菜单 -->
    <el-select id="info-product" style="width:100%;" placeholder="选择产品" v-model="product_id"
      v-if="showStyle === 'select' & ptype === 'only-product-name'">
      <el-option
        v-for="(item,index) in product_list"
        :key="index"
        :label="item.product_code"
        :value="item.product_value">
      </el-option>
    </el-select>


    <!-- 缺陷、用例主页面 -->
    <div class="display-inline" v-if="showStyle === 'dropdown' & ['bug_index','case_index'].includes(ptype)">
      <el-dropdown id="query-product" class="mr-1 my-1">
        <span>
          <span class="el-dropdown-desc">产品:</span>
          <span class="el-dropdown-link bg-edown">
            {{ product_code }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item,index) in product_list" :key="index">
            <span @click="product_id = item.product_id">{{ item.product_code }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown id="query-release" class="mr-1 my-1" v-if="ptype === 'bug_index'">
        <span>
          <span class="el-dropdown-desc">版本:</span>
          <span class="el-dropdown-link bg-edown">
            {{ release | FilterRelease}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item,index) in release_list" :key="index">
            <span @click="release = item.version">{{ item.version | FilterRelease}}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showStyle: String,
    ptype: String,
    showVersionInfo: Boolean,
    editData: Object
  },

  data () {
    return {
      product_list: [],
      product_id: "",
      release: this.$route.query.release || "all",
      modules_list: [],
      module_id: [],
      ModuleMsg: "",
      PageMsg: ""
    }
  },

  computed: {
    product_code: function() {
      // 遍历项目编码
      for (let item of this.product_list) {
        if (this.product_id === item.product_id) {
          return item.product_code
        }
      }
    },
    release_list: function() {
      let arr = []
      let tmp = []
      this.ptype.includes('index') ? tmp = [{ "label": "全部","version": "all" }] : undefined
      let data = this.product_list
      if (this.product_id) {
        for (let i in data) {
          if (this.product_id === data[i]["product_id"]) {
            arr = [...tmp, ...data[i]["data"]]
          }
        }
        if (arr.length !== 0) {
          for (let i of arr) {
            this.release = i["version"]
            break
          }
        }
        return arr.length > 0 ? arr : false
      }
    },

    // 组件通信数据
    EmitInfo: function() {
      let { product_id, release, module_id, PageMsg } = this
      if (this.release === "all" && this.ptype !== "bug_create") {
        release = "all"
      } else {
        release = this.release
      }
      return { product_id, release, module_id,PageMsg }
    },
  },

  filters: {
    FilterRelease: function(value) {
      return value == "all" ? "全部" : value
    }
  },

  watch: {
    EmitInfo: {
      handler: function(val,oldVal) {
        this.$emit('ProductInfo', this.EmitInfo)
      },
      deep: true
    },

    product_id: function (val, oldVal) {
      if (this.product_id) {
        // 请求页面菜单权限数据
        let PageData = this.$store.state.PageData
        if (JSON.stringify(PageData) === '[]' || PageData === false) {
          this.$store.dispatch("getPageData",this.product_id)
        }

        // save product_id to localStorage
        if (process.client) {
          document.cookie = "last_visited_product_id=" + this.product_id + ";" + "path=/"
          window.localStorage.setItem("last_visited_product_id", this.product_id)
        }

        // 项目模块数据
        let ProductModulesInfo = this.$store.state.ProductModulesInfo
        if (JSON.stringify(ProductModulesInfo) !== '{}') {
          ProductModulesInfo.product_id === this.product_id
            ? this.modules_list = ProductModulesInfo.data
            : this.getAllModule()
        } else {
          this.getAllModule()
        }
      }
    },

    editData: {
      handler: function (val, oldVal) {
        let isEdit = Boolean(JSON.stringify(this.editData))
        let data = this.editData
        if (isEdit) {
          this.product_id = data.product_id
          this.module_id = data.module_id
          this.release = data.release
        }
      },
      deep: true
    },

    product_list: {
      handler: function (val, oldVal) {
        let isEdit = Boolean(JSON.stringify(this.editData))
        let route = this.$route.query
        let last_visited_product_id = process.client ? window.localStorage.last_visited_product_id : undefined
        // 处理product_id
        if (JSON.stringify(this.product_list) !== '[]' && !isEdit) {
          if (route.product_id) {
            this.product_id = route.product_id
          } else if (last_visited_product_id) {
            this.product_id = last_visited_product_id
          } else {
            this.product_id = this.product_list[0]['product_id']
          }
        }
      },
      deep: true
    }

  },

  mounted() {
    let route_info = this.$route.query
    if (route_info.hasOwnProperty("product_id")) {
      this.product_id = route_info.product_id
    }
    let ProductVersionInfo = this.$store.state.ProductVersionInfo
    if (JSON.stringify(ProductVersionInfo) !== '{}') {
      this.product_list = ProductVersionInfo
    } else {
      this.getProductRelease()
    }
  },

  methods: {
    /**
    * 请求：当前用户所有项目，以及项目对应的版本
    */
    getProductRelease() {
      this.axios
        .get("/api/pm/product/my")
        .then(res => {
          if (res.data["status"] === 20000) {
            this.product_list = res.data["data"]
            this.$store.commit("setProductVersionInfo", res.data["data"])
          } else {
            this.PageMsg = res.data["msg"]
          }
        }
      )
    },

    /**
    * 请求：项目模块
    */
    getAllModule() {
      this.axios
        .get("/api/pm/module/all/list?product_id=" + this.product_id)
        .then(res => {
          if (res.data["status"] === 20000) {
            let data = res.data["data"]
            if (data.length > 0) {
              this.modules_list = data
              this.$store.commit("setProductModulesInfo", res.data)
            }
          } else {
           this.$notify.error({ title: "消息提示", message: res.data["msg"] })
          }
        }
      )
    }

  }
}
</script>
