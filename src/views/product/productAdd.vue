<template>
  <div class="container">
    <el-form ref="ruleForm" :model="ruleForm" label-width="100px">
      <el-row>
        <el-col :span="12">
          <div class="block">
            <div class="itemcontainer">
              <el-form inline>
                <el-form-item label="类别" prop="catalogIds">
                  <el-cascader
                    :show-all-levels="false"
                    v-model="ruleForm.catalogIds"
                    :options="list"
                    :props="props"
                    change-on-select/>
                </el-form-item>
                <el-form-item label="类别" prop="catalogIds">
                  <el-cascader
                    :show-all-levels="false"
                    v-model="ruleForm.catalogIds"
                    :options="list"
                    :props="props"
                    change-on-select/>
                </el-form-item>
              </el-form>
              <el-form-item label="名称" prop="code">
                <el-input v-model="ruleForm.name" maxlength="30"/>
              </el-form-item>
              <el-form-item label="型号" prop="code">
                <el-input v-model="ruleForm.code" maxlength="30"/>
              </el-form-item>
              <el-form-item label="条形码" prop="barcode">
                <el-input v-model="ruleForm.name" maxlength="30"/>
              </el-form-item>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="rightblock">
            <span class="demonstration">产品图片</span>
            <div class="imglist">
              <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                list-type="picture-card">
                <i
                  class="el-icon-plus"><span class="demonstration">主图</span></i>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'ProductAdd',
  data() {
    return {
      props: {
        value: 'id',
        label: 'name'
      },
      ruleForm: {
        code: '',
        name: '',
        barcode: '',
        imgUrl: '',
        catalogIds: ''
      }
    }
  },
  methods: {

  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.imglist {
  display: inline-block;
  .el-upload-list--picture-card{
display: inline-block;
}
}
</style>

<style scoped>
.container {
padding: 24px;
}
.container .itemcontainer{
padding:0px 24px 24px 0px;
}
.container .demonstration {
    display: block;
    color: #8492a6;
    font-size: 14px;
    margin-bottom: 20px;
}
.container .block {
    padding: 30px 0;
    text-align: center;
    border-right: 1px solid #eff2f6;
    display: inline-block;
    width: 100%;
    box-sizing: border-box;
}
.container .rightblock {
    padding: 30px 0;
    text-align: center;
    display: inline-block;
    width: 100%;
    box-sizing: border-box;
}
</style>

