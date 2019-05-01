<template>
  <div v-loading="listLoading" class="container">
    <el-form ref="ruleForm" :disabled="disabled" :model="ruleForm" :rules="formRules" label-width="100px">
      <el-row>
        <el-col :span="12">
          <div class="leftblock">
            <div class="itemcontainer">
              <span class="demonstration">产品基本属性</span>
              <el-form-item label="名称" prop="name">
                <el-input v-model="ruleForm.name" maxlength="30" show-word-limit/>
              </el-form-item>
              <el-form-item label="型号" prop="code">
                <el-input v-model="ruleForm.code" maxlength="30" show-word-limit/>
              </el-form-item>
              <el-row>
                <el-col :span="12" style="text-align:left;"><el-form-item label="产品分类" prop="catalogIds">
                  <el-cascader
                    :show-all-levels="false"
                    v-model="ruleForm.catalogIds"
                    :options="catalogList"
                    :props="props"
                    placeholder="请选择或者搜索"
                    expand-trigger="hover"
                    filterable/>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="规格" prop="spec">
                    <el-input v-model="ruleForm.spec" maxlength="30" show-word-limit/>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="rightblock">
            <span class="demonstration">产品图片<div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div></span>
            <el-row>
              <el-col :span="6">
                <el-upload
                  ref="imgUrl"
                  :file-list="img1List"
                  :action="action"
                  :show-file-list="false"
                  :on-success="image1OnSuccess"
                  :on-remove="image1OnRemove"
                  :on-error="image1OnError"
                  :before-upload="beforeUpload"
                  class="product-uploader"
                  list-type="picture-card">
                  <i v-if="!ruleForm.imgUrl" class="el-icon-plus"><span class="demonstration">主图</span></i>
                  <upload-item v-if="ruleForm.imgUrl" />
                </el-upload>
              </el-col>
              <el-col :span="6">
                <el-upload
                  ref="imgUrlA"
                  :file-list="img2List"
                  :action="action"
                  :show-file-list="false"
                  :on-success="image2OnSuccess"
                  :on-remove="image2OnRemove"
                  :on-error="image2OnError"
                  :before-upload="beforeUpload"
                  class="product-uploader"
                  list-type="picture-card">
                  <i v-if="!ruleForm.imgUrlA" class="el-icon-plus"><span class="demonstration">副图1</span></i>
                  <upload-item v-if="ruleForm.imgUrlA" />
                </el-upload>
              </el-col>
              <el-col :span="6">

                <el-upload
                  ref="imgUrlB"
                  :file-list="img3List"
                  :action="action"
                  :show-file-list="false"
                  :on-success="image3OnSuccess"
                  :on-remove="image3OnRemove"
                  :on-error="image3OnError"
                  :before-upload="beforeUpload"
                  class="product-uploader"
                  list-type="picture-card">
                  <i v-if="!ruleForm.imgUrlB" class="el-icon-plus"><span class="demonstration">副图2</span></i>
                  <upload-item v-if="ruleForm.imgUrlB" />
                </el-upload>
              </el-col>
              <el-col :span="6">
                <el-upload
                  ref="imgUrlC"
                  :file-list="img4List"
                  :action="action"
                  :show-file-list="false"
                  :on-success="image4OnSuccess"
                  :on-remove="image4OnRemove"
                  :on-error="image4OnError"
                  :before-upload="beforeUpload"
                  class="product-uploader"
                  list-type="picture-card">
                  <i v-if="!ruleForm.imgUrlC" class="el-icon-plus"><span class="demonstration">副图3</span></i>
                  <upload-item v-if="ruleForm.imgUrlC" />
                </el-upload>
              </el-col>
            </el-row>

          </div>
        </el-col>
      </el-row>

      <div class="block">
        <span class="demonstration">产品详情描述</span>
        <tinymce ref="tinymce" :height="300" v-model="ruleForm.content" menubar="edit insert view format table" />
      </div>
      <el-row>
        <el-col :span="24">
          <div class="block">
            <span class="demonstration">网页SEO</span>
            <div class="itemcontainer">
              <el-form-item label="Keyword" prop="keyword">
                <el-input v-model="ruleForm.keyword"/>
              </el-form-item>
              <el-form-item label="Description" prop="description">
                <el-input v-model="ruleForm.description" :rows="3" type="textarea"/>
              </el-form-item>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item v-if="!disabled">
            <el-button :loading="listLoading" type="primary" @click="submitForm('ruleForm',false)">保存</el-button>
            <el-button :loading="listLoading" type="primary" @click="submitForm('ruleForm',true)">保存并复制</el-button>
            <el-button @click="resetForm()">重置</el-button>
          </el-form-item>

        </el-col>
      </el-row>
    </el-form>
    <div v-if="disabled" class="filter-container">
      <el-button @click="reload()">重新加载</el-button>
    </div>
  </div>
</template>
<script>
import Tinymce from '@/components/Tinymce'
import { getProps, addProduct, updateProduct, getProduct } from '@/api/product'
import { bisError, bisSuccess, uploadUrl, fullImageUrl } from '@/api/util'
import UploadItem from '@/components/Upload/uploadItem'
export default {
  name: 'ProductAdd',
  components: { Tinymce, UploadItem },
  data() {
    return {
      mode: 'add',
      disabled: false,
      listLoading: false,
      catalogOptions: [],
      props: {
        value: 'id',
        label: 'name'
      },
      formRules: {
        name: [{ required: true, trigger: 'blur', message: '名称是必填选，不能为空' }],
        code: [{ required: true, trigger: 'blur', message: '型号是必填选，不能为空' }],
        catalogIds: [{ type: 'array', required: true, trigger: 'change', message: '产品类别是必选项' }]
      },
      ruleForm: {
        id: '',
        code: '',
        name: '',
        spec: '',
        barcode: '',
        imgUrl: '',
        imgUrlA: '',
        imgUrlB: '',
        imgUrlC: '',
        catalogIds: [],
        content: '',
        keyword: '',
        description: ''
      }
    }
  },
  computed: {
    catalogList() {
      return this.catalogOptions
    },
    action() {
      return uploadUrl()
    },
    img1List() {
      if (this.ruleForm.imgUrl) {
        return [{ url: fullImageUrl(this.ruleForm.imgUrl) }]
      }
      return []
    },
    img2List() {
      if (this.ruleForm.imgUrlA) {
        return [{ url: fullImageUrl(this.ruleForm.imgUrlA) }]
      }
      return []
    },
    img3List() {
      if (this.ruleForm.imgUrlB) {
        return [{ url: fullImageUrl(this.ruleForm.imgUrlB) }]
      }
      return []
    },
    img4List() {
      if (this.ruleForm.imgUrlC) {
        return [{ url: fullImageUrl(this.ruleForm.imgUrlC) }]
      }
      return []
    }
  },
  created() {
    this.getProductProps()
    if (this.$route.query.mode) {
      this.mode = this.$route.query.mode
    }
    if (this.$route.query.id) {
      this.ruleForm.id = this.$route.query.id
      this.initForm()
    }
  },
  methods: {
    reload() {
      this.disabled = false
      this.getProductProps()
      this.resetForm()
    },
    getProductProps() {
      this.listLoading = true
      getProps().then(response => {
        this.listLoading = false
        if (response.data.catalogs) {
          this.catalogOptions = response.data.catalogs
        }
      }).catch(error => {
        this.listLoading = false
        this.disabled = true
        bisError(error)
      })
    },
    initForm() {
      if (this.ruleForm.id) {
        this.listLoading = true
        getProduct(this.ruleForm.id).then(response => {
          this.listLoading = false
          if (response.success) {
            this.ruleForm = response.data
          } else {
            bisError(response)
            this.disabled = true
          }
        }).catch(error => {
          this.listLoading = false
          bisError(error)
          this.disabled = true
        })
      }
    },
    image1OnSuccess(response, file, fileList) {
      this.imageOnSuccess('imgUrl', response, file, fileList)
    },
    image2OnSuccess(response, file, fileList) {
      this.imageOnSuccess('imgUrlA', response, file, fileList)
    },
    image3OnSuccess(response, file, fileList) {
      this.imageOnSuccess('imgUrlB', response, file, fileList)
    },
    image4OnSuccess(response, file, fileList) {
      this.imageOnSuccess('imgUrlC', response, file, fileList)
    },
    imageOnSuccess(field, response, file, fileList) {
      if (response.success) {
        this.ruleForm[field] = response.data[0].url
      } else {
        this.ruleForm[field] = ''
        this.$refs[field].clearFiles()
        bisError(response)
      }
    },
    image1OnError(err, file, fileList) {
      this.imageOnError('imgUrl', err, file, fileList)
    },
    image2OnError(err, file, fileList) {
      this.imageOnError('imgUrlA', err, file, fileList)
    },
    image3OnError(err, file, fileList) {
      this.imageOnError('imgUrlB', err, file, fileList)
    },
    image4OnError(err, file, fileList) {
      this.imageOnError('imgUrlC', err, file, fileList)
    },
    imageOnError(field, err, file, fileList) {
      this.ruleForm[field] = ''
      this.$refs[field].clearFiles()
      bisError(err)
    },
    image1OnRemove(file, fileList) {
      this.imageOnRemove('imgUrl', file, fileList)
    },
    image2OnRemove(file, fileList) {
      this.imageOnRemove('imgUrlA', file, fileList)
    },
    image3OnRemove(file, fileList) {
      this.imageOnRemove('imgUrlB', file, fileList)
    },
    image4OnRemove(file, fileList) {
      this.imageOnRemove('imgUrlC', file, fileList)
    },
    imageOnRemove(field, file, fileList) {
      this.ruleForm[field] = ''
      this.$refs[field].clearFiles()
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 < 500
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 或者 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 500KB!')
      }
      return isJPG && isLt2M
    },
    submitForm(formName, copy) {
      let modeAction = addProduct
      if (this.mode === 'edit') {
        modeAction = updateProduct
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.listLoading = true
          modeAction(this.ruleForm).then(response => {
            this.listLoading = false
            this.visible = false
            if (this.mode === 'edit') {
              this.$emit('modified', response)
              bisSuccess('产品修改成功！')
            } else {
              this.$emit('created', response)
              bisSuccess('产品添加成功！')
            }
            if (!copy) {
              this.resetForm()
            }
          }).catch((error) => {
            console.log(error)
            this.listLoading = false
            if (!error.sucess && error.errorCode) {
              switch (error.errorCode) {
                default :
                  bisError(error)
              }
            } else {
              bisError(error)
            }
            return false
          })
        } else {
          this.listLoading = false
          return false
        }
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
      this.imageOnRemove('imgUrl')
      this.imageOnRemove('imgUrlA')
      this.imageOnRemove('imgUrlB')
      this.imageOnRemove('imgUrlC')
      this.ruleForm.content = ''
      this.$refs.tinymce.setContent('')
      this.listLoading = false
      this.initForm()
    }
  }
}
</script>
<style scoped>
.container {
padding: 24px;
}
.container .itemcontainer{
padding:0px 24px 0px 0px;
}
.container .demonstration {
    display: block;
    color: #8492a6;
    font-size: 14px;
    margin-bottom: 20px;
}
.container .block {
    padding: 20px 0;
    text-align: center;
    display: block;
    width: 100%;
    box-sizing: border-box;
}
.container .leftblock {
    padding: 20px 0;
    text-align: center;
    border-right: 1px solid #eff2f6;
    display: inline-block;
    width: 100%;
    box-sizing: border-box;
}
.container .rightblock {
    padding: 20px 0;
    text-align: center;
    display: inline-block;
    width: 100%;
    box-sizing: border-box;
}
</style>

