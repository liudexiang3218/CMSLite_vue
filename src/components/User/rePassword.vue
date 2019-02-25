<template>
  <div>
    <el-form v-show="visible" ref="ruleForm" :model="ruleForm" :rules="rules" status-icon label-width="100px">
      <el-form-item label="原密码" prop="originPassword">
        <el-input v-model="ruleForm.originPassword" type="password" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input v-model="ruleForm.password" type="password" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPassword">
        <el-input v-model="ruleForm.checkPassword" type="password" autocomplete="off"/>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
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
export default {
  name: 'RePassword',
  data() {
    var validateOriginPasswordd = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('原密码不能为空'))
      }
      callback()
    }
    var validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (value.length < 6) {
          callback(new Error(this.$t('login.passwordTip')))
        } else {
          if (this.ruleForm.checkPassword !== '') {
            this.$refs.ruleForm.validateField('checkPassword')
          }
          callback()
        }
      }
    }
    var validateCheckPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        password: '',
        checkPassword: '',
        originPassword: ''
      },
      rules: {
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        checkPassword: [
          { validator: validateCheckPassword, trigger: 'blur' }
        ],
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
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
