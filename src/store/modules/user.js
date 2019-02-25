import { loginByUsername, logout, getUserInfo } from '@/api/login'
import { changePassword } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.userName.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => {
          const responseData = response.data
          if (!responseData.success) {
            reject(responseData.message)
          } else {
            commit('SET_TOKEN', responseData.data.token)
            setToken(responseData.data.token)
            resolve()
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(response => {
          // 由于mockjs 不支持自定义状态码只能这样hack
          if (!response.data) {
            reject('Verification failed, please login again.')
          }
          debugger
          const responseData = response.data
          const user = responseData.data
          if (user.roles && user.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', user.roles)
          } else {
            reject('getInfo: roles must be a non-null array!')
          }

          commit('SET_NAME', user.userName)
          commit('SET_AVATAR', user.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit, dispatch }, role) {
      return new Promise(resolve => {
        debugger
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          debugger
          const user = response.data.data
          commit('SET_ROLES', user.roles)
          commit('SET_NAME', user.userName)
          commit('SET_AVATAR', user.avatar)
          dispatch('GenerateRoutes', user) // 动态修改权限后 重绘侧边菜单
          resolve()
        })
      })
    },

    // 修改密码
    changePassword(data) {
      return new Promise((resolve, reject) => {
        changePassword(data.originPassword, data.password).then(response => {
          const responseData = response.data
          if (!responseData.success) {
            reject(responseData.message)
          } else {
            resolve()
          }
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default user
