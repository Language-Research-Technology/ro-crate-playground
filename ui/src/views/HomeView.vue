<script setup>
import {RouterLink} from 'vue-router'

</script>

<template>
  <div class="flex items-center justify-center">
    <div class="h-64 w-[600px] flex items-center justify-center">
      <el-row>
        <el-col :span="24">
          <div class="flex items-center justify-center">
            <p class="text-[54px] p-3">RO-Crate Playground</p>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
  <div class="flex items-center justify-center">
    <div class="h-20 w-[600px] flex items-center justify-center">
      <el-row :gutter="10">
        <p class="p-2 text-red-900 text-4xl">Package</p>
        <p class="p-2 text-emerald-400 text-4xl">Describe</p>
        <p class="p-2 text-violet-600 text-4xl">Publish</p>
      </el-row>
    </div>
  </div>
  <div class="flex items-center justify-center">
    <div class="h-64 w-[600px] flex items-center justify-center">
      <el-row>
        <el-col :span="24">
          <p class="p-10 text-violet-600 text-2xl text-center">
            This is the playground of the RO-Crate specification described a method of packaging data in a folder, which can be zipped, with any kind of file.
          </p>
          <div class="flex items-center justify-center">
            <el-button type="primary" color="" size="large">
              <RouterLink to="/explorer">Start Packaging</RouterLink>
            </el-button>
            <el-button type="primary" color="red" size="large">
              <RouterLink to="/help">Start Learning</RouterLink>
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
