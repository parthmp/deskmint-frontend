<template>
	<section class="main-content">
    	<div class="card">
			<div>
				<h1 class="text-2xl!">Manage Credits</h1>
				<BackButton></BackButton>
				<CreditsApplyUnapplySkeleton v-if="data.loading"></CreditsApplyUnapplySkeleton>
				<div v-if="!data.loading">
					<p>Invoice#: {{ data.invoice_number }}</p>
					<p>Client: {{ data.full_name }}</p>
					<p>Amount : {{ data.amount }} (left : {{ data.amount_left }}) Currency : {{ data.currency_code }}</p>
					<div class="mt-4">
						<InputSearch v-model="data.searched"></InputSearch>
						<div class="overflow-auto! max-h-[280px] relative styled-scrollbar">
							<ApplyUnapplyTable :searching="data.searching" :headers="data.table.headers" :data="data.table.data" mode="add" @apply="(obj) => handleApply(obj, 'add')" :max="data.amount_left" :credit_left="data.amount_left"></ApplyUnapplyTable>
						</div>
						
					</div>
					<div v-if="data.applied.length > 0">
						<p class="mt-6">Applied</p>
						<div class="mt-4">
							<ApplyUnapplyTable :searching="false" :headers="data.table.headers" :data="data.applied" mode="edit" @apply="(obj) => handleApply(obj, 'edit')" @remove="removeApplied" @modify_amount_left="addToAmountLeft" @edit="handleEdit" :max="data.amount_left" :credit_left="data.amount_left"></ApplyUnapplyTable>
						</div>
					</div>
					<InputButton @click.prevent="handleSubmit" btn_text="Save" :disabled="data.disabled" icon="IconCheck" class="lg:float-end"></InputButton>
					<div class="clear-both"></div>
				</div>
				
				
			</div>
		</div>
	</section>
</template>
<script lang="ts" setup>

/**
 * type 1 : the entries that user searched, not applied yet.
 * type 2 : the entries that user applied from searched, not saved to db yet, the due amount includes the applied amount.
 * type 3 : the entries that user applied and fetched from db, means already applied and deducted from the amount_left from credit amount, due does not include applied amount.
 */

import { onMounted, reactive, watch } from 'vue';
import BackButton from '../blocks/BackButton.vue';
import InputSearch from '../inputs/InputSearch.vue';
import ApplyUnapplyTable from '../UI/ApplyUnapplyTable.vue';
import Decimal from 'decimal.js';
import { toastEvents } from '../../events/toastEvents.ts';
import api from '../../helpers/api.ts';
import { useRoute, useRouter } from 'vue-router';
import CreditsApplyUnapplySkeleton from '../skeletons/CreditsApplyUnapplySkeleton.vue';
import InputButton from '../inputs/InputButton.vue';

type TableRow = {
	id : number,
	invoice : string,
	total : string,
	due : string,
	amount : string,
	add: string,
	type: number,
	fetched_amount: string,
	show_text_input:boolean
};

interface CreditsApply {
	invoice_id : number,
	invoice_number : string,
	amount : string,
	amount_left:string,
	currency_code:string,
	due:string,
	full_name:string,
	searched:string,
	table : {
		headers : Array<string>,
		data : Array<TableRow>
	},
	applied : Array<TableRow>,
	applied_ids : Array<number>,
	loading : boolean,
	searching:boolean,
	disabled : boolean
	removed_ids : Array<number>
	fetched_and_removed_ids : Array<number>
	fetched_entries : Array<TableRow>
}

const route = useRoute();
const router = useRouter();

const data = reactive<CreditsApply>({
	invoice_id : 0,
	invoice_number : '',
	amount : '100',
	amount_left: '100',
	currency_code : 'USD',
	due : '',
	full_name : '',
	searched : '',
	table : {
		headers : ['ID', 'Invoice', 'Total', 'Due', 'Amount', '-'],
		data : []
	},
	applied : [],
	applied_ids : [],
	loading : false,
	searching : false,
	disabled : false,
	removed_ids : [],
	fetched_entries : [],
	fetched_and_removed_ids : []
});

watch(() => data.searched, () => {
	//fetchInvoices();
});

const removeObjectById = (id:number) : void => {
	data.table.data = data.table.data.filter(item => item.id !== id);
}

const handleApply = (obj:TableRow, mode:string) : void => {
	const left = new Decimal(data.amount_left);
	const to_be_sub = new Decimal(obj.amount);
	const zero = new Decimal(0);
	const sum = left.minus(to_be_sub);
	
	if(sum.lessThan(zero)){
		toastEvents.emit('toast', {
			type : 'error',
			message: `You can not apply ${to_be_sub.toFixed(2).toString()} because remaining credit is ${left.toFixed(2).toString()}`
		});
		return ;
	}

	data.amount_left = sum.toFixed(2).toString();
	obj.show_text_input = false;
	if(mode === 'add'){
		if(!data.applied_ids.includes(obj.id)){

			data.applied_ids.push(obj.id);
			data.applied.push(obj);
			removeObjectById(obj.id);
		}else{
			data.amount_left = left.toFixed(2).toString();
		}
		
	}
	
	data.removed_ids = data.removed_ids.filter(id => id !== obj.id);
	
}

const handleEdit = (obj:TableRow) : void => {
	handleApply(obj, 'edit');
}

const addToAmountLeft = (amount:string) : void => {
	const left = new Decimal(data.amount_left);
	const to_add = new Decimal(amount);
	data.amount_left = left.add(to_add).toFixed(2).toString();
}

const removeApplied = (obj:TableRow) : void => {

	// data.applied = data.applied.filter(item => item.id !== obj.id);
	// data.applied_ids = data.applied_ids.filter(id => id !== obj.id);
	// addToAmountLeft(obj.amount);
	// obj.amount = '';
	// data.removed_ids.push(+obj.id);
	// const exists = data.table.data.some(row => row.id === obj.id);
	// if(!exists){
	// 	data.table.data.push(obj);
	// }

	// if(obj.type === 3){
	// 	//push id to fetched_and_removed_ids and send same while searching so it can fetch additional rows as well, this is for invoices that are paid, but user removes the row.
	// 	const due = new Decimal(obj.due);
	// 	if(due.equals(new Decimal(0))){
	// 		data.fetched_and_removed_ids.push(+obj.id);
	// 	}
	// }

	// //when we remove the entry, check if it is type 2, if it is, make it type 1 because user did not save it yet. (doesn't exist in db)
	// //type 3 never changes its type.
	// if(obj.type === 2){
	// 	obj.type = 1;
	// }

	
}

const handleSubmit = async () : Promise<void> => {

	// const credit_amount = new Decimal(data.amount);
	// let sum = new Decimal(0);

	// for(let z = 0 ; z < data.applied.length ; z++){

	// 	if(data.applied[z].show_text_input){
	// 		toastEvents.emit('toast', {
	// 			type : 'error',
	// 			message: `Please finish the editing in applied section`
	// 		});
	// 		return ;
	// 	}

	// 	sum = sum.plus(data.applied[z].amount);
	// }

	// if(sum.greaterThan(credit_amount)){
	// 	toastEvents.emit('toast', {
	// 		type : 'error',
	// 		message: `You can not apply more than available credit amount`
	// 	});
	// 	return ;
	// }

	// try{
	// 	data.disabled = true;
	// 	const response = await api.patch('manage-credits/apply-unapply-credit', {
	// 		applied : data.applied,
	// 		credit_id : data.credit_id,
	// 		removed_ids : data.removed_ids
	// 	});
	// 	router.push('/credits');
	// }finally{
	// 	data.disabled = false;
	// }
	
}

const fetchCredits = async () : Promise<void> => {
	data.searching = true;
	data.table.data = [];
	try{
		
		const response = await api.get('manage-invoices/apply-unapply-credits/search-credits', {
			params : {
				searched : data.searched,
				invoice_id : data.invoice_id,
				applied_ids : data.applied_ids,
				fetched_and_removed_ids : data.fetched_and_removed_ids
			}
		});

		const rd = response.data;
		const to_be_assigned:Array<TableRow> = [];
		const unpaid_invoices = rd.unpaid_invoices;
		const paid_invoices = rd.paid_invoices;

		unpaid_invoices.forEach((t_row:TableRow) => {
			
			let type = 1;

			if(t_row.applied_amount !== ''){
				type = 3;
			}

			to_be_assigned.push({
				id: t_row.id,
				invoice : t_row.invoice,
				total : t_row.total,
				due : t_row.due,
				amount : '',
				add: '',
				fetched_amount : t_row.applied_amount,
				type : type,
				show_text_input : false
			});
		
		});

		paid_invoices.forEach((t_row:TableRow) => {
			
			to_be_assigned.push({
				id: t_row.id,
				invoice : t_row.invoice,
				total : t_row.total,
				due : t_row.due,
				amount :'',
				add: '',
				fetched_amount : t_row.applied_amount,
				type : 3,
				show_text_input : false
			});
		
		});

		data.table.data = to_be_assigned;
		data.loading = false;
		data.searching = false;

	}catch(e){
		
	}finally{
		
	}
	
	
}

const fetchInvoice = async () : Promise<void> => {
	try{
		const response = await api.get(`manage-invoices/apply-unapply-credits/fetch-invoice/${data.invoice_id}`);
		
		const rd = response.data;

		data.invoice_number = rd.invoice_number;
		data.amount = rd.amount;
		data.amount_left = rd.amount_left;
		data.due = rd.due;
		data.currency_code = rd.currency_code;
		data.full_name = rd.full_name;

		await fetchAlreadyApplied();
		await fetchCredits();
		
	}catch(e){
		router.push('/invoices');
	}finally{

	}
	
	
}

const fetchAlreadyApplied = async () : Promise<void> => {
	// const response = await api.get('manage-credits/fetch-already-applied', {
	// 	params : {
	// 		credit_id : data.credit_id
	// 	}
	// });

	// const rd = response.data;

	// const to_be_applied:Array<TableRow> = [];
	// rd.forEach((t_row:TableRow) => {
	// 	data.applied_ids.push(+t_row.id);
	// 	to_be_applied.push({
	// 		id: t_row.id,
	// 		invoice : t_row.invoice,
	// 		total : t_row.total,
	// 		due : t_row.due,
	// 		amount : t_row.amount,
	// 		add: '',
	// 		type : 3,
	// 		fetched_amount : t_row.amount,
	// 		show_text_input : false
	// 	});
	
	// });

	// data.applied = to_be_applied;
	
}

onMounted(() : void => {
	//data.loading = true;
	let invoice_id = +route.params.id;
	if(!isNaN(invoice_id)){
		data.invoice_id = invoice_id;
	}
	fetchInvoice();
});

</script>