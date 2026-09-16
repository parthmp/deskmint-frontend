<template>
	<section class="main-content">
    	<div class="card">
			<invoice-view-skeleton v-if="data.loading"></invoice-view-skeleton>
			<div v-if="!data.loading">
				<h1 class="text-2xl!">View Invoice</h1>
				<back-button></back-button>
				<Tabs :horizontal="true" :options="['Info', 'Ledger']">
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
					</template>
					<template v-slot:tab-1>
						<table class="table table-auto">
							<thead>
								<tr>
									<th v-for="(header, z) in data.ledger_headers" :key="z">
										{{ header }}
									</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(element, z) in data.ledger_rows" :key="z">
									<td>{{ element.type }}</td>
									<td>{{ element.id_number }}</td>
									<td>{{ element.applied }}</td>
									<td>{{ element.currency }}</td>
									<td>{{ element.applied_at }}</td>
									
								</tr>
							</tbody>
						</table>
						<p>Total applied : {{ data.ledger_meta.total_applied }}</p>
					</template>
					
				</Tabs>
				
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">

import { onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import api from '../../helpers/api';
import InvoiceViewSkeleton from '../skeletons/InvoiceViewSkeleton.vue';
import BackButton from '../blocks/BackButton.vue';
import Tabs from '../UI/Tabs.vue';
import common from '../../helpers/common.ts';

const route = useRoute();

type GenericType = {
	text : string,
	value: string
};
type GeneralSettings = {
	e_invoice_on:boolean,
	font_size:number,
	logo_size:number,
	primary_color:string,
	secondary_color:string,
	template:string
};

type MetaType = {
	currency : string,
	payment_method : number,
	payment_method_string : string
};

type HeaderType = {
	key : string,
	text : string
};

type TermsType = {
	company_terms : string,
	footer : string,
	invoice_terms : string
};

type LedgerRows = {
	type : string,
	id_number:string,
	applied:number,
	currency:string,
	applied_at:string
};

type LedgerMeta = {
	total_applied:string
};

interface InvoiceViewInterface{
	client : Array<GenericType>,
	company : Array<GenericType>,
	general : GeneralSettings,
	invoice : Array<GenericType>,
	meta : MetaType,
	loading : boolean,
	product_rows_headers : Array<HeaderType>,
	product_rows_data : Array<object>,
	terms : TermsType,
	totals : Array<GenericType>,
	invoice_id : number,
	ledger_headers: Array<string>
	ledger_rows: Array<LedgerRows>,
	ledger_meta: LedgerMeta
}

const data = reactive<InvoiceViewInterface>({
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
	invoice_id : 0,
	ledger_headers : ['Type', 'ID/Number', 'Applied', 'Currency', 'Applied at'],
	ledger_rows : [],
	ledger_meta : {
		total_applied : ''
	}

});

const fetchInvoice = async (invoice_id : number) : Promise<void> => {

		data.loading = true;

		try{
			const response = await api.get('manage-invoices/snapshot/'+invoice_id);
			const snapshot = response.data.snapshot;
			const ledger_rows = response.data.ledger.rows;
			const ledger_meta = response.data.ledger.meta;
			data.ledger_rows = ledger_rows;

			for(let z = 0 ; z < data.ledger_rows.length ; z++){
				data.ledger_rows[z].applied_at = common.formatDate(data.ledger_rows[z].applied_at);
			}

			data.ledger_meta = ledger_meta;

			data.client = snapshot.client;
			data.company = snapshot.company;
			data.invoice = snapshot.invoice;
			data.meta = snapshot.meta;
			data.meta = snapshot.meta;
			data.product_rows_headers = snapshot.product_rows.headers;
			data.product_rows_data = snapshot.product_rows.data;
			data.totals = snapshot.totals;
		}catch(e){

		}finally{
			data.loading = false;
		}

		

		
		
		
		
		
	}


onMounted(() => {
	if(route.path.includes('view')){
		data.invoice_id = +route.params.id;
		fetchInvoice(data.invoice_id);
	}
	
});

</script>