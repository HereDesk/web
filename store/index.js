import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export const state = () => ({
    userInfo: false,
    PageData: false,
    UserConfig: [],
    isLogin: false,
    ProductInfo: [],
    isProductInfo: false,
    BugProperty: {},
    ProductMemberList: {},
    ProductVersionInfo: {},
    ProductModulesInfo: {}
})

export const mutations = {
    setProductVersionInfo(state, data) {
        state.ProductVersionInfo = data
    },
    setProductModulesInfo(state, data) {
        state.ProductModulesInfo = data
    },
    setLoginInfo(state, data) {
        state.isLogin = true
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
        state.isProductInfo = true
        state.ProductInfo = data
    },
    setBugPropery(state, data) {
        state.BugProperty = data
    },
    setProductMemberList(state, data) {
        state.ProductMemberList = data
    }
}

export const actions = {
    async getUserInfo({ commit }) {
        const { data } = await axios.get('/api/user/userinfo')
        commit('setUserInfo', data)
    },
    async getPageData({ commit }, product_id) {
        const { data } = await axios.get('/api/user/pages?product_id=' + product_id)
        commit('setPageData', data)
    },
    async getProductRelease({ commit }) {
        const { data } = await axios.get('/api/pm/product/my')
        commit('setProductInfo', data)
    },
    async getProductMembers({ commit }, product_id) {
        const { data } = await axios.get('/api/pm/member/list?product_id=' + product_id)
        commit('setProductMemberList', data)
    },
    async getBugProperty({ commit }) {
        const { data } = await axios.get('/api/qa/bug/bug_property')
        commit('setBugPropery', data)
    }
}