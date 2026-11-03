<template>
	<section class="main-content">
    	<div class="card">
			<h1 class="text-2xl!">View recurring invoice</h1>
			<invoice-view-skeleton v-if="data.loading" class="mt-4"></invoice-view-skeleton>
			<template v-if="!data.loading">
				<back-button></back-button>
				<Tabs :horizontal="true" :options="['Info', 'Generated invoices']">
					<template v-slot:tab-0>
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
						<div class="lg:grid lg:grid-cols-12 lg:gap-4">
							<div class="lg:col-span-4">
								<p>Frequency: {{ data.recurring_invoice.frequency }}</p>
								<p class="mt-3">Mark paid: {{ +data.recurring_invoice.mark_paid === 1 ? 'Yes' : 'No' }}</p>
							</div>
							<div class="lg:col-span-4">
								<p>Payment type: {{ data.recurring_invoice.payment_type }}</p>
								<p class="mt-3">Next invoice on: {{ common.formatDate(data.recurring_invoice.next_invoice_on) }}</p>
							</div>
							<div class="lg:col-span-4">
								<p>Send invoice generation email: {{ +data.recurring_invoice.send_invoice_generation_email === 1 ? 'Yes' : 'No' }}</p>
							</div>
						</div>
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
									<template v-if="field.text.toLowerCase() !== 'paid to date'">
										{{ field.text }} : {{ field.value }} {{ data.meta.currency }}
									</template>
								</p>
							</div>
						</div>
					</template>
					<template v-slot:tab-1>
						<Invoices :filter_data="[{filter_key:'recurring_invoice_id', filter_value: data.recurring_invoice_id}]"></Invoices>
					</template>
				</Tabs>
			</template>
		</div>
	</section>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from 'vue';
import api from '../../helpers/api';
import { useRoute } from 'vue-router';
import BackButton from '../blocks/BackButton.vue';
import Tabs from '../UI/Tabs.vue';
import Invoices from '../invoices/Invoices.vue';
import InvoiceViewSkeleton from '../skeletons/InvoiceViewSkeleton.vue';
import common from '../../helpers/common.ts';

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

	data.loading = true;

	try{

		const response = await api.get(`manage-recurring-invoices/invoice-view/${recurring_invoice_id}`);

		const rd = response.data;
		data.recurring_invoice = rd.recurring_invoice;

		const snapshot = rd.snapshot;
		data.client = snapshot.client;
		data.company = snapshot.company;
		data.invoice = snapshot.invoice;
		
		data.meta = snapshot.meta;
		data.meta = snapshot.meta;
		data.product_rows_headers = snapshot.product_rows.headers;
		data.product_rows_data = snapshot.product_rows.data;
		data.totals = snapshot.totals;

	}finally{
		data.loading = false;
	}

	

	

}

onMounted(() => {

	data.recurring_invoice_id = +route.params.id;
	fetchRecurringInvoice(data.recurring_invoice_id);
	
});

</script>