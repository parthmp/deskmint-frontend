<template>
	<section class="main-content">
    	<div class="card">
			 <h1 class="text-2xl!" v-if="a_data.mode === 'create'">Create an invoice</h1>
			 <h1 class="text-2xl!" v-if="a_data.mode === 'edit'">Edit invoice</h1>
			 <br>
			 <client-create-edit-skeleton :blocks="3" v-if="!a_data.fetched"></client-create-edit-skeleton>
			 <tabs :options="tab_options" :horizontal="true" :active_tab_index="a_data.active_tab_index" :disable_further="(a_data.mode !== 'edit')" @tab-changed="changedActiveTabValue" v-if="a_data.fetched">
				<template v-slot:tab-0>
					<invoice-page ref="invoice_page_validation" @validated="handleInvoicePageValidated"></invoice-page>
				</template>
				<template v-slot:tab-1>
					<div>
						<CustomFieldsRenderer v-model="a_data.custom_fields" @validated="handleCustomFieldsValidated" ref="custom_fields_tab_ref"></CustomFieldsRenderer>
					</div>
				</template>
				<template v-slot:tab-2>
					<SettingsTab :btn_disabled="a_data.btn_disabled" v-model:payment_method="a_data.payment_method" v-model:send_invoice_in_email="a_data.send_invoice_in_email" v-model:gateways="a_data.gateways" @validated="handleSettingsValidated" ref="settings_tab_ref"></SettingsTab>
				</template>
			 </tabs>
		</div>
	</section>
</template>
<style scoped>

</style>
<script lang="ts" setup>

	import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';
	import Tabs from '../UI/Tabs.vue';

	import SettingsTab from './blocks/SettingsTab.vue';

	import CustomFieldsRenderer from '../blocks/custom_fields_templates/CustomFieldsRenderer.vue';
	import api from '../../helpers/api';
	import { useInvoiceStore } from '../../composables/invoice/useInvoiceStore';
	import { useInvoiceProducts } from '../../composables/invoice/useInvoiceProducts';
	import InvoicePage from './blocks/InvoicePage.vue';
	import { useInvoiceReset } from '../../composables/invoice/useInvoiceReset';
	import { useRoute, useRouter } from 'vue-router';

	import ClientCreateEditSkeleton from '../skeletons/ClientCreateEditSkeleton.vue';
	

	interface InvoiceCreateEditInterface{
		active_tab_index : number,
		custom_fields : Array<object>,
		payment_method : {
			value:string,
			error:string
		},
		send_invoice_in_email: boolean,
		gateways: Array<string>,
		btn_disabled: boolean,
		mode: string,
		invoice_id: number,
		fetched: boolean
	}

	type refType = {
		isValid: () => boolean,
		validateFields: () => boolean,
		validateSettings: () => boolean,
	};

	const router = useRouter();
	const route = useRoute();


	const tab_options : Array<string> = ['Invoice Details', 'Custom Fields', 'Settings'];

	const data = useInvoiceStore();

	const d = new Date();
	const timezone_offset_minutes = -(d.getTimezoneOffset());

	const a_data = reactive<InvoiceCreateEditInterface>({
		active_tab_index: 0,
		custom_fields : [],
		payment_method : {
			value : '',
			error : ''
		},
		send_invoice_in_email : true,
		gateways : [],
		btn_disabled : false,
		mode : 'create',
		invoice_id : 0,
		fetched : false
	});

	const { addNewProductRow } = useInvoiceProducts();

	const { reset } = useInvoiceReset();
	
	const custom_fields_tab_ref = ref<refType | null>(null);
	const settings_tab_ref = ref<refType | null>(null);
	const invoice_page_validation = ref<refType | null>(null);

	const fetchInitialData = async () : Promise<void> =>  {

		
		const response = await api.get('manage-invoices/fetch-initial-data', {
			params : {
				timezone_offset_minutes : timezone_offset_minutes
			}
		});

		data.invoice_details.invoice_number.value = response.data.invoice_number;
		data.product_columns = response.data.product_columns;
		
		data.product_columns_slices.push(data.product_columns.slice(0, 6));
		if(data.product_columns.length > 6){
			data.product_columns_slices.push(data.product_columns.slice(6, 9));
		}

		a_data.custom_fields = response.data.custom_fields;
		a_data.gateways = response.data.gateways;

		
		if(a_data.mode === 'create'){
			addNewProductRow();
			a_data.fetched = true;
		}else{
			fetchInvoice(a_data.invoice_id);
		}

	}
	
	const changedActiveTabValue = (tab_index: number) => {
		
		if(tab_index === 0){
			nextTick(() => {
				invoice_page_validation.value?.isValid() ?? false;
			});
		} else if(tab_index === 1){
			nextTick(() => {
				custom_fields_tab_ref.value?.validateFields() ?? false;
			});
		} else if(tab_index === 2){
			nextTick(() => {
				settings_tab_ref.value?.validateSettings() ?? false;
			});
		}

		a_data.active_tab_index = tab_index;
	}
	
	const handleCustomFieldsValidated = (is_valid: boolean) => {
		if(is_valid){
			a_data.active_tab_index = 2;
		}
	}

	const handleInvoicePageValidated = (is_valid: boolean) : void => {
		if(is_valid){
			a_data.active_tab_index = 1;
		}
	}
	
	const handleSettingsValidated = async (is_valid: boolean) => {

		/**
		 * switch tabs by validating server side.
		 * */
		a_data.btn_disabled = true;
		try{

			const post_settings = {
				payment_method : a_data.payment_method.value,
				send_invoice_in_email : a_data.send_invoice_in_email
			};
			
			const post_data = {
								data:data,
								custom_fields:a_data.custom_fields,
								settings : post_settings,
								timezone_offset_minutes : timezone_offset_minutes
							};

			if(a_data.mode === 'create'){
				await api.post('manage-invoices', post_data);
			}else{
				await api.patch('manage-invoices/'+a_data.invoice_id, post_data);
			}
			

			router.push('/invoices');
			
		}catch(e){
			a_data.active_tab_index = e.response.data.tab_switch;
		}finally{
			a_data.btn_disabled = false;
		}

	}

	const fetchInvoice = async (invoice_id : number) : Promise<void> => {

		const timezone_offset_minutes = -(d.getTimezoneOffset());

		const response = await api.get('manage-invoices/'+invoice_id, {
			params : {
				timezone_offset_minutes:timezone_offset_minutes
			}
		});

		data.invoice_details.client.value = response.data.invoice.first_name + ' ' + response.data.invoice.last_name;
		data.invoice_details.client.client_id = response.data.invoice.client_id+'';
		data.invoice_details.currency_id = response.data.invoice.currency_id;
		data.invoice_details.currency_code = response.data.invoice.currency_code;
		data.invoice_details.invoice_date.value = response.data.invoice.invoice_date;

		data.invoice_details.due_date.value = response.data.invoice.due_date;
		data.invoice_details.invoice_number.value = response.data.invoice.invoice_number;
		data.invoice_details.po_number = response.data.invoice.po_number;
		data.invoice_details.global_discount_type = (response.data.invoice.discount_type === 1) ? 'percentage' : 'amount';

		const product_rows = response.data.product_rows;
		
		setTimeout(() => {
			
			data.invoice_details.global_discount = response.data.invoice.discount;
			data.global_discount_amount = response.data.invoice.discount_amount;

			product_rows.forEach(ele => {
				addNewProductRow(ele);
			});
			
			const saved_values = response.data.custom_fields; // raw edit values
			
			a_data.custom_fields = a_data.custom_fields.map(field => {
				
				const saved = saved_values.find(s => s.invoices_custom_field_id === field.id);
				
				if(saved){
					if(saved.invoices_custom_field.custom_field_type.input_type === 'multiselect'){
						field.value = JSON.parse(saved.field_value);
					}else{
						field.value = saved.field_value;
					}
					
				}
				return field;
			});

			data.global_subtotal = response.data.invoice.subtotal;
			data.global_total = response.data.invoice.total;
			data.global_tax_amount = response.data.invoice.tax_amount;

		}, 10);

		a_data.payment_method.value = response.data.invoice.payment_method.toString();
		a_data.send_invoice_in_email = false;
		
		data.invoice_terms = response.data.invoice.invoice_terms;
		a_data.fetched = true;
		
	}

	onMounted(() => {
		
		if(route.path.includes('edit')){
			a_data.mode = 'edit';
			a_data.invoice_id = +route.params.id;
		}
		fetchInitialData();
		
	})

	onUnmounted(() : void => {
		reset();
	});

</script>