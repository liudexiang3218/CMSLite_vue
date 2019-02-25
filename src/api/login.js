import request from '@/utils/request'

export function loginByUsername(userName, password) {
  const data = {
    userName,
    password
  }
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/userinfo',
    method: 'get',
    params: { token }
  })
}

