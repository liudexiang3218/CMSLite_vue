<template>
  <div>
    <el-form v-show="visible" ref="ruleForm" :rules="rules" :model="ruleForm" status-icon label-width="100px">
      <el-form-item label="原密码" prop="originPassword">
        <el-input v-model="ruleForm.originPassword" type="password" autocomplete="off"/>
      </el-form-item>
      <check-re-password :form-model="ruleForm"/>
      <el-form-item>
        <el-button :loading="loading" type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
    <span v-show="!visible">
      <p class="warn-content">
        密码已修改成功，请牢记您的新密码！
      </p>
    </span>
  </div>
</template>
<script>
import CheckRePassword from '@/components/User/checkRePassword'
export default {
  name: 'RePassword',
  components: {
    CheckRePassword
  },
  data() {
    var validateOriginPasswordd = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('原密码不能为空'))
      }
      callback()
    }
    return {
      ruleForm: {
        password: '',
        checkPassword: '',
        originPassword: ''
      },
      rules: {
        originPassword: [
          { validator: validateOriginPasswordd, trigger: 'blur' }
        ]
      },
      loading: false,
      visible: true
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('changePassword', this.ruleForm).then(() => {
            this.loading = false
            this.visible = false
          }).catch((error) => {
            this.loading = false
            this.$message({
              message: error,
              type: 'error',
              showClose: true,
              duration: 5000
            })
          })
        } else {
          console.log('error submit!!')
          this.loading = false
          return false
        }
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
      this.visible = true
      this.loading = false
    }
  }
}
</script>
