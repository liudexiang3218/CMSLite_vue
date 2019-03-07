import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['XAuthToken'] = store.getters.token
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Message({
      message: error,
      type: 'error',
      duration: 5 * 1000,
      showClose: true
    })
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const responseData = response.data
    if (response.headers.XAuthToken) {
      store.commit('SET_TOKEN', response.headers.XAuthToken)
    } else {
      if (responseData.data && responseData.data.token) {
        store.commit('SET_TOKEN', responseData.data.token)
      }
    }
    if (responseData.errorCode !== 10000) {
      switch (responseData.errorCode) {
        case 10003:
          router.push({
            path: '/login',
            querry: { redirect: '/' }
          })
          break
        default:
          Message({
            message: responseData.errorCode + ' ' + responseData.message,
            type: 'error',
            duration: 5 * 1000,
            showClose: true
          })
      }
    }

    return response
  },
  error => {
    debugger
    if (error.response) {
      switch (error.response.status) {
        case 401:
          router.push({
            path: '/login',
            querry: { redirect: '/' }
          })
          break
        default :
          Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000,
            showClose: true
          })
      }
      return Promise.resolve(error)
    } else {
      console.log('err' + error) // for debug
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000,
        showClose: true
      })
    }
    return Promise.reject(error)
  }
)

export default service
