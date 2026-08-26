<template>
	<section class="main-content">
    	<div class="card">
			
			<div>
				<h1 class="text-2xl!">View Payment</h1>
				<back-button></back-button>
				<CreditViewSkeleton v-if="data.loading"></CreditViewSkeleton>
				<div v-if="!data.loading">
					<div class="lg:grid lg:grid-cols-12 lg:gap-4">
						<div class="lg:col-span-4">
							<p>Status : {{ data.payment.status_text }}</p>
						</div>
						<div class="lg:col-span-4">
							<p>Amount : {{ data.payment.amount }}</p>
						</div>
						<div class="lg:col-span-4">
							<p>Applied amount : {{ data.payment.applied_amount }}</p>
						</div>
					</div>
					<div class="lg:grid lg:grid-cols-12 lg:gap-4 mt-[25px]">
						<div class="lg:col-span-4">
							<p>Amount left : {{ data.payment.amount_left_to_be_applied }}</p>
						</div>
						<div class="lg:col-span-4">
							<p>Client name : {{ data.payment.full_name }}</p>
						</div>
						<div class="lg:col-span-4">
							<p>Currency : {{ data.payment.payment_currency }}</p>
						</div>
					</div>
					<br>
					<br>
					<table class="table table-auto">
						<thead>
							<tr>
								<th v-for="key in auto_headers" :key="key">
									{{ formatHeader(key) }}
								</th>
							</tr>
							<tr v-for="(entry, index) in data.applied_entries" :key="index">
								<td v-for="key in auto_headers" :key="key" class="px-1 py-1">
									{{ entry[key] }}
								</td>
							</tr>
						</thead>
					</table>
					<br>
					<br>
				</div>
				
				
			</div>
		</div>
	</section>
</template>

<script lang="ts" setup>

import { computed, onMounted, reactive } from 'vue';
import BackButton from '../../blocks/BackButton.vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../../../helpers/api.ts';
import common from '../../../helpers/common.ts';
import CreditViewSkeleton from '../../skeletons/CreditViewSkeleton.vue';

interface PaymentView{
	loading:boolean,
	payment:{
		status_text : string,
		amount : string,
		applied_amount : string,
		amount_left_to_be_applied : string,
		full_name : string,
		payment_currency : string
	},
	applied_entries: Array<AppliedEntry>
}
interface AppliedEntry {
	applied_amount: string;
	invoice_number: string;
	created_at: string;
	[key: string]: string; 
}

const route = useRoute();
const router = useRouter();

const data = reactive<PaymentView>({
	loading : false,
	payment : {
		status_text : '',
		amount : '',
		applied_amount : '',
		amount_left_to_be_applied : '',
		full_name : '',
		payment_currency : ''
	},
	applied_entries : []

});

const auto_headers = computed(() => {
  
	if(!data.applied_entries.length){
		return [];
	}

	return Object.keys(data.applied_entries[0]);

});

const formatHeader = (key:string) => {
	return key.replace(/_/g, ' ').replace(/^./, key[0].toUpperCase());
};

const fetchPayment = async (id : number) : Promise<void> => {
	data.loading = true;

	try{
		
		const response = await api.get(`manage-payments/view/${id}`);
		data.payment = response.data.payment;
		data.applied_entries = response.data.applied_entries;

		for(let z = 0 ; z < data.applied_entries.length ; z++){
			for(const [key, value] of Object.entries(data.applied_entries[z])){
				
				const k = key as keyof AppliedEntry;
				
				if(typeof data.applied_entries[z][k] === 'string' && common.isValidISODate(data.applied_entries[z][key])){
					data.applied_entries[z][key] = common.formatDate(data.applied_entries[z][key]);
				}
			}
		}
		

	}finally{
		data.loading = false;
	}
}

onMounted(() : void => {
	const payment_id = +route.params.id;
	if(isNaN(payment_id)){
		router.push('/');
	}
	fetchPayment(payment_id);
})

</script>