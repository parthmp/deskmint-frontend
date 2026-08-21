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
	removed_ids : []
});

watch(() => data.searched, () => {
	fetchInvoices();
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
	data.applied = data.applied.filter(item => item.id !== obj.id);
	data.applied_ids = data.applied_ids.filter(id => id !== obj.id);
	addToAmountLeft(obj.amount);
	obj.amount = '';
	data.removed_ids.push(+obj.id);
	const exists = data.table.data.some(row => row.id === obj.id);
	if(!exists){
		data.table.data.push(obj);
	}
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
				applied_ids : data.applied_ids
			}
		});

		const rd = response.data;
		const to_be_assigned:Array<TableRow> = [];
		
		rd.forEach((t_row:TableRow) => {
			to_be_assigned.push({
				id: t_row.id,
				invoice : t_row.invoice,
				total : t_row.total,
				due : t_row.due,
				allowed : t_row.due,
				amount : '',
				add: '',
				show_text_input : false
			});
		
		});

		data.table.data = to_be_assigned;
		data.loading = false;
		data.searching = false;

	}catch(e){
		router.push('/credits');
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

		const due = new Decimal(t_row.due);
		const amount = new Decimal(t_row.amount);
		const allowed = due.plus(amount);
		data.applied_ids.push(+t_row.id);
		to_be_applied.push({
			id: t_row.id,
			invoice : t_row.invoice,
			total : t_row.total,
			due : t_row.due,
			allowed : allowed.toFixed(2).toString(),
			amount : t_row.amount,
			add: '',
			show_text_input : false
		});
	
	});

	data.applied = to_be_applied;

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