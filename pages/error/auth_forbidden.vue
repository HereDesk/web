<template>
  <div class="containre">
    <div class="row mt-5">
      <div class="col text-center">
        <h1 class="title">
          HDesk
        </h1>
        <div class="mt-5 pt-5">
          <img src="~/assets/images/perm.svg">
          <p class="text-lg mt-5">访问权限受限</p>
          <p class="text-lg mt-3">您没有此项目或此接口的访问权限</p>
        </div>
        <div class="links">
          <a target="_blank" class="button--green" @click="ReLogin()">重新登录</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    ReLogin() {
      window.localStorage.removeItem('token')
      window.localStorage.removeItem('last_visited_product_id')
      document.cookie = 'token' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;' + 'path=/'
      this.$router.replace("/")
    }
  },
}
</script>
