<template>
  <div>
    <el-form v-show="visible" ref="ruleForm" :rules="formRules" :model="ruleForm" label-width="100px">
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
        修改成功
      </p>
    </span>
  </div>
</template>
<script>
import { Message } from 'element-ui'
export default {
  name: 'UserEdit',
  props: {
    id: {
      required: true,
      type: Number,
      default: 0
    },
    nick: {
      type: String,
      default: ''
    },
    roles: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
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
        nick: [{ required: true, trigger: 'blur', validator: validateNick }],
        roles: [{ required: true, trigger: 'blur', validator: validateRoles }]
      },
      ruleForm: {
        id: this.id,
        nick: this.nick,
        roles: this.roles
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
          this.$store.dispatch('editUser', this.ruleForm).then(() => {
            this.loading = false
            this.visible = false
          }).catch((error) => {
            console.log(error)
            this.loading = false
            if (!error.sucess && error.errorCode) {
              switch (error.errorCode) {
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
      this.$refs.ruleForm.resetFields()
      this.visible = true
      this.loading = false
    }
  }
}
</script>
