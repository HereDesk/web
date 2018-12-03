<template>
  <div id="page-permissions" class="container">
    <div id="module-product" class="row pt-5">
      <nav class="navbar navbar-expand-lg mr-auto">
        <a class="navbar-brand">系统设置</a>
      </nav>
    </div>
    <div class="row" style="margin-top:15%;">
      <div class="col-xl-2 col-lg-2 col-md-2 col-sm-3 col-3" v-for="item in LinkData" :key="item.id">
        <div class="text-center link-item">
          <nuxt-link :to="item.url">
            <img :src="item.img">
            <p class="pt-3 text-desc">{{ item.text }}</p>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import PageLoading from "~/components/PageLoading"
export default {
  head() {
    return {
      title: "HDesk - 系统设置"
    };
  },

  data() {
    return {
      LinkData: [
        {
          url: "/app/system/page",
          img: require("~/static/pic/system_perm.png"),
          text: "页面权限"
        },
        {
          url: "/app/system/api",
          img: require("~/static/pic/system_perm.png"),
          text: "接口权限"
        },
        {
          url: "/app/system/bug",
          img: require("~/static/pic/system_bug.png"),
          text: "缺陷设置"
        },
        {
          url: "/app/system/log",
          img: require("~/static/pic/system_log.png"),
          text: "日志记录"
        }
      ]
    };
  }
};
</script>

<style>
@import "~/static/static/common/css/system.css";
</style>