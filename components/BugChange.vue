<template>
  <div class="modal modal-mask">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ modal_title }}</h5>
          <i class="iconfont icon-close-windows size-1-5" @click="$emit('close')"></i>
        </div>

        <div class="modal-body text-center">
          <ul class="ul-inline mb-5 mt-3" v-if="data_type == 'severity'">
            <li class="mx-3 font-size-150 font-weight-light"
              v-for="(item,index) in severity_list" :key="index" @click="ModifySeverity(item.key)">
              {{ item.name }}
            </li>
          </ul>
          <ul class="ul-inline mb-5 mt-3" v-if="data_type == 'priority'">
          	<li class="mr-5 font-size-150 font-weight-light"
          		v-for="(item,index) in priority_list" :key="index" @click="ModifyPriority(item.key)">
              {{ item.name }}
          	</li>
          </ul>
          <p class="my-3 text-gray">备注：选择后，即实现提交，无需进行其它操作</p>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import data from "~/assets/js/data.js"

export default {
  props: {
    bug_id: String,
    data_type: String,
  },
  
  computed: {
    priority_list() {
      return this.$store.state.BugProperty.bug_priority
    },
    severity_list() {
      return this.$store.state.BugProperty.bug_severity
    },
  	modal_title() {
      if (this.data_type == 'priority') {
        return '修改优先级'
      } else if (this.data_type == 'severity') {
        return '修改严重程度'
      } else {
        return false
      }
  	}
  },
  
  methods: {
    ModifySeverity(data) {
    	let ModifyData = {}
    	ModifyData.bug_id = this.bug_id
    	ModifyData.severity = data
    	this.axios({
    		method: "post",
    		url: "/api/qa/bug/edit",
    		data: JSON.stringify(ModifyData)
    	}).then(res => {
    		if (res.data["status"] === 20000) {
          this.$notify.success({title: "成功",message: res.data["msg"]})
          this.$emit("close")
    			this.$emit("refreshList")
    		} else {
    			this.$notify.error({title: "失败",message: res.data["msg"]})
    		}
    	})
    },
    ModifyPriority(data) {
      let ModifyData = {}
      ModifyData.bug_id = this.bug_id
      ModifyData.priority = data
      this.axios({
        method: "post",
        url: "/api/qa/bug/edit",
        data: JSON.stringify(ModifyData)
      }).then(res => {
        if (res.data["status"] === 20000) {
          this.$emit("close")
          this.$emit("refreshList")
        } else {
          this.$notify.error({title: "失败",message: res.data["msg"]})
        }
      })
    }
  }
}
</script>