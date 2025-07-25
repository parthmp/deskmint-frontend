import { createWebHistory, createRouter } from 'vue-router';
import PanelLayout from './../src/components/PanelLayout.vue';
import Login from './../src/components/Login.vue';
import ForgotPassword from '../src/components/ForgotPassword.vue';
import ManageCompanies from '../src/components/ManageCompanies.vue';

import Dashboard from '../src/components/Dashboard.vue';
import Clients from '../src/components/Clients.vue';
import Admins from '../src/components/Admins.vue';

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
		path: '/add-company',
		component: ManageCompanies,	
	},
	{
		path: '/panel',
		component: PanelLayout,	
		children : [
			{
				path: '/panel',
				component: Dashboard,	
			},
			{
				path: '/clients',
				component: Clients,	
			},
			{
				path:'/admins',
				component: Admins
			}
		]
	}
	
]
const router = createRouter({
	history: createWebHistory(),
	routes,
})
export default router