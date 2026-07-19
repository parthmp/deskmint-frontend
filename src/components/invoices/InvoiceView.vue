<template>
	<section class="main-content">
    	<div class="card">
			<invoice-view-skeleton v-if="data.loading"></invoice-view-skeleton>
			<div v-if="!data.loading">
				<h1 class="text-2xl!">View Invoice</h1>
				<back-button></back-button>
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
						<tr v-for="(element, z) in data.product_rows_data" :key="z">
							<td v-for="(element_data, x) in element" :key="x">
								{{ element_data }}
							</td>
						</tr>
					</thead>
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
		</div>
	</section>
</template>

<script setup lang="ts">

import { onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import api from '../../helpers/api';
import InputButton from '../inputs/InputButton.vue';
import InvoiceViewSkeleton from '../skeletons/InvoiceViewSkeleton.vue';
import BackButton from '../blocks/BackButton.vue';

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
	invoice_id : number
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
	invoice_id : 0

});

const fetchInvoice = async (invoice_id : number) : Promise<void> => {

		data.loading = true;

		try{
			const response = await api.get('manage-invoices/snapshot/'+invoice_id);
			data.client = response.data.client;
			data.company = response.data.company;
			data.invoice = response.data.invoice;
			data.meta = response.data.meta;
			data.meta = response.data.meta;
			data.product_rows_headers = response.data.product_rows.headers;
			data.product_rows_data = response.data.product_rows.data;
			data.totals = response.data.totals;
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