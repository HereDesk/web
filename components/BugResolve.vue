<template>
	<div id="componentsResolve" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
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
              <option disabled value="">请选择</option>
              <option v-for='item in person_list' :key="item.id" :value="item.user_id">{{ item.realname }}</option>
            </select>
          </div>
          <div class='form-group row col-md-auto mx-3'>
            <label for="remark">备注</label>
            <textarea type='text' v-model='ResolveData.remark' class='textarea-control form-border-bottom' rows="5" placeholder='请输入备注...'></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-cancel" data-dismiss="modal">关闭</button>
          <button type="submit" class="btn btn-primary" @click="MoreRecovered()">提交</button>
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
    OpenBy: String,
    product_code: String,
    scheme: String,
    pageSource: String,
    member_list: {}
  },
  data() {
    return {
      person_list: [],
      ResolveData: {
        bug_id: "",
        assignedTo: "",
        reamrk: "",
        solution: "Fixed"
      }
    };
  },
  computed: {
    mtitle: function() {
      if (this.scheme === "Postponed") {
        return "延期解决缺陷";
      } else {
        return "解决缺陷";
      }
    },
    solution_list: function() {
      return this.$store.state.BugSolutionList;
    }
  },
  created() {
    if (this.member_list === undefined) {
      this.getMemberList();
    } else {
      this.person_list = this.member_list;
    }
  },
  mounted() {
    if (this.$store.state.BugSolutionList) {
      this.solution_list = this.$store.state.BugSolutionList;
    } else {
      this.$store.dispatch("getBugSolution");
    }
  },
  methods: {
    getMemberList() {
      axios
        .get("/api/pm/member/list?product_code=" + this.product_code)
        .then(res => {
          if (res.data["status"] === 20000) {
            this.person_list = res.data["data"];
          }
        });
    },
    // bug resolve
    MoreRecovered() {
      this.ResolveData.bug_id = this.bug_id;
      // this.ResolveData.assignedTo = this.PageData.openedBy
      this.ResolveData.solution = this.scheme;
      axios({
        method: "post",
        url: "/api/qa/bug/resolve",
        data: JSON.stringify(this.ResolveData)
      }).then(res => {
        if (res.data["status"] === 20000) {
          if (this.pageSource === "page_bug_index") {
            this.$emit("refreshList");
          }
          if (this.pageSource === "page_bug_details") {
            this.$router.push("/app/qa/bug");
          }
          $("#componentsResolve").modal("hide");
          this.$notify.success({ title: "成功", message: res.data["msg"] });
        } else {
          this.$notify.error({ title: "错误", message: res.data["msg"] });
        }
      });
    }
  }
};
</script>