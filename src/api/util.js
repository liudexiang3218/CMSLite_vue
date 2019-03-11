import { Message } from 'element-ui'

export function bisError(error) {
  if (error && !error.success && error.errorCode) {
    if (error.errorCode > 19999) {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000,
        showClose: true
      })
    }
  }
}

