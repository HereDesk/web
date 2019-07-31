<template>
  <div id="testcase-modules">
    <div class="pl-5 my-2">
      <span class="mb-2" :class="{ 'el-active' : !m1_id && !m2_id }" @click="click_all_modules()">全部模块</span>
      <span>
        <nuxt-link :to="{ path: '/app/products/modules',query: {'product_id': product_id } }">
          <span style="color:#2b2b2b" title="维护模块"> / 维护 </span>
        </nuxt-link>
      </span>
    </div>
    <ul :id="item1.m1_id" class="ul-style-none" v-for="(item1,index) in modules_list" :key="index">
      <li>
        <div class="line-height-2" :class="{ 'el-active': m1_id == item1.m1_id }"
          @click="click_moudle_1(item1)">
          <i class="iconfont icon-8a8a8a"
            :class="[ m1_id == item1.id ? 'icon-trigon-down' : 'icon-trigon-right' ]">
          </i>
          &nbsp;&nbsp;{{ item1.label }}
          <span class="badge_num" v-if="item1.num" :key="item1.num">{{ item1.num }}</span>
        </div>
        <ul class="t_module_second pl-5" v-if="m1_id == item1.m1_id">
          <li v-for="(item2,index2) in item1.children" :key="index2" :id="index2" @click="click_moudle_2(item2)">
            <span :class="{ 'el-active': m2_id == item2.m2_id }">
              {{ item2.label }}
              <span class="badge_num" v-show="filter_m2_id(item2.m2_id)">{{  filter_m2_id(item2.m2_id) }}</span>
            </span>
          </li>
        </ul>
      </li>
    </ul>
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
        validator: function (value) {
          return ['bug', 'testcase'].indexOf(value) !== -1
        }
      },
      Rules:{}
    },
    data () {
      return {
        m1_id: this.$route.query.m1_id || null,
        m2_id: this.$route.query.m2_id || null,
        modules_num: [],
        tmp_modules_list: []
      }
    },

    computed: {
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
          if (JSON.stringify(this.modules_num) == '[]') return
          let tmp = {}
          for (let i of this.modules_num) {
            if (JSON.stringify(i["m2_data"]) !== '[]') {
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
      }
    },

    watch: {
      product_id () {
        this.getModuleCount()
      },
      m1_id () {
        this.$emit('getM1M2',this.m1_id,this.m2_id)
      },
      m2_id () {
        this.$emit('getM1M2',this.m1_id,this.m2_id)
      },
    },

    mounted() {
      this.getModuleCount()
    },

    methods: {

      click_moudle_1 (data) {
        if (this.m1_id == data.m1_id) {
          this.m1_id = ''
          this.m2_id = ''
        } else {
          this.m1_id = data.m1_id
        }
      },
      click_moudle_2 (data) {
        if (this.m2_id == data.m2_id) {
          this.m2_id = ''
        } else {
          this.m2_id = data.m2_id
        }
      },

      click_all_modules() {
        this.m1_id,this.m2_id = null,null
      },

      /**
       * 模块对应的缺陷数量、测试用例数量
      */
      getModuleCount() {
        if (!this.query_type) return
        if (!this.product_id) return
        this.axios
          .get("/api/pm/module/count?product_id=" + this.product_id + "&type=" + this.query_type)
          .then(res => {
            if (res.data["status"] === 20000) {
              this.tmp_modules_list = []
              this.modules_num = res.data["data"]
            }
          }
        )
      }
    }
  }
</script>

<style scope>
  .el-active {
    color: rgb(21, 101, 192);
  }
  .badge_num {
    background-color: #EEEEEE;
    padding: 2px 10px;
    border-radius: 15px;
    color: rgb(158, 158, 158);
    font-weight: 300;
    font-size: 0.6rem !important;
  }
</style>
