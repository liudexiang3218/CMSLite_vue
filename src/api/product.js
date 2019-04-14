import request from '@/utils/request'
export function addCatalog(data) {
  return request({
    url: '/catalog/add',
    method: 'post',
    data
  })
}
export function updateCatalog(data) {
  return request({
    url: '/catalog/update',
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
export function upCatalog(id) {
  return request({
    url: '/catalog/up',
    method: 'post',
    params: { id }
  })
}
export function downCatalog(id) {
  return request({
    url: '/catalog/down',
    method: 'post',
    params: { id }
  })
}
export function getProps() {
  return request({
    url: '/product/props',
    method: 'get'
  })
}
export function addProduct(data) {
  return request({
    url: '/product/add',
    method: 'post',
    data
  })
}
export function deleteProducts(data) {
  return request({
    url: '/product/del',
    method: 'post',
    data
  })
}
export function unDeleteProducts(data) {
  return request({
    url: '/product/undel',
    method: 'post',
    data
  })
}
export function updateProduct(data) {
  return request({
    url: '/product/update',
    method: 'post',
    data
  })
}
export function getProducts(data) {
  return request({
    url: '/product/list',
    method: 'post',
    data
  })
}
export function getProduct(id) {
  return request({
    url: '/product/get',
    method: 'get',
    params: { id: id }
  })
}

