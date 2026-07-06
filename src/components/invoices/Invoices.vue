<template>
	<general-index-page page_title="Manage invoices" :enable_arranged_columns="true" base_url="manage-invoices" slug="invoices" :actions="['view','edit', 'delete', cancel_data,'Add Payment', 'download PDF', 'send Invoice']" @action="handleAction"></general-index-page>
</template>

<script lang="ts" setup>
	
/* using compositon API */
import { onMounted, reactive } from 'vue';
import GeneralIndexPage from '../blocks/GeneralIndexPage.vue';
import api from '../../helpers/api.ts';
import { toastEvents } from '../../events/toastEvents.ts';
import { useRouter } from 'vue-router';

const router = useRouter();

type actionObject = {
	action:string,
	row : {
		company_id : number,
		id : number
	}
};

const data = reactive<{time_offset_minutes:number}>({
	time_offset_minutes : 0
});

const cancel_data = {

	labels: {
		cancel : 1,
		uncancel : 2,
	},
	mapped : 'status'

};


const handleAction = (obj:actionObject) => {
	//console.log(obj);
	if(obj.action.toLowerCase() === 'send invoice'){
		sendInvoice(obj.row.company_id, obj.row.id);
	}else if(obj.action.toLowerCase() === 'download pdf'){
		downloadPDF(obj.row.company_id, obj.row.id);
	}else if(obj.action.toLowerCase() === 'add payment'){
		//TODO: redirect to the transactions module.
	}else if(obj.action.toLowerCase() === 'cancel'){
		obj.row.status.value = 2;
		obj.row.status.highlight = 'error';
		obj.row.status.text = 'Cancelled';
		toggleInvoiceCancel(obj.row.id, 2);
	}else if(obj.action.toLowerCase() === 'uncancel'){
		obj.row.status.value = 1;
		obj.row.status.highlight = 'info';
		obj.row.status.text = 'Pending';
		toggleInvoiceCancel(obj.row.id, 1);
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

onMounted(() => {
	const d = new Date();
	data.time_offset_minutes = -(d.getTimezoneOffset());
});

</script>