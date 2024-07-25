<template>
  <el-row :gutter="10">
    <el-col :xs="24" :sm="4" :md="4" :lg="4" :xl="2">
      <el-menu
          :default-active="'home'"
          class="el-menu-demo"
          mode="vertical"
          @select="handleSelect"
          :router="false"
      >
        <el-menu-item index="home" collapse="false">
          <template #title>
            <el-icon>
              <location/>
            </el-icon>
            <span>Home</span>
          </template>
        </el-menu-item>
        <el-sub-menu index="describe" collapse="false">
          <template #title>
            <el-icon>
              <location/>
            </el-icon>
            <span>Describe</span>
          </template>
          <el-menu-item index="crate-o">Crate</el-menu-item>
          <el-menu-item index="bulk-meta">Bulk Describe</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>
            <el-icon>
              <icon-menu/>
            </el-icon>
            <span>Files</span>
          </template>
          <el-menu-item index="file-browse">Browse</el-menu-item>
          <el-menu-item index="file-upload">Upload</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="3">
          <template #title>
            <el-icon>
              <setting/>
            </el-icon>
            <span>Help</span>
          </template>
          <el-menu-item index="3-1">RoCrate</el-menu-item>
          <el-menu-item index="3-2">Crate-O</el-menu-item>
          <el-menu-item index="3-3">LDaCA</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-col>
    <el-col :xs="24" :sm="20" :md="20" :lg="20" :xl="22">
      <div v-if="menu.show==='home'">
        <div class="flex items-center justify-center">
          <div class="h-32 w-[600px] flex items-center justify-center">
            <el-row>
              <el-col :span="24">
                <div class="flex items-center justify-center">
                  <p class="text-[54px] p-3">Ro-Crate Playground</p>
                </div>
              </el-col>
              <el-col :span="24">
                <div class="flex items-center justify-center">
                  <el-button type="primary" color="" class="custom-button"
                             @click="menu.show='crate-o'">
                    <span class="text-2xl p-5">Start a Blank Folder</span>
                  </el-button>
                  <el-button type="primary" color="red" class="custom-button">
                    <RouterLink to="/explorer" class="text-2xl p-5">Upload your RO-Crate</RouterLink>
                  </el-button>
                  <el-button type="primary" color="brown" class="custom-button">
                    <RouterLink to="/help" class="text-2xl p-5">Help</RouterLink>
                  </el-button>
                </div>
              </el-col>
            </el-row>

          </div>
        </div>
      </div>
      <div v-if="menu.show==='crate-o'">
        <el-row>
          <el-col>
            <el-button >Re-Start</el-button>
            <el-button @click="newCrate()">Enable Auto-Save</el-button>
            <el-button @click="newCrate()">Save</el-button>
            <el-button @click="newCrate()">something</el-button>
          </el-col>
        </el-row>
        <crate-editor :crate="editor.crate" :mode="mode" @ready="ready"></crate-editor>
      </div>
      <div v-if="menu.show==='file-browse'">
        <file-browser/>
      </div>
      <div v-if="menu.show==='bulk-meta'">
        <BulkDescribe/>
      </div>
      <div v-if="menu.show==='file-upload'">
        <upload/>
      </div>
    </el-col>
  </el-row>
</template>
<script></script>
<style></style>