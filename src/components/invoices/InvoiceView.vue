<template>
	<section class="main-content">
    	<div class="card">
			<div>
				<h1 class="text-2xl!">View Invoice</h1>
				<input-button class="lg:float-start" btn_text="Back" url="/invoices" icon="IconCaretLeft"></input-button>
				<div class="clear-both"></div>
				<br>
				<div>
					<div>
						<h2 class="text-xl!">Invoice details</h2>
						<br>
						
						<div class="lg:grid lg:grid-cols-12 gap-5">
							<div class="lg:col-span-4">
								<p>Client: {{ data.invoice_details.client }}</p>
							</div>
							<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
								<p>Invoice date: {{ common.formatDate(data.invoice_details.invoice_date, true) }}</p>
							</div>
							<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
								<p>Due date: {{ common.formatDate(data.invoice_details.due_date, true) }}</p>
							</div>
						</div>

						<div class="lg:grid lg:grid-cols-12 gap-5">
							<div class="lg:col-span-4 mt-[20px]">
								<p>Invoice #: {{ data.invoice_details.invoice_number }}</p>
							</div>
							<div class="lg:col-span-4 mt-[20px]">
								<p>PO number: {{ data.invoice_details.po_number }}</p>
							</div>
							<div class="lg:col-span-4 mt-[20px]">
								<p>Discount type: {{ (data.invoice_details.discount_type === 2) ? 'Amount' : 'Percentage' }} - ({{data.invoice_details.discount_amount}} {{data.invoice_details.currency_code}})</p>
							</div>
						</div>
						<br>
						
					
							<div class="mt-4 p-4 rounded-lg bg-deskmint-sage-green" v-for="(product_row, index3) in data.product_rows" :key="index3">
									
							<div class="">
								
								<div v-for="(product_column_slice, index2) in data.product_columns_slices" :key="index2" class="min-w-0">
									
									
									<div class="grid gap-4 mt-2" :class="{'grid-cols-6' : index2 === 0, 'grid-cols-3' : index2 === 1}">
										
										<div v-for="(product_column, column_index) in product_column_slice" :key="column_index">
											
											
											<div v-if="product_column.value == 'item'">
												{{ product_column.text }} : {{product_row.item}}
											</div>
											
											
											<!-- Description Field -->
											<div v-if="product_column.value == 'description'">
												{{ product_column.text }} : {{product_row.description}}
											</div>
											
											<!-- Unit Cost Field -->
											<div v-if="product_column.value == 'unit_cost'">
												{{ product_column.text }} : {{ product_row.unit_price.toFixed(2) }}
											</div>
											
											<!-- Quantity Field -->
											<div v-if="product_column.value == 'quantity'">
												{{ product_column.text }} : {{ product_row.quantity }}
											</div>
											
											
											
											<!-- Custom Field -->
											<div v-if="product_column.type == 'custom' && product_column?.tax === true">
												
												{{ product_column.text }} : {{ product_row['custom_tax_'+common.replaceWithUnderscores(product_column?.text+'')] }}
											</div>
											<div v-if="product_column.type == 'custom' && product_column?.tax === false">
												
												{{ product_column.text }} : {{ product_row['normal_'+common.replaceWithUnderscores(product_column?.text+'')] }}
											</div>
											
											
											<!-- Tax Field -->
											<div v-if="product_column.value == 'tax'">
												
												Tax : {{ product_row.tax }}%
											</div>
											
											<!-- Line Total Display -->
											<div v-if="product_column.value == 'line_total'" class="font-semibold text-lg text-gray-900 pt-1">
												TOTAL<br>
												{{ product_row.line_total }} {{ data.invoice_details.currency_code }}
											</div>
										
										</div>
									</div>
								</div>
							
							</div>
						</div>
						<br>
						<div class="lg:grid lg:grid-cols-12 lg:gap-5">
						<div class="lg:col-span-9">
							<div>
								<p>Terms</p>
								<p>{{ data.invoice_terms }}</p>
							</div>
						</div>
						<div class="lg:col-span-3">
							<p class="text-xl! mb-[5px]">Subtotal : {{ data.global_subtotal }} {{ data.invoice_details.currency_code }}</p>
							<p class="text-xl! mb-[5px]">Tax : {{ data.global_tax_amount }} {{ data.invoice_details.currency_code }}</p>
							<p class="text-xl! mb-[5px]">Discount amount: {{ data.global_discount_amount }} {{ data.invoice_details.currency_code }}</p>
							<p class="text-xl! mb-[5px]">Total : {{ data.global_total }} {{ data.invoice_details.currency_code }}</p>
							<p class="text-xl! mb-[5px]">Balance due : {{ data.global_total }} {{ data.invoice_details.currency_code }}</p>
						</div>
					</div>
					</div>
					<br>
					<hr>
					<br>

					<div>
						<h2 class="text-xl!">Custom fields</h2>
						<br>
						<div class="lg:grid lg:grid-cols-12 gap-5">
							<div v-for="(field, key) in data.custom_fields" :key="key" :class="{'lg:col-span-12' : (field.span === 12), 'lg:col-span-6' : (field.span === 6), 'lg:col-span-4' : (field.span === 4)}">
								<div>
									<p>{{ field.label }}: {{ field.value }}</p>
								</div>
							</div>
							
						</div>
						<br>
						<br>
					</div>
					<div>
						<h2 class="text-xl!">Settings</h2>
						<br>
						<p>Payment method: {{ data.payment_method_str }}</p>
						<br>
						<br>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">

import { nextTick, onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import api from '../../helpers/api';
import InputButton from '../inputs/InputButton.vue';
import common from '../../helpers/common';

type ClientDetails = {
	client: string,
	invoice_date: string,
	due_date : string,
	invoice_number : string,
	po_number:string,
	discount_type : number,
	discount_amount : number,
	currency_code : string,
	global_discount_type : string,
	global_discount : number,
};

type ColumnSlice = {
	text:string,
	value: string,
	type:string,
	tax:boolean
};

type productRow = {
	item : string,
	description : string,
	unit_price : number,
	quantity : number,
	tax : number,
	line_total : number
};

type customFields = {
	id : number,
	invoices_custom_field_id : number,
	span: number,
	label : string,
	value : string|number,
	custom_field_type : {
		input_type : string
	}
}

interface InvoiceViewInterface{
	product_columns : Array<ColumnSlice>,
	product_columns_slices : Array<Array<ColumnSlice>>,
	invoice_id:number,
	timezone_offset_minutes:number,
	custom_fields: Array<customFields>,
	invoice_details: ClientDetails,
	global_discount_amount: number,
	global_subtotal: number,
	global_total: number,
	global_tax_amount: number,
	payment_method: number,
	payment_method_str: string,
	invoice_terms: string,
	product_rows: Array<productRow>
}

const route = useRoute();

const data = reactive<InvoiceViewInterface>({
	product_columns: [],
	product_columns_slices : [],
	invoice_id : 0,
	timezone_offset_minutes : 0,
	custom_fields : [],
	invoice_details : {
		client: '',
		invoice_date : '',
		due_date : '',
		invoice_number : '',
		po_number : '',
		discount_type : -1,
		discount_amount : -1,
		currency_code : '',
		global_discount_type : '',
		global_discount: 0	
	},
	global_discount_amount : 0,
	global_subtotal : 0,
	global_total : 0,
	global_tax_amount : 0,
	payment_method : 0,
	payment_method_str : '',
	invoice_terms : '',
	product_rows: []

});


const fetchInitialData = async () : Promise<void> =>  {

	const response = await api.get('manage-invoices/fetch-initial-data', {
		params : {
			timezone_offset_minutes : data.timezone_offset_minutes
		}
	});

	//data.invoice_details. = response.data.invoice_number;
	data.product_columns = response.data.product_columns;
	
	data.product_columns_slices.push(data.product_columns.slice(0, 6));
	if(data.product_columns.length > 6){
		data.product_columns_slices.push(data.product_columns.slice(6, 9));
	}

	data.custom_fields = response.data.custom_fields;
	//a_data.gateways = response.data.gateways;
	console.log(data.custom_fields);
				
	
	
	fetchInvoice(data.invoice_id);
	

}

const addNewProductRowView = (obj:any|null = null) : void => {

	let row_index = 0;

	if(obj){
	
		data.product_rows.push(obj);
		row_index = data.product_rows.length;
	}else{
		
		
	}

	
	
}
const fetchInvoice = async (invoice_id : number) : Promise<void> => {

		const response = await api.get('manage-invoices/'+invoice_id, {
			params : {
				timezone_offset_minutes:data.timezone_offset_minutes
			}
		});

		data.invoice_details.client = response.data.invoice.first_name + ' ' + response.data.invoice.last_name;
		data.invoice_details.currency_code = response.data.invoice.currency_code;
		data.invoice_details.invoice_date = response.data.invoice.invoice_date;
		data.invoice_details.discount_amount = response.data.invoice.discount_amount;

		data.invoice_details.due_date = response.data.invoice.due_date;
		data.invoice_details.invoice_number = response.data.invoice.invoice_number;
		data.invoice_details.po_number = response.data.invoice.po_number;
		data.invoice_details.global_discount_type = (response.data.invoice.discount_type === 1) ? 'percentage' : 'amount';

		const product_rows = response.data.product_rows;
		
		await nextTick();
		//setTimeout(() => {
			
			data.invoice_details.global_discount = response.data.invoice.discount;
			data.global_discount_amount = response.data.invoice.discount_amount;

			product_rows.forEach((ele:productRow) => {
				addNewProductRowView(ele);
			});
			
			const saved_values = response.data.custom_fields; // raw edit values
			
			data.custom_fields = data.custom_fields.map(field => {

				const saved = saved_values.find((s:customFields) => s.invoices_custom_field_id === field.id);
				if(saved){
					
					if(field.custom_field_type.input_type === 'multiselect'){
						field.value = JSON.parse(saved.field_value).join(', ');
					}else if(field.custom_field_type.input_type === 'datetime'){
						field.value = common.formatDate(saved.field_value);
					}else if(field.custom_field_type.input_type === 'date'){
						field.value = common.formatDate(saved.field_value, true);
					}else{
						field.value = saved.field_value+'';
					}
				}
				return field;

			});

			data.global_subtotal = response.data.invoice.subtotal;
			data.global_total = response.data.invoice.total;
			data.global_tax_amount = response.data.invoice.tax_amount;

		//}, 10);

		data.payment_method = +response.data.invoice.payment_method;
		console.log(data.payment_method);
		if(data.payment_method == 1){
			data.payment_method_str = 'Cash';
		}else if(data.payment_method == 2){
			data.payment_method_str = 'Netbanking';
		}else if(data.payment_method == 3){
			data.payment_method_str = 'PayPal';
		}else if(data.payment_method == 4){
			data.payment_method_str = 'Stripe';
		}
		//data.send_invoice_in_email = false;
		
		data.invoice_terms = response.data.invoice.invoice_terms;
		//data.fetched = true;
		
		
	}


onMounted(() => {
	if(route.path.includes('view')){
		data.invoice_id = +route.params.id;
		const d = new Date();
		data.timezone_offset_minutes = -(d.getTimezoneOffset());
		fetchInitialData();
	}
	
});

</script>