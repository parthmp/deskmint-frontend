<template>
	<section class="main-content">
    	<div class="card">
			<h1 class="text-2xl!">Create a transaction</h1>
			<br>
			<form @submit.prevent="handleSubmit">
				<div class="lg:grid lg:grid-cols-12 lg:gap-4">
					<div class="lg:col-span-4">
						<input-auto-complete label="Invoice #" v-model="data.invoice_number.value" @selected="handleInvoiceSelect" :error="data.invoice_number.error" endpoint="manage-transactions/fetch-invoices" :required="true" placeholder="Invoice #" :options="data.invoices" ref="invoice_number_ref"></input-auto-complete>
					</div>
					<div class="lg:col-span-4">
						<input-number label="Amount" v-model="data.amount.value" :error="data.amount.error" :required="true" placeholder="Amount" step="0.01" ref="amount_ref"></input-number>
					</div>
					<div class="lg:col-span-4">
						<input-number label="Gateway fees" v-model="data.gateway_fees.value" :error="data.gateway_fees.error" :required="true" placeholder="Gateway fees" step="0.01" ref="gateway_fees_ref"></input-number>
					</div>
				</div>
				
				<div class="lg:grid lg:grid-cols-12 lg:gap-4 mt-[20px]">
					<div class="lg:col-span-6">
						<input-number label="Received amount" v-model="data.received_amount.value" :error="data.received_amount.error" :required="true" placeholder="Received amount" step="0.01" ref="received_amount_ref"></input-number>
					</div>
					<div class="lg:col-span-6">
						<input-select label="Payment method" placeholder="Payment method" v-model="data.payment_method.value" :error="data.payment_method.error" :required="true" :options="data.payment_methods" ref="payment_method_ref"></input-select>
					</div>
				</div>
				<input-button :disabled="data.disabled" btn_text="Save" icon="iconCheck" class="lg:float-end" />
				<div class="clear-both"></div>
			</form>
		</div>
	</section>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue';
import api from '../../helpers/api';
import type { TextFieldType } from '../../types/InputTypes';
import InputAutoComplete from '../inputs/InputAutoComplete.vue';
import InputNumber from '../inputs/InputNumber.vue';
import InputSelect from '../inputs/InputSelect.vue';
import InputButton from '../inputs/InputButton.vue';
import { toastEvents } from '../../events/toastEvents';
import Decimal from 'decimal.js';
import { nextTick } from 'vue';
import { useRouter } from 'vue-router';

interface TransactionCreateInterface{
	payment_methods : Array<Array<{identifier : string, label: string}>>,
	invoice_number : {error : string, value : string, invoice_id:string},
	amount : TextFieldType,
	payment_method : TextFieldType,
	gateway_fees : TextFieldType,
	received_amount : TextFieldType,
	invoices : Array<object>,
	loading : boolean,
	disabled : boolean
}

interface InputComponent{
	validate: () => boolean
}

const router = useRouter();

const data = reactive<TransactionCreateInterface>({
	payment_methods : [],
	invoice_number : {
		error : 'Please select an invoice #',
		value : '',
		invoice_id : '0'
	},
	amount : {
		error : 'Enter the amount',
		value : ''
	},
	gateway_fees : {
		error : 'Enter the gateway fees',
		value : '0'
	},
	received_amount : {
		error : 'Enter the received amount',
		value : ''
	},
	payment_method : {
		error : 'Select payment method',
		value : ''
	},
	invoices : [],
	loading : false,
	disabled : false
});

const suppress_watch = reactive({ received_amount: false, gateway_fees: false });
	

/* refs */
const invoice_number_ref = ref<InputComponent | null>(null);
const amount_ref = ref<InputComponent | null>(null);
const gateway_fees_ref = ref<InputComponent | null>(null);
const received_amount_ref = ref<InputComponent | null>(null);
const payment_method_ref = ref<InputComponent | null>(null);
		
watch(() => data.invoice_number.invoice_id, () => {
	if(!data.loading){
		//let invoice_number_v = invoice_number_ref.value?.validate() ?? false;
		data.invoice_number.error = '';
		if(data.invoice_number.invoice_id.toString() === ''){
			data.invoice_number.error = 'Please select an invoice #';
			//details.value.client.show_errors = true;
		}
	}
	
});

watch(() => data.amount.value, () => {
	if(!data.loading){
		let amount_v = amount_ref.value?.validate() ?? false;
		data.amount.error = '';
		if(!amount_v){
			data.amount.error = 'Enter the amount';
		}else{
			calculateAmounts();
		}
	}
});

watch(() => data.gateway_fees.value, () => {
	if(suppress_watch.gateway_fees){
		suppress_watch.gateway_fees = false;
		return;
	}
	if(!data.loading){
		let gateway_fees_v = gateway_fees_ref.value?.validate() ?? false;
		data.gateway_fees.error = '';
		if(!gateway_fees_v){
			data.gateway_fees.error = 'Enter the gateway fees';
		}else{
			calculateAmounts();
		}
	}
});

watch(() => data.received_amount.value, () => {
	if(suppress_watch.received_amount){
		suppress_watch.received_amount = false;
		return;
	}
	if(!data.loading){
		let received_amount_v = received_amount_ref.value?.validate() ?? false;
		data.received_amount.error = '';
		if(!received_amount_v){
			data.received_amount.error = 'Enter the received amount';
		}else{
			calculateGatewayFees();
		}
	}
});


watch(() => data.payment_method.value, () => {
	if(!data.loading){
		let payment_method_v = payment_method_ref.value?.validate() ?? false;
		data.payment_method.error = '';
		if(!payment_method_v){
			data.payment_method.error = 'Select payment method';
		}else{
			calculateAmounts();
		}
	}
});

const forceSetReceivedAmount = (val: string) : void => {
	suppress_watch.received_amount = true;
	data.received_amount.value = '';
	nextTick(() => {
		suppress_watch.received_amount = true;
		data.received_amount.value = val;
	});
}

const forceSetGatewayFees = (val: string) : void => {
	suppress_watch.gateway_fees = true;
	data.gateway_fees.value = '';
	nextTick(() => {
		suppress_watch.gateway_fees = true;
		data.gateway_fees.value = val;
	});
}

const calculateGatewayFees = () : void => {
	const amount = new Decimal(data.amount.value === '' ? 0 : data.amount.value);
	const received_amount = new Decimal(data.received_amount.value === '' ? 0 : data.received_amount.value);

	let received_amount_clamped = received_amount;
	if(received_amount.greaterThan(amount)){
		received_amount_clamped = amount;
		forceSetReceivedAmount(amount.toFixed(2));
	}

	const gateway_fees_new = amount.minus(received_amount_clamped).toFixed(2);
	forceSetGatewayFees(gateway_fees_new);
}

const calculateAmounts = () : void => {
	const amount = new Decimal(data.amount.value === '' ? 0 : data.amount.value);
	let gateway_fees = new Decimal(data.gateway_fees.value === '' ? 0 : data.gateway_fees.value);

	if(gateway_fees.greaterThan(amount)){
		gateway_fees = amount;
		forceSetGatewayFees(amount.toFixed(2));
	}

	const received_amount_new = amount.minus(gateway_fees).toFixed(2);
	forceSetReceivedAmount(received_amount_new);
}

const fetchInit = async () : Promise<void>  => {
	try{
		const response = await api.get('manage-transactions/fetch-init');
		data.payment_methods = response.data.offline_payment_methods;
	}catch(e){}
	
}

const handleSubmit = async () : Promise<void> => {
	
	data.disabled = true;

	data.invoice_number.error = '';
	data.amount.error = '';
	data.gateway_fees.error = '';
	data.received_amount.error = '';
	data.payment_method.error = '';

	let invoice_number_v = invoice_number_ref.value?.validate() ?? false;
	let amount_v = amount_ref.value?.validate() ?? false;
	let gateway_fees_v = gateway_fees_ref.value?.validate() ?? false;
	let received_amount_v = received_amount_ref.value?.validate() ?? false;
	let payment_method_v = payment_method_ref.value?.validate() ?? false;

	if(!invoice_number_v){
		data.invoice_number.error = 'Please select an invoice #';
	}

	if(!amount_v){
		data.amount.error = 'Enter the amount';
	}

	if(!gateway_fees_v){
		data.gateway_fees.error = 'Enter the gateway fees';
	}

	if(!received_amount_v){
		data.received_amount.error = 'Enter the received amount';
	}

	if(!payment_method_v){
		data.payment_method.error = 'Select payment method';
	}

	if(parseFloat(data.amount.value) <= 0){
		data.disabled = false;
		toastEvents.emit('toast', {
			type: 'error',
			message: 'Amount must not be 0 or less than 0'
		});
		return ;
	}

	if(invoice_number_v && amount_v && gateway_fees_v && received_amount_v && payment_method_v && data.invoice_number.invoice_id !== ''){
		try{
			const response = await api.post('manage-transactions', {
				invoice_id : data.invoice_number.invoice_id,
				amount : data.amount.value,
				gateway_fees : data.gateway_fees.value,
				received_amount : data.received_amount.value,
				payment_method : data.payment_method.value
			});
			router.push('/transactions');
		}catch(e){

		}finally{
			data.disabled = false;
		}
	}else{
		data.disabled = false;
		toastEvents.emit('toast', {
			type: 'error',
			message: 'Please fill in highlighted fields'
		});
	}

}

const handleInvoiceSelect = (ev) => {

	data.invoice_number.invoice_id = '';
	if(ev.value){
		//data.invoice_number.text = ev.value+'';
		data.invoice_number.value = ev.text+'';
		data.invoice_number.invoice_id = ev.value;
	}
	
}

onMounted(() => {
	fetchInit();
})

</script>