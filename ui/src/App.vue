<script setup>
import {RouterLink, RouterView} from 'vue-router'
import Navigation from './components/Navigation.vue';
import {onMounted, ref} from 'vue';
const centerDialogVisible = ref(false);

onMounted(() => {
  centerDialogVisible.value = true
});
</script>

<template>
  <header class="sticky top-0 z-50">
    <el-row :gutter="0" :offset="0" style="" class="flex items-center justify-center">
      <el-col :xs="24" :sm="24" :md="24" :lg="22" :xl="17" :offset="0">
        <Navigation/>
      </el-col>
    </el-row>
  </header>
  <el-row :gutter="0" :offset="0" style="" class="flex items-center justify-center">
    <el-col :xs="24" :sm="24" :md="24" :lg="22" :xl="17" :offset="0">
      <main class="">
        <RouterView/>
      </main>
    </el-col>
  </el-row>
  <el-dialog v-model="centerDialogVisible" title="Hi!" width="500" center>
    <h3 class="text-xl">
      This is a very early beta, please use at your own risk.
    </h3>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="centerDialogVisible = false">
          Close
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>


