<template>
  <div id="componentsAssign" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">分配缺陷</h5>
        </div>
        <div class="modal-body">
          <div class='form-group row col-md-auto mx-3'>
            <label for="assignedTo">分配</label>
            <select class='select-control border' v-model="AssignData.assignedTo">
              <option disabled value="">请选择</option>
              <option v-for='item in person_list' :key="item.id" :value="item.user_id" v-if="item.realname !== '超级管理员'">
                {{ item.realname }}
              </option>
            </select>
          </div>
          <div class='form-group row col-md-auto mx-3'>
            <label for="remark">备注</label>
            <textarea type='text' v-model='AssignData.remark' class='textarea-control form-border-bottom' rows="5" placeholder='请输入备注...'></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-cancel" data-dismiss="modal">关闭</button>
          <button type="submit" class="btn btn-primary" @click="assign()">提交</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    bug_id: String,
    product_code: String,
    pageSource: String,
    member_list: {}
  },
  data() {
    return {
      person_list: [],
      AssignData: {
        bug_id: "",
        assignedTo: "",
        remark: ""
      }
    };
  },
  mounted() {
    if (this.member_list === undefined) {
      this.getMemberList();
    } else {
      this.person_list = this.member_list;
    }
  },
  methods: {
    getMemberList() {
      let that = this;
      axios
        .get("/api/pm/member/list?product_code=" + that.product_code)
        .then(function(res) {
          if (res.data["status"] === 20000) {
            that.person_list = res.data["data"];
          }
        });
    },
    assign() {
      let that = this;
      if (that.AssignData.assignedTo === "") {
        return that.$notify.error({
          title: "数据校验",
          message: "请选择分配人"
        });
      }
      that.AssignData.bug_id = this.bug_id;
      axios({
        method: "post",
        url: "/api/qa/bug/assign",
        data: JSON.stringify(that.AssignData)
      }).then(function(res) {
        if (res.data["status"] === 20000) {
          $("#componentsAssign").modal("hide");
          if (that.pageSource === "page_bug_index") {
            that.$emit("refreshList");
          }
          if (that.pageSource === "page_bug_details") {
            that.$router.go(-1);
          }
          that.$notify.success({ title: "成功", message: res.data["msg"] });
        } else {
          that.$notify.error({ title: "失败", message: res.data["msg"] });
        }
      });
    }
  }
};
</script>
