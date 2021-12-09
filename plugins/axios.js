import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

Vue.use(VueAxios, axios)
