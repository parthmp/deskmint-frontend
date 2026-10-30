<template>
	<general-index-page page_title="Manage recurring invoices" :enable_arranged_columns="true" base_url="manage-recurring-invoices" slug="invoices/recurring" :actions="['view','edit', 'delete',  send_sub_email]" @action="handleAction" :add_new="true" :checkbox_actions="['Delete', 'Export CSV']"></general-index-page>
	
	
</template>

<script lang="ts" setup>
	
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

const handleAction = (obj:actionObject) => {
	if(obj.action.toLowerCase() === 'send'){
		sendEmail(obj);
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