import { param2Obj } from '@/utils'

const userMap = {
  admin: {
    success: true,
    errorCode: 10000,
    data: {
      roles: ['admin'],
      token: 'admin',
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      userName: 'Super Admin',
      expireAt: '2020-01-01 00:00:00'
    }
  },
  loginError: {
    success: false,
    errorCode: 10005,
    message: '账号或者密码错误!'
  },
  Success: {
    success: true,
    errorCode: 10000,
    message: ''
  },
  Error: {
    success: false,
    errorCode: 10001,
    message: '发生错误'
  },
  editor: {
    success: true,
    errorCode: 10000,
    data: {
      roles: ['editor'],
      token: 'editor',
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      userName: 'Normal Editor',
      expireAt: '2020-01-01 00:00:00'
    }
  }
}

export default {
  loginByUsername: config => {
    const { userName } = JSON.parse(config.body)
    return userMap[userName]
  },
  getUserInfo: config => {
    const { token } = param2Obj(config.url)
    if (userMap[token]) {
      return userMap[token]
    } else {
      return false
    }
  },
  logout: () => 'success',
  changePassword: config => {
    return userMap['Error']
  }
}
