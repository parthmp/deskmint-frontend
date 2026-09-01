<template>
	<general-index-page page_title="Manage invoices" :enable_arranged_columns="true" base_url="manage-invoices" slug="invoices" :actions="['view','edit', 'delete', cancel_data,add_payment, add_credit, 'Manage Credits', 'Manage Payments','download PDF', 'send Invoice']" @action="handleAction" :checkbox_actions="['Delete', 'Export CSV']"></general-index-page>
	<Popup :header="data.popup_header" :show_popup="data.show_popup" :blocker="true" :scrollable="false" @closed="closePopup" :close_outside="true" >
		<AddPaymentToInvoiceSkeleton v-if="data.loading"></AddPaymentToInvoiceSkeleton>
		<form @submit.prevent="handleAddCreditOrPayment" v-if="!data.loading">
			<div class="mt-2">
				<p>Invoice : {{ data.selected_invoice_number }}</p>
				<p>Due : {{ data.selected_invoice_due }} ({{ data.selected_invoice_currency }})</p>
				<template v-if="data.apply_type === 'credit'">
					<InputNumber step="0.01" min="0.01" label="Enter credit amount" v-model="data.apply_amount.value" :error="data.apply_amount.error" :required="true" ref="apply_amount_ref" placeholder="Enter credit amount"></InputNumber>
				</template>
				<template v-if="data.apply_type === 'payment'">
					<InputNumber step="0.01" min="0.01" label="Enter payment amount" v-model="data.apply_amount.value" :error="data.apply_amount.error" :required="true" ref="apply_amount_ref" placeholder="Enter payment amount"></InputNumber>
					<input-select label="Payment type" placeholder="Select payment type" :disabled="false" v-model="data.payment_type.value" :error="data.payment_type.error" :required="true" :options="data.payment_types" ref="payment_type_ref"></input-select>
				</template>
				<InputButton btn_text="Save" icon="IconCheck" :disabled="data.btn_disabled"></InputButton>
			</div>
		</form>
	
	</Popup>
</template>

<script lang="ts" setup>
	
/* using compositon API */
import { onMounted, reactive, ref, watch } from 'vue';
import GeneralIndexPage from '../blocks/GeneralIndexPage.vue';
import api from '../../helpers/api.ts';
import { toastEvents } from '../../events/toastEvents.ts';
import { useRouter } from 'vue-router';
import common from '../../helpers/common.ts';
import Popup from '../UI/Popup.vue';
import InputNumber from '../inputs/InputNumber.vue';
import InputButton from '../inputs/InputButton.vue';
import Decimal from 'decimal.js';
import InputSelect from '../inputs/InputSelect.vue';
import AddPaymentToInvoiceSkeleton from '../skeletons/AddPaymentToInvoiceSkeleton.vue';

const router = useRouter();

type actionObject = {
	action:string,
	row : {
		company_id : number,
		id : number
	}
};

interface InvoicesInterface {
	time_offset_minutes : number,
	show_popup : boolean,
	popup_header : string,
	apply_type: string,
	selected_invoice_id : number,
	selected_invoice_number : string,
	selected_invoice_due : string,
	selected_invoice_currency : string,
	apply_amount : {
		error: string,
		value : string
	},
	btn_disabled: boolean,
	loading: boolean,
	payment_types : Array<object>
	payment_type : {
		error: string,
		value : string
	}
}

const data = reactive<InvoicesInterface>({
	time_offset_minutes : 0,
	show_popup : false,
	popup_header : '',
	apply_type : '',
	selected_invoice_id : 0,
	selected_invoice_number : '',
	selected_invoice_due : '',
	selected_invoice_currency : '',
	apply_amount : {
		error: 'Please enter amount',
		value : ''
	},
	btn_disabled : false,
	loading : false,
	payment_types : [],
	payment_type : {
		error: 'Please select payment type',
		value : ''
	}
});

const payment_type_ref = ref();
const apply_amount_ref = ref();

let temp_obj = null;

watch(() => data.payment_type.value, () => {
	data.payment_type.error = '';
	const payment_type_v = payment_type_ref.value.validate();
	if(!payment_type_v){
		data.payment_type.error = 'Please select payment type';
	}
});

watch(() => data.apply_amount.value, () => {
	data.apply_amount.error = '';
	const apply_amount_v = apply_amount_ref.value.validate();
	if(!apply_amount_v){
		data.apply_amount.error = 'Please enter amount';
	}
});


const cancel_data = {

	labels: {
		cancel : [1,2],
		uncancel : 3,
	},
	mapped : 'status'

};

const add_payment = {
	labels : {
		add_payment : [1,2, 4]
	},
	mapped : 'status'
};


const add_credit = {
	labels : {
		add_credit : [1,2, 4]
	},
	mapped : 'status'
};

const handleAction = (obj:actionObject) => {
	
	temp_obj = obj;
	if(obj.action.toLowerCase() === 'send invoice'){
		if(obj.row.status.value == 1){
			obj.row.status.value = 2;
			obj.row.status.text = 'Sent';
			obj.row.status.highlight = 'success';
			const sql_datetime = common.toLocalSqlDatetime();
			obj.row.sent_at = common.formatDate(sql_datetime, false);
		}
		
		sendInvoice(obj.row.company_id, obj.row.id);
	}else if(obj.action.toLowerCase() === 'download pdf'){
		downloadPDF(obj.row.company_id, obj.row.id);
	}else if(obj.action.toLowerCase() === 'add payment'){
		//TODO: redirect when we have the seperate payment module.
		//router.push(`/transactions/create/${obj.row.id}`);
	}else if(obj.action.toLowerCase() === 'cancel'){
		obj.row.status.value = 3;
		obj.row.status.highlight = 'error';
		obj.row.status.text = 'Cancelled';
		toggleInvoiceCancel(obj.row.id, 3);
	}else if(obj.action.toLowerCase() === 'uncancel'){
		if(!obj.row.sent_at){
			obj.row.status.value = 1;
			obj.row.status.text = 'Draft';
			obj.row.status.highlight = 'info';
			toggleInvoiceCancel(obj.row.id, 1);
		}else{
			obj.row.status.value = 2;
			obj.row.status.text = 'Sent';
			obj.row.status.highlight = 'success';
			toggleInvoiceCancel(obj.row.id, 2);
		}
	}else if(obj.action.toLowerCase() === 'add_credit'){
		data.show_popup = true;
		data.popup_header = 'Add Credit';
		data.apply_type = 'credit';
		data.selected_invoice_id = obj.row.id;
		data.selected_invoice_number = obj.row.invoice_number;
		data.selected_invoice_currency = obj.row.c_code;
		data.selected_invoice_due = obj.row.balance_due;
		
	}else if(obj.action.toLowerCase() === 'add_payment'){
		data.show_popup = true;
		data.popup_header = 'Add Payment';
		data.apply_type = 'payment';
		data.selected_invoice_id = obj.row.id;
		data.selected_invoice_number = obj.row.invoice_number;
		data.selected_invoice_currency = obj.row.c_code;
		data.selected_invoice_due = obj.row.balance_due;
		fetchPaymentTypes();
	}else if(obj.action.toLowerCase() === 'manage credits'){
		router.push(`/invoices/manage-credits/${obj.row.id}`);
	}else if(obj.action.toLowerCase() === 'manage payments'){
		router.push(`/invoices/manage-payments/${obj.row.id}`);
	}
}

const toggleInvoiceCancel = async (id : number, cancel_status : number) : Promise<void> => {
	
	try{
		await api.patch('manage-invoices/toggle-cancel', {
			invoice_id : id,
			status : cancel_status
		});
	}catch(e){
		
	}
}

const sendInvoice = async (company_id : number, id : number) : Promise<void> => {

	try{
		await api.get('manage-invoices/send-invoice', {
			params : {
				company_id : company_id,
				invoice_id : id,
				time_offset_minutes : data.time_offset_minutes
			}
		});
	}catch(e){
		
	}
	
}

const downloadPDF = async (company_id : number, id : number) : Promise<void> => {
	try{
		const response = await api.get('manage-invoices/download-pdf', {
			params : {
				company_id : company_id,
				invoice_id : id,
				time_offset_minutes : data.time_offset_minutes
			}
		});
		toastEvents.emit('toast', {
			type: 'success',
			message: 'Downloading...'
		});
	
		const a = document.createElement('a');
		a.href = response.data.url;
		a.click();

	}catch(e){
		
	}
}

const closePopup = () : void => {
	data.show_popup = false;
	data.apply_amount.value = '';
}

const fetchPaymentTypes = async () => {
	data.loading = true;
	const response = await api.get(`manage-payment-requests/payment-types`);
	data.payment_types = response.data;
	data.loading = false;
}

const handleAddCreditOrPayment = async () : Promise<void> => {
	
	const apply_amount_v = apply_amount_ref.value.validate();

	let payment_type_v = true;

	if(data.apply_type === 'payment'){
		payment_type_v = payment_type_ref.value.validate();
	}
	
	if(!payment_type_v || !apply_amount_v){
		return ;
	}

	const due = new Decimal(data.selected_invoice_due);
	const applied_amount = new Decimal(data.apply_amount.value);

	if(applied_amount.equals(new Decimal(0))){
		return ;
	}

	if(applied_amount.greaterThan(due)){
		toastEvents.emit('toast', {
			type: 'error',
			message: `You can not apply more than ${due.toFixed(2).toString()}`
		});
		return ;
	}

	try{

		data.btn_disabled = true;
		const response = await api.post(`manage-invoices/add-credit-or-payment`, {
			invoice_id : data.selected_invoice_id,
			amount : data.apply_amount.value,
			payment_type : data.payment_type.value,
			type : data.apply_type
		});

		const meta = response.data.meta;

		temp_obj.row.status.value = meta.status;
		temp_obj.row.status.text = meta.status_text;
		temp_obj.row.status.highlight = meta.highlight;
		temp_obj.row.balance_due = meta.balance_due;
		closePopup();

	}catch(e){
		
	}finally{
		data.btn_disabled = false;	
	}

	

}

onMounted(() => {
	const d = new Date();
	data.time_offset_minutes = -(d.getTimezoneOffset());
});

</script>