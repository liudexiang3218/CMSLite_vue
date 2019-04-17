import request from '@/utils/request'
export function up(table, id) {
  return request({
    url: '/' + table + '/up',
    method: 'post',
    params: { id }
  })
}
export function down(table, id) {
  return request({
    url: '/' + table + '/down',
    method: 'post',
    params: { id }
  })
}
export function add(table, data) {
  return request({
    url: '/' + table + '/add',
    method: 'post',
    data
  })
}
export function deletes(table, data) {
  return request({
    url: '/' + table + '/del',
    method: 'post',
    data
  })
}
export function unDeletes(table, data) {
  return request({
    url: '/' + table + '/undel',
    method: 'post',
    data
  })
}
export function update(table, data) {
  return request({
    url: '/' + table + '/update',
    method: 'post',
    data
  })
}
export function gets(table, data) {
  return request({
    url: '/' + table + '/list',
    method: 'post',
    data
  })
}
export function get(table, id) {
  return request({
    url: '/' + table + '/get',
    method: 'get',
    params: { id: id }
  })
}
export function getPath(table, id, path) {
  return request({
    url: '/' + table + '/' + path,
    method: 'get',
    params: { id: id }
  })
}
export function status(table, data) {
  return request({
    url: '/' + table + '/status',
    method: 'post',
    data
  })
}

