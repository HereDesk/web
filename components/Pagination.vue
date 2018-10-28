<template>
  <div class="container-fluid" v-cloak>
    <div id="data-paging" class="row" :class="{ 'my-5' : !isModal }">
      <div class="col-auto mr-auto">
        <nav aria-label="Page navigation" v-if="total > pageSize">
          <ul class="pagination pl-0">
            <li class="page-item" v-if="FirstPage != pageNumber & LastPage > 5">
              <a class="page-link" aria-label="Previous" @click="handleChange('pn',$event)">
                <span aria-hidden="true">&lt;</span>
              </a>
            </li>
            <li class="page-item" 
              :class="{ active: item === parseInt(pageNumber),disabled: item == '...'}" 
              v-for="item in PageList" :key="item.id" 
              @click="handleChange('pn',$event)">
              <a class="page-link">{{ item }}</a>
            </li>
            <li class="page-item" v-if="LastPage != pageNumber & LastPage > 5">
              <a class="page-link" aria-label="Next"  @click="handleChange('pn',$event)">
                <span aria-hidden="true">&gt;</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div class="col-auto pagination pt-2" v-if="total">
        <span v-if="total > 0">
          共&nbsp;{{ total }}&nbsp;条
        </span>
        <span v-if="total >= 10 && isModal !== 'Modal'" @click="handleChange('ps',$event)">
          每页<span class="text-007BFF" style="text-decoration:underline;">{{ pageSize }}</span>条
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    "total": Number,
    "isModal": String
  },

  data () {
    return {
      FirstPage: 1,
      pageNumber: parseInt(this.$route.query.pageNumber) || 1,
      pageSize: parseInt(this.$route.query.pageSize) || 10
    }
  },

  computed: {
    LastPage: function () {
      return Math.ceil(this.total / this.pageSize)
    },
    PageList: function () {
      let list = new Array()
      let lp = parseInt(this.LastPage)
      let pn = parseInt(this.pageNumber)
      if (lp <= 5){
        let tmp = new Array()
        for (let i = 0; i < lp; i++) {
          tmp.push(i+1)
        }
        return tmp
      } else {
        if (lp == 6) {
          return [1,2,3,4,5,6]
        } else {
          if (lp > 6) {
            if (pn == 1 | pn == lp) {
              return [1,2,'...',lp-1,lp]
            }
            if (pn == 2 ) {
              return [1,2,'...',lp-1,lp]
            } else if (pn == lp - 1) {
              return [1,2,'...',pn,lp]
            } else {
              return [1,'...',pn,'...',lp]
            }
          }
        }
      }
    }
  },
  watch: {
    "$route" () {
      let query = this.$route.query
      query.pageNumber ? (this.pageNumber = parseInt(query.pageNumber)) : undefined
      query.pageSize ? (this.pageSize = parseInt(query.pageSize)) : undefined
    },
    pageSize () {
      this.$emit('PsPn',this.pageSize,this.pageNumber) 
    },
    pageNumber () {
      this.$emit('PsPn',this.pageSize,this.pageNumber) 
    }
  },

  methods: {
    // 翻页
    handleChange (data,event) {
      console.log(event)
      if (data === 'ps') {
        if (this.pageSize == 50) {
          this.pageNumber = 1
          this.pageSize = parseInt(this.pageSize) - 40
        } else {
          this.pageNumber = 1
          this.pageSize = parseInt(this.pageSize) + 20
        }
      }
      if (data === 'pn') {
        let text = event.target.innerText
        if (text == '>') {
          this.pageNumber = parseInt(this.pageNumber) + 1
        }
        if (text == '<') {
          this.pageNumber = parseInt(this.pageNumber) - 1
        }
        if (parseInt(text)) {
          this.pageNumber = parseInt(text)
        }
      }
    }
  }
}
</script>

