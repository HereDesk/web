<template>
  <div class="modal modal-mask">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">分配缺陷</h5>
        </div>

        <div class="modal-body">
          <div class="form-group row col-md-auto mx-3">
            <label for="assignedTo">分配</label>
            <select class="select-control border" v-model="AssignData.assignedTo">
              <option disabled value>请选择分配给谁</option>
              <option
                v-for="item in person_list"
                :key="item.id"
                :value="item.user_id"
                v-if="item.realname !== '超级管理员'"
              >{{ item.realname }}</option>
            </select>
          </div>
          <div class="form-group row col-md-auto mx-3 no-toolbars">
            <mavon-editor
              style="width:100%;"
              placeholder="请输入备注 ~ "
              :toolbarsFlag="false"
              :subfield="false"
              v-model.trim="AssignData.remark"
            ></mavon-editor>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-cancel" @click="$emit('close')">关闭</button>
          <button type="submit" class="btn btn-primary" @click="assign()">提交</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    bug_id: String,
    product_id: String,
    product_code: String,
    pageSource: String,
  },
  data() {
    return {
      AssignData: {
        bug_id: "",
        assignedTo: "",
        remark: ""
      }
    };
  },
  computed: {
    person_list: function () {
      if (JSON.stringify(this.$store.state.ProductMemberList) !== "{}") {
        let state = this.$store.state.ProductMemberList["data"]
        let data =  state ? state.filter( x => x["status"] == 0) : []
        return data
      }
      return
    }
  },

  created() {
    let person_list = this.$store.state.ProductMemberList
    if (JSON.stringify(person_list) === "{}") {
      this.$store.dispatch("getProductMembers",this.product_id)
    }
  },

  methods: {
    assign() {
      if (this.AssignData.assignedTo === "") {
        this.$notify.error({ title: "数据校验", message: "请选择分配人" })
        return
      }
      this.AssignData.bug_id = this.bug_id
      this.axios({
        method: "post",
        url: "/api/qa/bug/assign",
        data: JSON.stringify(this.AssignData)
      }).then(res => {
        if (res.data["status"] === 20000) {
          this.$emit('close')
          if (this.pageSource === "page_bug_index") {
            this.$emit("refreshList")
          }
          if (this.pageSource === "page_bug_details") {
            this.$router.go(-1)
          }
          this.$notify.success({ title: "成功", message: res.data["msg"] })
        } else {
          this.$notify.error({ title: "失败", message: res.data["msg"] })
        }
      })
    }
  }
}
</script>
