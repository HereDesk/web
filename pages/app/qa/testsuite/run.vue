<template>
  <div id="page-testcase-run" class="container">
    <nav class="d-flex my-5">
      <a class="navbar-brand flex-grow-1">运行测试用例</a>
    </nav>

    <div class="row">
      <div class="col">
        <el-table :data='tableData' :default-sort="{prop: 'date', order: 'descending'}">
          <el-table-column label='用例ID' prop='id' width='80'></el-table-column>
          <el-table-column label='标题' prop='title'></el-table-column>
          <el-table-column label='执行结果' prop='result' width='100'>
            <template slot-scope="scope">
              <span v-if="scope.row.result === 0" class="text-secondary">
                <span class="circle circle-secondary"></span>&nbsp;&nbsp;未运行
              </span>
              <span v-if="scope.row.result === -1" class="text-urgency">
                <span class="circle circle-urgency"></span>&nbsp;&nbsp;失败
              </span>
              <span v-else-if="scope.row.result === 1" class="text-success">
                <span class="circle circle-success"></span>&nbsp;&nbsp;通过
              </span>
            </template>
          </el-table-column>
          <el-table-column label='执行人' prop='runner' width='98'></el-table-column>
          <el-table-column label='执行时间' width='170'>
            <template slot-scope="scope">
              <span>{{ scope.row.run_time | date }}</span>
            </template>
          </el-table-column>
          <el-table-column label='缺陷' prop='bug_id' width='70'>
            <template slot-scope="scope">
              <span class="text-2973B7" v-for="item in scope.row.bug_id" :key="item.id">
                <a :href="'/app/qa/bug/deatils?bug_id=' + item.bug_id" target="_blank">查看</a>
              </span>
            </template>
          </el-table-column>
          <el-table-column label='操作' width='100'>
            <template slot-scope="scope">
              <div :class="{ 'invisible': scope.row.result !== 0 }">
                <span title="运行成功" class="mr-2" @click="run('1',scope.row.cell_id,case_id)">
                  <i class="iconfont icon-check-circle-fill size-1-5 text-success"></i>
                </span>
                <span title="运行失败" @click="run('-1',scope.row.cell_id,scope.row.case_id)">
                  <i class="iconfont icon-close-circle-fill size-1-5"></i>
                </span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <Pagination :total="total" @PsPn="getPsPn"></Pagination>

  </div>
</template>

<script>
import axios from 'axios'
import util from '~/assets/js/util.js'
import rules from '~/assets/js/rules.js'
import Pagination from '~/components/Pagination'

export default {
  layout: 'head',
  components: {
    Pagination
  },

  validate({ query }) {
    return query.suite_id && query.product_code ? true : false
  },

  data () {
    return {
      tableData: [],
      total: null,
      product_code: this.$route.query.product_code,
      QueryBuilder: {
        pageSize: 10,
        pageNumber: 1,
        suite_id: this.$route.query.suite_id
      },
      RunData: {
        cell_id: null,
        result: null
      }
    }
  },

  watch: {
    QueryBuilder: {
      handler: function (val, oldVal) {
        this.getTestCaseRunList()
      },
      deep: true
    }
  },

  filters: {
    date: util.date
  },

  mounted () {
    this.getTestCaseRunList()
  },

  methods: {
    getPsPn:function (ps,pn) {
      this.QueryBuilder.pageSize = ps
      this.QueryBuilder.pageNumber = pn
    },

    getTestCaseRunList () {
      axios.get('/api/qa/testsuite/cell/list',{ params: this.QueryBuilder }).then(res => {
        if (res.data['status'] === 20000) {
          this.tableData = res.data['data']
          this.total = res.data['total']
        } else {
          this.$notify.error({title:'提示',message:res.data['msg']})
        }
      })
    },
    run (result,cell_id,case_id) {
      this.RunData.result = result
      this.RunData.cell_id = cell_id
      axios({
        method: 'post',
        url: '/api/qa/testsuite/cell/run',
        data: JSON.stringify(this.RunData)
      }).then(res => {
        if (res.data['status'] === 20000) {
          this.getTestCaseRunList()
          this.$notify.success({title: '成功',message: res.data['msg']})
          if (result === '-1') {
            let href = '/app/qa/bug/add?case_id=' + case_id + '&cell_id=' + cell_id
            this.$router.push(href)
          }
        } else {
          this.$notify.error({title: '错误',message: res.data['msg']})
        }
      })
    },
  }
}
</script>