<template>
	<section class="main-content">
    	<div class="card">
			 <h1 class="text-2xl!">Create an invoice</h1>
			 <br>
			 <tabs :options="tab_options" :horizontal="true" :active_tab_index="data.active_tab_index" :disable_further="false" @tab-changed="changedActiveTabValue">
				<template v-slot:tab-0>
					<invoice-page ref="invoice_page_validation" @validated="handleInvoicePageValidated"></invoice-page>
				</template>
				<template v-slot:tab-1>
					<div>
						<CustomFieldsRenderer v-model="data.custom_fields" @validated="handleCustomFieldsValidated" ref="custom_fields_tab_ref"></CustomFieldsRenderer>
					</div>
				</template>
				<template v-slot:tab-2>
					<SettingsTab v-model:payment_method="data.payment_method" v-model:send_invoice_in_email="data.send_invoice_in_email" v-model:gateways="data.gateways" @validated="handleSettingsValidated" ref="settings_tab_ref"></SettingsTab>
				</template>
			 </tabs>
		</div>
	</section>
</template>
<style scoped>

</style>
<script lang="ts" setup>

	import { nextTick, onMounted, onUnmounted, reactive, ref, toRaw, watch, type Ref } from 'vue';
	import Tabs from '../UI/Tabs.vue';

	import SettingsTab from './blocks/SettingsTab.vue';

	import CustomFieldsRenderer from '../blocks/custom_fields_templates/CustomFieldsRenderer.vue';
	import api from '../../helpers/api';
	import { useInvoiceStore } from '../../composables/invoice/useInvoiceStore';
	import { useInvoiceProducts } from '../../composables/invoice/useInvoiceProducts';
	import InvoicePage from './blocks/InvoicePage.vue';
	import { useInvoiceReset } from '../../composables/invoice/useInvoiceReset';

	const tab_options : Array<string> = ['Invoice Details', 'Custom Fields', 'Settings'];

	const data = useInvoiceStore();
	const { addNewProductRow } = useInvoiceProducts();

	const { reset } = useInvoiceReset();
	
	const custom_fields_tab_ref = ref(null);
	const settings_tab_ref = ref(null);
	const invoice_page_validation = ref(null);

	const fetchInitialData = async () : Promise<void> =>  {

		const d = new Date();
		const timezone_offset_minutes = d.getTimezoneOffset();

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

		data.custom_fields = response.data.custom_fields;
		data.gateways = response.data.gateways.map(ele => {
			return {
				text : ele,
				value : ele.toLowerCase()
			};
		});

		
		addNewProductRow();

	}
	
	const changedActiveTabValue = (tab_index: number) => {
		
		if(tab_index === 0){
			nextTick(() => {
				invoice_page_validation.value?.isValid();
			});
		} else if(tab_index === 1){
			nextTick(() => {
				custom_fields_tab_ref.value?.validateFields();
			});
		} else if(tab_index === 2){
			nextTick(() => {
				settings_tab_ref.value?.validateSettings();
			});
		}

		data.active_tab_index = tab_index;
	}
	
	const handleCustomFieldsValidated = (is_valid: boolean) => {
		if(is_valid){
			data.active_tab_index = 2;
		}
	}

	const handleInvoicePageValidated = (is_valid: boolean) : void => {
		if(is_valid){
			data.active_tab_index = 1;
		}
	}
	
	const handleSettingsValidated = (is_valid: boolean) => {
		if(is_valid){
			// Submit the invoice or move to next step
			console.log('All validated, submit invoice');
			console.log(data);
		}
	}

	onMounted(() => {
		fetchInitialData();
	})

	onUnmounted(() : void => {
		reset();
	});

</script>