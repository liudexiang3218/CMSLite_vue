import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
import { getToken, setToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (store.getters.token) {
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      config.headers['XAuthToken'] = getToken()
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response interceptor
axios.interceptors.response.use(
  response => {
    if (response.headers.XAuthToken) {
      store.commit('SET_TOKEN', response.headers.XAuthToken)
      setToken(response.headers.XAuthToken)
    }
    if (response.data.errorCode !== 10000) {
      if (response.data.errorCode === 10003) {
        router.push({
          path: '/login',
          querry: { redirect: '/' }
        })
      } else {
        Message({
          message: response.data.message,
          type: 'error',
          duration: 5 * 1000
        })
      }
    }
    return response
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
