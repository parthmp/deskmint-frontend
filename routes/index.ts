import { createWebHistory, createRouter } from 'vue-router';
import login from '../src/helpers/login';

import PanelLayout from './../src/components/PanelLayout.vue';
import Login from './../src/components/Login.vue';
import ForgotPassword from '../src/components/ForgotPassword.vue';
import ManageCompanies from '../src/components/ManageCompanies.vue';

import Dashboard from '../src/components/Dashboard.vue';
import Admins from '../src/components/admins/Admins.vue';
import AdminCreate from '../src/components/admins/AdminCreate.vue';
import AdminEdit from '../src/components/admins/AdminEdit.vue';

import ManageCustomFieldTypes from '../src/components/custom_fields/manage_types/ManageCustomFieldTypes.vue';
import ManageCustomFieldTypesCreate from '../src/components/custom_fields/manage_types/ManageCustomFieldTypesCreate.vue';
import ManageCustomFieldTypesEdit from '../src/components/custom_fields/manage_types/ManageCustomFieldTypesEdit.vue';

import ClientsCustomFields from '../src/components/custom_fields/Clients/ClientsCustomFields.vue';
import ClientsCustomFieldsCreateEdit from '../src/components/custom_fields/Clients/ClientsCustomFieldsCreateEdit.vue';

import InvoicesCustomFields from '../src/components/custom_fields/invoices/InvoicesCustomFields.vue';
import InvoicesCustomFieldsCreateEdit from '../src/components/custom_fields/invoices/InvoicesCustomFieldsCreateEdit.vue';

import Clients from '../src/components/clients/Clients.vue';
import ClientCreateEdit from '../src/components/clients/ClientCreateEdit.vue';
import ClientView from '../src/components/clients/ClientView.vue';

import Products from '../src/components/products/Products.vue';
import ProductsCreateEdit from '../src/components/products/ProductsCreateEdit.vue';

import InvoiceSettings from '../src/components/settings/invoice/InvoiceSettings.vue';
import NumbersInvoiceSettings from '../src/components/settings/invoice/blocks/NumbersInvoiceSettings.vue';
import GeneralInvoiceSettings from '../src/components/settings/invoice/blocks/GeneralInvoiceSettings.vue';
import ClientDetailsInvoiceSettings from '../src/components/settings/invoice/blocks/ClientDetailsInvoiceSettings.vue';


const routes = [
	{
		path: '/',
		component: Login,
		meta: { requires_auth: false }
	},
	{
		path: '/forgot-password',
		component: ForgotPassword,
		meta: { requires_auth: false }
	},
	{
		path: '/add-company',
		component: ManageCompanies,
		meta: { requires_auth: true }
	},
	{
		path: '/panel',
		component: PanelLayout,	
		children : [
			{
				path: '/panel',
				component: Dashboard,
				meta: { requires_auth: true }
			},
			{
				path:'/custom-fields/manage-field-types',
				component: ManageCustomFieldTypes,
				meta: { requires_auth: true }
			},
			{
				path:'/custom-fields/manage-field-types/create',
				component: ManageCustomFieldTypesCreate,
				meta: { requires_auth: true }
			},
			{
				path:'/custom-fields/manage-field-types/edit/:id',
				component: ManageCustomFieldTypesEdit,
				meta: { requires_auth: true }
			},
			{
				path:'/custom-fields/clients',
				component: ClientsCustomFields,
				meta: { requires_auth: true }
			},
			{
				path:'/custom-fields/clients/create',
				component: ClientsCustomFieldsCreateEdit,
				meta: { requires_auth: true }
			},
			{
				path:'/custom-fields/clients/edit/:id',
				component: ClientsCustomFieldsCreateEdit,
				meta: { requires_auth: true }
			},
			{
				path:'/custom-fields/invoices',
				component: InvoicesCustomFields,
				meta: { requires_auth: true }
			},
			{
				path:'/custom-fields/invoices/create',
				component: InvoicesCustomFieldsCreateEdit,
				meta: { requires_auth: true }
			},
			{
				path:'/custom-fields/invoices/edit/:id',
				component: InvoicesCustomFieldsCreateEdit,
				meta: { requires_auth: true }
			},
			{
				path:'/admins',
				component: Admins,
				meta: { requires_auth: true }
			},
			{
				path:'/admins/create',
				component: AdminCreate,
				meta: { requires_auth: true }
			},
			{
				path:'/admins/edit/:id',
				component: AdminEdit,
				meta: { requires_auth: true }
			},
			{
				path: '/clients',
				component: Clients,
				meta: { requires_auth: true }
			},
			{
				path: '/clients/create',
				component: ClientCreateEdit,
				meta: { requires_auth: true }
			},
			{
				path: '/clients/edit/:id',
				component: ClientCreateEdit,
				meta: { requires_auth: true }
			},
			{
				path: '/clients/view/:id',
				component: ClientView,
				meta: { requires_auth: true }
			},
			{
				path: '/products',
				component: Products,
				meta: { requires_auth: true }
			},
			{
				path: '/products/create',
				component: ProductsCreateEdit,
				meta: { requires_auth: true }
			},
			{
				path: '/products/edit/:id',
				component: ProductsCreateEdit,
				meta: { requires_auth: true }
			},
			{
				path: '/settings/invoice',
				component: InvoiceSettings,
				meta: { requires_auth: true },
				children : [
					{
						path: '/settings/invoice',
						component: GeneralInvoiceSettings,
						meta: { requires_auth: true }
					},
					{
						path: '/settings/invoice/general',
						component: GeneralInvoiceSettings,
						meta: { requires_auth: true }
					},
					{
						path: '/settings/invoice/numbers',
						component: NumbersInvoiceSettings,
						meta: { requires_auth: true }
					},
					{
						path: '/settings/invoice/client-details',
						component: ClientDetailsInvoiceSettings,
						meta: { requires_auth: true }
					}
				]
			}
		]
	}
	
]
const router = createRouter({
	history: createWebHistory(),
	routes,
})

router.beforeEach(async (to, from, next) => {

	let logged_in = await login.isLoggedIn();

	if(!logged_in && to.meta.requires_auth){
		return next('/');
	}

	if(logged_in && !to.meta.requires_auth){
		return next('/panel');
	}
	
	next();
});

export default router;