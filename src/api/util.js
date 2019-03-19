import { Message } from 'element-ui'
import request from '@/utils/request'
export function bisError(error) {
  if (error && !error.success && error.errorCode) {
    if (error.errorCode > 19999) {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000,
        showClose: true
      })
    }
  }
}
export function postData(url, data) {
  return request({
    url: url,
    method: 'post',
    data
  })
}

