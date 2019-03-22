<template>
  <transition-group
    :class="[
      'el-upload-list',
      'el-upload-list--' + listType,
      { 'is-disabled': disabled }
    ]"
    tag="ul"
    name="el-list"
  >
    <li
      v-for="file in files"
      :class="['el-upload-list__item', 'is-' + file.status, focusing ? 'focusing' : '']"
      :key="file.uid"
      tabindex="0"
      @keydown.delete="!disabled && onRemove(file)"
      @focus="focusing = true"
      @blur="focusing = false"
      @click.stop="focusing = false"
    >
      <img
        v-if="file.status !== 'uploading' && ['picture-card', 'picture'].indexOf(listType) > -1"
        :src="file.url"
        class="el-upload-list__item-thumbnail"
        alt=""
      >
      <a class="el-upload-list__item-name" @click="handleClick(file)">
        <i class="el-icon-document"/>{{ file.name }}
      </a>
      <label class="el-upload-list__item-status-label">
        <i
          :class="{
            'el-icon-upload-success': true,
            'el-icon-circle-check': listType === 'text',
            'el-icon-check': ['picture-card', 'picture'].indexOf(listType) > -1
        }"/>
      </label>
      <i v-if="!disabled" class="el-icon-close" @click="onRemove(file)"/>
      <i v-if="!disabled" class="el-icon-close-tip">{{ t('el.upload.deleteTip') }}</i> <!--因为close按钮只在li:focus的时候 display, li blur后就不存在了，所以键盘导航时永远无法 focus到 close按钮上-->
      <el-progress
        v-if="file.status === 'uploading'"
        :type="listType === 'picture-card' ? 'circle' : 'line'"
        :stroke-width="listType === 'picture-card' ? 6 : 2"
        :percentage="parsePercentage(file.percentage)"/>
      <span v-if="listType === 'picture-card'" class="el-upload-list__item-actions">
        <span
          v-if="handlePreview && listType === 'picture-card'"
          class="el-upload-list__item-preview"
          @click="handlePreview(file)"
        >
          <i class="el-icon-zoom-in"/>
        </span>
        <span
          v-if="!disabled"
          class="el-upload-list__item-delete"
          @click.stop="onRemove(file)"
        >
          <i class="el-icon-delete"/>
        </span>
      </span>
    </li>
  </transition-group>
</template>
<script>
import Locale from 'element-ui/src/mixins/locale'
import ElProgress from 'element-ui/packages/progress'

export default {
  inject: ['uploader'],
  name: 'UploadItem',
  components: { ElProgress },

  mixins: [Locale],
  data() {
    return {
      files: this.uploader.uploadFiles,
      disabled: this.uploader.uploadDisabled,
      handlePreview: this.uploader.onPreview,
      listType: this.uploader.listType,
      focusing: false,
      handleRemove: this.uploader.handleRemove
    }
  },
  methods: {
    parsePercentage(val) {
      return parseInt(val, 10)
    },
    handleClick(file) {
      this.handlePreview && this.handlePreview(file)
    },
    onRemove(file) {
      this.handleRemove && this.handleRemove(file)
    }
  }
}
</script>
