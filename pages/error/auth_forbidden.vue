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
