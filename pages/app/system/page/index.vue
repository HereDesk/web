<template>
  <div id="page-permissions" class="container">

		<div id="page-head" class="row mt-5">
      <nav class="navbar navbar-expand-lg mr-auto">
        <a class="navbar-brand">页面管理</a>
      </nav>
    </div>

    <div id="page-data" class="row mt-3">
      <div id="permissions-group" class="col-xl-3 col-sm-12 col-12">
        <p class="divider"></p>
        <ul class="pl-0 ul_link">
          <li v-for="item in group_list"
            :key="item.id" :value="item.group"
            :class="{ 'selected_data' : PageData.group == item.role }"
            @click="select_group(item.role)">
            {{ item.name }}
          </li>
        </ul>
      </div>
      <div id="permissions-management" class="col-xl-9 col-sm-12 col-12">
        <div style="display:block;">
          <button type="btn" class="btn btn-create float-right" @click="showModal = 'page'">
            创建新页面
          </button>
        </div>
        <div v-for="item in page_list" :key="item.id" class="mb-5 mt-5">
          <h5>{{ item.flag }}</h5>
          <p class="divider"></p>
          <ul class="pl-0 ul_line">
            <li v-for="p in item.data" :key="p.id" class="mr-3">
              <input type="checkbox" class="mr-2" :value="p.id" :checked="p.is_allow === 1"
                @click="PageManage($event,p.id)">
              <span>{{ p.page_name }} &nbsp;&nbsp;</span>
              <span v-if="p.desc" style="color:#666666;font-size:0.85rem;">{{ p.desc }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <Modal id="modal-page" v-if="showModal == 'page'" @close="showModal = false" :isFooter="true">
      <h5 slot="header" class="modal-title">创建新页面</h5>
      <div class="my-3" slot="body">
        <div class='form-group row col-md-auto mx-3'>
          <label for="permissions_name">页面标记</label>
          <input type='text' class='form-control' maxlength="100" placeholder='请输入页面名称...'
            v-model='PageData.flag' />
        </div>
        <div class='form-group row col-md-auto mx-3'>
          <label for="permissions_name">页面名称</label>
          <input type='text' class='form-control' maxlength="100" placeholder='请输入页面名称...'
            v-model='PageData.page_name' />
        </div>
          <div class='form-group row col-md-auto mx-3'>
          <label for="permissions_url">页面地址</label>
          <input type='text' class='form-control' maxlength="100" placeholder='请输入页面url...'
            v-model='PageData.page_url' />
        </div>
      </div>
      <button slot="footer" type="submit" class="btn btn-primary" @click="SavePageData()">提交</button>
    </Modal>

  </div>
</template>

<script>

export default {
  head() {
    return {
      title: "HDesk - 页面管理"
    }
  },

  data() {
    return {
      showModal: false,
      page_list: [],
      modules: [],
      PageData: {
        page_name: "",
        page_url: "",
        flag: "",
        group: "test"
      },
      group_list: []
    };
  },

  watch: {
    showModal () {
      this.showModal ?
        document.body.classList.add("overflow-hidden") :
        document.body.classList.remove("overflow-hidden")
    }
  },

  created() {
    this.get_group_list()
    this.getPageList()
  },

  methods: {
    get_group_list() {
      this.axios.get("/api/user/group").then(res => {
        if (res.data["status"] === 20000) {
          this.group_list = res.data["data"]
        } else {
          this.$notify.error({title: "提示",message: res.data["msg"]})
        }
      })
    },

    select_group(data) {
      this.PageData.group = data
      this.getPageList()
    },

    getPageList() {
      this.axios
        .get("/api/system/page/list?role=" + this.PageData.group)
        .then(res => {
          if (res.data["status"] === 20000) {
            this.page_list = res.data["data"]
          } else {
            this.page_list = []
            this.$notify.error({title: "提示",message: res.data["msg"]})
          }
        })
    },

    SavePageData() {
      this.axios({
        method: "post",
        url: "/api/system/page/create",
        data: JSON.stringify(this.PageData)
      }).then(res => {
        if (res.data["status"] === 20000) {
					this.showModal = false
          this.getPageList()
          this.$notify.success({title: "成功",message: res.data["msg"]})
        } else {
          this.$notify.error({title: "提示",message: res.data["msg"]})
        }
      })
    },

    PageManage(event, page_id) {
      var data = {
        is_allow: null,
        page_id: null,
        group: null
      }
      event.target.checked ? (data.is_allow = 1) : (data.is_allow = -1)
      data.page_id = page_id
      data.group = this.PageData.group
      this.axios({
        method: "post",
        url: "/api/system/page/manage",
        data: JSON.stringify(data)
      }).then(res => {
        if (res.data["status"] === 20000) {
          this.getPageList()
          this.$notify.success({title: "成功",message: res.data["msg"]})
        } else {
          this.$notify.error({title: "提示",message: res.data["msg"]})
        }
      })
    }
  }
};
</script>

<style>
  @import "~/assets/css/system.css"
</style>
