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
          <p class="text-lg mt-3">当前页面，您没有访问权限； 或请求出错了，请返回首页重试</p>
        </div>
        <div class="links mt-5">
          <a target="_blank" class="button--green" @click="BackHome()">返回首页</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    BackHome() {
      this.$router.replace("/app/dashboard")
    }
  },
}
</script>
