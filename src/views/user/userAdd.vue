<template>
  <div>
    <el-form v-show="visible" ref="ruleForm" :rules="formRules" :model="ruleForm" label-width="100px">
      <el-form-item :label="$t('login.username')" prop="userName">
        <el-input v-model="ruleForm.userName"/>
      </el-form-item>
      <check-re-password :form-model="ruleForm"/>
      <el-form-item label="昵称" prop="nick">
        <el-input v-model="ruleForm.nick"/>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
    <span v-show="!visible">
      <p class="warn-content">
        账号{{ ruleForm.userName }}已添加成功，密码为:{{ ruleForm.password }}
      </p>
    </span>
  </div>
</template>
<script>
import { validUsername } from '@/utils/validate'
import CheckRePassword from '@/components/User/checkRePassword'
export default {
  name: 'UserAdd',
  components: {
    CheckRePassword
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error(this.$t('login.usernameTip')))
      } else {
        callback()
      }
    }
    const validateNick = (rule, value, callback) => {
      if (value.length < 0) {
        callback(new Error('昵称不能为空!'))
      } else {
        callback()
      }
    }
    return {
      formRules: {
        userName: [{ required: true, trigger: 'blur', validator: validateUsername }],
        nick: [{ required: true, trigger: 'blur', validator: validateNick }]
      },
      ruleForm: {
        password: '',
        checkPassword: '',
        userName: '',
        nick: ''
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
          this.$store.dispatch('createUser', this.ruleForm).then(() => {
            this.loading = false
            this.visible = false
          }).catch((error) => {
            console.log(error)
            this.loading = false
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
      this.$refs.ruleForm.resetFields()
      this.visible = true
      this.loading = false
    }
  }
}
</script>
