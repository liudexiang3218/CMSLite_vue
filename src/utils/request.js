import axios from 'axios'
import { Message } from 'element-ui'
import { bisError } from '@/api/util'
import store from '@/store'
import router from '@/router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
NProgress.configure({ showSpinner: false })// NProgress Configuration
// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    NProgress.start() // start progress bar
    if (store.getters.token) {
      config.headers['XAuthToken'] = store.getters.token
    }
    if (store.getters.language) {
      if (store.getters.language === 'zh') { config.headers['lang'] = 'zh_CN' } else if (store.getters.language === 'en') { config.headers['lang'] = 'en_US' }
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    NProgress.done() // finish progress bar
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
    NProgress.done() // finish progress bar
    const responseData = response.data
    if (response.headers.XAuthToken) {
      store.commit('SET_TOKEN', response.headers.XAuthToken)
    } else {
      if (responseData.data && responseData.data.token) {
        store.commit('SET_TOKEN', responseData.data.token)
      }
    }
    if (responseData.errorCode !== 10000) {
      // 1开头的errorCode为系统级别错误，统一提示错误信息。其他为应用业务级别错误,业务代码自行处理
      if (responseData.errorCode > 19999) {
        return Promise.reject(responseData)
      }
      switch (responseData.errorCode) {
        case 10003:
          router.push({
            path: '/login',
            querry: { redirect: '/' }
          })
          break
        default:
          bisError(responseData)
          return Promise.reject(responseData)
      }
    }
    return Promise.resolve(responseData)
  },
  error => {
    NProgress.done() // finish progress bar
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
      return Promise.reject(error)
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
