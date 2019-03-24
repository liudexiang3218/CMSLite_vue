import request from '@/utils/request'
export function upBanner(id) {
  return request({
    url: '/banner/up',
    method: 'post',
    params: { id }
  })
}
export function downBanner(id) {
  return request({
    url: '/banner/down',
    method: 'post',
    params: { id }
  })
}
export function addBanner(data) {
  return request({
    url: '/banner/add',
    method: 'post',
    data
  })
}
export function deleteBanners(data) {
  debugger
  return request({
    url: '/banner/del',
    method: 'post',
    data
  })
}
export function unDeleteBanners(data) {
  return request({
    url: '/banner/undel',
    method: 'post',
    data
  })
}
export function updateBanner(data) {
  return request({
    url: '/banner/update',
    method: 'post',
    data
  })
}
export function getBanners(data) {
  return request({
    url: '/banner/list',
    method: 'post',
    data
  })
}
export function getBanner(id) {
  return request({
    url: '/banner/get',
    method: 'get',
    params: { id: id }
  })
}

