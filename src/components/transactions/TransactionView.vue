<template>
	<section class="main-content">
		<div class="card">
			<h1 class="text-2xl!">View transaction</h1>
			<transaction-view-skeleton v-if="data.loading"></transaction-view-skeleton>
			<div v-if="!data.loading" class="mt-[20px]">
				<back-button></back-button>
				<div class="lg:grid lg:grid-cols-12 gap-5">
					<div class="lg:col-span-4">
						<p>ID: {{ data.transaction.id }}</p>
					</div>
					<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
						<p>Invoice ID: {{ data.transaction.invoice_id }}</p>
					</div>
					<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
						<p>Invoice #: {{ data.transaction.invoice_number }}</p>
					</div>
				</div>
				<div class="lg:grid lg:grid-cols-12 gap-5 mt-[20px]">
					<div class="lg:col-span-4">
						<p>Amount: {{ data.transaction.amount }}</p>
					</div>
					<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
						<p>Gateway fees: {{ data.transaction.gateway_fees_amount }}</p>
					</div>
					<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
						<p>Received: {{ data.transaction.received_amount }}</p>
					</div>
				</div>
				<div class="lg:grid lg:grid-cols-12 gap-5 mt-[20px]">
					<div class="lg:col-span-4">
						<p>Payment method: {{ data.transaction.payment_method }}</p>
					</div>
					<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
						<p>Mode: {{ data.transaction.mode }}</p>
					</div>
					<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
						<p>Token/Identifer: {{ data.transaction.token_id_identifier }}</p>
					</div>
				</div>
				<div class="lg:grid lg:grid-cols-12 gap-5 mt-[20px]">
					<div class="lg:col-span-4">
						<p>Approved: {{ data.transaction.is_approved }}</p>
					</div>
					<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
						<p>Captured: {{ data.transaction.is_payment_captured }}</p>
					</div>
					<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
						<p>Status: {{ data.transaction.status }}</p>
					</div>
				</div>
				<div class="lg:grid lg:grid-cols-12 gap-5 mt-[20px]">
					<div class="lg:col-span-4">
						<p>Echeck: {{ data.transaction.is_echeck }}</p>
					</div>
					<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
						<p>Voided by: {{ data.transaction.voided_by_name }}</p>
					</div>
					<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
						<p>Paid at: {{ data.transaction.paid_at }}</p>
					</div>
				</div>
				<div class="lg:grid lg:grid-cols-12 gap-5 mt-[20px]">
					<div class="lg:col-span-4">
						<p>Voided at: {{ data.transaction.voided_at }}</p>
					</div>
					<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
						<p>Added on: {{ data.transaction.created_at }}</p>
					</div>
					<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
						<p>Updated on: {{ data.transaction.updated_at }}</p>
					</div>
				</div>
				<br>
				<p>Currency: {{ data.transaction.currency_code }}</p>
			</div>
		</div>
	</section>
</template>
<script lang="ts" setup>
import { onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import api from '../../helpers/api';
import common from '../../helpers/common';
import TransactionViewSkeleton from '../skeletons/TransactionViewSkeleton.vue';
import BackButton from '../blocks/BackButton.vue';

const route = useRoute();

type Transaction = {
	id : number,
	invoice_id : number,
	invoice_number : string,
	amount : number,
	gateway_fees_amount : number,
	received_amount : number,
	payment_method : string,
	mode : string,
	token_id_identifier : string,
	is_approved : string,
	is_payment_captured : string,
	status : string,
	is_echeck : string,
	voided_by : string,
	voided_by_name : string,
	paid_at : string,
	voided_at : string,
	created_at : string,
	updated_at : string,
	currency_code : string
};

interface TransactionViewInterface{
	loading:boolean,
	transaction : Transaction
}

const data = reactive<TransactionViewInterface>({
	loading : false,
	transaction : {
		id : 0,
		invoice_id : 0,
		invoice_number : '',
		amount : 0,
		gateway_fees_amount : 0,
		received_amount : 0,
		payment_method : '',
		mode : '',
		token_id_identifier : '',
		is_approved : '',
		is_payment_captured : '',
		status : '',
		is_echeck : '',
		voided_by : '',
		voided_by_name : '',
		paid_at : '',
		voided_at : '',
		created_at : '',
		updated_at : '',
		currency_code : ''
	}
});

const fetchTransaction = async (transaction_id: number) : Promise<void> => {
	
	data.loading = true;

	try{

		const response = await api.get(`manage-transactions/${transaction_id}`);
		data.transaction = response.data;

		data.transaction.paid_at = common.formatDate(data.transaction.paid_at);
		data.transaction.voided_at = common.formatDate(data.transaction.voided_at);
		data.transaction.created_at = common.formatDate(data.transaction.created_at);
		data.transaction.updated_at = common.formatDate(data.transaction.updated_at);
		
		data.loading = false;

	}catch(e){

	}finally{

	}

}

onMounted(() => {
	fetchTransaction(+route.params.id);
});

</script>