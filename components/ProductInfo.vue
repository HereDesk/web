<template>
  <div id="components-product-info">
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
        <el-select id="info-version" class="col" placeholder="选择版本" 
          v-model="release" v-if="['bug_add'].includes(type)">
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
  </div>
</template>

<script>
export default {
  props: {
    type: String,
    showVersionInfo: Boolean,
    fillData: {}
  },
  
  data () {
    return {
      product_list: [],
      product_code: "",
      release: "",
      modules_list: [],
      module_id: [],
      ModuleMsg: "",
      PageMsg: ""
    }
  },
  
  computed: {
    // emit info
    EmitInfo: function() {
      let { product_code, release, module_id } = this
      return {product_code, release, module_id}
    },
    // version list
    release_list: function() {
      let arr = []
      let data = this.product_list
      if (this.product_code) {
        for (let i in data) {
          if (this.product_code === data[i]["product_code"]) {
            arr = [...data[i]["data"]]
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
        const ProductModulesInfo = this.$store.state.ProductModulesInfo
        if (JSON.stringify(ProductModulesInfo) !== '{}') {
          console.log("oooo")
          if (ProductModulesInfo.product_code === this.product_code) {
            this.modules_list = ProductModulesInfo.data
          } else {
            this.getModule()
          }
        } else {
          this.getModule()
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
    if (JSON.stringify(this.$store.state.ProductVersionInfo) !== '{}') {
      this.product_list = this.$store.state.ProductVersionInfo
    } else {
      this.getProductRelease()
    }
  },
  
  methods: {
    /* get product info and release info */
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
    
    /* get product module info */
    getModule() {
      this.axios.get("/api/pm/get_module?product_code=" + this.product_code)
        .then(res => {
          if (res.data["status"] === 20000) {
            const data = res.data["data"]
            this.modules_list = data
            if (data.length > 0) {
              this.$store.commit("setProductModulesInfo", res.data)
            }
          } else {
            this.ModuleMsg = res.data["msg"]
          }
        })
    }
    
  }
}
</script>
