<template>
  <div id="components-product-info" class="display-inline">

    <!-- 缺陷/用例：创建、编辑 -->
    <div id="product-version-module" class="container-fluid px-0" 
      v-if="['bug_add','case_add'].includes(type)">
      <div class="row">
        <el-select id="info-product" class="col" placeholder="选择产品" v-model="product_code" >
          <el-option 
            v-for="(item,index) in product_list" 
            :key="index" 
            :label="item.product_code" 
            :value="item.product_code">
          </el-option>
        </el-select>
        <el-select id="info-version" class="col" placeholder="选择版本" v-model="release" 
          v-if="['bug_add'].includes(type)">
          <el-option 
            v-for="(item,index) in release_list" 
            :key="index" 
            :label="item.version" 
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

    <!-- Only ProductNameList, no border dropdown -->
    <div v-if="showStyle === 'no-border-dropdown' & type === 'only-product-name'">
      <el-dropdown>
        <span class="dashboard-product">
          <span class="el-dropdown-link"> 
            {{ product_code || '' }}&nbsp;&nbsp;
            <i class="iconfont icon-trigon-down icon-8a8a8a"></i>
          </span>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item,index) in product_list" :key="index">
            <span @click="product_code = item.product_code">
              {{ item.product_code }}
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!-- Dropdown style -->
    <div class="display-inline" v-if="showStyle === 'dropdown' & ['bug_index','case_index'].includes(type)">
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
      <el-dropdown id="query-release" class="mr-1 my-1" v-if="type === 'bug_index'">
        <span>
          <span class="el-dropdown-desc">版本:</span>
          <span class="el-dropdown-link bg-edown">
            {{ release | FilterVersion }}
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
    type: String,
    showVersionInfo: Boolean,
    fillData: {}
  },
  
  data () {
    return {
      product_list: [],
      product_code: "",
      release: "全部",
      modules_list: [],
      module_id: [],
      ModuleMsg: "",
      PageMsg: ""
    }
  },
  
  filters: {
    FilterVersion: function(value) {
      return value == "all" ? "全部" : value
    }
  },
  
  computed: {

    // emit info
    EmitInfo: function() {
      let { product_code, release, module_id, PageMsg } = this
      return {product_code, release, module_id,PageMsg}
    },

    // version list
    release_list: function() {
      let arr = []
      let tmp = []
      this.type.includes('index') ? tmp = [{ version: "全部" }] : undefined
      let data = this.product_list
      if (this.product_code) {
        for (let i in data) {
          if (this.product_code === data[i]["product_code"]) {
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
    
    product_code: function (val, oldVal) {
      if (this.product_code) {
        this.$router.replace( this.$route.path + "?product_code=" + this.product_code)
        if (process.browser) {
          window.localStorage.setItem("last_visited_product", this.product_code)
        }
        
        if (!['only-product-name','case_index','bug_index'].includes(type)) {  
          const ProductModulesInfo = this.$store.state.ProductModulesInfo
          if (JSON.stringify(ProductModulesInfo) !== '{}') {
            ProductModulesInfo.product_code === this.product_code 
              ? this.modules_list = ProductModulesInfo.data
              : this.getModule()
          } else {
            this.getModule()
          }
        }
      }
    },
    
    product_list: {
      handler: function (val, oldVal) {
        let route = this.$route.query
        const last_visited_product = process.browser ? window.localStorage.last_visited_product : undefined
        
        if (JSON.stringify(this.product_list) !== '[]') {
          if (route.product_code) {
            this.product_code = route.product_code
          } else if (last_visited_product) {
            this.product_code = last_visited_product
          } else {
            this.product_code = this.product_list[0]['product_code']
          }
        }
      },
      deep: true
    },
    
    release_list: {
      handler: function (val,oldVal) {
        this.release_list ? 
          this.release = this.release_list[0]['version'] : this.release = ''
      },
      deep: true
    }
  },
  
  created() {
    const ProductVersionInfo = this.$store.state.ProductVersionInfo
    if (JSON.stringify(ProductVersionInfo) !== '{}') {
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
        .get("/api/pm/get_module?product_code=" + this.product_code)
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
