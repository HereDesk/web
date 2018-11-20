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
    <ul class="ul-style-none" v-for="item1 in modules_list" :key="item1.id">
      <li>
        <span class="line-height-1-8 li-color" :class="{ 'el-active': m1_id == item1.id }" 
          @click="clickMoudle1(item1)">
          <i class="iconfont icon-8a8a8a" 
            :class="[ m1_id == item1.id ? 'icon-trigon-down' : 'icon-trigon-right' ]">
          </i>
          &nbsp;&nbsp;{{ item1.label }}
        </span>
        <ul class="t_module_second pl-5" v-if="m1_id == item1.id">
          <li v-for="item2 in item1.children" :key="item2.id" :id="item1.id" @click="clickMoudle2(item2)">
            <span class="li-color" :class="{ 'el-active': m2_id == item2.id }">
              {{ item2.label }}
            </span>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios"
let _ = require("lodash/Collection")

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

  // computed: {
  //   isShowModules: function() {
  //     let config = this.$store.state.UserConfig
  //     return _.find(config, function(o) {
  //       return (o.code == "IS_SHOW_MODULE") & (o.code_value == 1)}) ? true : false
  //   }
  // },

  watch: {
    product_code: function(val, oldVal) {
      this.getModule()
    },
    m1_id () {
      this.$emit('getM1M2',this.m1_id,this.m2_id) 
    },
    m2_id () {
      this.$emit('getM1M2',this.m1_id,this.m2_id) 
    },
    // isShowModules () {
    //   this.$emit('getM1M2',this.m1_id,this.m2_id)
    // }
  },

  mounted() {
    this.getModule()
  },
  methods: {
    // 获取所有模块
    getModule() {
      if (!this.product_code) {return}
      axios.get("/api/pm/get_module?product_code=" + this.product_code)
        .then(res => {
          if (res.data["status"] === 20000) {
             this.modules_list = res.data["data"]
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

<style>

</style>
