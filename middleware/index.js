import axios from 'axios'

import {
  getUserFromCookie,
  getUserFromLocalStorage
} from '~/assets/js/auth'

axios.defaults.timeout = 100000
axios.defaults.withCredentials = true
// axios.defaults.baseURL = 'http://127.0.0.1:8000/'

axios.interceptors.request.use(function (config, context) {
  var url = config.url
  const token = process.server ? getUserFromCookie(config) : getUserFromLocalStorage()
  if (url.indexOf('login') < 0) {
    if (token) {
      config.headers.Authorization = `token ${token}`
    }
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
  if (process.client) {
    let status = response.data['status']
    if (status === 14444) {
      window.location.replace('/error/auth_forbidden')
    }
    if (status === 14404 || status === 14402 || status === 14403) {
      window.localStorage.removeItem('token')
      window.localStorage.removeItem('last_visited_product_id')
      document.cookie = 'token' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;' + 'path=/'
      window.location.replace('/')
    }
  }
  return response
}, function (error) {
  return Promise.reject(error)
})
