<template>
  <div id="modal-modify-priority" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">修改优先级</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body text-center">
          <ul class="ul-inline mb-5 mt-3">
            <li class="mr-5 text-150 font-weight-light"
              v-for="item in priority_list" :key="item.id" v-if="item.pvalue != 'all'" 
              @click="ModifyPriority(item.pvalue)">
              {{ item.pvalue }}
            </li>
          </ul>
          <p class="my-3 text-gray">备注：选择后，即实现提交，无需进行其它操作</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import data from "~/assets/js/data.js"

export default {
  props: {
    bug_id: String
  },

  data () {
    return {
      priority_list: data.priority_list,
      ModifyPriorityData: {
        bug_id: "",
        priority: ""
      }
    }
  },

  methods: {
    ModifyPriority(data) {
      this.ModifyPriorityData.bug_id = this.bug_id
      this.ModifyPriorityData.priority = data
      axios({
        method: "post",
        url: "/api/qa/bug/edit",
        data: JSON.stringify(this.ModifyPriorityData)
      }).then(res => {
        if (res.data["status"] === 20000) {
          this.$notify.success({
            title: "成功",
            message: res.data["msg"]
          })
          $("#modal-modify-priority").modal("hide")
          this.$emit("refreshList")
        } else {
          this.$notify.error({
            title: "失败",
            message: res.data["msg"]
          })
        }
      })
    }
  }
}
</script>