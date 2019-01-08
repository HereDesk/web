<template>
  <div id="page-permissions" class="container">
    
		<div id="page-head" class="row mt-5">
      <nav class="navbar navbar-expand-lg mr-auto">
        <a class="navbar-brand">API权限管理</a>
      </nav>
    </div>
		
    <div id="page-data" class="row mt-3">
      <div id="permissions-group" class="col-xl-3 col-sm-12 col-12">
        <p class="divider"></p>
        <ul class="pl-0 ul_link">
          <li v-for="item in group_list" 
            :key="item.id" :value="item.group" 
            :class="{ 'selected_data' : ApiPermissionsData.group == item.group }" 
            v-if="item.group != 'admin'"
            @click="select_group(item.group)">
            {{ item.name }}
          </li>
        </ul>
      </div>
      <div id="permissions-management" class="col-xl-9 col-sm-12 col-12">
        <div style="display:block;">
          <button type="btn" class="btn btn-create float-right" @click="showModal = 'api'">+ Api</button>
        </div>
        <div v-for="item in api_list" :key="item.id" class="mb-5 mt-5">
          <h5>{{ item.flag }}</h5>
          <p class="divider"></p>
          <ul class="pl-0 ul_perm">
            <li v-for="p in item.data" :key="p.id" class="mr-3">
              <input type="checkbox" class="mr-2" :value="p.id" :checked="p.is_allow === 1" 
                @click="ApiManage($event,p.id)">
                {{ p.api_name }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <Modal id="modal-api" v-if="showModal == 'api'" @close="showModal = false" :isFooter="isFooter">
      <h5 slot="header" class="modal-title">添加Api</h5>
      <div class="my-3" slot="body">
        <div class='form-group row col-md-auto mx-3'>
          <label for="api_module">所属模块</label>
          <input type='text' maxlength="100" class='form-control' placeholder='请输入api所属模块...' 
            v-model='ApiPermissionsData.flag' />
        </div>
        <div class='form-group row col-md-auto mx-3'>
          <label for="api_name">api_name</label>
          <input type='text' maxlength="100" class='form-control' placeholder='请输入api名称...' 
            v-model='ApiPermissionsData.api_name' />
        </div>
        <div class='form-group row col-md-auto mx-3'>
          <label for="api_code">api_code</label>
          <input type='text' maxlength="100" class='form-control' placeholder='请输入api_code...' 
            v-model='ApiPermissionsData.api_code' />
        </div>
          <div class='form-group row col-md-auto mx-3'>
          <label for="api_url">url</label>
          <input type='text' maxlength="100" class='form-control' placeholder='请输入api_url...' 
            v-model='ApiPermissionsData.url' />
        </div>
      </div>
      <button slot="footer" type="submit" class="btn btn-primary" @click="SaveApiData()">提交</button>
    </Modal>

  </div>
</template>

<script>
export default {
  head() {
    return {
      title: "HDesk - 接口权限管理"
    }
  },

  data() {
    return {
      showModal: false,
      isFooter: true,
      api_list: [],
      modules: [],
      ApiPermissionsData: {
        group: "test",
        api_name: "",
        api_code: "",
        url: "",
        flag: "",
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
    this.getApiList("test")
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
      this.ApiPermissionsData.group = data
      this.getApiList(data)
    },
		
    getApiList(data) {
      this.axios.get("/api/system/api/list?group=" + data)
        .then(res => {
          if (res.data["status"] === 20000) {
            this.api_list = res.data["data"]
          } else {
            this.api_list = []
            this.$notify.error({title: "提示",message: res.data["msg"]})
          }
        })
    },
		
    SaveApiData() {
      this.axios({
        method: "post",
        url: "/api/system/api/create",
        data: JSON.stringify(this.ApiPermissionsData)
      }).then(res => {
        if (res.data["status"] === 20000) {
					this.showModal = false
          this.getApiList(this.ApiPermissionsData.group)
          this.$notify.success({title: "成功",message: res.data["msg"]})
        } else {
          this.$notify.error({title: "提示",message: res.data["msg"]})
        }
      })
    },
		
    ApiManage(event, api_id) {
      var data = {
        is_allow: null,
        api_id: null,
        group: null
      }
      event.target.checked ? (data.is_allow = 1) : (data.is_allow = -1)
      data.api_id = api_id
      data.group = this.ApiPermissionsData.group
      this.axios({
        method: "post",
        url: "/api/system/api/manage",
        data: JSON.stringify(data)
      }).then(res => {
        if (res.data["status"] === 20000) {
          this.getApiList(this.ApiPermissionsData.group)
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