<template>
	<section class="main-content">
    	<div class="card">
			<h1 class="text-2xl!" v-if="data.mode === 'create'">Create payment request</h1>
			<h1 class="text-2xl!" v-if="data.mode === 'edit'">Edit payment request</h1>

			<BackButton></BackButton>

			<form @submit.prevent="handleSubmit">
				<div class="grid grid-cols-12 lg:gap-5">
					<div class="col-span-12 lg:col-span-6">
						<input-auto-complete :disabled="false" label="Client" v-model="data.client.value" @selected="handleClientSelect" :error="data.client.error" endpoint="manage-invoices/fetch-clients" :required="true" placeholder="Type to select a client" :options="data.clients" :show_errors="data.client.show_errors"></input-auto-complete>
					</div>
					<div class="col-span-12 mt-[25px] lg:col-span-6 lg:mt-0">
						<input-text :disabled="false" label="Label" v-model="data.label.value" :error="data.label.error" :required="true" placeholder="Type label" ref="label_ref"></input-text>
					</div>
				</div>
				<div class="grid grid-cols-12 lg:gap-5 mt-[25px]">
					<div class="col-span-12 lg:col-span-6">
						<div class="grid grid-cols-12">
							<div class="col-span-11">
								<input-number :disabled="false" label="Amount" v-model="data.amount.value" :error="data.amount.error" :required="true" placeholder="Type amount" :min="0.01" :max="999999999" :step="0.01" ref="amount_ref"></input-number>
							</div>
							<div class="col-span-1 self-center mt-5 ml-5 font-bold">
								{{ data.client_currency }}
							</div>
						</div>
						
					</div>
					<div class="col-span-12 mt-[25px] lg:col-span-6 lg:mt-0">
						<input-select label="Payment gateway" placeholder="Select payment gateway" :disabled="false" v-model="data.payment_gateway.value" :error="data.payment_gateway.error" :required="true" :options="data.payment_gateways" ref="payment_gateway_ref"></input-select>
					</div>
				</div>
			
				<span class="flex gap-5 items-center mt-[25px]">
					<input-switch v-model="data.send_reminders" />
					<span @click.prevent="data.send_reminders = !data.send_reminders">
						On/Off Send reminders
					</span>
				</span>
				<span class="flex gap-5 items-center mt-[25px]">
					<input-switch v-model="data.send_request" />
					<span @click.prevent="data.send_request = !data.send_request">
						Send request
					</span>
				</span>
				<input-button btn_text="Save" :disabled="data.disabled" icon="IconCheck" class="lg:float-end"></input-button>
				<div class="clear-both"></div>
			</form>
			
			

		</div>
	</section>
</template>

<script lang="ts" setup>

import { onMounted, reactive, ref, watch } from 'vue';
import BackButton from '../../blocks/BackButton.vue';
import InputAutoComplete from '../../inputs/InputAutoComplete.vue';
import InputText from '../../inputs/InputText.vue';
import InputNumber from '../../inputs/InputNumber.vue';
import InputSelect from '../../inputs/InputSelect.vue';
import InputSwitch from '../../inputs/InputSwitch.vue';
import InputButton from '../../inputs/InputButton.vue';
import api from '../../../helpers/api.ts';
import { toastEvents } from '../../../events/toastEvents.ts';
import { useRoute, useRouter } from 'vue-router';
import type { TextFieldType } from '../../../types/InputTypes.ts';

interface InputComponent{
	validate: () => boolean
}

interface RequestInterface{
	mode : string,
	client: {
		value : string,
		error : string,
		show_errors : boolean,
		client_id : string
	},
	amount : TextFieldType,
	label : TextFieldType,
	payment_gateway : TextFieldType,
	payment_gateways: Array<{text:string, value:string}>,
	clients: Array<object>,
	currency_id : number,
	client_currency : string,
	send_reminders: boolean,
	send_request: boolean,
	disabled: boolean,
	loading: boolean,
	id : number
}

const data = reactive<RequestInterface>({
	mode : 'create',
	client: {
		value : '',
		error : 'Please select a client',
		show_errors : false,
		client_id : ''
	},
	amount : {
		value : '',
		error : 'Enter an amount'
	},
	label : {
		value : '',
		error : 'Enter the label'
	},
	payment_gateway : {
		value : '',
		error : 'Select the payment gateway'
	},
	payment_gateways: [],
	clients: [],
	currency_id : 0,
	client_currency : '-',
	send_reminders: true,
	send_request: true,
	disabled: false,
	loading: false,
	id : 0

});

const route = useRoute();
const router = useRouter();

const amount_ref = ref<InputComponent>();
const label_ref = ref<InputComponent>();
const payment_gateway_ref = ref<InputComponent>();

watch(() => data.client.client_id, () : void => {
	data.client.error = '',
	data.client.show_errors = false;
	if(data.client.client_id === ''){
		data.client.error = 'Please select a client';
		data.client.show_errors = true;
	}
});

watch(() => data.amount.value, () : void => {

	data.amount.error = '';

	if(!amount_ref?.value?.validate()){
		data.amount.error = 'Enter an amount';
	}

});

watch(() => data.label.value, () : void => {

	data.label.error = '';

	if(!label_ref?.value?.validate()){
		data.label.error = 'Enter the label';
	}

});

watch(() => data.payment_gateway.value, () : void => {

	data.payment_gateway.error = '';

	if(!payment_gateway_ref?.value?.validate()){
		data.payment_gateway.error = 'Select the payment gateway';
	}

});

const handleSubmit = async () : Promise<void> => {

	const amount_v = amount_ref?.value?.validate();
	const label_v = label_ref?.value?.validate();
	const payment_gateway_v = payment_gateway_ref?.value?.validate();
	data.client.show_errors = false;
	data.disabled = true;

	if(!amount_v || data.client.client_id === '' || !label_v || !payment_gateway_v){
		data.client.show_errors = true;
		toastEvents.emit('toast', {
			type: 'error',
			message : 'Fill in highlighted fields'
		});
		data.disabled = false;
		return ;
	}

	if(+data.amount.value === 0){
		toastEvents.emit('toast', {
			type: 'error',
			message : 'Amount must be greater than zero'
		});
		data.disabled = false;
		return ;
	}

	if(+data.amount.value >= 999999999){
		toastEvents.emit('toast', {
			type: 'error',
			message : 'Amount must be lesser than 999999999'
		});
		data.disabled = false;
		return ;
	}

	try{
		await api.post(`manage-payment-requests`, {
			client_id : data.client.client_id,
			label : data.label.value,
			amount : data.amount.value,
			payment_gateway : data.payment_gateway.value,
			send_reminders : data.send_reminders,
			send_request : data.send_request
		});
		router.push('/payments/requests');
	}finally{
		data.disabled = false;
	}
	

}

const handleClientSelect = (ev : {data : {currency : {id: number, code : string}}, value : number, text:string}) : void => {

	data.currency_id = 0;
	data.client.client_id = '';

	if(Object.keys(ev).length > 0){
		data.currency_id = ev.data.currency.id;
		data.client_currency = ev.data.currency.code;
		data.client.client_id = ev.value+'';
		data.client.value = ev.text+'';
	}
}

const fetchInit = async () : Promise<void> => {
	
	data.loading = true;

	try{
		const response = await api.get(`manage-payment-requests/fetch-init`);
		data.payment_gateways = response.data;
		data.loading = false;
	}finally{}

}

onMounted(() => {
	fetchInit();
});

</script>