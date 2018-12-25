<template>
  <div id="page-testcase-execution" class="container">
    
    <!-- page head -->
    <nav id="page-head" class="d-flex my-5">
      <a class="navbar-brand flex-grow-1">TestSuite {{ childValue }}</a>
      <div class="pt-3">
        <button type="btn" class="btn btn-create" @click="showModal = 'create'"> + TestSuite</button>
      </div>
    </nav>

    <!-- page data -->
    <div id="page-data" class="row">
      <div class="col">
        <el-table :data='tableData' :default-sort="{prop: 'date', order: 'descending'}">
          <el-table-column label='ID' prop='id' width='80'></el-table-column>
          <el-table-column label='产品' prop='product_code' width='110'></el-table-column>
          <el-table-column label='执行版本' prop='suite_name' width='200'></el-table-column>
          <el-table-column label='总数' prop='total' width='80'></el-table-column>
          <el-table-column label='已执行' prop='executed' width='100'></el-table-column>
          <el-table-column label='未执行' prop='not_execution' width='100'></el-table-column>
          <el-table-column label='成功' prop='success' width='90'></el-table-column>
          <el-table-column label='失败' prop='fail' width='90'></el-table-column>
          <el-table-column label='发现缺陷' prop='bug_num' width='90' align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.bug_num !== 0">{{ scope.row.bug_num }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label='操作' align="center">
            <template slot-scope="scope">
              <span class="mr-3" v-if="scope.row.total > 0">
                <nuxt-link :to="{ 
                    path: '/app/qa/testsuite/run',
                    query: { 'suite_id': scope.row.suite_id, 'product_code':scope.row.product_code } }">
                  <span title="运行完成" v-if="scope.row.executed === scope.row.total && scope.row.executed !== 0">
                    <i class="iconfont icon-Running size-1-5 icon-E53935"></i>
                  </span>
                  <span  title="待运行" v-else-if="scope.row.total === 0 || scope.row.executed === 0">
                     <i class="iconfont icon-Running size-1-5 icon-8a8a8a"></i>
                  </span>
                  <span  title="运行中" v-else>
                    <i class="iconfont icon-Running size-1-5 icon-00BFA5"></i>
                  </span>
                </nuxt-link>
              </span>
              <span>
                <nuxt-link :to="{ 
                    path: '/app/qa/testsuite/loader', 
                    query: { 'product_code':scope.row.product_code,'suite_id': scope.row.suite_id } }">
                  <i class="iconfont icon-jiaru size-1-5 icon-8a8a8a" title="组织测试用例"></i>
                </nuxt-link>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <Pagination :total="total" @PsPn="getPsPn"></Pagination>

    <!-- modal: create test suite -->
    <Modal id="create-suite" :isFooter="true" @close="showModal = false" v-if="showModal == 'create'">
      <h5 slot="header" class="modal-title">创建</h5>
      <div slot="body" class="form-group mx-1">
        <div class='row col-md-auto'>
          <label for="product_code" class="col-sm-2 pt-2">产品</label>
          <el-select class="col-sm-9 px-0" v-model="TestSuiteCreate.product_code" placeholder="请选择产品">
            <el-option v-for="(item,index) in product_list" :key="index" :label="item.product_code" :value="item.product_code">
            </el-option>
          </el-select>
        </div>
        <div class='row col-md-auto mt-3'>
          <label for="name" class="col-sm-2">执行版本</label>
          <div class="col-sm-9 px-0">
            <input type='text' v-model.trim='TestSuiteCreate.suite_name' maxlength="20" class='form-control' rows="5" placeholder='请输入用户执行版本...' />
            <p class="text-notes">备注：用例执行版本，如v1.0_20180920</p>
          </div>
        </div>
      </div>
      <button slot="footer" type="submit" class="btn btn-primary" @click="createTestSuite()">提交</button>
    </Modal>

  </div>
</template>

<script>
import Pagination from '~/components/Pagination'

export default {
  head () {
    return {
      title: 'HDesk - TestSuite'
    }
  },

  layout: 'head',
  components: {
    Pagination,
  },

  data () {
    return {
      showModal: false,
      childValue: '',
      current_product_code: null,
      total: null,
      tableData: [],
      QueryBuilder: {
        "pageSize": 10,
        "pageNumber": 1,
      },
      TestSuiteCreate: {
        "product_code": null,
        "suite_name": null,
      }
    }
  },

  watch: {
    QueryBuilder: {
      handler: function (val, oldVal) {
        this.getTestSuite()
      },
      deep: true
    }
  },

  computed: {
    product_list: function () {
      return this.$store.state.ProductInfo['data'] ? this.$store.state.ProductInfo['data'] : []
    }
  },

  created () {
    if (!this.$store.state.isProductInfo) {
      this.$store.dispatch('getProductRelease')
    }
  },

  mounted () {
    this.getTestSuite()
  },

  methods: {
    getPsPn:function (ps,pn) {
      this.QueryBuilder.pageSize = ps
      this.QueryBuilder.pageNumber = pn
    },

    /* get current all test suite */
    getTestSuite () {
      this.axios.get('/api/qa/testsuite/list',{ params: this.QueryBuilder })
        .then(res => {
          if (res.data['status'] === 20000) {
            this.tableData = res.data['data']
            this.total = res.data['total']
          } else {
            this.$notify.error({title:'提示',message:res.data['msg']})
          }
        }
        )
    },

    /* 
     * create testcase suite
     * must param: product_code  testsuite version
    */
    createTestSuite () {
      let { product_code, suite_name } = this.TestSuiteCreate
      if (!product_code) {
        this.$notify.error({title:'提示',message:'请选择产品'})
        return
      }
      if (!suite_name) {
        this.$notify.error({title:'提示',message:'名字无效哦'})
        return
      }
      if (suite_name.length < 2 | suite_name.length > 20) {
        this.$notify.error({title:"提示",message:"版本的有效长度为2-20位"})
        return 
      }
      this.axios({
        method: 'POST',
        url: '/api/qa/testsuite/create',
        data: JSON.stringify(this.TestSuiteCreate)
      }).then(res => {
        if (res.data['status'] === 20000) {
          this.showModal = false
          this.getTestSuite()
          this.$notify.success({title:'成功',message:res.data['msg']})
        } else {
          this.$notify.error({title:'提示',message:res.data['msg']})
        }
      })
    }
  }
}
</script>
