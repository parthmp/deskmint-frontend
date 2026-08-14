<template>
	<section class="main-content">
    	<div class="card">
			<div>
				<h1 class="text-2xl!">Apply/Unapply Credit</h1>
				<BackButton></BackButton>
				<p>Amount : {{ data.amount }} (left : {{ data.amount_left }}) Currency : {{ data.currency_code }}</p>
				<div class="mt-4">
					<InputSearch v-model="data.searched"></InputSearch>
					<ApplyUnapplyTable :data="data.table.data" mode="add" @apply="handleApply" :max="data.amount_left"></ApplyUnapplyTable>
				</div>
				<p class="mt-6">Applied</p>
				<div class="mt-4">
					<ApplyUnapplyTable :data="data.applied" mode="edit" @apply="handleApply" @edit="handleEdit" :max="data.amount_left"></ApplyUnapplyTable>
				</div>
			</div>
		</div>
	</section>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';
import BackButton from '../blocks/BackButton.vue';
import InputSearch from '../inputs/InputSearch.vue';
import ApplyUnapplyTable from '../UI/ApplyUnapplyTable.vue';
import Decimal from 'decimal.js';
import { toastEvents } from '../../events/toastEvents.ts';

const data = reactive({
	amount : '100',
	amount_left: '100',
	currency_code : 'USD',
	searched : '',
	table : {
		data : [{
			id : 1,
			invoice : 'INV - 1',
			name : 'jack sparrow',
			due : '500',
			amount : '',
			add: '',
		}, {
			id: 2,
			invoice : 'INV - 1',
			name : 'jack sparrow',
			due : '500',
			amount : '',
			add: '',
		}]
	},
	applied : []
});

const removeObjectById = (id:number) => {
	data.table.data = data.table.data.filter(item => item.id !== id);
}

const handleApply = (obj) => {
	
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
	
	data.applied.push(obj);
	removeObjectById(obj.id);

}

const handleEdit = (obj) => {
	console.log(obj);
}

// const fetchInit = async () : Promise<void> => {

// }

</script>