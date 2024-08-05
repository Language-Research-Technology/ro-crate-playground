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

      </el-row>
    </div>
  </div>
  <div class="flex items-center justify-center">
    <div class="h-64 w-[600px] flex items-center justify-center">
      <el-row>
        <el-col :span="24">
          <p class="p-10 text-violet-600 text-2xl text-center">
            This is the playground of the RO-Crate specification. The RO-Crate is described as a method of packaging data in a folder, which
            can be zipped, with any kind of file.
          </p>
          <p class="p-10 text-emerald-400 text-2xl text-center">
            For more on RO-Crate please visit <a class="underline" href="https://www.researchobject.org/ro-crate/">www.researchobject.org/ro-crate/</a>
          </p>
          <p class="p-10 text-violet-600 text-2xl text-center">
            This Playground is aimed at developers looking to explore ro-crates in the browser without downloading any tools
          </p>
          <div class="flex items-center justify-center">
            <RouterLink to="/explorer">
              <el-button type="primary" color="" size="large">Start Packaging
              </el-button>
            </RouterLink>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
