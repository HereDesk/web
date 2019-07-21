<template>
  <div class="containre">
    <div class="row mt-5">
      <div class="col text-center">
        <h1 class="title">
          HDesk
        </h1>
        <div class="mt-5 pt-5">
          <img src="~/assets/images/perm.svg">
          <p class="text-lg mt-3">您没有此页面的访问权限，请联系管理员</p>
        </div>
        <div class="links">
          <<nuxt-link to="/"></nuxt-link>
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
