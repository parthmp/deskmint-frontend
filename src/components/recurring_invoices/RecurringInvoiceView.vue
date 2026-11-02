<template>
	<section class="main-content">
    	<div class="card">
			<h1 class="text-2xl!">View recurring invoice</h1>
			<div class="lg:grid lg:grid-cols-12 lg:gap-4">
				<div class="lg:col-span-4">
					<p v-for="(item, z) in data.client" :key=z class="mt-3">
						{{ item.text }} : {{ item.value }}
					</p>
				</div>
				<div class="lg:col-span-4">
					<p v-for="(item, z) in data.company" :key="z" class="mt-3">
						{{ item.text }} : {{ item.value }}
					</p>
				</div>
				<div class="lg:col-span-4">
					<p v-for="(item, z) in data.invoice" :key="z" class="mt-3">
						{{ item.text }} : {{ item.value }} <span v-if="item.text.toLowerCase() === 'total' || item.text.toLowerCase() === 'balance due'">{{ data.meta.currency }}</span>
					</p>
				</div>
			</div>
			<br>
			<br>
			<table class="table table-auto">
				<thead>
					<tr>
						<th v-for="(header, z) in data.product_rows_headers" :key="z">
							{{ header.text }}
						</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(element, z) in data.product_rows_data" :key="z">
						<td v-for="(element_data, x) in element" :key="x">
							{{ element_data }}
						</td>
					</tr>
				</tbody>
			</table>
			<br>
			<br>
			<div class="lg:grid lg:grid-cols-12 lg:gap-4">
				<div class="lg:col-span-8"></div>
				<div class="lg:col-span-4">
					<p v-for="(field, z) in data.totals" :key="z" class="text-xl! mb-[5px]">
						{{ field.text }} : {{ field.value }} {{ data.meta.currency }}
					</p>
				</div>
			</div>
		</div>
	</section>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from 'vue';
import api from '../../helpers/api';
import { useRoute } from 'vue-router';

const route = useRoute();

const data = reactive({
	recurring_invoice_id : 0,
	recurring_invoice : {},
	client: [],
	company: [],
	general: {
		e_invoice_on : false,
		font_size : 0,
		logo_size : 0,
		primary_color : '',
		secondary_color : '',
		template : ''
	},
	invoice : [],
	meta : {
		currency : '',
		payment_method : 0,
		payment_method_string : ''
	},
	loading : false,
	product_rows_headers : [],
	product_rows_data : [],
	terms : {
		company_terms : '',
		footer : '',
		invoice_terms : '',
	},
	totals : [],
});

const fetchRecurringInvoice = async (recurring_invoice_id : number) : Promise<void> => {

	const response = await api.get(`manage-recurring-invoices/invoice-view/${recurring_invoice_id}`);

	const rd = response.data;
	data.recurring_invoice = rd.invoice;

	const snapshot = rd.snapshot;
	data.client = snapshot.client;
	data.company = snapshot.company;
	data.invoice = snapshot.invoice;
	
	data.meta = snapshot.meta;
	data.meta = snapshot.meta;
	data.product_rows_headers = snapshot.product_rows.headers;
	data.product_rows_data = snapshot.product_rows.data;
	data.totals = snapshot.totals;

}

onMounted(() => {

	data.recurring_invoice_id = +route.params.id;
	fetchRecurringInvoice(data.recurring_invoice_id);
	
});

</script>