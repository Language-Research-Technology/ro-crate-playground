import "@/assets/tailwind.css";
import "element-plus/theme-chalk/index.css";
import './assets/main.css';

import VueGtag from "vue-gtag-next";
import {createApp} from 'vue';
import {createPinia} from 'pinia';

import App from './App.vue';
import router from './router/index.js';
import ElementPlus from 'element-plus';
import {useStore} from "./stores/store.js";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ElementPlus);

// Preload the store before mounting the app
const store = useStore();
store.fetchData().then(() => {
    app.use(VueGtag, {
        property: {
            id: store.g_tag, // Replace with your Google Analytics Measurement ID
        }
    });
    app.mount('#app');
});
