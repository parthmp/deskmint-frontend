import { createApp } from 'vue'
import './assets/css/main.css';
import App from './App.vue'
import router from './../routes/index';
import { createPinia } from 'pinia';


const pinia = createPinia();
const app = createApp(App);
app.use(router).use(pinia).mount('#app');
