<template>
  <el-upload
      class="upload-demo"
      drag
      action="/app/upload"
      :on-success="onSuccess"
      :multiple="false"
  >
    <el-icon class="el-icon--upload">
      <upload-filled/>
    </el-icon>
    <div class="el-upload__text">
      Drop file here or <em>click to upload</em>
    </div>
    <template #tip>
      <div class="el-upload__tip">
        json/jsonld files with a size less than 100MB.
      </div>
    </template>
  </el-upload>
</template>

<script setup lang="js">
import {useStore} from "@/stores/store.js";

const store = useStore();
import {UploadFilled} from '@element-plus/icons-vue';
import {ref, defineEmits} from 'vue';

const emit = defineEmits([ 'on-success'])

const dialogImageUrl = ref('');
const dialogVisible = ref(false);

const onSuccess = (res, file) => {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;

  emit('on-success', res.data);
}
</script>