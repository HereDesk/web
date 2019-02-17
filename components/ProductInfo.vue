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
            :label="item.version" 
            :value="item.version">
          </el-option>
          <!-- <el-option value="create">
            <a :href="'/app/products/release?product_code=' + product_code">
              创建新版本
            </a>
          </el-option> -->
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

    <!-- Only ProductNameList, no border dropdown -->
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
    
    <!-- Only ProductNameList, no border dropdown -->
    <el-select id="info-product" style="width:100%;" placeholder="选择产品" v-model="product_code" 
      v-if="showStyle === 'select' & ptype === 'only-product-name'">
      <el-option
        v-for="(item,index) in product_list" 
        :key="index" 
        :label="item.product_code" 
        :value="item.product_code">
      </el-option>
    </el-select>
    

    <!-- Dropdown style -->
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
            <span @click="product_code = item.product_code">{{ item.product_code }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown id="query-release" class="mr-1 my-1" v-if="ptype === 'bug_index'">
        <span>
          <span class="el-dropdown-desc">版本:</span>
          <span class="el-dropdown-link bg-edown">
            {{ release }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item,index) in release_list" :key="index">
            <span @click="release = item.version">{{ item.version }}</span>
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
      product_code: "",
      product_id: "",
      release: this.$route.query.release || "全部",
      modules_list: [],
      module_id: [],
      ModuleMsg: "",
      PageMsg: ""
    }
  },
  
  computed: {

    // emit info
    EmitInfo: function() {
      let { product_id, release, module_id, PageMsg } = this
      if (this.release === "全部") {
        if (this.ptype === "bug_create") {
          this.release = ""
        } else {
          release = "all"
        }
      }
      return { product_id, release, module_id,PageMsg }
    },

    // version list
    release_list: function() {
      let arr = []
      let tmp = []
      this.ptype.includes('index') ? tmp = [{ version: "全部" }] : undefined
      let data = this.product_list
      if (this.product_id) {
        for (let i in data) {
          if (this.product_id === data[i]["product_id"]) {
            arr = [...tmp, ...data[i]["data"]]
          }
        }
        return arr.length > 0 ? arr : false
      }
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
        // save product_id to localStorage
        if (process.browser) {
          window.localStorage.setItem("last_visited_product_id", this.product_id)
        }
        // get product_code, used for page show
        for (const item of this.product_list) {
          if (this.product_id === item.product_id) {
            this.product_code = item.product_code
          }
        }
        if (!['only-product-name','case_index','bug_index'].includes(this.ptype)) {  
          const ProductModulesInfo = this.$store.state.ProductModulesInfo
          if (JSON.stringify(ProductModulesInfo) !== '{}') {
            ProductModulesInfo.product_id === this.product_id 
              ? this.modules_list = ProductModulesInfo.data
              : this.getModule()
          } else {
            this.getModule()
          }
        }
      }
    },
    
    editData: {
      handler: function (val, oldVal) {
        const isEdit = Boolean(JSON.stringify(this.editData))
        if (isEdit) {
          this.product_id = this.editData.product_id
          this.module_id = this.editData.module_id
          this.release = this.editData.release
        }
      },
      deep: true
    },
    product_list: {
      handler: function (val, oldVal) {
        const isEdit = Boolean(JSON.stringify(this.editData))
        const route = this.$route.query
        const last_visited_product = process.browser & isEdit 
          ? window.localStorage.last_visited_product 
          : undefined
        if (JSON.stringify(this.product_list) !== '[]' & !isEdit) {
          if (route.product_id) {
            this.product_id = route.product_id
          } else if (last_visited_product) {
            this.product_id = last_visited_product_id
          } else {
            this.product_id = this.product_list[0]['product_id']
          }
          if (JSON.stringify(val) !== JSON.stringify(oldVal)) {
            this.$store.dispatch("getPageData",this.product_id)
          }
        }
      },
      deep: true
    }
    
  },
  
  created() {
    const ProductVersionInfo = this.$store.state.ProductVersionInfo
    if (JSON.stringify(ProductVersionInfo) !== '{}') {
      console.log("----")
      console.log(ProductVersionInfo)
      this.product_list = ProductVersionInfo
    } else {
      this.getProductRelease()
    }
  },
  
  methods: {
    /* 
    * get product info and release info 
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
    
    /* 
    * get product module info 
    */
    getModule() {
      this.axios
        .get("/api/pm/module/all/list?product_id=" + this.product_id)
        .then(res => {
          if (res.data["status"] === 20000) {
            const data = res.data["data"]
            if (data.length > 0) {
              this.modules_list = data
              this.$store.commit("setProductModulesInfo", res.data)
            }
          } else {
           this.$notify.error({
             title: "上传失败",
             message: res.data["msg"]
           })
          }
        }
      )
    }
    
  }
}
</script>
