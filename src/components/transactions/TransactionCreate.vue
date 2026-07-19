<template>
	<section class="main-content">
    	<div class="card">
			<h1 class="text-2xl!">Create a transaction</h1>
			<br>
			<div class="lg:grid lg:grid-cols-12 lg:gap-4">
				<div class="lg:col-span-4">
					<input-auto-complete label="Invoice#" v-model="data.invoice_number.value" @selected="(selected_item:any) => handleInvoiceSelect(selected_item, element)" :error="data.invoice_number.error" endpoint="manage-transactions/fetch-invoices" :required="true" placeholder="Item" :options="data.invoices"></input-auto-complete>
				</div>
				<div class="lg:col-span-4">
					123
				</div>
				<div class="lg:col-span-4">
					123
				</div>
			</div>
		</div>
	</section>
</template>
<script lang="ts" setup>
import { onMounted, reactive } from 'vue';
import api from '../../helpers/api';
import type { TextFieldType } from '../../types/InputTypes';
import InputAutoComplete from '../inputs/InputAutoComplete.vue';

interface TransactionCreateInterface{
	payment_methods : Array<Array<{identifier : string, label: string}>>,
	invoice_number : TextFieldType,
	invoices : Array<object>
}

const data = reactive<TransactionCreateInterface>({
	payment_methods : [],
	invoice_number : {
		error : 'Select invoice #',
		value : ''
	},
	invoices : []
});

const fetchInit = async () : Promise<void>  => {
	try{
		const response = await api.get('manage-transactions/fetch-init');
		console.log(response);
		data.payment_methods = response.data.offline_payment_methods;
	}catch(e){}
	
}

const handleInvoiceSelect = (ele1, ele2) => {
	console.log('ele1');
	console.log(ele1);
	console.log('ele2');
	console.log(ele2);
}

onMounted(() => {
	fetchInit();
})

</script>