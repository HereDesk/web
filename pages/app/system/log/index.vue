<template>
  <div id="page-bug-set" class="container">
    <div id="module-product" class="row mt-5">
      <nav class="navbar navbar-expand-lg mr-auto">
        <a class="navbar-brand">用户日志</a>
      </nav>
    </div>
    <div class="row mt-3">
      <div class="col">
        <el-table :data='tableData' >
          <el-table-column label='ID' prop='id' sortable width='70'></el-table-column>
          <el-table-column label='姓名' prop='realname'></el-table-column>
          <el-table-column label='标记' prop='flag'></el-table-column>
          <el-table-column label='IP' prop='ip'></el-table-column>
          <el-table-column label='第一次'>
            <template slot-scope="scope">
              <span>{{ scope.row.create_time | date }}</span>
            </template>
          </el-table-column>
          <el-table-column label='最后一次更新时间'> 
            <template slot-scope="scope">
              <span>{{ scope.row.update_time | date }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <Pagination :total="total" @PsPn="getPsPn"></Pagination>
  </div>
</template>

<script>
import Pagination from "~/components/Pagination"
import util from "~/assets/js/util.js"

export default {

  components: {
    Pagination
  },

  filters: {
    date: util.date
  },

  data () {
    return {
      tableData: [],
      Builder: {
        "pageSize": 10,
        "pageNumber": 1,
      },
      total: 0
    }
  },

  watch: {
    Builder: {
      handler: function (val, oldVal) {
        this.get_log()
      },
      deep: true
    }
  },
  
  created() {
    this.get_log()
  },

  methods: {
    getPsPn:function (ps,pn) {
      this.Builder.pageSize = ps
      this.Builder.pageNumber = pn
    },
    get_log () {
      this.axios.get('/api/system/user_log', {params: this.Builder}).then(res => {
        if (res.data['status'] === 20000) {
          this.tableData = res.data['data']
          this.total = res.data['total']
        }
      })
    }
  }
}
</script>

<style>

</style>
