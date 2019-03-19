<template>
  <div>
    <el-form v-show="visible" ref="ruleForm" :rules="formRules" :model="ruleForm" label-width="100px">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="ruleForm.name" maxlength="16" minlength="6"/>
      </el-form-item>
      <el-form-item :error="parentError" label="父级" prop="parentIds">
        <el-cascader
          :show-all-levels="false"
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
        分类 {{ ruleForm.name }}已修改
      </p>
    </span>
  </div>
</template>
<script>
import { updateCatalog } from '@/api/product'
import { bisError } from '@/api/util'
export default {
  name: 'CatalogEdit',
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
    },
    id: {
      type: String,
      default: '0'
    },
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    const validateName = (rule, value, callback) => {
      debugger
      if (value.length < 1) {
        callback(new Error('分类名称不能为空!'))
      } else {
        callback()
      }
    }
    const validateParent = (rule, value, callback) => {
      debugger
      if (value) {
        let er = false
        value.forEach(element => {
          if (this.ruleForm.id === element) {
            er = true
            return false
          }
        })
        if (er) {
          callback(new Error('父级不可选择当前分类及所属下级'))
        } else {
          callback()
        }
      } else {
        callback(new Error('父级是必填选'))
      }
    }
    return {
      props: {
        value: 'id',
        label: 'name'
      },
      formRules: {
        name: [{ required: true, trigger: 'blur', validator: validateName }],
        parentIds: [{ type: 'array', required: true, trigger: 'change', validator: validateParent }]
      },
      ruleForm: {
        id: this.id,
        name: this.name,
        parentIds: this.parentIds
      },
      loading: false,
      visible: true,
      parentError: ''
    }
  },
  computed: {
    list() {
      return this.options
    }
  },
  methods: {
    submitForm(formName) {
      this.parentError = ''
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          updateCatalog(this.ruleForm).then(response => {
            this.loading = false
            this.visible = false
            this.$emit('edited', response)
          }).catch(error => {
            this.loading = false
            if (!error.sucess && error.errorCode) {
              switch (error.errorCode) {
                case 30004 :
                  this.parentError = error.message
                  break
                default :
                  bisError(error)
              }
            } else {
              bisError(error)
            }
          })
        } else {
          this.loading = false
          return false
        }
      })
    },
    resetForm() {
      this.parentError = ''
      this.$refs.ruleForm.resetFields()
      this.visible = true
      this.loading = false
    }
  }
}
</script>
