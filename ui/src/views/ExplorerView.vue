<script setup>
import {
  Document,
  Menu as IconMenu,
  Help,
  CopyDocument,
  HomeFilled,
  Box, Files,
  CloseBold,
  CircleCheck,
  Warning,
  WarnTriangleFilled, QuestionFilled, List
} from '@element-plus/icons-vue'
import {onMounted, onUpdated, reactive, ref, toRaw} from 'vue';
import mode from 'ro-crate-modes/modes/base.json';
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
import {ElMessage, ElMessageBox} from 'element-plus';
import HelpView from "@/views/HelpView.vue";
import {useGtag} from 'vue-gtag-next';

const store = useStore();
const gtag = useGtag();

const tour1 = ref();
const tour2 = ref();
const tour3 = ref();
const tour4 = ref();
const tour5 = ref();

let validIcon = ref('success');

const activeIndex = ref('1');
let menu = reactive({main: '-'});
const drawer = ref(false);
const status = reactive({
  htmlPreviewLoading: false
});

const validation = reactive({
  crate: null,
  context: {
    name: "",
    message: ""
  },
  hasRootDataset: null,
  generalError: false,
  running: false,
  error: null
});

const valid = [
  'context',
  'hasRootDataset',
  'hasName',
  'hasDescription'
];

const explorer = {
  files: [],
  crate: null,
  json: {},
  refresh: () => {
    console.log('refresh')
  }
};

let openTour = ref(false);

store.$subscribe((mutation, state) => {
  if (mutation.events.key === 'crate') {
    console.log(`Crate changed! ${state.crate}`);
    validIcon.value = 'reValidate';
  }
});

async function ready(roc, refresh) {
  explorer.crate = roc;
  explorer.refresh = refresh;
}

const handleSelect = async (key, keyPath) => {
  console.log('handleSelect');
  console.log(key, keyPath)
  menu.show = key;
  // if (key === 'crate') {
  //   crateViewActive.value = 'json';
  //   await validate();
  // }
  if (key === 'help') {
    openTour.value = true;
  }
  console.log(menu.show)
}
const handleOpen = async (key, keyPath) => {
  console.log('handleOpen');
  //console.log(key, keyPath);
  //menu.show = key;
  if (key === 'crate') {
    crateViewActive.value = 'json';
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

// onUpdated(async () => {
//   await validate();
// });


const validate = async () => {
  console.log(explorer.crate)
  if(explorer.crate) {
    validation.running = true;
    validation.results = [];
    try {
      store.crate = explorer.crate.toJSON();
      const results = await validateCrate(store.crate);
      validation.results = results.slice();
      validIcon.value = 'success';
      for (let valid of validation.results) {
        if (valid.status === 'error') {
          validIcon.value = 'error';
        }
        if (valid.status === 'warning') {
          validIcon.value = 'warning';
        }
      }
    } catch (e) {
      validation.results = [];
      validation.generalError = e.message;
    }
    validation.running = false;
  }
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
    document.getElementById("html_preview").appendChild(iframe);
    status.htmlPreviewLoading = false;
  } catch (e) {
    status.htmlPreviewLoading = false;
    console.log(e)
  }
}

const fileUploaded = async (data) => {
  gtag.pageview({
    page_path: '/explorer',
    page_title: 'File Upload Success',
  });
  await setCrate({upload: data});
}
</script>

<template>
  <el-row :gutter="10">
    <el-col :xs="24" :sm="4" :md="4" :lg="4" :xl="4">
      <el-menu
          :default-active="'home'"
          class="el-menu-explorer"
          mode="vertical"
          @select="handleSelect"
          :router="false"
      >
        <el-menu-item index="home" collapse="false" ref="tour1">
          <template #title>
            <el-icon>
              <home-filled/>
            </el-icon>
            <span>Upload Crate</span>
          </template>
        </el-menu-item>
        <el-menu-item index="examples" ref="tour4">
          <template #title>
            <el-icon>
              <CopyDocument/>
            </el-icon>
            <span>Examples</span>
          </template>
        </el-menu-item>
        <hr/>
        <template v-if="!crateIsEmpty()">
          <div class="text-2xl p-4 px-6 flex items-center justify-center"
               ref="tour3">
            <el-icon>
              <Box/>
            </el-icon>
            <span class="px-2">Crate</span>
          </div>
          <el-menu-item index="crate">
            <el-tooltip v-if="validIcon === 'reValidate'"
                        class="box-item"
                        effect="dark"
                        content="Click to validate crate"
                        placement="top"
            >
              <el-icon size="30" @click="drawer = true; validate()" style="margin-right: 3px;">
                <List />
              </el-icon>
            </el-tooltip>
            <el-tooltip v-if="validIcon === 'success'"
                        class="box-item"
                        effect="dark"
                        content="Valid crate"
                        placement="top"
            >
              <el-icon size="30" @click="drawer = true; validate()" style="margin-right: 3px;color: darkgreen">
                <CircleCheck/>
              </el-icon>
            </el-tooltip>
            <el-tooltip v-if="validIcon === 'warning'"
                        class="box-item"
                        effect="dark"
                        content="There are some warnings in your crate, click to see the detail"
                        placement="top"
            >
              <el-icon size="30" @click="drawer = true;  validate()" style="margin-right: 3px;color: gold">
                <Warning/>
              </el-icon>
            </el-tooltip>
            <el-tooltip v-if="validIcon === 'error'"
                        class="box-item"
                        effect="dark"
                        content="There are some errors in your crate, click to see the detail"
                        placement="top"
            >
              <el-icon size="30" @click="drawer = true; validate()" style="margin-right: 3px;color: red">
                <WarnTriangleFilled/>
              </el-icon>
            </el-tooltip>
            <p ref="tour2">ro-crate-metadata.json</p>
          </el-menu-item>
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
              <el-button type="primary" disabled @click="()=>{}"
                         ref="tour6">Add Files</el-button>
            </div>
          </div>
        </template>
        <div class="text-2xl p-4 px-6 flex items-center justify-center">
          <el-button type="primary" color="brown" @click="setCrate({})"
                     class="custom-button" ref="tour5">Create New
          </el-button>
        </div>
        <div class="text-2xl p-4 px-6 flex items-center justify-center">
          <el-icon @click="openTour = true">
            <QuestionFilled/>
          </el-icon>
        </div>
      </el-menu>
    </el-col>
    <el-col :xs="24" :sm="20" :md="20" :lg="20" :xl="20">
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
      </div>
    </el-col>
  </el-row>
  <el-drawer
      v-model="drawer"
      title="RO-Crate Validation"
      direction="rtl"
      size="30%"
  >
    <el-container>
      <el-header>
        <div class="text-2xl flex items-center justify-center">
          Basic Validation for your RO-Crate
        </div>
      </el-header>
      <el-main v-loading="validation.running">
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
        <div v-if="validation.generalError"
             class="text-2xl">
          General Error: {{ validation.generalError }}
        </div>
      </el-main>
    </el-container>
  </el-drawer>
  <el-tour v-model="openTour" type="primary" :mask="false">
    <el-tour-step
        :target="tour1?.$el"
        title="Upload RO-Crate"
        description="If you have already an ro-crate-metadata.json file click here to upload it, if you dont have one click 'Create New'"
    />
    <el-tour-step
        :target="tour2?.$el"
        title="Edit ro-crate-metadata.json"
        description="In this pane you can edit your ro-crate-metadata file with a plain json editor or with a Visual Editor Ro-Crate. An HTML preview will be generated everytime you switch tabs."
    />
    <el-tour-step
        :target="tour3?.$el"
        title="Validate your ro-crate-metadata.json"
        description="This button will run simple validation for your ro-crate according to the spec"
    />
    <el-tour-step
        :target="tour4?.$el"
        title="Load Examples"
        description="Click to show examples of RO-Crates to play around!"
    />
    <el-tour-step
        :target="tour5?.$el"
        title="Create New"
        description="Create a new RO-Crate from a base ro-crate"
    />
  </el-tour>
</template>
<style>
.custom-button {
  height: 3rem;
}

.text-editor-json {
  height: calc(100vh - 4rem); /* Adjust 4rem to match the header height */
}

.el-menu-explorer {
  white-space: nowrap;
  font-size: 1rem; /* Adjust font size */
  padding: 8px 16px; /* Adjust padding as necessary */
}

.el-menu-item > p {
  overflow: scroll;
}
</style>