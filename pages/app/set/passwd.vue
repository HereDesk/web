<template>
  <div class='container'>
    <div class='row' id='setpasswd' style="margin-top:10%;">
      <div class='col-xl-4 col-lg-4 col-md-4 col-12 offset-xl-4 col-lg-4 offset-md-4'>
  	    <div class='form-group input-group-control'>
          <label for='oldPassword'>旧密码</label>
          <input type='password' class='form-control' id='oldPassword' name="oldPassword" placeholder='旧密码' maxlength='16' minlength="8" required v-model.trim='passwdData.oldPassword'>
        </div>
        <div class='form-group input-group-control'>
        	<label for='newPassword'>新密码</label>
        	<input type='password' class='form-control' id='newPassword' name="newPassword" placeholder='新密码不能为纯数字' maxlength='16' minlength="8" required v-model.trim='passwdData.newPassword' />
      	</div>
      	<div class='form-group input-group-control mt-5'>
        	<input type="submit" class="btn btn-control" @click="SubmitPasswd" v-bind:class="{ 'btn-secondary': !isButtonStatus, 'btn-success': isButtonStatus }" v-bind:disabled="!isButtonStatus">
      	</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    head () {
      return {
        title: 'HDesk - 修改密码'
      }
    },
    layout: 'head',
    computed: {
      isButtonStatus () {
        if (this.passwdData.oldPassword && this.passwdData.newPassword) {
          return true
        } else {
          return null
        }
      }
    },

    data () {
      return {
        msg: '',
        showModal: false,
        passwdData: {
          oldPassword: null,
          newPassword: null
        }
      }
    },
    methods: {
      HandLogout () {
        window.localStorage.removeItem('token')
        document.cookie = 'token' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;' + 'path=/'
        window.location.replace('/')
      },
      SubmitPasswd () {
        const newPassword = this.passwdData.newPassword
        const oldPassword = this.passwdData.oldPassword
        if (newPassword.length < 8 | newPassword.length > 16) {
          this.$notify.error({
            title: '错误',
            message: '密码的有效长度为8到16位'
          })
          return
        }
        if (oldPassword.length === 0) {
          this.$notify.error({
            title: '错误',
            message: '旧密码不能为空！'
          })
          return
        }

        let that = this
        axios({
          method: 'post',
          url: '/api/user/setpasswd',
          data: JSON.stringify(that.passwdData)
        }).then(function (rep) {
          if (rep.data['status'] === 20000) {
            that.$notify.error({
              title: '修改成功',
              message: rep.data['msg']
            })
            that.HandLogout()
          }
          if (rep.data['status'] !== 20000) {
            that.$notify.error({
              title: '修改失败',
              message: rep.data['msg']
            })
          }
        })
      }
    }
  }
</script>