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
											<input-auto-complete label="Client" v-model="data.client.value" :error="data.client.error" endpoint="manage-invoices/fetch-clients" :required="true" placeholder="Type to select a client" :options="data.clients"></input-auto-complete>
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
							<div class="flex gap-5 mt-[40px]">
								<span v-for="(product_column, key) in data.product_columns" :key="key" class="grow text-left w-[150px]">
									{{ product_column.text }}
									
								</span>
								
								<!-- <product-row class="mt-[20px]" :data="product_column"></product-row> -->
							</div>
							<div class="flex gap-5">
								<span v-for="(product_column, key) in data.product_columns" :key="key" class="grow w-[150px]">
									<span v-if="product_column.value == 'item'">
										<input-auto-complete v-model="data.client.value" :error="data.client.error" endpoint="manage-invoices/fetch-clients" :required="true" placeholder="Product/Item" :options="data.clients"></input-auto-complete>
									</span>
									<span v-if="product_column.value == 'description'">
										<input-textarea></input-textarea>
									</span>
									<span v-if="product_column.value == 'unit_cost'">
										<input-number :step="0.01"></input-number>
									</span>
									<span v-if="product_column.value == 'quantity'">
										<input-number :step="1"></input-number>
									</span>
									<span v-if="product_column.value == 'discount'">
										<input-number :step="0.01"></input-number>
									</span>
								</span>
							</div>
						</form>
					</div>
				</template>
				<template v-slot:tab-1>
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

	import ProductRow from './blocks/ProductRow.vue';

	import InputButton from '../inputs/InputButton.vue';
	import api from '../../helpers/api';

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
			error : 'Please select a client'
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
		product_columns : []
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
		}).catch(error => {

		});

	}

	onMounted(() => {
		
		fetchInitialData();
	})

</script>