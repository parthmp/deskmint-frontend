import { createWebHistory, createRouter } from 'vue-router';
import HelloWorld from './../src/components/HelloWorld.vue';
import TestComponent from './../src/components/TestComponent.vue';
import TestComponent2 from './../src/components/TestComponent2.vue';

const routes = [
	{
		path: '/',
		component: TestComponent,	
	},
    {
		path: '/hello',
		component: HelloWorld,	
	},
    {
        path: '/test2',
        component: TestComponent2
    }
	
]
const router = createRouter({
	history: createWebHistory(),
	routes, //same --- > routes:routes
})
export default router