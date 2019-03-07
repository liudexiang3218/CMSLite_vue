import request from '@/utils/request'

export function changePassword(originPassword, password) {
  const data = { originPassword, password }
  return request({
    url: '/user/changepassword',
    method: 'post',
    data
  })
}
export function addUser(data) {
  return request({
    url: '/user/add',
    method: 'post',
    data
  })
}
export function deleteUsers(data) {
  return request({
    url: '/user/del',
    method: 'post',
    data
  })
}
export function updateUser(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}
export function getUsers(data) {
  return request({
    url: '/user/list',
    method: 'post',
    data
  })
}

