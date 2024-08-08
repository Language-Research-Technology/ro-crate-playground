<script setup>
import {
  Document,
  Menu as IconMenu,
  Help,
  CopyDocument,
  HomeFilled,
  Box, Files,
  CloseBold
} from '@element-plus/icons-vue'
import {onMounted, onUpdated, reactive, ref, toRaw} from 'vue';
import mode from 'ro-crate-modes/modes/default.json';
import {ROCrate, validate as validateCrate} from "ro-crate";
//import {Validator} from "ro-crate/lib/validator";
import {Preview} from 'ro-crate-html';
import ejs from 'ejs';
import template from 'ro-crate-html/defaults/metadata_template.html?raw';

import {CrateEditor} from 'crate-o';
import 'crate-o/css';
import FileBrowser from "../components/FileBrowser.vue";
import BulkDescribe from "@/components/BulkDescribe.vue";
import Upload from "@/components/Upload.vue";
import JsonEditorVue from 'json-editor-vue'
import {useStore} from "@/stores/store.js";
import rocratelogo from '@/assets/ro-crate-logo.png';
import {ElMessage, ElMessageBox} from 'element-plus'
import HelpView from "@/views/HelpView.vue";


const store = useStore();

const activeIndex = ref('1');
let menu = reactive({main: '-'});
const drawer = ref(false);
const status = reactive({
  htmlPreviewLoading: false
})
const value = ref();
const validation = reactive({
  crate: null,
  context: {
    name: "",
    message: ""
  },
  hasRootDataset: null,
  generalError: false,
  running: false
});

const valid = [
  'context',
  'hasRootDataset',
  'hasName',
  'hasDescription'
];

const explorer = {
  files: [],
  crate: {},
  json: {},
  refresh: () => {
    console.log('refresh')
  }
};

function ready(roc, refresh) {
  explorer.crate = roc;
  explorer.refresh = refresh;
}

const handleSelect = async (key, keyPath) => {
  console.log('handleSelect');
  console.log(key, keyPath)
  menu.show = key;
  if (key === 'crate') {
    crateViewActive.value = 'json';
    await validate();
  }
  console.log(menu.show)
}
const handleOpen = async (key, keyPath) => {
  console.log('handleOpen');
  //console.log(key, keyPath);
  menu.show = key;
  if (key === 'crate') {
    crateViewActive.value = 'json';
    await validate();
  }
  console.log(menu.show)
}
const handleClose = (key, keyPath) => {
  console.log('handleClose');
  console.log(key, keyPath)
}

onMounted(async () => {
  menu.show = 'home';
  explorer.files = [
    // {id: 1, name: 'file1.png', path: ''},
    // {id: 2, name: 'file.pdf', path: ''},
    // {id: 2, name: 'file.xml', path: ''}
  ]
});

onUpdated(async () => {
  await validate();
})

const validate = async () => {
  validation.running = true;
  validation.results = [];
  const results = await validateCrate(store.crate);
  validation.results = results.slice();
  validation.running = false;
}
const crateViewActive = ref('first');
const switchCrateView = async (e) => {
  if (e.paneName === 'json') {
    store.crate = explorer.crate.toJSON();
  }
  if (e.paneName === 'html') {
    store.crate = explorer.crate.toJSON();
    await generateHTMLPreview();
  }
  await validate();
}


const crateIsEmpty = () => {
  return store.crate == null || Object.keys(store.crate).length === 0;
}

const setCrate = async ({example, upload}) => {
  if (crateIsEmpty()) {
    if (example) {
      store.example = example;
      await store.setExampleCrate();
    } else if (upload) {
      store.crate = upload;
    } else {
      await store.newCrate();
    }
    menu.show = 'crate';
    crateViewActive.value = 'json';
    await validate();
  } else {
    ElMessageBox.confirm(
        'This will replace your current crate. Continue?',
        'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning',
        }
    ).then(async () => {
      if (example) {
        store.example = example;
        await store.setExampleCrate();
      } else if (upload) {
        store.crate = upload;
      } else {
        await store.newCrate();
      }
      menu.show = 'crate';
      crateViewActive.value = 'json';
      await validate();
      ElMessage({
        type: 'success',
        message: 'Create New completed',
      });
    }).catch(() => {
      ElMessage({
        type: 'info',
        message: 'New Crate canceled',
      });
    })
  }
}

const generateHTMLPreview = async () => {
  console.log("generate preview");
  try {
    status.htmlPreviewLoading = true;
    const crate = new ROCrate(store.crate, {array: true, link: true});
    await crate.resolveContext();
    const preview = new Preview(crate);
    const templateParams = preview.templateParams();
    const content = ejs.render(template, templateParams);
    const blob = new Blob([content], {type: 'text/html'});
    const blobURL = URL.createObjectURL(blob);
    const iframe = document.createElement("iframe");
    iframe.src = blobURL;
    iframe.style.width = "100%";
    iframe.style.height = "1200px";
    document.getElementById("html_preview").innerHTML = "";
    document.getElementById("html_preview").appendChild(iframe)
    status.htmlPreviewLoading = false;
  } catch (e) {
    status.htmlPreviewLoading = false;
    console.log(e)
  }
}

const fileUploaded = async (data) => {
  await setCrate({upload: data});
}
</script>

<template>
  <el-row :gutter="10">
    <el-col :xs="24" :sm="4" :md="6" :lg="4" :xl="4">
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
              <home-filled/>
            </el-icon>
            <span>Home</span>
          </template>
        </el-menu-item>
        <el-menu-item index="examples">
          <template #title>
            <el-icon>
              <CopyDocument/>
            </el-icon>
            <span>Examples</span>
          </template>
        </el-menu-item>
        <el-menu-item index="help">
          <template #title>
            <el-icon>
              <help/>
            </el-icon>
            <span>Help</span>
          </template>
        </el-menu-item>
        <hr/>
        <template v-if="!crateIsEmpty()">
          <div class="text-2xl p-4 px-6 flex items-center justify-center">
            <el-icon>
              <Box/>
            </el-icon>
            <span class="px-2">Crate</span>
          </div>
          <el-menu-item index="crate">ro-crate-metadata.json</el-menu-item>
          <div>
            <div class="text-1xl p-4 px-6 flex items-center justify-center">
              <el-icon>
                <Files/>
              </el-icon>
              <el-tooltip
                  class="box-item"
                  effect="light"
                  content="coming soon!"
                  placement="top-start"
              >
                <span class="px-2">Other Files</span>
              </el-tooltip>
            </div>
            <el-menu-item v-for="file of explorer.files" index="{{ file.id + '_file' }}">
              <template #title>
                <el-icon>
                  <Document/>
                </el-icon>
                <span>{{ file.name }}</span>
              </template>
            </el-menu-item>
            <hr/>
            <div class="text-2xl p-4 px-6 flex items-center justify-center">
              <el-button type="primary" disabled @click="()=>{}">Add Files</el-button>
            </div>
          </div>
        </template>
        <div class="text-2xl p-4 px-6 flex items-center justify-center">
          <el-button type="primary" color="brown" @click="setCrate({})"
                     class="custom-button">Create New
          </el-button>
        </div>
      </el-menu>
    </el-col>
    <el-col :xs="24" :sm="16" :md="14" :lg="14" :xl="14">
      <div v-if="menu.show==='home'">
        <div class="flex items-center justify-center">
          <div class="h-32 w-[600px]">
            <el-row>
              <el-col :span="24">
                <div class="flex items-center justify-center">
                  <p class="text-[54px] p-3">RO-Crate Playground</p>
                </div>
              </el-col>
              <el-col :span="24">
                <upload @on-success="fileUploaded"/>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div v-if="menu.show==='crate'">
        <el-tabs v-model="crateViewActive" class="demo-tabs"
                 @tab-click="switchCrateView">
          <el-tab-pane label="JSON" name="json">
            <div class="flex flex-col min-h-screen">
              <header class="h-1"></header>
              <main class="flex-1 bg-gray-100">
                <JsonEditorVue
                    :stringified="false"
                    v-model="store.crate"
                    v-bind="{/* local props & attrs */}"
                />
              </main>
            </div>
          </el-tab-pane>
          <el-tab-pane label="Visual Editor" name="visual">
            <el-row>
              <div v-if="!validation.generalError">
                <crate-editor :crate="store.crate" :mode="mode" @ready="ready"></crate-editor>
              </div>
              <div v-else>
                General Error: {{ validation.generalError }}
                {{ validation.crate }}
              </div>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="HTML Preview" name="html">
            <div id="html_preview" v-loading="status.htmlPreviewLoading"></div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div v-if="menu.show==='file-browse'">
        <file-browser/>
      </div>
      <div v-if="menu.show==='bulk-meta'">
        <BulkDescribe/>
      </div>
      <div v-if="menu.show==='file-upload'">

      </div>
      <div v-if="menu.show==='examples'">
        <div v-for="example of store.examples"
             index="{{ example.name + '_example' }}"
        >
          <el-card style="max-height: 380px" class="m-4">
            <template #header>{{ example.name }}</template>
            <el-row>
              <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
                <img
                    :src="rocratelogo"
                    style="width: 100%"
                />
              </el-col>
              <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
                <p>
                  Description:
                  {{ example.description }}
                </p>
                <el-button @click="setCrate({example})" type="primary">Try it</el-button>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </div>
      <div v-if="menu.show==='help'">
        <HelpView/>
      </div>
    </el-col>
    <el-col :xs="24" :sm="16" :md="6" :lg="6" :xl="6">
      <el-container v-if="menu.show==='crate'">
        <el-header>
          <div class="text-2xl flex items-center justify-center">
            <span class="">
              <el-button @click="validate()">Validate</el-button>
            </span>
          </div>
        </el-header>
        <el-main v-loading="validation.running">
          <hr/>
          <div v-for="item of validation.results" class="m-1">
            <el-alert :type="item?.status" :closable="false">
              <p>
                <span v-if="item?.status === 'error'">
                  <el-icon><CloseBold class="red-600"/></el-icon>
                </span>
                <span class="font-bold uppercase">{{ item?.status }}: </span>
                <span v-if="item?.message">{{ item?.message }}</span>
                <span v-else>{{ item?.clause }}</span>
              </p>
            </el-alert>
          </div>
        </el-main>
      </el-container>
    </el-col>
  </el-row>
</template>
<style>
.custom-button {
  height: 3rem;
}

.text-editor-json {
  height: calc(100vh - 4rem); /* Adjust 4rem to match the header height */
}
</style>