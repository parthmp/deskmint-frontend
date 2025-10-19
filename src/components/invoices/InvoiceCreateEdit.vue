<template>
	<section class="main-content">
    	<div class="card">
			 <h1 class="text-2xl!">Create an invoice</h1>
			 <br>
			 <tabs :options="tab_options" :horizontal="true">
				<template v-slot:tab-0>
					<div>
						<form>
							
							<div class="lg:grid lg:grid-cols-12 lg:gap-5">
								<div class="lg:col-span-4">
									<div class="grid grid-cols-12 gap-2">
										<div class="col-span-9">
											<input-auto-complete label="Client" v-model="data.client.value" @selected="handleClientSelect" :error="data.client.error" endpoint="manage-invoices/fetch-clients" :required="true" placeholder="Type to select a client" :options="data.clients"></input-auto-complete>
										</div>
										<div class="col-span-3">
											<input-button url="/clients/create" label="New" class="mt-[23.5px]"></input-button>
											
										</div>
										
										
									</div>
								</div>
								<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
									<input-date-time mode="date" label="Invoice date" v-model="data.invoice_date.value" :error="data.invoice_date.error" :required="true" placeholder="Select invoice date"></input-date-time>
								</div>
								<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
									<input-date-time mode="date" label="Due date" v-model="data.due_date.value" :error="data.due_date.error" :required="true" placeholder="Select due date"></input-date-time>
								</div>
							</div>
						
							<div class="lg:grid lg:grid-cols-12 lg:gap-5">
								<div class="lg:col-span-4 mt-[20px]">
									<input-text label="Invoice number" v-model="data.invoice_number.value" :error="data.invoice_number.error" :required="true" placeholder="Invoice number"></input-text>
								</div>
								<div class="lg:col-span-4 mt-[20px]">
									<input-text label="PO number" v-model="data.po_number" :required="true" placeholder="PO number"></input-text>
								</div>
								<div class="lg:col-span-4 mt-[20px]">
									<div class="lg:grid lg:grid-cols-12 lg:gap-2">
										<div class="lg:col-span-6">
											<input-number label="Discount" v-model="data.global_discount" :required="false" placeholder="Discount" :step="0.01"></input-number>
										</div>
										<div class="lg:col-span-6 mt-[20px] lg:mt-[0px]">
											<input-select label="Discount type" v-model="data.global_discount_type" placeholder="Select" :options="discount_options"></input-select>
										</div>
										
									</div>
									
								</div>
							</div>
							
							<br>
							<br>
								<div class="space-y-4 mt-[25px]" v-for="(product_row, index) in data.product_rows" :key="product_row.id">
									<IconTrash class="float-end text-red-500! cursor-pointer m-2" @click.prevent="removeProductRow(index)"></IconTrash>
											
									<div class="rounded-lg p-5 shadow-sm bg-deskmint-sage-green">
										
										
										<div class="overflow-x-auto -mx-4 px-4 styled-scrollbar">
											
											<div v-for="(product_column_slice, index) in data.product_columns_slices" :key="index" class="min-w-0">
												
												<div class="clear-both"></div>
												<div class="grid gap-4 mb-4 min-w-[1000px]" :class="{'grid-cols-6' : index === 0, 'grid-cols-3' : index === 1}">
													
													<div v-for="(product_column, key2) in product_column_slice" :key="key2" class="min-w-0">
														
														<!-- Column Label -->
														<label class="block mb-1.5">
															{{ product_column.text }}
														</label>
														
														<!-- Item Field -->
														<div v-if="product_column.value == 'item'">
															<input-auto-complete 
															v-model="data.client.value" 
															:error="data.client.error" 
															endpoint="manage-invoices/fetch-clients" 
															:required="true" 
															placeholder="Product/Item" 
															:options="data.clients" 
															class="w-full">
															</input-auto-complete>
														</div>
														
														<!-- Description Field -->
														<div v-if="product_column.value == 'description'">
															<input-textarea class="w-full"></input-textarea>
														</div>
														
														<!-- Unit Cost Field -->
														<div v-if="product_column.value == 'unit_cost'">
															<input-number :step="0.01" class="w-full"></input-number>
														</div>
														
														<!-- Quantity Field -->
														<div v-if="product_column.value == 'quantity'">
															<input-number :step="1" class="w-full"></input-number>
														</div>
														
														<!-- Discount Field -->
														<div v-if="product_column.value == 'discount'">
															<input-number :step="0.01" class="w-full"></input-number>
														</div>
														
														<!-- Custom Field -->
														<div v-if="product_column.type == 'custom' && product_column?.tax === true">
															<input-number :step="0.01" class="w-full"></input-number>
														</div>
														<div v-if="product_column.type == 'custom' && product_column?.tax === false">
															<input-text class="w-full"></input-text>
														</div>
														
														<!-- Gross Line Total Field -->
														<div v-if="product_column.value == 'gross_line_total'">
															<input-number :step="0.01" class="w-full"></input-number>
														</div>
														
														<!-- Tax Field -->
														<div v-if="product_column.value == 'tax'">
															<input-number :step="0.01" class="w-full"></input-number>
														</div>
														
														<!-- Line Total Display -->
														<div v-if="product_column.value == 'line_total'" 
															class="font-semibold text-lg text-gray-900 pt-1">
															TOTAL
														</div>
													
													</div>
												</div>
											</div>
										
										</div>
									</div>
									
									
								</div>

								<input-button @click.prevent="addNewProductRow" label="Add" icon="IconPlus" class="lg:float-start"></input-button>
									<div class="clear-both"></div>

						</form>
					</div>
				</template>
				<template v-slot:tab-1>
					<div>
						invoice cf here
					</div>
				</template>
				<template v-slot:tab-2>
					<div>
						invoice settings here
					</div>
				</template>
			 </tabs>
		</div>
	</section>
</template>
<script lang="ts" setup>

	import { onMounted, reactive } from 'vue';
	import Tabs from '../UI/Tabs.vue';
	import InputAutoComplete from '../inputs/InputAutoComplete.vue';
	import InputDateTime from '../inputs/InputDateTime.vue';
	import InputText from '../inputs/InputText.vue';
	import InputNumber from '../inputs/InputNumber.vue';
	import InputSelect from '../inputs/InputSelect.vue';
	import InputTextarea from '../inputs/InputTextarea.vue';

	import { IconTrash } from '@tabler/icons-vue';

	import InputButton from '../inputs/InputButton.vue';
	import api from '../../helpers/api';
import common from '../../helpers/common';

	const tab_options = ['Invoice Details', 'Custom Fields', 'Settings'];
	const discount_options = [
		{
			text: 'Percentage',
			value: 'percentage'
		},
		{
			text: 'Amount',
			value: 'amount'
		}
	];

	const data = reactive({
		clients : [],
		client : {
			value : '',
			error : 'Please select a client',
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
		product_columns : [],
		product_columns_slices : [],
		product_rows : []
	});

	const fetchInitialData = () : void =>  {

		const d = new Date();
		const timezone_offset_minutes = d.getTimezoneOffset();

		api.get('manage-invoices/fetch-initial-data', {
			params : {
				timezone_offset_minutes : timezone_offset_minutes
			}
		}).then(response => {
			data.invoice_number.value = response.data.invoice_number;
			data.product_columns = response.data.product_columns;
			data.product_columns_slices.push(data.product_columns.slice(0, 6));
			if(data.product_columns.length > 6){
				data.product_columns_slices.push(data.product_columns.slice(6, 9));
			}
			
		}).catch(error => {

		});

	}

	const handleClientSelect = (ev:object) : void => {
		data.client.client_id = ev.value+'';
	}

	const addNewProductRow = () : void => {
		data.product_rows.push({
			some : "thing",
			id: common.random_number()
		});
	}

	const removeProductRow = (index:number) : void => {
		data.product_rows.splice(index, 1);
	}

	onMounted(() => {
		fetchInitialData();
		addNewProductRow();
	})

</script>