import { createWebHistory, createRouter } from 'vue-router';
import PanelLayout from './../src/components/PanelLayout.vue';
import Login from './../src/components/Login.vue';

const routes = [
	{
		path: '/',
		component: Login,	
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