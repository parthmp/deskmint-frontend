import { createApp } from 'vue';
import axios from 'axios';
import './assets/css/main.css';
import App from './App.vue'
import router from './../routes/index';
import  Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";

import { createPinia } from 'pinia';
import mitt from "mitt";

axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

const emitter = mitt();

const pinia = createPinia();
const app = createApp(App);
const options = {
    position: POSITION.TOP_CENTER
};

app.use(router).use(pinia).use(Toast, options).provide('emitter', emitter).mount('#app');
