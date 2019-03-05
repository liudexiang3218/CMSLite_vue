<template>
  <div>
    <password :model="formModel" :rules="passwordRules" label="新密码" prop="password"/>
    <password ref="checkPassword" :model="formModel" :rules="checkPasswordRules" label="确认新密码" prop="checkPassword"/>
  </div>
</template>
<script>
import Password from '@/components/User/password'
export default {
  name: 'CheckRePassword',
  components: {
    Password
  },
  props: {
    formModel: {
      type: Object,
      required: true
    }
  },
  data() {
    var validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (value.length < 6) {
          callback(new Error(this.$t('login.passwordTip')))
        } else {
          if (this.formModel.checkPassword !== '') {
            this.$refs.checkPassword.validate('')
          }
          callback()
        }
      }
    }
    var validateCheckPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.formModel.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      passwordRules: [
        { required: true, validator: validatePassword, trigger: 'blur' }
      ],
      checkPasswordRules: [
        { required: true, validator: validateCheckPassword, trigger: 'blur' }
      ]
    }
  }
}
</script>
