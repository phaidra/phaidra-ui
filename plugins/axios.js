import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

export default ({ app, $sentry }) => {
  axios.interceptors.response.use(
    async response => {
      return response;
    },
    error => {
      $sentry.captureException(error)
      throw new Error(error)
    },
  );
}

Vue.use(VueAxios, axios)
