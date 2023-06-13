<template>
  <el-upload ref="upload"
    list-type="picture"
    drag
    :show-file-list="false"
    :action="apiUrl"
    :auto-upload="true"
    :http-request="httpRequest"
    :on-change="onElChange">
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>

    <slot></slot>
    
    <div slot="tip">
      <slot name="tip"></slot>
    </div>
    

    <ul slot="tip"
      class="el-upload-list el-upload-list--picture">
      <li v-for="(item, index) in fileList"
        :key="index"
        tabindex="0" class="el-upload-list__item is-ready">
        <img v-if="isImage(item.type)"
          :src="item.url" alt="" class="el-upload-list__item-thumbnail">
        <a class="el-upload-list__item-name">
          <i class="el-icon-document"></i>{{ item.name }}
        </a>
        <label class="el-upload-list__item-status-label">
          <i class="el-icon-upload-success el-icon-check"></i>
        </label>
        <i class="el-icon-close"
          @click="onElRemove(index)"></i>
        <i class="el-icon-close-tip">按 delete 键可删除</i>
        <el-progress :percentage="item.percentage"
          :status="item.status"
          slot="tip"></el-progress>
      </li>
    </ul>
  </el-upload>
</template>

<script>
import js from './index_.js'
export default js
</script>
