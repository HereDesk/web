<template>
   <div id="page-nav-title" class="container-fluid">
    <div class="row">
      <div class="col text-center page-pure-title">
        <span @click="$router.go(-1)">
          <i class="iconfont icon-close-windows size-2 icon-8a8a8a"></i>
        </span>
        <h3>{{ title }}</h3>
        <div class="dropdown-divider"></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"

export default {
  props: {
    title: String
  },
  data () {
    return {
      last_url: false
    }
  },
  created() {
    if (!this.$store.state.userInfo) {
      this.$store.dispatch("getUserInfo")
    }
  }
}
</script>

<style>
  .page-pure-title span{
    display: inline-block;
    float: right;
    margin:0.8rem 1rem 1rem 0;
    height: 33px;
    width:33px;
  }

  .page-pure-title h3{
    display: inline-block;
    font-weight: 300 !important;
    margin:1rem 0;
  }
</style>
