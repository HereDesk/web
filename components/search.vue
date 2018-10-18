<template>
  <div class='row' style="margin:2rem 0 0 0;padding: 0;">
    <div class='col-xl-2 col-lg-2 col-md-2 col-4' @change='SelectedProduct($event)'>
      <select class='form-control' v-model="product_code" style="border:1px solid #9E9E9E;background-color:#f5f5f5;">
        <option v-for='item in product_list' :key="item.id">{{ item.product_code }}</option>
      </select>
    </div>
    <div class='col-xl-2 col-lg-2 col-md-2 col-4 form-group' v-if='release_list' @change='SelectedRelease($event)'>
      <select class='form-control' v-model="release" style="border:1px solid #9E9E9E;background-color:#f5f5f5;">
        <option value="all">所有版本</option>
        <option v-for='item in release_list' :key="item.id">{{ item.version }}</option>
      </select>
    </div>
    <div class='col-xl-2 col-lg-2 col-md-2 col-4 form-group' >
      <slot name="add">
      </slot>
    </div>
    <div class='col-xl-5 col-lg-5 col-md-6 col-12 input-group-control offset-xl-1 offset-lg-1 pr-0 pl-0' >
      <slot name="search">
      </slot>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      product_list: [],
      release_list: [],
      product_code: '',
      release: 'all',
      product_msg: '',
      // loading
      loading: true
    }
  },
  created () {
    this.getProductRelease()
  },
  mounted () {
    this.$emit('pvinfo',[this.product_code])
  },
  watch: {
    product_code: function (val, oldVal) {
      var i
      for (i in this.product_list) {
        if (this.product_code === this.product_list[i]['product_code']) {
          this.release_list = this.product_list[i]['data']
        }
      }
      this.$emit('pvinfo',[this.product_code])
    }
  },
  methods: {
    // get product info and release info 
    getProductRelease () {
      axios.get('/api/pm/product_release').then(res => {
        if (res.data['status'] === 20000) {
          this.product_list = res.data['data']
          // loading
          this.loading = false
          // url query params
          if (this.$route.query.product_code) {
            this.product_code = this.$route.query.product_code
          } else {
            this.product_code = this.product_list[0]['product_code']
            this.$router.push('?product_code=' + this.product_code)
          }
          if (this.$route.query.release) {
            this.release = this.$route.query.release
          }
        } else {
          this.product_msg = res.data['msg']
        }
      })
    },
    // select product code
    SelectedProduct (event) {
      this.product_code = event.target.value
      this.release = 'all'
      this.$router.push(this.$route.path + '?product_code=' + this.product_code + '&release=' + this.release)
    },
    // select release
    SelectedRelease (event) {
      this.release = event.target.value
      this.$router.push(this.$route.path + '?product_code=' + this.product_code + '&release=' + this.release)
    }
  } 
}

</script>
