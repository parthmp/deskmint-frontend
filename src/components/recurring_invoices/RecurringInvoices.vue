<template>
	<general-index-page page_title="Manage recurring invoices" :enable_arranged_columns="true" base_url="manage-recurring-invoices" slug="invoices/recurring" :actions="['view','edit', delete_record,  send_sub_email, pause, start, cancel]" @action="handleAction" :add_new="true" :checkbox_actions="['Delete', 'Export CSV']" :key="data.key"></general-index-page>
	
	<ConfirmationPopup :show_popup="data.show_popup" :confirm_text="'Are you sure?'" :blocker="true" :close_outside="false" :scrollable="false" @closed="(e) => closePopup(e)"></ConfirmationPopup>
</template>

<script lang="ts" setup>
	
import { reactive } from 'vue';
import { toastEvents } from '../../events/toastEvents.ts';
import api from '../../helpers/api.ts';
import common from '../../helpers/common.ts';
import GeneralIndexPage from '../blocks/GeneralIndexPage.vue';
import ConfirmationPopup from '../UI/ConfirmationPopup.vue';

type RowObj = {
	company_id : number,
	id : number,
	payment_gateway: {
		text : string,
		value : number
	},
	status: {
		text : string,
		value : number,
		highlight : string
	},
	sent_at : string,
	next_invoice_on : string
};

type actionObject = {
	action:string,
	row : RowObj
};

type ReactiveType = {
	show_popup : boolean,
	row_object : RowObj,
	popup_action_mode : string,
	key: number
};

const data = reactive<ReactiveType>({
	show_popup : false,
	row_object : {

		company_id : 0,
		id : 0,
		payment_gateway: {
			text : '',
			value : 0
		},
		status: {
			text : '',
			value : 0,
			highlight : ''
		},
		sent_at : '',
		next_invoice_on : ''

	},
	popup_action_mode : '',
	key : 1
});

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

const cancel = {

	labels: {
		cancel : [1,2,3,4,5,7]
	},
	mapped : 'status'

};

const delete_record = {

	labels: {
		delete_record : [1,2,5,6,8]
	},
	mapped : 'status'

};



const handleAction = (obj:actionObject) => {
	
	const action = obj.action.toLowerCase();
	
	if(action === 'send'){
		sendEmail(obj);
	}else if(action === 'pause'){
		handleSubscriptionStatus(obj.row, 'pause');
	}else if(action === 'start'){
		handleSubscriptionStatus(obj.row, 'activate');
	}else if(action === 'cancel'){
		data.show_popup = true;
		data.row_object = obj.row;
		data.popup_action_mode = 'cancel';
	}else if(action === 'delete_record'){
		data.show_popup = true;
		data.row_object = obj.row;
		data.popup_action_mode = 'delete_record'
	}

}

const handleSubscriptionStatus = async (obj : RowObj, status_call:string) : Promise<void> => {

	try{

		if(obj.payment_gateway.text.toLowerCase() !== 'none'){
			toastEvents.emit('toast', {
				type : 'success',
				message: `Contacting ${obj.payment_gateway.text}...`
			});
		}

		const response = await api.get(`manage-recurring-invoices/${status_call}/${obj.id}`);

		const meta = response.data.meta;
		
		obj.status.value = +meta.status_value;
		obj.status.text = meta.status_text;
		obj.status.highlight = meta.highlight;
		
		if(meta.iso_date){
			obj.next_invoice_on = common.formatDate(meta.iso_date);
		}
		

	}finally{

	}
	

}

const deleteRecords = async (id: number) : Promise<void> => {

	try{

		await api.delete('manage-recurring-invoices', {
			data : {
				ids : [id]
			}
		});

		data.key++;

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

const closePopup = (e : {value : boolean, closed : boolean}) => {

	data.show_popup = false;

	if(e.value){
		console.log(data.row_object);
		if(data.popup_action_mode === 'cancel'){
			handleSubscriptionStatus(data.row_object, 'cancel');
		}else if(data.popup_action_mode === 'delete_record'){
			deleteRecords(data.row_object.id);
		}
		
	}
	
}

</script>