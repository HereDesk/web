<template>
  <div id="page-bug-set" class="container">
    <div id="module-product" class="row mt-5">
      <nav class="navbar navbar-expand-lg mr-auto">
        <a class="navbar-brand">缺陷设置</a>
      </nav>
    </div>
    <div class="row mt-3">
      <div class="col-xl-3 col-sm-12 col-12">
        <ul class="pl-0 ul_link">
          <li v-for="item in NavList" 
            :key="item.id" :value="item.value" 
            :class="{ 'selected_data' : selected_value == item.value }" 
            @click="select_data(item.value)">
            {{ item.name }}
          </li>
        </ul>
      </div>
      <div class="col-xl-9 col-sm-12 col-12">
        <div v-for="item in DataList" :key="item.id" class="mb-5 mt-5">
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
  </div>
</template>

<script>
import axios from "axios";
export default {
  head() {
    return {
      title: "HDesk - 缺陷设置"
    };
  },

  data() {
    return {
      NavList: [
        { name: "缺陷类型", value: "bug_type" },
        { name: "缺陷严重程度", value: "bug_severity" },
        { name: "缺陷优先级", value: "bug_priority" }
      ],
      selected_value: "bug_type",
      DataList: []
    };
  },

  computed: {},

  watch: {},

  created() {},
  methods: {
    select_data(data) {
      this.selected_value = data;
    }
  }
};
</script>

<style>
@import "~/static/static/common/css/system.css";
</style>