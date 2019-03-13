<template>
  <el-form-item ref="password" :rules="rules" :label="label" :error="error" :prop="prop">
    <el-input
      v-model="model[prop]"
      :type="passwordType"
      :placeholder="placeholder"
      auto-complete="off"
      @keyup.enter.native="$emit('enter')"
    >
      <span slot="prefix" class="svg-container">
        <svg-icon icon-class="password" />
      </span>
      <span slot="suffix" class="show-pwd" @click="showPwd">
        <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
      </span>

    </el-input>

  </el-form-item>
</template>
<script>
export default {
  name: 'Password',
  props: {
    label: {
      type: String,
      default: '密码'
    },
    error: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    prop: {
      type: String,
      default: 'password'
    },
    model: {
      type: Object,
      required: true
    },
    rules: {
      type: [Object, Array],
      required: true
    }
  },
  data() {
    return {
      passwordType: 'password'
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    validate(trigger, callback) {
      this.$refs.password.validate(trigger, callback)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
$dark_gray:#889aa4;
.svg-container {
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
.show-pwd {
    color: $dark_gray;
    position: absolute;
    right: 10px;
    vertical-align: middle;
    font-size: 16px;
    cursor: pointer;
    user-select: none;
  }
</style>
