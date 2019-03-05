<template>
  <div>
    <el-form v-show="visible" ref="ruleForm" :model="ruleForm" label-width="100px">
      <password :model="ruleForm" :rules="passwordRules" label="原密码" prop="originPassword"/>
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
import Password from '@/components/User/password'
export default {
  name: 'RePassword',
  components: {
    CheckRePassword,
    Password
  },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6 || value.length > 16) {
        callback(new Error(this.$t('login.passwordTip')))
      } else {
        callback()
      }
    }
    return {
      passwordRules: [{ required: true, trigger: 'blur', validator: validatePassword }],
      ruleForm: {
        password: '',
        checkPassword: '',
        originPassword: ''
      },
      loading: false,
      visible: true
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert(this.ruleForm.originPassword)
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
