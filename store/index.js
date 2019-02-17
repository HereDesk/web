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
      ProductMemberList: false,
      ProductVersionInfo: {},
      ProductModulesInfo: {},
    },
    mutations: {
      setProductVersionInfo(state, data) {
        if (data) {
          state.ProductVersionInfo = data
        }
      },
      setProductModulesInfo(state, data) {
        if (data) {
          state.ProductModulesInfo = data
        }
      },
      setLoginInfo(state, data) {
        if (data) {
          state.isLogin = true
        }
      },
      setUserInfo(state, data) {
        if (data) {
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
      async getPageData({ commit },product_id) {
        const { data } = await axios.get('/api/user/pages?product_id=' + product_id)
        commit('setPageData', data)
      },
      async getProductRelease({ commit }) {
        const { data } = await axios.get('/api/pm/product/my') 
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
