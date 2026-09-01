<template>
	<section class="main-content">
		<div class="card">
			<h1 class="text-2xl!" v-if="data.mode === 'create'">Create credit</h1>
			<h1 class="text-2xl!" v-if="data.mode === 'edit'">Edit credit</h1>
			<BackButton></BackButton>
			<p class="text-red-900 mb-2" v-if="data.mode === 'edit' && data.client_currency !== data.credit_currency && data.access">Updating this credit will change its currency from {{ data.credit_currency }} to {{ data.client_currency }} as client's currency had been changed.</p>
			<p class="text-red-900 mb-2" v-if="data.mode === 'edit' && !data.access">You can not go below {{ data.applied_amount }} to update this entry. {{ data.applied_amount }} amount already applied to invoice(s).</p>
			<CreditCreateEditSkeleton v-if="data.loading"></CreditCreateEditSkeleton>
			<form v-if="!data.loading" @submit.prevent="handleSubmit">
				<div class="grid grid-cols-12">
					<div class="col-span-12">
						<input-text label="Credit number (Unique)" v-model="data.credit_number.value" :error="data.credit_number.error" placeholder="Enter credit number" :required="true" ref="credit_number_ref"></input-text>
					</div>
				</div>
				<div class="grid grid-cols-12 mt-[20px]">
					<div class="col-span-12">
						<input-auto-complete :disabled="!data.access" label="Client" v-model="data.client.value" @selected="handleClientSelect" :error="data.client.error" endpoint="manage-invoices/fetch-clients" :required="true" placeholder="Type to select a client" :options="data.clients" :show_errors="data.client.show_errors"></input-auto-complete>
					</div>
				</div>
				<div class="grid grid-cols-12 mt-[20px]">
					<div class="col-span-12">
						<input-number :min="data.applied_amount" label="Amount" v-model="data.amount.value" :error="data.amount.error" placeholder="Enter an amount" :required="true" step="0.01" ref="amount_ref"></input-number>
					</div>
				</div>
				<h2 class="text-xl! mt-3" v-if="(data.client_currency !== '' && data.mode === 'create') || (data.mode === 'edit' && data.access)">Currency : {{ data.client_currency }}</h2>
				<h2 class="text-xl! mt-3" v-if="data.mode === 'edit' && !data.access">Currency : {{ data.credit_currency }}</h2>
				<input-button btn_text="Save" :disabled="data.btn_disabled" icon="IconCheck" class="lg:float-end"></input-button>
				<div class="clear-both"></div>
			</form>
		</div>
	</section>
</template>
<script lang="ts" setup>

import { nextTick, onMounted, reactive, ref } from 'vue';
import InputAutoComplete from '../inputs/InputAutoComplete.vue';
import BackButton from '../blocks/BackButton.vue';
import InputNumber from '../inputs/InputNumber.vue';
import InputButton from '../inputs/InputButton.vue';
import { watch } from 'vue';
import { toastEvents } from '../../events/toastEvents.ts';
import api from '../../helpers/api.ts';
import { useRoute, useRouter } from 'vue-router';
import type { TextFieldType } from '../../types/InputTypes.ts';
import CreditCreateEditSkeleton from '../skeletons/CreditCreateEditSkeleton.vue';
import InputText from '../inputs/InputText.vue';

interface InputComponent{
	validate: () => boolean
}

interface ClientInterface{
	client : {
		value : string,
		error: string,
		show_errors:boolean,
		client_id : string
	},
	amount : TextFieldType,
	credit_number : TextFieldType,
	clients : Array<{value : string, text:string}>,
	btn_disabled:boolean,
	currency_id:number,
	credit_id:number,
	mode: string,
	loading: boolean,
	client_currency: string,
	credit_currency: string,
	access:boolean,
	applied_amount : number
}

const router = useRouter();
const route = useRoute();

const data = reactive<ClientInterface>({
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
	credit_number: {
		value : '',
		error : 'Enter credit number'
	},
	clients: [],
	btn_disabled : false,
	currency_id : 0,
	credit_id : 0,
	mode : 'create',
	loading : false,
	client_currency: '',
	credit_currency : '',
	access : true,
	applied_amount: 0
	
});

const amount_ref = ref<InputComponent>();
const credit_number_ref = ref<InputComponent>();

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

watch(() => data.credit_number.value, () : void => {
	nextTick(() => {
		data.credit_number.error = '';

		if(!credit_number_ref?.value?.validate()){
			data.credit_number.error = 'Enter credit number';
		}
	});
	

});

const handleClientSelect = (ev : {data : {currency : {id: number, code : string}}, value : number, text:string}) => {

	data.currency_id = 0;
	data.client.client_id = '';

	if(Object.keys(ev).length > 0){
		data.currency_id = ev.data.currency.id;
		data.client_currency = ev.data.currency.code;
		data.client.client_id = ev.value+'';
		data.client.value = ev.text+'';
	}
}

const handleSubmit = async () : Promise<void> => {

	const amount_v = amount_ref?.value?.validate();
	const credit_number_v = credit_number_ref?.value?.validate();
	data.client.show_errors = false;
	data.btn_disabled = true;

	if(!amount_v || data.client.client_id === '' || !credit_number_v){
		data.client.show_errors = true;
		toastEvents.emit('toast', {
			type: 'error',
			message : 'Fill in highlighted fields'
		});
		data.btn_disabled = false;
		return ;
	}

	if(+data.amount.value === 0){
		toastEvents.emit('toast', {
			type: 'error',
			message : 'Amount must be greater than zero'
		});
		data.btn_disabled = false;
		return ;
	}

	if(+data.amount.value >= 999999999){
		toastEvents.emit('toast', {
			type: 'error',
			message : 'Amount must be lesser than 999999999'
		});
		data.btn_disabled = false;
		return ;
	}

	try{
		if(data.mode === 'create'){
			await api.post('manage-credits', {
				client_id : data.client.client_id,
				amount : data.amount.value,
				credit_number : data.credit_number.value
			});
		}else{
			await api.patch(`manage-credits/${data.credit_id}`, {
				client_id : data.client.client_id,
				amount : data.amount.value,
				credit_number : data.credit_number.value
			});
		}
		
		router.push('/credits');
	}finally{
		data.btn_disabled = false;
	}
	
}

const fetchCredit = async () : Promise<void> => {
	data.loading = true;

	try{

		const response = await api.get(`manage-credits/edit/${data.credit_id}`);
		data.client.value = response.data.credit.full_name;
		data.client.client_id = response.data.credit.client_id;
		data.client_currency = response.data.credit.client_currency;
		data.credit_currency = response.data.credit.credit_currency;
		data.access = +response.data.full_access === 1 ? true : false;
		data.applied_amount = response.data.credit.applied_amount;
		data.amount.value = response.data.credit.amount+'';
		data.credit_number.value = response.data.credit.credit_number+'';
		nextTick(() => {
			data.amount.error = '';
			amount_ref?.value?.validate();
		});
		
		
	}finally{
		data.loading = false;
	}
}

onMounted(() : void => {
	const credit_id = route.params.id;
	if(typeof credit_id !== 'undefined'){
		data.credit_id = +credit_id;
		data.mode = 'edit';
		fetchCredit();
	}else{
		data.credit_number.value = crypto.randomUUID();
	}
})

</script>