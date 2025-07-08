import { createApp } from 'vue'
import './assets/css/main.css';
import App from './App.vue'
import router from './../routes/index';
import { createPinia } from 'pinia';
import { defineRule } from 'vee-validate';
import { required, email, min, max } from '@vee-validate/rules';
defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);


const pinia = createPinia();
const app = createApp(App);
app.use(router).use(pinia).mount('#app');
