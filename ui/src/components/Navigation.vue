<script lang="ts" setup>
import { ref } from 'vue'

const activeIndex = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<template>
  <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      :router="true"
  >
    <el-menu-item index="1" route="/">RO-Crate Playground</el-menu-item>
    <el-menu-item index="2" route="/about">About</el-menu-item>
    <el-sub-menu index="3">
      <template #title>Help</template>
      <el-menu-item index="3-1">RoCrate</el-menu-item>
      <el-menu-item index="3-2">Crate-O</el-menu-item>
      <el-menu-item index="3-3">LDaCA</el-menu-item>
    </el-sub-menu>
  </el-menu>
  <div class="h-6" />

</template>

