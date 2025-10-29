<template>
	<section class="main-content">
    	<div class="card">
			 <h1 class="text-2xl!">Create an invoice</h1>
			 <br>
			 <tabs :options="tab_options" :horizontal="true" :active_tab_index="data.active_tab_index" :disable_further="false" @tab-changed="changedActiveTabValue">
				<template v-slot:tab-0>
					<div>
						<form @submit.prevent="validateInvoiceDetails">
							
							<invoice-details v-model="data.invoice_details" ref="invoice_details_ref"></invoice-details>
							
							<br>
							<br>
								<div class="overflow-x-auto overflow-y-visible! styled-scrollbar min-h-[0px]">
									<draggable class="min-w-[1000px] mt-[25px]" group="fields" @start="true" @end="printRows" v-model="data.product_rows" item-key="id" :animation="200" handle=".drag-handle">
										<template #item="{element, index}">
											<transition-group name="fade" tag="div">
												
												<div class="rounded-lg p-5 shadow-sm bg-deskmint-sage-green mt-5 relative" :key="index">
													<IconGrain class="absolute left-0 top-0 drag-handle block"></IconGrain>
													<IconTrash class="float-end text-red-500! cursor-pointer" @click.prevent="removeProductRow(element)"></IconTrash>
													<div class="clear-both"></div>
													<div class="">
														
														<div v-for="(product_column_slice, index2) in data.product_columns_slices" :key="index" class="min-w-0">
															
															
															<div class="grid gap-4 mt-2" :class="{'grid-cols-6' : index2 === 0, 'grid-cols-3' : index2 === 1}">
																
																<div v-for="(product_column, column_index) in product_column_slice" :key="column_index">
																	
																	
																	<div v-if="product_column.value == 'item'">
																		<input-auto-complete label="Item" v-model="element.item" @selected="selected_item => handleProductSelect(selected_item, element)" :error="data.invoice_details.client.error" endpoint="manage-invoices/fetch-products" :required="true" placeholder="Item" :options="data.clients"></input-auto-complete>
																	</div>
																	
																	
																	<!-- Description Field -->
																	<div v-if="product_column.value == 'description'">
																		<input-textarea :rows="1" label="Description" v-model="element.description" placeholder="Description" class="w-full"></input-textarea>
																	</div>
																	
																	<!-- Unit Cost Field -->
																	<div v-if="product_column.value == 'unit_cost'">
																		<input-number :step="0.01" label="Unit cost" v-model="element.unit_cost" placeholder="Unit cost" class="w-full"></input-number>
																	</div>
																	
																	<!-- Quantity Field -->
																	<div v-if="product_column.value == 'quantity'">
																		<input-number :step="1" label="Quantity" v-model="element.quantity" placeholder="Quantity" class="w-full"></input-number>
																	</div>
																	
																	
																	
																	<!-- Custom Field -->
																	<div v-if="product_column.type == 'custom' && product_column?.tax === true">
																		<input-number :step="0.01" :label="product_column?.text" v-model="element['custom_tax_'+common.replaceWithUnderscores(product_column?.text)]" :placeholder="product_column?.text" class="w-full"></input-number>
																	</div>
																	<div v-if="product_column.type == 'custom' && product_column?.tax === false">
																		<input-text class="w-full" :label="product_column?.text" v-model="element['normal_'+common.replaceWithUnderscores(product_column?.text)]" :placeholder="product_column?.text"></input-text>
																	</div>
																	
																	
																	<!-- Tax Field -->
																	<div v-if="product_column.value == 'tax'">
																		<input-number :step="0.01" label="Tax %" v-model="element.tax" placeholder="Tax %" class="w-full"></input-number>
																	</div>
																	
																	<!-- Line Total Display -->
																	<div v-if="product_column.value == 'line_total'" class="font-semibold text-lg text-gray-900 pt-1">
																		TOTAL<br>
																		{{ element.line_total }} {{ data.invoice_details.currency_code }}
																	</div>
																
																</div>
															</div>
														</div>
													
													</div>
												</div>
											</transition-group>
										</template>
									</draggable>
								</div>
								<div class="clear-both"></div>
								<input-button @click.prevent="addNewProductRow" type="button" label="Add" icon="IconPlus" class="lg:float-start"></input-button>
								<div class="clear-both"></div>
								<br>
								<div class="lg:grid lg:grid-cols-12 lg:gap-5">
									<div class="lg:col-span-9">
										<input-textarea label="Invoice terms" placeholder="Invoice terms" v-model="data.invoice_terms" :rows="4"></input-textarea>
									</div>
									<div class="lg:col-span-3">
										<p class="text-xl! mb-[5px]">Subtotal : {{ data.global_subtotal }} {{ data.invoice_details.currency_code }}</p>
										<p class="text-xl! mb-[5px]">Tax : {{ data.global_tax_amount }} {{ data.invoice_details.currency_code }}</p>
										<p class="text-xl! mb-[5px]">Discount amount: {{ data.invoice_details.global_discount_amount }} {{ data.invoice_details.currency_code }}</p>
										<p class="text-xl! mb-[5px]">Total : {{ data.global_total }} {{ data.invoice_details.currency_code }}</p>
										<p class="text-xl! mb-[5px]">Balance due : {{ data.global_total }} {{ data.invoice_details.currency_code }}</p>
									</div>
								</div>
								<input-button btn_text="Next" icon="IconCaretRight" class="lg:float-end"></input-button>
								<div class="clear-both"></div>

						</form>
					</div>
				</template>
				<template v-slot:tab-1>
					<div>
						<CustomFieldsRenderer v-model="data.custom_fields" @validated="handleCustomFieldsValidated" ref="custom_fields_tab_ref"></CustomFieldsRenderer>
					</div>
				</template>
				<template v-slot:tab-2>
					<SettingsTab v-model:payment_method="data.payment_method" v-model:send_invoice_in_email="data.send_invoice_in_email" @validated="handleSettingsValidated" ref="settings_tab_ref"></SettingsTab>
				</template>
			 </tabs>
		</div>
	</section>
</template>
<style scoped>

</style>
<script lang="ts" setup>

	import { nextTick, onMounted, reactive, ref, toRaw, watch, type Ref } from 'vue';
	import Tabs from '../UI/Tabs.vue';
	import InputAutoComplete from '../inputs/InputAutoComplete.vue';
	import InputText from '../inputs/InputText.vue';
	import InputNumber from '../inputs/InputNumber.vue';
	import InputTextarea from '../inputs/InputTextarea.vue';
	
	import SettingsTab from './blocks/SettingsTab.vue';

	import CustomFieldsRenderer from '../blocks/custom_fields_templates/CustomFieldsRenderer.vue';

	import InvoiceDetails from './blocks/InvoiceDetails.vue';

	import { IconTrash } from '@tabler/icons-vue';

	import InputButton from '../inputs/InputButton.vue';
	import api from '../../helpers/api';
	import common from '../../helpers/common';

	import draggable from 'vuedraggable';

	import { IconGrain } from '@tabler/icons-vue';

	import Decimal from 'decimal.js';
	import { toastEvents } from '../../events/toastEvents';

	const tab_options = ['Invoice Details', 'Custom Fields', 'Settings'];
	

	interface InvoiceCreateEditInterface{
		clients : Array<object>,
		products : Array<object>,
		invoice_details : object,
		global_discount_amount : string,
		product_columns : Array<object>,
		product_columns_slices : Array<object>,
		product_rows : Array<object>,
		product_id : string,
		global_subtotal: string,
		global_total : string,
		global_tax_amount : string,
		invoice_terms: string,
		active_tab_index: number,
		custom_fields : Array<object>,
		payment_method : object,
		send_invoice_in_email : boolean
	}


	const data = reactive<InvoiceCreateEditInterface>({
		clients : [],
		products : [],
		invoice_details : {
			client : {
				value : '',
				error : 'Please select a client',
				show_errors : false,
				client_id : ''
			},
			invoice_date : {
				value : new Date(),
				error : 'Please select invoice date'
			},
			due_date : {
				value : null,
				error : 'Please select due date'
			},
			invoice_number : {
				value : '',
				error : 'Please enter invoice number'
			},
			po_number : '',
			global_discount : 0,
			global_discount_type: 'percentage',
			currency_id : 0,
			currency_code : '',
		},
		global_discount_amount: '0.00',
		product_columns : [],
		product_columns_slices : [],
		product_rows : [],
		product_id : '',
		
		global_subtotal : '0.00',
		global_total : '0.00',
		global_tax_amount : '0.00',
		invoice_terms: '',
		active_tab_index: 0,
		custom_fields : [],
		payment_method : {
			value : 'cash',
			error : ''
		},
		send_invoice_in_email : true
	});


	
	const custom_fields_tab_ref = ref(null);
	const settings_tab_ref = ref(null);
	const invoice_details_ref = ref(null);
	
	/* watchers */
	watch(() => [data.invoice_details.global_discount_type, data.invoice_details.global_discount], () => {
		calculateGlobalTotals();
	});

	watch(() => data.product_rows, (rows) => {
		rows.forEach(row => calculateItemCost(row));
		calculateGlobalTotals();
	}, { deep:true });


	const fetchInitialData = () : void =>  {

		const d = new Date();
		const timezone_offset_minutes = d.getTimezoneOffset();

		api.get('manage-invoices/fetch-initial-data', {
			params : {
				timezone_offset_minutes : timezone_offset_minutes
			}
		}).then(response => {
			data.invoice_details.invoice_number.value = response.data.invoice_number;
			data.product_columns = response.data.product_columns;
			data.product_columns_slices.push(data.product_columns.slice(0, 6));
			if(data.product_columns.length > 6){
				data.product_columns_slices.push(data.product_columns.slice(6, 9));
			}
			addNewProductRow();
		}).catch(error => {

		});

	}

	const handleProductSelect = (row:object, element:object) : void => {
		
		if(Object.keys(row).length > 0){
			
			for(const key in element){
				element.quantity = 1;
				if(key === 'description'){
					element.description = row.data.product.description;
				}
				if(key === 'unit_cost'){
					element.unit_cost = row.data.product.price;
				}
				if(key === 'item'){
					element.item_id = row.value+'';
					element.item = row.text+'';
				}
				
			}
			calculateItemCost(element);
			calculateGlobalTotals();
		}
		
	}

	const calculateItemCost = (row:object) : void => {
		const raw_row = toRaw(row);
		if(common.isset(raw_row?.item_id)){

			raw_row.tax_amount = new Decimal(0);
			raw_row.line_subtotal = new Decimal(0);
			
			raw_row.line_total = new Decimal(0);

			if (raw_row.item_id !== '') {
				
				const quantity = new Decimal(raw_row.quantity || 0);
				const unit_cost = new Decimal(raw_row.unit_cost || 0);

				// line_subtotal = quantity × unit_cost
				const line_subtotal = quantity.mul(unit_cost);
				raw_row.line_subtotal = line_subtotal.toNumber();

				// calculate total tax for the line
				let tax_amount = new Decimal(0);
				
				for (const key in raw_row) {
					if(key.includes("tax")){
						const tax_percent = new Decimal(raw_row[key] || 0);
						tax_amount = tax_amount.add(line_subtotal.mul(tax_percent.div(100)));
					}
				}

				raw_row.tax_amount = tax_amount.toNumber();

				// line_total = subtotal + tax
				const lineTotal = line_subtotal.add(tax_amount);
				raw_row.line_total = lineTotal.toFixed(2);

			}
			Object.assign(row, raw_row);
		}
		
	}

	const calculateGlobalTotals = () : void => {
		
		let global_subtotal = new Decimal(0);
		let global_tax = new Decimal(0);
		let global_total = new Decimal(0);
		let global_discount_amount = new Decimal(0);

		for(const row of data.product_rows){

			const subtotal = new Decimal(row.line_subtotal || 0);
			const tax = new Decimal(row.tax_amount || 0);
			const line_total = subtotal.add(tax);

			global_subtotal = global_subtotal.add(subtotal);
			global_tax = global_tax.add(tax);
			global_total = global_total.add(line_total);
			
		}

		data.global_subtotal = global_subtotal.toFixed(2);
		data.global_tax_amount = global_tax.toFixed(2);

		data.global_total = global_total.toFixed(2);

		if(data.invoice_details.global_discount_type !== ''){
			if(data.invoice_details.global_discount_type === 'percentage'){
				let global_discount_perc = new Decimal(data.invoice_details.global_discount);
				global_discount_amount = global_discount_amount.add(global_total.mul(global_discount_perc.div(100)));
			}else{
				global_discount_amount = new Decimal(data.invoice_details.global_discount);
			}
		}else{
			data.invoice_details.global_discount = 0;
		}

		data.invoice_details.global_discount_amount = global_discount_amount.toFixed(2);

		
		
		data.global_total = global_total.sub(data.invoice_details.global_discount_amount).toFixed(2);

		
	}

	const addNewProductRow = () : void => {

		/* create an object to push */

		let row_index = data.product_rows.length;

		const product_row = {
			id : Date.now() + '_' + Math.random().toString(36).slice(2),
			row_index: row_index
		};

		
		for(let row of data.product_columns){

			if(row.type == 'custom' && row?.tax === true){
				const key = 'custom_tax_' + common.replaceWithUnderscores(row?.text);
				product_row[key] = +row.tax_rate;

			}else if(row.type == 'custom' && row?.tax === false){

				product_row['normal_'+common.replaceWithUnderscores(row?.text)] = '';

			}else{

				if(row.value == 'tax' || row.value == 'line_total'){
					
					product_row[row.value] = 0;
				}else{
					product_row[row.value] = '';
				}

			}
			

		}

		product_row.item_id = '';
		product_row.line_subtotal = 0;
		product_row.tax_amount = 0;
		
		data.product_rows.push(product_row);

	}

	const removeProductRow = (row:object) : void => {

		// remove the object from the array
		const index = data.product_rows.indexOf(row);
		if (index !== -1) {
			data.product_rows.splice(index, 1);
		}

		// recalc totals
  		calculateGlobalTotals();

	}

	const printRows = () : void => {
		// console.log(data.product_rows);
	}

	const validateInvoiceDetails = () : void => {
		
		let validated = true;

		validated = invoice_details_ref.value.validateInvoiceDetails();

		if(!validated){
			toastEvents.emit('toast', {
				type : 'error',
				message : 'Please fill in highlighted fields'
			});
		}else{

			if(data.product_rows.length === 0){
				validated = false;
				toastEvents.emit('toast', {
					type : 'error',
					message : 'Please add at at least one product row for invoice'
				});
			}else{
				for(const row of data.product_rows){
					if(row.item_id === ''){
						validated = false;
						toastEvents.emit('toast', {
							type : 'error',
							message : 'Please select an item for each product row for invoice'
						});
						break;
					}
				}

				
			}

			

		}

		if(validated){
			data.active_tab_index = 1;
		}
		
	}
	
	const changedActiveTabValue = (tab_index: number) => {
		
		if(tab_index === 0){
			nextTick(() => {
				invoice_details_ref.value?.validateInvoiceDetails();
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
	
	const handleSettingsValidated = (is_valid: boolean) => {
		if(is_valid){
			// Submit the invoice or move to next step
			console.log('All validated, submit invoice');
			console.log(data);
		}
	}
	
	const fetchCustomFields = () : void => {
		api.get('manage-invoices/fetch-invoice-custom-fields').then((response) => {
			data.custom_fields = response.data.data_fields;
		});
	}

	onMounted(() => {
		fetchInitialData();
		fetchCustomFields();
	})

</script>