import request from '@/utils/request'

export function changePassword(originPassword, password) {
  const data = {
    originPassword,
    password
  }
  return request({
    url: '/user/changepassword',
    method: 'post',
    data
  })
}

