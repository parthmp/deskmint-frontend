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
							<p>Drag and drop the rows below to adjust their order.</p>
								<div class="overflow-x-auto overflow-y-visible! styled-scrollbar min-h-[0px]">
									<!-- <div class="min-w-[1000px] mt-[25px]" v-for="(product_row, index_old) in data.product_rows" :key="product_row.id"> -->
										<draggable group="fields" @start="true" @end="printRows" v-model="data.product_rows" item-key="id" :animation="200">
											<template #item="{element, index}">
												<transition-group name="fade" tag="div">
													<div class="rounded-lg p-5 shadow-sm bg-deskmint-sage-green mt-5 border-l-8 border-deskmint-cyan" :key="element.id">
													
														<IconTrash class="float-end text-red-500! cursor-pointer" @click.prevent="removeProductRow(index)"></IconTrash>
														<div class="clear-both"></div>
														<div class="">
															
															<div v-for="(product_column_slice, index) in data.product_columns_slices" :key="index" class="min-w-0">
																
																
																<div class="grid gap-4" :class="{'grid-cols-6' : index === 0, 'grid-cols-3' : index === 1}">
																	
																	<div v-for="(product_column, column_index) in product_column_slice" :key="column_index">
																		
																		
																		<div v-if="product_column.value == 'item'">
																			<input-auto-complete label="Item" v-model="element.item" @selected="handleProductSelect(element)" :error="data.client.error" endpoint="manage-invoices/fetch-products" :required="true" placeholder="Item" :options="data.clients"></input-auto-complete>
																		</div>
																		
																		
																		<!-- Description Field -->
																		<div v-if="product_column.value == 'description'">
																			<input-textarea label="Description" v-model="element.description" placeholder="Description" class="w-full"></input-textarea>
																		</div>
																		
																		<!-- Unit Cost Field -->
																		<div v-if="product_column.value == 'unit_cost'">
																			<input-number :step="0.01" label="Unit cost" v-model="element.unit_cost" placeholder="Unit cost" class="w-full"></input-number>
																		</div>
																		
																		<!-- Quantity Field -->
																		<div v-if="product_column.value == 'quantity'">
																			<input-number :step="1" label="Quantity" v-model="element.quantity" placeholder="quantity" class="w-full"></input-number>
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
																			{{ element.line_total }}
																		</div>
																	
																	</div>
																</div>
															</div>
														
														</div>
													</div>
												</transition-group>
											</template>
										</draggable>
										
									<!-- </div> -->
								</div>
								<div class="clear-both"></div>
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
<style scoped>

</style>
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

	import draggable from 'vuedraggable';

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

	interface InvoiceCreateEditInterface{
		clients : Array<object>,
		products : Array<object>,
		client : object,
		invoice_date : object,
		due_date : object,
		invoice_number : object,
		po_number : string,
		global_discount : number,
		global_discount_type : string,
		product_columns : Array<object>,
		product_columns_slices : Array<object>,
		product_rows : Array<object>,
		product_id : string
	}

	const data = reactive<InvoiceCreateEditInterface>({
		clients : [],
		products : [],
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
		product_rows : [],
		product_id : ''
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
			addNewProductRow();
		}).catch(error => {

		});

	}

	const handleClientSelect = (ev:object) : void => {
		data.client.client_id = ev.value+'';
	}

	const handleProductSelect = (row:object) : void => {
		// data.product_id = ev.value;
		// console.log(data.product_id);

		console.log(`Object: ${JSON.stringify(row)}`);

	}

	const addNewProductRow = () : void => {

		/* create an object to push */

		let row_index = data.product_rows.length;



		let product_row = {
			id : common.random_number(),
			row_index: row_index
		};

		
		for(let row of data.product_columns){

			if(row.type == 'custom' && row?.tax === true){
				product_row['custom_tax_'+common.replaceWithUnderscores(row?.text)] = +row.tax_rate;
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
		
		data.product_rows.push(product_row);
		
		product_row = null;
		

	}

	const removeProductRow = (index:number) : void => {
		data.product_rows.splice(index, 1);
	}

	const printRows = () : void => {
		// console.log(data.product_rows);
	}

	onMounted(() => {
		fetchInitialData();
		
	})

</script>