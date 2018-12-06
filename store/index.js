import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const createStore = () => {
  return new Vuex.Store({
    state: {
      userInfo: false,
      PageData: false,
      UserConfig: [],
      isLogin: false,
      ProductInfo: [],
      isProductInfo: false,
      BugProperty: {},
      ProductMemberList: false
    },
    mutations: {
      setUserInfo(state, data) {
        if (data) {
          state.isLogin = true
          state.userInfo = data['data']
          state.UserConfig = data['config']
        }
      },
      setPageData(state, data) {
        if (data) {
          state.PageData = data['data']
        }
      },
      setProductInfo(state, data) {
        if (data) {
          state.isProductInfo = true
          state.ProductInfo = data
        }
      },
      setBugPropery(state, data) {
        if (data) {
          state.BugProperty = data
        }
      },
      setProductMemberList(state,data) {
        if (data) {
          state.ProductMemberList = data
        }
      }
    },
    actions: {
      async getUserInfo({ commit }) {
        const { data } = await axios.get('/api/user/userinfo')
        commit('setUserInfo', data)
      },
      async getPageData({ commit }) {
        const { data } = await axios.get('/api/user/pages')
        commit('setPageData', data)
      },
      async getProductRelease({ commit }) {
        const { data } = await axios.get('/api/pm/product_release')
        commit('setProductInfo', data)
      },
      async getBugProperty({ commit }) {
        const { data } = await axios.get('/api/qa/bug/bug_property')
        commit('setBugPropery', data)
      }
    }
  })
}

export default createStore
