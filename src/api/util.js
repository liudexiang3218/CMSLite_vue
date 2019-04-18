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
export function bisErrorMsg(message) {
  Message({
    message: message,
    type: 'error',
    duration: 5 * 1000,
    showClose: true
  })
}
export function bisSuccess(message) {
  Message({
    message: message,
    type: 'success',
    duration: 5 * 1000,
    showClose: true
  })
}
export function postData(url, data) {
  return request({
    url: url,
    method: 'post',
    data
  })
}
export function uploadUrl() {
  return process.env.BASE_API + '/upload/image'
}
export function fullImageUrl(url) {
  return process.env.BASE_API + url
}
export function setSort(listQuery, order, prop) {
  if (order === 'ascending') {
    listQuery.sort = '+' + prop
  } else {
    listQuery.sort = '-' + prop
  }
}

