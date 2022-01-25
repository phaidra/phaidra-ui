import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

export default ({ app }) => {
  axios.interceptors.request.use((config) => {
    const token =  app.$cookies.get('token')
    if (token && token !== null) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  }, function (error) {
    return Promise.reject(error)
  })
}


Vue.use(VueAxios, axios)
