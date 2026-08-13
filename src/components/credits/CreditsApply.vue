<template>
	<section class="main-content">
    	<div class="card">
			<div>
				<h1 class="text-2xl!">Apply/Unapply Credit</h1>
				<BackButton></BackButton>
				<p>Amount : {{ data.amount }} (left : {{ data.amount_left }}) Currency : {{ data.currency_code }}</p>
				<div>
					<InputSearch v-model="data.searched"></InputSearch>
					<Table :headers="data.table.headers" :data="data.table.data"></Table>
				</div>
			</div>
		</div>
	</section>
</template>
<script lang="ts" setup>
import { onMounted, reactive } from 'vue';
import BackButton from '../blocks/BackButton.vue';
import InputSearch from '../inputs/InputSearch.vue';
import Table from '../UI/Table.vue';

const data = reactive({
	amount : 0,
	amount_left: 0,
	currency_code : '',
	searched : '',
	table : {
		headers : ['Add', 'Invoice#', 'Name', 'Balance due'],
		data : [{
			invoice_number : 'INV - 1',
			name : 'jack sparrow',
			balance_due : '500',
		}, {
			invoice_number : 'INV - 1',
			name : 'jack sparrow',
			balance_due : '500',
		}]
	}
});

// const fetchInit = async () : Promise<void> => {

// }

</script>