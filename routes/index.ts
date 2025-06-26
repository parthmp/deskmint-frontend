import { createWebHistory, createRouter } from 'vue-router';
import PanelLayout from './../src/components/PanelLayout.vue';

const routes = [
	{
		path: '/',
		component: PanelLayout,	
	}
	
]
const router = createRouter({
	history: createWebHistory(),
	routes, //same --- > routes:routes
})
export default router