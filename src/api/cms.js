import request from '@/utils/request'
export function up(table, id) {
  return post(table, 'up', { id })
}
export function down(table, id) {
  return post(table, 'down', { id })
}
export function add(table, data) {
  return post(table, 'add', data)
}
export function deletes(table, data) {
  return post(table, 'del', data)
}
export function unDeletes(table, data) {
  return post(table, 'undel', data)
}
export function update(table, data) {
  return post(table, 'update', data)
}
export function status(table, data) {
  return post(table, 'status', data)
}
export function gets(table, data) {
  return post(table, 'list', data)
}
export function get(table, id) {
  return fetch(table, 'get', { id: id })
}
export function fetch(table, path, data) {
  return request({
    url: '/cms/' + table + '/' + path,
    method: 'get',
    params: data
  })
}

export function post(table, path, data) {
  return request({
    url: '/cms/' + table + '/' + path,
    method: 'post',
    data
  })
}

