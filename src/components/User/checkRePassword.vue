<template>
  <div>
    <el-form-item :rules="passwordRules" label="新密码" prop="password">
      <el-input v-model="formModel.password" type="password" autocomplete="off"/>
    </el-form-item>
    <el-form-item ref="checkPassword" :rules="checkPasswordRules" label="确认密码" prop="checkPassword">
      <el-input v-model="formModel.checkPassword" type="password" autocomplete="off"/>
    </el-form-item>
  </div>
</template>
<script>
export default {
  name: 'CheckRePassword',
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
        callback(new Error('请再次输入密码'))
      } else if (value !== this.formModel.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      passwordRules: [
        { validator: validatePassword, trigger: 'blur' }
      ],
      checkPasswordRules: [
        { validator: validateCheckPassword, trigger: 'blur' }
      ]
    }
  }
}
</script>
