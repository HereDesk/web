<template>
  <div id="page-permissions" class="container">
    <div id="module-product" class="row mt-5">
      <nav class="navbar navbar-expand-lg mr-auto">
        <a class="navbar-brand">权限管理</a>
      </nav>
    </div>
    <div class="row mt-3">
      <div id="permissions-group" class="col-xl-3 col-sm-12 col-12">
        <p class="divider"></p>
        <ul class="pl-0 ul_link">
          <li v-for="item in group_list" 
            :key="item.id" :value="item.group" 
            :class="{ 'selected_data' : PermissionsData.group == item.group }" 
            v-if="item.group != 'admin'"
            @click="select_group(item.group)">
            {{ item.name }}
          </li>
        </ul>
      </div>
      <div id="permissions-management" class="col-xl-9 col-sm-12 col-12">
        <div style="display:block;">
          <button type="btn" class="btn btn-create float-right" data-toggle="modal" data-target="#add_router">+权限</button>
        </div>
        <div v-for="item in permissions_list" :key="item.id" class="mb-5 mt-5">
          <h5>{{ item.flag }}</h5>
          <p class="divider"></p>
          <ul class="pl-0 ul_perm">
            <li v-for="p in item.data" :key="p.id" class="mr-3">
              <input type="checkbox" class="mr-2" :value="p.permissions_id" :checked="p.is_allow === 1" @click="MangePermissions($event,p.permissions_id)">{{ p.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div id="add_router" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">添加权限</h5>
          </div>
          <div class="modal-body my-3">
            <div class='form-group row col-md-auto mx-3'>
              <label for="page_module">选择模块</label>
              <select class="select-control form-border-bottom" v-model="PermissionsData.flag">
                <option v-for="item in modules" :key="item.id" :value="item.value">{{ item.name }}</option>
              </select>
            </div>
            <div class='form-group row col-md-auto mx-3'>
              <label for="permissions_name">权限名称</label>
              <input type='text' v-model='PermissionsData.name' maxlength="100" class='form-control' placeholder='请输入页面名称...' />
            </div>
            <div class='form-group row col-md-auto mx-3'>
              <label for="permissions_name">权限code</label>
              <input type='text' v-model='PermissionsData.code' maxlength="100" class='form-control' placeholder='请输入页面名称...' />
            </div>
             <div class='form-group row col-md-auto mx-3'>
              <label for="permissions_url">url</label>
              <input type='text' v-model='PermissionsData.url' maxlength="100" class='form-control' placeholder='请输入页面url...' />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-cancel" data-dismiss="modal">关闭</button>
            <button type="submit" class="btn btn-primary" @click="SavePermissions()">提交</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    head () {
      return {
        title: 'HDesk - 接口权限管理'
      }
    },

    data () {
      return {
        permissions_list: [],
        modules: [

        ],
        PermissionsData: {
          group: 'test',
          name: '',
          code: '',
          url: '',
        },
        group_list: []
      }
    },

    computed: {
    },

    watch: {
    },

    created () {
      this.get_group_list()
      this.getPermissionsList('test')
    },
    methods: {
      get_group_list () {
        let that = this
        axios.get('/api/user/group').then(function (rep) {
          if (rep.data['status'] === 20000) {
            that.group_list = rep.data['data']
          } else {
            that.$notify.error({title: '提示',message: res.data['msg']})
          }
        })
      },
      select_group (data) {
        this.PermissionsData.group = data
        this.getPermissionsList(data)
      },
      getPermissionsList (data) {
        let that = this
        axios.get('/api/system/permissions/list?group=' + data).then(function (res) {
          if (res.data['status'] === 20000) {
            that.permissions_list = res.data['data']
          } else {
            that.permissions_list = []
            that.$notify.error({title: '提示',message: res.data['msg']})
          }
        })
      },
      SavePermissions () {
        let that = this
        axios({
          method: 'post',
          url: '/api/system/permissions/create',
          data: JSON.stringify(that.PermissionsData),
        }).then(function (res) {
          if (res.data['status'] === 20000) {
            $('#add_router').modal('hide')
            that.getPermissionsList(that.PermissionsData.flag)
            that.$notify.success({title: '成功',message: res.data['msg']})
          } else {
            that.$notify.error({title: '提示',message: res.data['msg']})
          }
        })
      },
      MangePermissions (event,permissions_id) {
        var data = {
          is_allow: null,
          permissions_id: null,
          group: null
        }
        event.target.checked ? data.is_allow = 1 : data.is_allow = -1
        data.permissions_id = permissions_id
        data.group = this.PermissionsData.group
        let that = this
        axios({
          method: 'post',
          url: '/api/system/permissions/manage',
          data: JSON.stringify(data),
        }).then(function (res) {
          if (res.data['status'] === 20000) {
            that.getPermissionsList(that.PermissionsData.group)
            that.$notify.success({title: '成功',message: res.data['msg']})
          } else {
            that.$notify.error({title: '提示',message: res.data['msg']})
          }
        })
      }
    }
  }
</script>

<style>
  @import '~/static/static/common/css/system.css'
</style>