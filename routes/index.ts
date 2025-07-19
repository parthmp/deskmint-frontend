import { createWebHistory, createRouter } from 'vue-router';
import PanelLayout from './../src/components/PanelLayout.vue';
import Login from './../src/components/Login.vue';
import ForgotPassword from '../src/components/ForgotPassword.vue';

const routes = [
	{
		path: '/',
		component: Login,	
	},
	{
		path: '/forgot-password',
		component: ForgotPassword,	
	},
	{
		path: '/panel',
		component: PanelLayout,	
	}
	
]
const router = createRouter({
	history: createWebHistory(),
	routes, //same --- > routes:routes
})
export default router