<template>
  <div>
    <el-form v-show="visible" ref="ruleForm" :rules="formRules" :model="ruleForm" label-width="100px">
      <el-form-item :error="userNameError" :label="$t('login.username')" prop="userName">
        <el-input v-model="ruleForm.userName" maxlength="16" minlength="6"/>
      </el-form-item>
      <check-re-password :form-model="ruleForm"/>
      <el-form-item label="昵称" prop="nick">
        <el-input v-model="ruleForm.nick" maxlength="20" minlength="1"/>
      </el-form-item>
      <el-form-item label="角色" prop="roles">
        <el-checkbox-group v-model="ruleForm.roles">
          <el-checkbox key="admin" label="admin">管理者</el-checkbox>
          <el-checkbox key="user" label="user">普通用户</el-checkbox>
        </el-checkbox-group>
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
import { Message } from 'element-ui'
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
      if (value.length < 1) {
        callback(new Error('昵称不能为空!'))
      } else {
        callback()
      }
    }
    const validateRoles = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('角色是必选项'))
      } else {
        callback()
      }
    }
    return {
      formRules: {
        userName: [{ required: true, trigger: 'blur', validator: validateUsername }],
        nick: [{ required: true, trigger: 'blur', validator: validateNick }],
        roles: [{ required: true, trigger: 'blur', validator: validateRoles }]
      },
      ruleForm: {
        password: '',
        checkPassword: '',
        userName: '',
        nick: '',
        roles: []
      },
      loading: false,
      visible: true,
      userNameError: ''
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.userNameError = ''
          this.loading = true
          this.$store.dispatch('createUser', this.ruleForm).then(() => {
            this.loading = false
            this.visible = false
          }).catch((error) => {
            console.log(error)
            this.loading = false
            if (!error.sucess && error.errorCode) {
              switch (error.errorCode) {
                case 20002:
                  this.userNameError = error.message
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
          this.loading = false
          return false
        }
      })
    },
    resetForm() {
      this.userNameError = ''
      this.$refs.ruleForm.resetFields()
      this.visible = true
      this.loading = false
    }
  }
}
</script>
