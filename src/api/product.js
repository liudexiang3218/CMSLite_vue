import request from '@/utils/request'
export function addCatalog(data) {
  return request({
    url: '/catalog/add',
    method: 'post',
    data
  })
}
export function getCatalogTree(data) {
  return request({
    url: '/catalog/tree',
    method: 'post',
    data
  })
}
export function deleteCatalogs(data) {
  debugger
  return request({
    url: '/catalog/del',
    method: 'post',
    data
  })
}
export function unDeleteCatalogs(data) {
  return request({
    url: '/catalog/undel',
    method: 'post',
    data
  })
}

