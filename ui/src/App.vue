<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Navigation from './components/Navigation.vue';
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
</template>


