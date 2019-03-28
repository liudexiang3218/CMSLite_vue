<template>
  <div v-loading="listLoading" class="container">
    <el-form ref="ruleForm" :disabled="disabled" :model="ruleForm" :rules="formRules" label-width="100px">
      <div class="block">
        <div class="itemcontainer">
          <span class="demonstration">基本属性</span>
          <el-form-item label="名称" prop="name">
            <el-input v-model="ruleForm.name" maxlength="30"/>
          </el-form-item>
        </div>
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
import { add, update } from '@/api/cms'
import { bisError, bisSuccess } from '@/api/util'
export default {
  name: 'ComProductAdd',
  props: {
    id: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    mode: {
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
      disabled: false,
      listLoading: false,
      formRules: {
        name: [{ required: true, trigger: 'blur', message: '名称是必填选，不能为空' }]
      },
      ruleForm: {
        id: this.id,
        name: this.name
      }
    }
  },
  created() {
    this.initForm()
  },
  methods: {
    reload() {
      this.disabled = false
      this.resetForm()
    },
    initForm() {

    },
    submitForm(formName, copy) {
      let modeAction = add
      if (this.mode === 'edit') {
        modeAction = update
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.listLoading = true
          modeAction('comproduct', this.ruleForm).then(response => {
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

