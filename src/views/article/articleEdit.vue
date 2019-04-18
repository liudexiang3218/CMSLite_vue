<template>
  <div v-loading="listLoading" class="container">
    <el-form ref="ruleForm" :disabled="disabled" :model="ruleForm" :rules="formRules" label-width="100px">
      <el-row>
        <el-col :span="12">
          <div class="leftblock">
            <div class="itemcontainer">
              <el-form-item label="标题" prop="title">
                <el-input v-model="ruleForm.title" maxlength="36"/>
              </el-form-item>
              <el-form-item label="简约描述" prop="spec">
                <el-input v-model="ruleForm.spec" :rows="3" type="textarea"/>
              </el-form-item>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="rightblock">
            <span class="demonstration">文章封面图<div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div></span>
            <el-row>
              <el-col>
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
                  <i v-if="!ruleForm.imgUrl" class="el-icon-plus"><span class="demonstration">封面</span></i>
                  <upload-item v-if="ruleForm.imgUrl" />
                </el-upload>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <div class="block">
        <span class="demonstration">文章内容</span>
        <tinymce ref="tinymce" :height="300" v-model="ruleForm.content" menubar="edit insert view format table" />
      </div>
      <el-row>
        <el-col :span="24">
          <div style="text-align: right;">
            <el-form-item v-if="!disabled">
              <el-button :loading="listLoading" type="primary" @click="submitForm('ruleForm',false)">保存</el-button>
              <el-button type="primary" @click="$emit('close')">关闭</el-button>
              <el-button @click="resetForm()">重置</el-button>
            </el-form-item>
          </div>
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
import { get, update, add } from '@/api/cms'
import { bisError, bisSuccess, uploadUrl, fullImageUrl } from '@/api/util'
import UploadItem from '@/components/Upload/uploadItem'
export default {
  name: 'ArticleAdd',
  components: { Tinymce, UploadItem },
  props: {
    id: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      mode: 'add',
      disabled: false,
      listLoading: false,
      formRules: {
        title: [{ required: true, trigger: 'blur', message: '标题是必填选，不能为空' }]
      },
      ruleForm: {
        id: '',
        title: '',
        spec: '',
        imgUrl: '',
        content: ''
      }
    }
  },
  computed: {
    action() {
      return uploadUrl()
    },
    img1List() {
      if (this.ruleForm.imgUrl) {
        return [{ url: fullImageUrl(this.ruleForm.imgUrl) }]
      }
      return []
    }
  },
  created() {
    if (this.id && this.id !== '0') {
      this.mode = 'edit'
      this.ruleForm.id = this.id
      this.initForm()
    } else {
      this.mode = 'add'
    }
  },
  methods: {
    reload() {
      this.disabled = false
      this.resetForm()
    },
    initForm() {
      if (this.ruleForm.id) {
        this.listLoading = true
        get('article', this.ruleForm.id).then(response => {
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
    imageOnError(field, err, file, fileList) {
      this.ruleForm[field] = ''
      this.$refs[field].clearFiles()
      bisError(err)
    },
    image1OnRemove(file, fileList) {
      this.imageOnRemove('imgUrl', file, fileList)
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
      let modeAction = add
      if (this.mode === 'edit') {
        modeAction = update
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.listLoading = true
          modeAction('article', this.ruleForm).then(response => {
            this.listLoading = false
            this.visible = false
            if (this.mode === 'edit') {
              this.$emit('modified', response)
              bisSuccess('修改成功！')
            } else {
              this.$emit('created', response)
              bisSuccess('添加成功！')
            }
          }).catch((error) => {
            debugger
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

