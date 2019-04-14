<template>
  <div class="container">
    <el-form :inline="true" label-position="right" label-width="80px">

      <el-form-item label="名称">
        <span>   {{ message.name }}</span>
      </el-form-item>

      <el-form-item label="email">
        <span>  {{ message.email }}</span>
      </el-form-item>

      <el-form-item label="手机">
        <span> {{ message.mobile }}</span>
      </el-form-item>
    </el-form>
    <el-form :inline="true" label-position="right" label-width="80px">
      <el-form-item label="内容">
        <span>{{ message.content }}</span>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'MessageDetail',
  props: {
    message: {
      type: Object,
      default: function() {
        return {
          name: '',
          email: '',
          mobile: '',
          content: ''
        }
      }
    }
  }
}
</script>

