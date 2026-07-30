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
import common from '../../helpers/common.ts';

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
		cancel : [1,2],
		uncancel : 3,
	},
	mapped : 'status'

};



const handleAction = (obj:actionObject) => {
	
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