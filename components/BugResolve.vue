<template>
  <div class="modal modal-mask">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ mtitle }}</h5>
        </div>

        <div class="modal-body">
          <div class='form-group row col-md-auto mx-3'>
            <label for="solution">解决方案</label>
            <select class='select-control border' v-model="scheme">
              <option disabled value="">请选择</option>
              <option v-for='item in solution_list' :key="item.id" :value="item.key">{{ item.name }}</option>
            </select>
          </div>
          <div class='form-group row col-md-auto mx-3'>
            <label for="assignedTo">指派给</label>
            <select class='select-control border' v-model="ResolveData.assignedTo">
              <option disabled value="">请选择指派给谁</option>
              <option v-for='(item,index) in person_list' :key="index" :value="item.user_id">
                {{ item.realname }}
              </option>
            </select>
          </div>
          <div class='form-group row col-md-auto mx-3 no-toolbars'>
            <label for="remark">备注</label>
            <mavon-editor style="width:100%;" placeholder="请输入备注 ~ "
              :toolbarsFlag="false" :subfield="false" v-model.trim="ResolveData.remark">
            </mavon-editor>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-cancel" @click="$emit('close')">关闭</button>
          <button type="submit" class="btn btn-primary" @click="MoreRecovered()">提交</button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    bug_id: String,
    OpenBy: String,
    product_code: String,
    scheme: String,
    pageSource: String,
    member_list: {}
  },
  data() {
    return {
      ResolveData: {
        bug_id: "",
        assignedTo: "",
        reamrk: "",
        solution: "Fixed"
      }
    };
  },
  computed: {
    solution_list: function () {
      return this.$store.state.BugProperty.bug_solution
    },
    person_list: function () {
      if (this.$store.state.ProductMemberList) {
        return this.$store.state.ProductMemberList["data"]
      }
      return 
    },
    mtitle: function() {
      if (this.scheme === "Postponed") {
        return "延期解决缺陷"
      } else {
        return "解决缺陷"
      }
    }
  },
  methods: {
    // bug resolve
    MoreRecovered() {
      this.ResolveData.bug_id = this.bug_id
      this.ResolveData.solution = this.scheme
      this.axios({
        method: "post",
        url: "/api/qa/bug/resolve",
        data: JSON.stringify(this.ResolveData)
      }).then(res => {
        if (res.data["status"] === 20000) {
          this.$emit('close')
          if (this.pageSource === "page_bug_index") {
            this.$emit("refreshList")
          }
          if (this.pageSource === "page_bug_details") {
            this.$router.go(-1)
          }
          this.$notify.success({
            title: "成功", 
            message: res.data["msg"]
          })
        } else {
          this.$notify.error({
            title: "错误", 
            message: res.data["msg"] 
          })
        }
      });
    }
  }
};
</script>