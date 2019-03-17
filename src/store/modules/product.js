import { addCatalog } from '@/api/product'
const product = {
  actions: {
    // 添加分类
    createCatalog(context, info) {
      return new Promise((resolve, reject) => {
        addCatalog(info).then(response => {
          if (!response.success) {
            reject(response.message)
          } else {
            resolve(response.data)
          }
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
export default product
