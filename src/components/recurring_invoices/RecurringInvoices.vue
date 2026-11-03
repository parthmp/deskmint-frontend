<template>
	<general-index-page page_title="Manage recurring invoices" :enable_arranged_columns="true" base_url="manage-recurring-invoices" slug="invoices/recurring" :actions="['view','edit', 'delete',  send_sub_email, pause, start, 'Cancel']" @action="handleAction" :add_new="true" :checkbox_actions="['Delete', 'Export CSV']"></general-index-page>
	
	
</template>

<script lang="ts" setup>
	
import { toastEvents } from '../../events/toastEvents.ts';
import api from '../../helpers/api.ts';
import common from '../../helpers/common.ts';
import GeneralIndexPage from '../blocks/GeneralIndexPage.vue';

type actionObject = {
	action:string,
	row : {
		company_id : number,
		id : number,
		payment_gateway: {
			value : number
		},
		status: {
			text : string,
			value : number,
			highlight : string
		},
		sent_at : string
	}
};

const send_sub_email = {

	labels: {
		Send : [1,2,5]
	},
	mapped : 'status'

};

const pause = {

	labels: {
		pause : [3]
	},
	mapped : 'status'

};

const start = {

	labels: {
		start : [1,2,4]
	},
	mapped : 'status'

};

const handleAction = (obj:actionObject) => {
	
	const action = obj.action.toLowerCase();

	if(action === 'send'){
		sendEmail(obj);
	}else if(action === 'pause'){
		pauseSubscription(obj);
	}else if(action === 'start'){

	}else if(action === 'cancel'){

	}

}

const pauseSubscription = async (obj : actionObject) : Promise<void> => {

	try{

		if(obj.row.payment_gateway.text.toLowerCase() !== 'none'){
			toastEvents.emit('toast', {
				type : 'success',
				message: `Contacting ${obj.row.payment_gateway.text}...`
			});
		}

		const response = await api.get(`manage-recurring-invoices/pause/${obj.row.id}`);

		const meta = response.data.meta;
		
		obj.row.status.value = +meta.status_value;
		obj.row.status.text = meta.status_text;
		obj.row.status.highlight = meta.highlight;

		

	}finally{

	}
	

}

const sendEmail = async (obj : actionObject) : Promise<void> => {
	
	try{
		await api.get('manage-recurring-invoices/send-email', {
			params : {
				recurring_invoice_id : obj.row.id,
			}
		});
		
		if(+obj.row.payment_gateway.value == 1){
			obj.row.status.value = 2;
			obj.row.status.text = 'Sent';
			obj.row.status.highlight = 'success';
			
		}else if(+obj.row.payment_gateway.value == 2 || +obj.row.payment_gateway.value == 3){
			obj.row.status.value = 5;
			obj.row.status.text = 'Pending approval';
			obj.row.status.highlight = 'error';
			
		}

		
		const sql_datetime = common.toLocalSqlDatetime();
		obj.row.sent_at = common.formatDate(sql_datetime, false);

	}catch(e){
		
	}
}

</script>