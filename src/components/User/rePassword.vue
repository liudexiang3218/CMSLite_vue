<template>
  <div>
    <el-form v-show="visible" ref="ruleForm" :model="ruleForm" label-width="100px">
      <password :model="ruleForm" :rules="passwordRules" :error="passwordError" label="原密码" prop="originPassword"/>
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
import { Message } from 'element-ui'
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
      visible: true,
      passwordError: ''
    }
  },
  methods: {
    submitForm(formName) {
      this.passwordError = ''
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('changePassword', this.ruleForm).then(() => {
            this.loading = false
            this.visible = false
          }).catch((error) => {
            console.log(error)
            this.loading = false
            if (!error.sucess && error.errorCode) {
              switch (error.errorCode) {
                case 20003:
                  this.passwordError = error.message
                  break
                default :
                  Message({
                    message: error.message,
                    type: 'error',
                    duration: 5 * 1000,
                    showClose: true
                  })
              }
            }
            return false
          })
        } else {
          console.log('error submit!!')
          this.loading = false
          return false
        }
      })
    },
    resetForm() {
      this.passwordError = ''
      this.$refs.ruleForm.resetFields()
      this.visible = true
      this.loading = false
    }
  }
}
</script>
