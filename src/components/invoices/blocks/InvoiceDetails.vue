<template>
	<div class="lg:grid lg:grid-cols-12 lg:gap-5">
		<div class="lg:col-span-4">
			<div class="grid grid-cols-12 gap-2">
				<div class="col-span-9">
					<input-auto-complete label="Client" v-model="details.client.value" @selected="handleClientSelect" :error="details.client.error" endpoint="manage-invoices/fetch-clients" :required="true" placeholder="Type to select a client" :options="details.clients" :show_errors="details.client.show_errors"></input-auto-complete>
				
				</div>
				<div class="col-span-3">
					<input-button url="/clients/create" label="New" class="mt-[23.5px]"></input-button>
					
				</div>
				
				
			</div>
		</div>
		<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
			<input-date-time mode="date" label="Invoice date" v-model="details.invoice_date.value" :error="details.invoice_date.error" :required="true" ref="invoice_date_ref" placeholder="Select invoice date"></input-date-time>
		</div>
		<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
			<input-date-time mode="date" label="Due date" v-model="details.due_date.value" :error="details.due_date.error" :required="true" placeholder="Select due date" ref="due_date_ref"></input-date-time>
		</div>
	</div>

	<div class="lg:grid lg:grid-cols-12 lg:gap-5">
		<div class="lg:col-span-4 mt-[20px]">
			<input-text label="Invoice number" v-model="details.invoice_number.value" :error="details.invoice_number.error" :required="true" placeholder="Invoice number" ref="invoice_number_ref"></input-text>
		</div>
		<div class="lg:col-span-4 mt-[20px]">
			<input-text label="PO number" v-model="details.po_number" :required="false" placeholder="PO number"></input-text>
		</div>
		<div class="lg:col-span-4 mt-[20px]">
			<div class="lg:grid lg:grid-cols-12 lg:gap-2">
				<div class="lg:col-span-6">
					<input-number label="Discount" v-model="details.global_discount" :required="false" placeholder="Discount" :step="0.01"></input-number>
				</div>
				<div class="lg:col-span-6 mt-[20px] lg:mt-[0px]">
					<input-select label="Discount type" v-model="details.global_discount_type" :required="false" :options="discount_options"></input-select>
				</div>
				
			</div>
			
		</div>
	</div>
</template>

<script lang="ts" setup>

	import { nextTick, ref, watch } from 'vue';

	import InputAutoComplete from '../../inputs/InputAutoComplete.vue';
	import InputButton from '../../inputs/InputButton.vue';
	import InputDateTime from '../../inputs/InputDateTime.vue';
	import InputText from '../../inputs/InputText.vue';
	import InputNumber from '../../inputs/InputNumber.vue';
	import InputSelect from '../../inputs/InputSelect.vue';
	
	interface InputComponent{
  		validate: () => boolean
	}

	type ClientType = {
		value : string|undefined,
		client_id : number|string,
		error : string,
		show_errors : boolean,
	
	};

	type InvoiceDetailsType = {
		global_discount: number,
		global_discount_type: string,
		client: ClientType,
		invoice_date: {
			value : string,
			error : string
		},
		due_date : {
			value : string,
			error : string
		},
		invoice_number : {
			value : string,
			error : string
		},
		po_number : string,
		clients : ClientType[],
		currency_id : number,
		currency_code : string,
	};

	type EvObject = {
		data : {
			currency : {
				id : number,
				code: string
			}
		},
		value : string,
		text : string
	};


	const details = defineModel<InvoiceDetailsType>({required : true});

	const invoice_date_ref = ref<InputComponent | null>(null);
	const due_date_ref = ref<InputComponent | null>(null);
	const invoice_number_ref = ref<InputComponent | null>(null);

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

	watch(() => details.value.global_discount, () => {
		nextTick(() => {
			if(details.value.global_discount_type === 'percentage' && details.value.global_discount > 100){
				details.value.global_discount = 100;
			}
		});
	});

	watch(() => details.value.global_discount_type, () => {
		nextTick(() => {
			details.value.global_discount = 0;
		});
	});


	watch(() => details.value.client.client_id, () => {
		details.value.client.error = '',
		details.value.client.show_errors = false;
		if(details.value.client.client_id === ''){
			details.value.client.error = 'Please select a client';
			details.value.client.show_errors = true;
		}
	});

	watch(() => details.value.invoice_date.value, () => {
		details.value.invoice_date.error = '';
		if(invoice_date_ref.value){
			if(!invoice_date_ref.value.validate()){
				details.value.invoice_date.error = 'Please select invoice date';
			}
		}
		
	});

	watch(() => details.value.due_date.value, () => {
		details.value.due_date.error = '';
		if(due_date_ref.value){
			if(!due_date_ref.value.validate()){
				details.value.due_date.error = 'Please select due date';
			}
		}
		
	});

	watch(() => details.value.invoice_number.value, () => {
		nextTick(() => {
			details.value.invoice_number.error = '';
			if(invoice_number_ref.value){
				if(!invoice_number_ref.value.validate()){
					details.value.invoice_number.error = 'Please enter invoice number';
				}
			}
			
		});
	});

	const handleClientSelect = (ev:EvObject) : void => {

		details.value.currency_id = 0;
		details.value.currency_code = '';
		details.value.client.client_id = '';

		if(Object.keys(ev).length > 0){
			details.value.currency_id = ev.data.currency.id;
			details.value.currency_code = ev.data.currency.code;
			details.value.client.client_id = ev.value+'';
			details.value.client.value = ev.text+'';
		}
	}

	const validateInvoiceDetails = () : boolean => {

		let validated = true;

		details.value.client.error = '',
		details.value.client.show_errors = false;
		if(details.value.client.client_id === ''){
			details.value.client.error = 'Please select a client';
			details.value.client.show_errors = true;
			validated = false;
		}
		
		details.value.invoice_date.error = '';
		if(!invoice_date_ref?.value?.validate()){
			details.value.invoice_date.error = 'Please select invoice date';
			validated = false;
		}

		details.value.due_date.error = '';
		if(!due_date_ref?.value?.validate()){
			details.value.due_date.error = 'Please select due date';
			validated = false;
		}

		details.value.invoice_number.error = '';
		if(!invoice_number_ref?.value?.validate()){
			details.value.invoice_number.error = 'Please enter invoice number';
			validated = false;
		}

		return validated;
	}

	defineExpose({ validateInvoiceDetails });

</script>