<template>
  <div>
    <el-form v-show="visible" ref="ruleForm" :rules="formRules" :model="ruleForm" label-width="100px">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="ruleForm.name" maxlength="16" minlength="6"/>
      </el-form-item>
      <el-form-item label="父级" prop="parentId">
        <el-cascader
          v-model="ruleForm.parentIds"
          :options="list"
          :props="props"
          change-on-select/>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
    <span v-show="!visible">
      <p class="warn-content">
        分类 {{ ruleForm.name }}已添加成功 <el-button @click="resetForm()">继续添加</el-button>
      </p>
    </span>
  </div>
</template>
<script>
import { Message } from 'element-ui'
export default {
  name: 'CatalogAdd',
  props: {
    options: {
      type: Array,
      default() {
        return [{ 'id': '0', name: '顶级分类' }]
      }
    },
    parentIds: {
      type: Array,
      default() {
        return ['0']
      }
    }
  },
  data() {
    const validateName = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('分类名称不能为空!'))
      } else {
        callback()
      }
    }
    return {
      props: {
        value: 'id',
        label: 'name'
      },
      formRules: {
        name: [{ required: true, trigger: 'blur', validator: validateName }]
      },
      ruleForm: {
        name: '',
        parentIds: this.parentIds,
        sort: 1
      },
      loading: false,
      visible: true
    }
  },
  computed: {
    list() {
      return this.options
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('createCatalog', this.ruleForm).then((response) => {
            this.loading = false
            this.visible = false
            this.$emit('created', response)
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
