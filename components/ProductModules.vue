<template>
  <div id="product-modules" class="mt-5 isDisplay" :key="$route.fullPath" :class="[isShowModules ? 'pg-modules col-md-2' : 'col-md-1']">
    <div id="icon-switch" class="dataModule" @click="switchModule()">
        <i class="iconfont py-2 ml-3"
          :class="[ isShowModules ? 'icon-arrow-right' : 'icon-arrow-left']"></i>
      </div>
    <div id="modules-list" v-if="isShowModules">
      <div class="pl-5 mb-2" >
        <span class="mb-2" :class="{ 'el-active' : !m1_id && !m2_id }" @click="click_all_modules()">全部模块</span>
        <nuxt-link :to="{ path: '/app/products/modules',query: {'product_id': product_id } }">
          <span style="color:#2b2b2b" title="维护模块">/ 维护</span>
        </nuxt-link>
      </div>
      <ul class="ul-style-none" v-for="(item1,index) in modules_list" :key="index" :id="'m1_' + item1.m1_id">
        <li>
          <div class="line-height-2" :class="{ 'el-active': m1_id == item1.m1_id }" @click="click_moudle_1(item1.m1_id)">
            <i class="iconfont icon-8a8a8a" :class="[ m1_id == item1.id ? 'icon-trigon-down' : 'icon-trigon-right' ]"></i>
            <span>&nbsp;&nbsp;{{ item1.label }}</span>
            <span class="badge_num" v-if="item1.num" :key="item1.num">{{ item1.num }}</span>
          </div>
          <ul class="t_module_second pl-5" v-if="m1_id == item1.m1_id">
            <li v-for="(item2,index2) in item1.children" :key="index2" :id="'m2_' + index2" @click="click_moudle_2(item2.m2_id)">
              <span :class="{ 'el-active': m2_id == item2.m2_id }"> {{ item2.label }} </span>
              <span class="badge_num" v-show="filter_m2_id(item2.m2_id)"> {{ filter_m2_id(item2.m2_id) }} </span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    product_id: {
      type: String,
      required: true
    },
    query_type: {
      validator: function(value) {
        return ["bug", "testcase"].indexOf(value) !== -1;
      }
    },
    Rules: {}
  },
  data() {
    return {
      m1_id: this.$route.query.m1_id || null,
      m2_id: this.$route.query.m2_id || null,
      modules_num: [],
      tmp_modules_list: []
    };
  },

  computed: {
    // 是否显示模块列表
    isShowModules() {
      return this.$store.state.UserConfig["IS_SHOW_MODULE"] == 1 ? true : false
    },

    // 模块列表
    modules_list() {
      let modules_name = this.$store.state.ProductModulesInfo.data
      if (this.modules_num.length > 0 && modules_name) {
        this.tmp_modules_list = JSON.parse(JSON.stringify(modules_name))
        for (let i1 in modules_name) {
          for (let i2 of this.modules_num) {
            if (modules_name[i1]["m1_id"] == i2["m1_id"]) {
              this.tmp_modules_list[i1]["num"] = i2["num"]
            }
          }
        }
        return this.tmp_modules_list
      }
      return modules_name
    },

    // 因为模块和模块计数是两个api，先采用这种方式吧
    filter_m2_id() {
      return function(value) {
        if (JSON.stringify(this.modules_num) == "[]") return
        let tmp = {}
        for (let i of this.modules_num) {
          if (JSON.stringify(i["m2_data"]) !== "[]") {
            for (let m2 of i["m2_data"]) {
              tmp[m2["m2_id"]] = m2["num"]
            }
          }
        }
        if (tmp.hasOwnProperty(value)) {
          return tmp[value]
        }
        return ""
      }
    },

  },

  watch: {
    product_id() {
      this.getModuleCount()
    },
    isShowModules() {
      this.$emit('getShowModules',this.isShowModules)
    },
    m1_id() {
      this.$emit("getM1M2", this.m1_id, this.m2_id)
    },
    m2_id() {
      this.$emit("getM1M2", this.m1_id, this.m2_id)
    }
  },

  created() {
    this.getModuleCount()
  },

  methods: {
    /**
     * 控制左侧模块列表
     */
    switchModule() {
      let isDisplay = this.isShowModules ? 0 : 1
      this.axios
        .get("/api/userconfig?IS_SHOW_MODULE=" + isDisplay)
        .then(res => {
          if (res.data["status"] === 20000) {
            this.$store.dispatch("getUserInfo")
            this.isShowModules = isDisplay == 1 ? true : false
          }
        })
    },

    /**
     * @param {String} m1_id 一级模块ID
     */
    click_moudle_1(m1_id) {
      if (this.m1_id == m1_id) {
        this.m1_id = ""
        this.m2_id = ""
      } else {
        this.m1_id = m1_id
      }
    },

    /**
     * @param {String} m2_id 二级模块ID
     */
    click_moudle_2(data) {
      if (this.m2_id == m2_id) {
        this.m2_id = ""
      } else {
        this.m2_id = m2_id
      }
    },

    /**
     * 所有模块
     */
    click_all_modules() {
      this.m1_id = null
      this.m2_id = null
    },

    /**
     * 请求：模块对应的缺陷数量、测试用例数量
     */
    getModuleCount() {
      if (!this.query_type) return
      if (!this.product_id) return
      this.axios
        .get( "/api/pm/module/count?product_id=" + this.product_id + "&type=" + this.query_type )
        .then(res => {
          if (res.data["status"] === 20000) {
            this.tmp_modules_list = []
            this.modules_num = res.data["data"]
          }
        })
    }
  }
};
</script>

<style scoped="scoped">
  
  .pg-modules {
    border-right: 1px solid #eee;
  }

  @media (max-width: 991.99px) {
    .pg-modules {
      display: none;
    }
  }

  #product-modules:hover + div > i {
    visibility: visible !important;
  }

  #product-modules + div > i:hover {
    visibility: visible !important;
    z-index: 9;
  }


  .t_module_second li {
    line-height: 2rem;
    text-overflow: ellipsis !important;
    overflow: hidden !important;
    white-space: nowrap !important;
  }

  .t_module_second li:hover {
    color: #1E88E5 !important
  }

  .dataModule {
    position: absolute;
    z-index: 9;
  }

  .isDisplay {
    display: block;
  }
  @media (max-width:767.98px) {
    .isDisplay {
      display: none !important;
    }
  }
  .el-active {
    color: rgb(21, 101, 192);
  }

  .badge_num {
    background-color: #eeeeee;
    padding: 2px 10px;
    border-radius: 15px;
    color: rgb(158, 158, 158);
    font-weight: 300;
    font-size: 0.6rem !important;
  }
</style>
