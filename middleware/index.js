import axios from 'axios'

import {
  getUserFromCookie,
  getUserFromLocalStorage
} from '~/assets/js/auth'

axios.defaults.timeout = 100000
axios.defaults.withCredentials = true

axios.interceptors.request.use(function (config) {
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
  if (process.browser) {
    if (response.data['status'] === 14444) {
      window.location.replace('/app/forbidden_auth')
    }
    if (response.data['status'] === 14404 || response.data['status'] === 14402) {
      window.localStorage.removeItem('token')
      document.cookie = 'token' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;' + 'path=/'
      window.location.replace('/')
    }
  }
  return response
}, function (error) {
  if (process.browser) {
    window.location.replace('/error')
  }
  return Promise.reject(error)
})
