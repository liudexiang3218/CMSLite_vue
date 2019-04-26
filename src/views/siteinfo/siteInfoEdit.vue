<template>
  <div v-loading="listLoading" class="xg-container">
    <el-form ref="ruleForm" :disabled="disabled" :model="ruleForm" :rules="formRules" label-width="100px">
      <el-row>
        <el-col :span="24">
          <div class="block">
            <div class="itemcontainer">
              <el-form-item label="默认标题" prop="title">
                <el-input v-model="ruleForm.title"/>
              </el-form-item>
              <el-form-item label="Keyword" prop="keyword">
                <el-input v-model="ruleForm.keyword"/>
              </el-form-item>
              <el-form-item label="Description" prop="description">
                <el-input v-model="ruleForm.description" :rows="3" type="textarea"/>
              </el-form-item>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div style="text-align: right;">
            <el-form-item v-if="!disabled">
              <el-button :loading="listLoading" type="primary" @click="submitForm('ruleForm',false)">保存并关闭</el-button>
              <el-button :loading="listLoading" type="primary" @click="submitForm('ruleForm',true)">保存并复制</el-button>
              <el-button type="primary" @click="$emit('close')">取消</el-button>
              <el-button @click="resetForm()">重置</el-button>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <div v-if="disabled" class="filter-container">
      <el-button @click="reload()">重新加载</el-button>
    </div>
  </div>
</template>
<script>
import { get, update, add } from '@/api/cms'
import { bisError, bisSuccess } from '@/api/util'
export default {
  name: 'SiteInfoEdit',
  props: {
    id: {
      type: String,
      default: '0'
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
      },
      ruleForm: {
        id: '',
        title: '',
        keyword: '',
        description: ''
      }
    }
  },
  created() {
    if (this.id && this.id !== '0') {
      if (this.mode) { this.mode = 'edit' }
      this.ruleForm.id = this.id
      this.initForm()
    } else {
      this.mode = 'add'
    }
  },
  methods: {
    reload() {
      this.disabled = false
      this.resetForm()
    },
    initForm() {
      if (this.ruleForm.id) {
        this.listLoading = true
        get('siteinfo', this.ruleForm.id).then(response => {
          this.listLoading = false
          if (response.success) {
            this.ruleForm = response.data
          } else {
            bisError(response)
            this.disabled = true
          }
        }).catch(error => {
          this.listLoading = false
          bisError(error)
          this.disabled = true
        })
      }
    },
    submitForm(formName, copy) {
      let modeAction = add
      if (this.mode === 'edit') {
        modeAction = update
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.listLoading = true
          modeAction('siteinfo', this.ruleForm).then(response => {
            this.listLoading = false
            this.visible = false
            var event = ''
            if (this.mode === 'edit') {
              event = 'modified'
              bisSuccess('修改成功！')
            } else {
              event = 'created'
              bisSuccess('添加成功！')
            }
            if (copy) {
              this.ruleForm.id = '0'
              this.mode = 'add'
              event = event + 'copy'
            }
            this.$emit(event, response)
          }).catch((error) => {
            this.listLoading = false
            if (!error.success && error.errorCode) {
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

