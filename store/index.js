import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const createStore = () => {
  return new Vuex.Store({
    state: {
      userInfo: {},
      UserCustomization: [],
      isLogin: false,
      ProductInfo: [],
      isProductInfo: false,
      BugProperty: {},
      BugSolutionList: false
    },
    mutations: {
      setUserInfo(state, data) {
        if (data) {
          state.isLogin = true
          state.userInfo = data['data']
          state.UserCustomization = data['config']
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
      setBugSolution(state, data) {
        if (data) {
          state.BugSolutionList = data
        }
      }
    },
    actions: {
      async getUserInfo({ commit }) {
        const { data } = await axios.get('/api/user/userinfo')
        commit('setUserInfo', data)
      },
      async getProductRelease({ commit }) {
        const { data } = await axios.get('/api/pm/product_release')
        commit('setProductInfo', data)
      },
      async getBugProperty({ commit }) {
        const { data } = await axios.get('/api/qa/bug/bug_property')
        commit('setBugPropery', data)
      },
      async getBugSolution({ commit }) {
        const { data } = await axios.get('/api/qa/bug/solution')
        commit('setBugSolution', data['data'])
      }
    }
  })
}

export default createStore
