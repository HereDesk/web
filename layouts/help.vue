<template>
  <div id="page-help" class="container mt-5">
    <div class="row">
      <div id="help-nav" class="col-xl-2 col-lg-2 col-md-3 col-sm-12 col-12">
        <ul class="nav flex-column position-fixed mt-5">
          <li class="nav-item" :class="{ 'nav-item-active' :  currentRoute === '/app/help' }">
            <nuxt-link class="nav-link" to="/app/help">关于</nuxt-link>
          </li>
          <li class="nav-item" :class="{ 'nav-item-active' :  currentRoute.indexOf('permission') >= 0 }">
            <nuxt-link class="nav-link" to="/app/help/permission">权限</nuxt-link>
          </li>
          <li class="nav-item" :class="{ 'nav-item-active' :  currentRoute.indexOf('bug') >= 0 }">
            <nuxt-link class="nav-link" to="/app/help/bug">缺陷</nuxt-link>
          </li>
          <li class="nav-item" :class="{ 'nav-item-active' :  currentRoute.indexOf('testcase') >= 0 }">
            <nuxt-link class="nav-link" to="/app/help/testcase">测试用例</nuxt-link>
          </li>
        </ul>
      </div>
      <div id="help-body" class="col-xl-10 col-lg-10 col-md-9 col-sm-12 col-12">
        <nuxt/>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    computed: {
      currentRoute () {
        return this.$route.path
      }
    }
  }
</script>