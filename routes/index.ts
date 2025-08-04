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

import ManageCustomFieldTypes from '../src/components/custom_fields/manage_types/ManageCustomFieldTypes.vue';
import ManageCustomFieldTypesCreate from '../src/components/custom_fields/manage_types/ManageCustomFieldTypesCreate.vue';
import ManageCustomFieldTypesEdit from '../src/components/custom_fields/manage_types/ManageCustomFieldTypesEdit.vue';

import ClientsCustomFields from '../src/components/custom_fields/Clients/ClientsCustomFields.vue';
import ClientsCustomFieldsCreate from '../src/components/custom_fields/Clients/ClientsCustomFieldsCreate.vue';


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
				path:'/custom-fields/manage-field-types',
				component: ManageCustomFieldTypes
			},
			{
				path:'/custom-fields/manage-field-types/create',
				component: ManageCustomFieldTypesCreate
			},
			{
				path:'/custom-fields/manage-field-types/edit/:id',
				component: ManageCustomFieldTypesEdit
			},
			{
				path:'/custom-fields/clients',
				component: ClientsCustomFields
			},
			{
				path:'/custom-fields/clients/create',
				component: ClientsCustomFieldsCreate
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