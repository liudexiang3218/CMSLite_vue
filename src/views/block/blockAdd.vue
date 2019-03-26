<template>
  <div v-loading="listLoading" class="container">
    <el-form ref="ruleForm" :disabled="disabled" :model="ruleForm" :rules="formRules" label-width="100px">
      <div class="block">
        <div class="itemcontainer">
          <span class="demonstration">基本属性</span>
          <el-form-item label="名称" prop="name">
            <el-input v-model="ruleForm.name" maxlength="30"/>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="ruleForm.description" maxlength="100"/>
          </el-form-item>
        </div>
      </div>
      <div class="block">
        <el-form-item prop="content">
          <span class="demonstration">区块代码</span>
          <tinymce ref="tinymce" :height="300" v-model="ruleForm.content" menubar="edit insert view format table" />
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
import { bisError, bisSuccess } from '@/api/util'
export default {
  name: 'BlockAdd',
  inject: ['layout'],
  data() {
    return {
      mode: 'add',
      disabled: false,
      listLoading: false,
      formRules: {
        name: [{ required: true, trigger: 'blur', message: '标题是必填选，不能为空' }],
        content: [{ required: true, trigger: 'blur', message: '区块代码是必填选，不能为空' }]
      },
      ruleForm: {
        id: '',
        name: '',
        content: '',
        description: ''
      }
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
        get('block', this.ruleForm.id).then(response => {
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
    submitForm(formName, copy) {
      let modeAction = add
      if (this.mode === 'edit') {
        modeAction = update
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.listLoading = true
          modeAction('block', this.ruleForm).then(response => {
            this.listLoading = false
            this.visible = false
            if (this.mode === 'edit') {
              this.$emit('modified', response)
              bisSuccess('修改成功！')
            } else {
              this.$emit('created', response)
              bisSuccess('添加成功！')
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

