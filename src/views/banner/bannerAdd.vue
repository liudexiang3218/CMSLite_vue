<template>
  <div v-loading="listLoading" class="container">
    <el-form ref="ruleForm" :disabled="disabled" :model="ruleForm" :rules="formRules" label-width="100px">
      <div class="block">
        <div class="itemcontainer">
          <span class="demonstration">基本属性</span>
          <el-form-item label="标题" prop="title">
            <el-input v-model="ruleForm.title" maxlength="30" show-word-limit/>
          </el-form-item>
          <el-form-item label="描述" prop="content">
            <el-input v-model="ruleForm.content" maxlength="200" show-word-limit/>
          </el-form-item>
          <el-form-item label="超链接" prop="link">
            <el-input v-model="ruleForm.link" maxlength="225" show-word-limit/>
          </el-form-item>
          <el-form-item label="是否隐藏" prop="del" style="text-align:left;">
            <el-switch v-model="ruleForm.del"/>
          </el-form-item>
        </div>
      </div>
      <div class="block">
        <el-form-item label="Banner图" prop="imgUrl">
          <el-upload
            :file-list="imgList"
            :action="action"
            :show-file-list="false"
            :on-success="image1OnSuccess"
            :on-remove="image1OnRemove"
            :on-error="image1OnError"
            :before-upload="beforeUpload"
            class="avatar-uploader"
            list-type="picture-card">
            <i v-if="!ruleForm.imgUrl" class="el-icon-plus"/>
            <upload-item v-if="ruleForm.imgUrl" />
          </el-upload>
        </el-form-item>
      </div>
      <el-row>
        <el-col :span="24">
          <el-form-item v-if="!disabled">
            <el-button :loading="listLoading" type="primary" @click="submitForm('ruleForm',false)">保存</el-button>
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
import { add, update, get } from '@/api/cms'
import { bisError, bisSuccess, uploadUrl, fullImageUrl } from '@/api/util'
import UploadItem from '@/components/Upload/uploadItem'
export default {
  name: 'BannerAdd',
  inject: ['layout'],
  components: { UploadItem },
  data() {
    return {
      mode: 'add',
      disabled: false,
      listLoading: false,
      formRules: {
        title: [{ required: true, trigger: 'blur', message: '标题必填选，不能为空' }],
        imgUrl: [{ required: true, trigger: 'blur', message: 'Banner图必填选，不能为空' }]
      },
      ruleForm: {
        id: '',
        title: '',
        content: '',
        imgUrl: '',
        link: '',
        del: false
      }
    }
  },
  computed: {
    action() {
      return uploadUrl()
    },
    imgList() {
      if (this.ruleForm.imgUrl) {
        return [{ url: fullImageUrl(this.ruleForm.imgUrl) }]
      }
      return []
    }
  },
  created() {
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
      this.resetForm()
    },
    initForm() {
      if (this.ruleForm.id) {
        this.listLoading = true
        get('banner', this.ruleForm.id).then(response => {
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
      const isLt2M = file.size / 1024 < 750
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 或者 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 750KB!')
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
          modeAction('banner', this.ruleForm).then(response => {
            this.listLoading = false
            this.visible = false
            if (this.mode === 'edit') {
              this.$emit('modified', response)
              bisSuccess('banner修改成功！')
            } else {
              this.$emit('created', response)
              bisSuccess('banner添加成功！')
            }
            if (!copy) {
              if (this.layout) {
                this.layout.closeSelectedTag(this.$route)
              }
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
      this.listLoading = false
      this.initForm()
    }
  }
}
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader .el-upload--picture-card{
    width: 633px;
    height: 360px;
  }
  .avatar-uploader .el-upload-list__item{
    width: 633px;
    height: 360px;
  }
</style>

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
</style>

