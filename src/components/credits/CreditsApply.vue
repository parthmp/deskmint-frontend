<template>
	<section class="main-content">
    	<div class="card">
			<div>
				<h1 class="text-2xl!">Apply/Unapply Credit</h1>
				<BackButton></BackButton>
				<CreditsApplyUnapplySkeleton v-if="data.loading"></CreditsApplyUnapplySkeleton>
				<div v-if="!data.loading">
					<p>Client: {{ data.full_name }}</p>
					<p>Amount : {{ data.amount }} (left : {{ data.amount_left }}) Currency : {{ data.currency_code }}</p>
					<div class="mt-4">
						<InputSearch v-model="data.searched"></InputSearch>
						<div class="overflow-auto! max-h-[280px] relative styled-scrollbar">
							<ApplyUnapplyTable :searching="data.searching" :headers="data.table.headers" :data="data.table.data" mode="add" @apply="(obj) => handleApply(obj, 'add')" :max="data.amount_left"></ApplyUnapplyTable>
						</div>
						
					</div>
					<div v-if="data.applied.length > 0">
						<p class="mt-6">Applied</p>
						<div class="mt-4">
							<ApplyUnapplyTable :searching="false" :headers="data.table.headers" :data="data.applied" mode="edit" @apply="(obj) => handleApply(obj, 'edit')" @remove="removeApplied" @modify_amount_left="addToAmountLeft" @edit="handleEdit" :max="data.amount_left"></ApplyUnapplyTable>
						</div>
					</div>
					<InputButton @click.prevent="handleAppliedCredits" btn_text="Save" :disabled="data.disabled" icon="IconCheck" class="lg:float-end"></InputButton>
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
	allowed : string,
	amount : string,
	add: string,
	type: number,
	fetched_amount: string,
	show_text_input:boolean
};

interface CreditsApply {
	credit_id : number,
	amount : string,
	amount_left:string,
	currency_code:string,
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
	credit_id : 0,
	amount : '100',
	amount_left: '100',
	currency_code : 'USD',
	full_name : '',
	searched : '',
	table : {
		headers : ['ID', 'Invoice', 'Total', 'Due', 'Allowed', 'Amount', '-'],
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
	fetchInvoices();
});

const calculateAllowedForApplied = (modify_for_allowed:Array<TableRow>, mode:string = 'add') : void  => {

	const remaining_credit = new Decimal(data.amount_left);
	
	modify_for_allowed.forEach(row => {

		let due = new Decimal(row.due);
		const total = new Decimal(row.total);
	

		if(row.type === 1){
			
			let allowed = due;
			if(due.greaterThan(remaining_credit) || due.equals(remaining_credit)){
				allowed = remaining_credit;
			}

			row.allowed = allowed.toFixed(2).toString();


		}else if(row.type === 2){

			//this section, the due is not deducted yet for the applied amount as it is not saved into db yet.
			//allowed should be applied + due, if applied + due is greater than remaining then it should be amount + remaining
			let applied_amount = new Decimal(row.amount);
			let allowed = applied_amount.plus(due);

			if((allowed.greaterThan(remaining_credit) || allowed.equals(remaining_credit))){
				allowed = applied_amount.plus(remaining_credit);
				if(due.lessThan(allowed)){
					allowed = due;
				}
			}else{
				allowed = due;
			}

			row.allowed = allowed.toFixed(2).toString();
			
		}else if(row.type === 3){

			//type 3 always have amount deducted from due, use fetched_amount for this for calculation.
			//type 3 entry can exist in search or in fetched entries
			//check if amount has value, if it has then it is inside fetched entries, if not, it is showing in search results.
			//for search : allowed should be fetched_amount + due, if fetched_amount + due is greater than remaining then it should be fetched_amount + remaining, if allowed greater than remaining then it should be remaining credit amount
			//for fetched entry : allowed should be amount + due, if amount + due is greater than remaining then it should be amount + remaining.
			//amount/fetched_amount always included for this because this entry already applied in db.
			
			const in_search = (row.amount === '');
			
			let allowed = null;
			

			if(in_search){
				
				let applied_amount = new Decimal(row.fetched_amount);
				allowed = applied_amount.plus(due);
				if(allowed.greaterThan(remaining_credit) || allowed.equals(remaining_credit)){
					//allowed = applied_fetched_amount.plus(remaining_credit);
					allowed = remaining_credit;
				}else{
					allowed = applied_amount.plus(due);
				}

				
			}else{
				let applied_amount = null;
				if(mode === 'edit'){
					applied_amount = new Decimal(row.amount);
				}else{
					applied_amount = new Decimal(row.fetched_amount);
				}
				
				allowed = applied_amount.plus(due);
				if((allowed.greaterThan(remaining_credit) || allowed.equals(remaining_credit)) && due.greaterThan(remaining_credit)){
					allowed = applied_amount.plus(remaining_credit);
				}

				if(due.equals(new Decimal(0))){
					allowed = applied_amount;
				}
				
				
			}

			row.allowed = allowed.toFixed(2).toString();

		}

	});

}

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
			
			//check if it is paid already
			const due = new Decimal(obj.due);
			if(!due.equals(new Decimal(0))){
				obj.type = 2; //changed type to 2
			}
			data.applied_ids.push(obj.id);
			data.applied.push(obj);
			removeObjectById(obj.id);
		}else{
			data.amount_left = left.toFixed(2).toString();
		}
		
	}
	
	data.removed_ids = data.removed_ids.filter(id => id !== obj.id);
	calculateAllowedForApplied(data.table.data);
	calculateAllowedForApplied(data.applied);
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

	

	data.applied = data.applied.filter(item => item.id !== obj.id);
	data.applied_ids = data.applied_ids.filter(id => id !== obj.id);
	addToAmountLeft(obj.amount);
	obj.amount = '';
	data.removed_ids.push(+obj.id);
	const exists = data.table.data.some(row => row.id === obj.id);
	if(!exists){
		data.table.data.push(obj);
	}

	if(obj.type === 3){
		//push id to fetched_and_removed_ids and send same while searching so it can fetch additional rows as well, this is for invoices that are paid, but user removes the row.
		const due = new Decimal(obj.due);
		if(due.equals(new Decimal(0))){
			data.fetched_and_removed_ids.push(+obj.id);
		}
	}

	//when we remove the entry, check if it is type 2, if it is, make it type 1 because user did not save it yet. (doesn't exist in db)
	//type 3 never changes its type.
	if(obj.type === 2){
		obj.type = 1;
	}

	calculateAllowedForApplied(data.table.data);
	calculateAllowedForApplied(data.applied);
	
}

const handleAppliedCredits = async () : Promise<void> => {
	try{
		data.disabled = true;
		const response = await api.patch('manage-credits/apply-unapply-credit', {
			applied : data.applied,
			credit_id : data.credit_id,
			removed_ids : data.removed_ids
		});
		router.push('/credits');
	}finally{
		data.disabled = false;
	}
	
}

const fetchInvoices = async () : Promise<void> => {
	data.searching = true;
	data.table.data = [];
	try{
		
		const response = await api.get('manage-credits/apply-unapply-search-invoices', {
			params : {
				searched : data.searched,
				credit_id : data.credit_id,
				applied_ids : data.applied_ids,
				fetched_and_removed_ids : data.fetched_and_removed_ids
			}
		});

		const rd = response.data;
		const to_be_assigned:Array<TableRow> = [];
		const unpaid_invoices = rd.unpaid_invoices;
		const paid_invoices = rd.paid_invoices;

		unpaid_invoices.forEach((t_row:TableRow) => {
			
			to_be_assigned.push({
				id: t_row.id,
				invoice : t_row.invoice,
				total : t_row.total,
				due : t_row.due,
				allowed : '',
				amount : '',
				add: '',
				fetched_amount : '',
				type : 1,
				show_text_input : false
			});
		
		});

		paid_invoices.forEach((t_row:TableRow) => {
			
			to_be_assigned.push({
				id: t_row.id,
				invoice : t_row.invoice,
				total : t_row.total,
				due : t_row.due,
				allowed : '',
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
		console.log(data.table.data);
		calculateAllowedForApplied(data.table.data);
		//router.push('/credits');
	}catch(e){
		
	}finally{
		
	}
	
	
}

const fetchCredit = async () : Promise<void> => {
	try{
		const response = await api.get('manage-credits/apply-unapply-fetch-credit', {
			params : {
				credit_id : data.credit_id
			}
		});
		
		const rd = response.data;

		data.amount = rd.amount;
		data.amount_left = rd.left;
		data.currency_code = rd.currency_code;
		data.full_name = rd.full_name;

		await fetchAlreadyApplied();
		await fetchInvoices();
		
	}catch(e){
		router.push('/credits');
	}finally{

	}
	
	
}

const fetchAlreadyApplied = async () : Promise<void> => {
	const response = await api.get('manage-credits/fetch-already-applied', {
		params : {
			credit_id : data.credit_id
		}
	});

	const rd = response.data;

	const to_be_applied:Array<TableRow> = [];
	rd.forEach((t_row:TableRow) => {

		// const due = new Decimal(t_row.due);
		// const amount = new Decimal(t_row.amount);
		// const allowed = due.plus(amount);
		data.applied_ids.push(+t_row.id);
		to_be_applied.push({
			id: t_row.id,
			invoice : t_row.invoice,
			total : t_row.total,
			due : t_row.due,
			allowed : '',
			amount : t_row.amount,
			add: '',
			type : 3,
			fetched_amount : t_row.amount,
			show_text_input : false
		});
	
	});

	data.applied = to_be_applied;
	//data.fetched_entries = to_be_applied;
	calculateAllowedForApplied(data.table.data);
	calculateAllowedForApplied(data.applied);

}

onMounted(() : void => {
	data.loading = true;
	let credit_id = +route.params.id;
	if(!isNaN(credit_id)){
		data.credit_id = credit_id;
	}
	fetchCredit();
});

</script>