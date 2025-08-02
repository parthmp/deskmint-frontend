import { createWebHistory, createRouter } from 'vue-router';
import PanelLayout from './../src/components/PanelLayout.vue';
import Login from './../src/components/Login.vue';
import ForgotPassword from '../src/components/ForgotPassword.vue';
import ManageCompanies from '../src/components/ManageCompanies.vue';

import Dashboard from '../src/components/Dashboard.vue';
import Clients from '../src/components/Clients.vue';
import Admins from '../src/components/admins/Admins.vue';
import AdminCreate from '../src/components/admins/AdminCreate.vue';
import AdminEdit from '../src/components/admins/AdminEdit.vue';

import ClientsCustomFields from '../src/components/custom_fields/Clients/ClientsCustomFields.vue';

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
				path:'/clients/page/:id',
				component: Clients
			},
			{
				path:'/custom-fields/clients',
				component: ClientsCustomFields
			},
			{
				path:'/admins',
				component: Admins
			},
			{
				path:'/admins/create',
				component: AdminCreate
			},
			{
				path:'/admins/edit/:id',
				component: AdminEdit
			}
		]
	}
	
]
const router = createRouter({
	history: createWebHistory(),
	routes,
})
export default router