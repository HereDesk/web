<template>
  <div id="testcase-modules">
    <div class="pl-5 my-2">
      <span class="mb-2" :class="{ 'el-active' : !m1_id && !m2_id }" @click="click_all_modules()">全部模块</span>
      <span>
        <nuxt-link :to="{ path: '/app/products/modules',query: {'product_code': product_code } }">
          <span style="color:#2b2b2b" title="维护模块"> / 维护</span>
        </nuxt-link>
      </span>
    </div>
    <ul :id="item1.id" class="ul-style-none" v-for="(item1,index) in modules_list" :key="index">
      <li>
        <span class="line-height-1-8" :class="{ 'el-active': m1_id == item1.id }" 
          @click="clickMoudle1(item1)">
          <i class="iconfont icon-8a8a8a" 
            :class="[ m1_id == item1.id ? 'icon-trigon-down' : 'icon-trigon-right' ]">
          </i>
          &nbsp;&nbsp;{{ item1.label }}
        </span>
        <ul class="t_module_second pl-5" v-if="m1_id == item1.id">
          <li v-for="(item2,index2) in item1.children" :key="index2" :id="index2" @click="clickMoudle2(item2)">
            <span :class="{ 'el-active': m2_id == item2.id }">
              {{ item2.label }}
            </span>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
// let _ = require("lodash/Collection")

export default {
  props: {
    product_code: String,
    Rules:{}
  },
  data () {
    return {
      modules_list: [],
      m1_id: this.$route.query.m1_id || null,
      m2_id: this.$route.query.m2_id || null
    }
  },

  watch: {
    product_code: function(val, oldVal) {
      this.isRequestModuleData()
    },
    m1_id () {
      this.$emit('getM1M2',this.m1_id,this.m2_id) 
    },
    m2_id () {
      this.$emit('getM1M2',this.m1_id,this.m2_id) 
    },
  },

  mounted() {
    this.isRequestModuleData()
  },
  methods: {
    isRequestModuleData() {
      const ProductModulesInfo = this.$store.state.ProductModulesInfo
      if (JSON.stringify(ProductModulesInfo) !== '{}') {
        ProductModulesInfo.product_code === this.product_code 
          ? this.modules_list = ProductModulesInfo.data
          : this.getModule()
      } else {
        this.getModule()
      }
    },
    // 获取所有模块
    getModule() {
      if (!this.product_code) {return}
      this.axios.get("/api/pm/get_module?product_code=" + this.product_code)
        .then(res => {
          if (res.data["status"] === 20000) {
            const data = res.data["data"]
            if (data.length > 0) {
              this.modules_list = data
              this.$store.commit("setProductModulesInfo", res.data)
            }
          } else {
             this.Msg = res.data["msg"]
          }
        })
    },

    clickMoudle1 (data) {
      if (this.m1_id == data.id) {
        this.m1_id = ''
        this.m2_id = ''
      } else {
        this.m1_id = data.id
      }
    },
    clickMoudle2 (data) {
      if (this.m2_id == data.id) {
        this.m2_id = ''
      } else {
        this.m2_id = data.id
      }
    },

    click_all_modules() {
      this.m1_id = null
      this.m2_id = null
    }
  }
}
</script>

<style scope>
  .el-active {
    color: rgb(21, 101, 192);
  }
</style>
