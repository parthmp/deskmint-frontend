<template>
	<section class="main-content">
		<div class="card">
			<h1 class="text-2xl!">Create credit</h1>
			<BackButton></BackButton>
			<form @submit.prevent="handleSubmit">
				<div class="grid grid-cols-12">
					<div class="col-span-12">
						<input-auto-complete label="Client" v-model="data.client.value" @selected="handleClientSelect" :error="data.client.error" endpoint="manage-invoices/fetch-clients" :required="true" placeholder="Type to select a client" :options="data.clients" :show_errors="data.client.show_errors"></input-auto-complete>
					</div>
				</div>
				<div class="grid grid-cols-12 mt-[25px]">
					<div class="col-span-12">
						<input-number label="Amount" v-model="data.amount.value" :error="data.amount.error" placeholder="Enter an amount" :required="true" step="0.01" ref="amount_ref"></input-number>
					</div>
				</div>
				<input-button btn_text="Save" :disabled="data.btn_disabled" icon="IconCheck" class="lg:float-end"></input-button>
				<div class="clear-both"></div>
			</form>
		</div>
	</section>
</template>
<script lang="ts" setup>

interface InputComponent{
	validate: () => boolean
}

import { reactive, ref } from 'vue';
import InputAutoComplete from '../inputs/InputAutoComplete.vue';
import BackButton from '../blocks/BackButton.vue';
import InputNumber from '../inputs/InputNumber.vue';
import InputButton from '../inputs/InputButton.vue';
import { watch } from 'vue';
import { toastEvents } from '../../events/toastEvents.ts';
import api from '../../helpers/api.ts';
import { useRouter } from 'vue-router';

const router = useRouter();

const data = reactive({
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
	clients: [],
	btn_disabled : false,
	currency_id : 0
	
});

const amount_ref = ref<InputComponent>();

watch(() => data.client.client_id, () => {
	data.client.error = '',
	data.client.show_errors = false;
	if(data.client.client_id === ''){
		data.client.error = 'Please select a client';
		data.client.show_errors = true;
	}
});

watch(() => data.amount.value, () => {

	data.amount.error = '';

	if(!amount_ref?.value?.validate()){
		data.amount.error = 'Enter an amount';
	}

});

const handleClientSelect = (ev) => {

	data.currency_id = 0;
	data.client.client_id = '';

	if(Object.keys(ev).length > 0){
		data.currency_id = ev.data.currency.id;
		data.client.client_id = ev.value+'';
		data.client.value = ev.text+'';
	}
}

const handleSubmit = async () => {

	const amount_v = amount_ref?.value?.validate();
	data.client.show_errors = false;
	data.btn_disabled = true;

	if(!amount_v || data.client.client_id === ''){
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
		await api.post('manage-credits', {
			client_id : data.client.client_id,
			amount : data.amount.value
		});
		router.push('/credits');
	}finally{
		data.btn_disabled = false;
	}
	
	
	

}

</script>