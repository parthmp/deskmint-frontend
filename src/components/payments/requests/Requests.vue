<template>
	<general-index-page page_title="Manage payment requests" :add_new="true" :enable_arranged_columns="true" base_url="manage-payment-requests" slug="payments/requests" :actions="[edit, 'Delete', cancel, send, mark_sent, mark_completed]" :checkbox_actions="['Delete', 'Export CSV']" @action="handleAction"></general-index-page>
</template>

<script lang="ts" setup>
	
/* using compositon API */
import { onMounted, reactive } from 'vue';
import GeneralIndexPage from '../../blocks/GeneralIndexPage.vue';
import common from '../../../helpers/common.ts';
import api from '../../../helpers/api.ts';

const mark_sent = {
	labels: {
		mark_sent : [1],
	},
	mapped : 'status'
};

const send = {
	labels: {
		send : [1, 2],
	},
	mapped : 'status'
};

const cancel = {
	labels: {
		cancel : [1, 2],
	},
	mapped : 'status'
};

const mark_completed = {
	labels: {
		mark_completed : [1, 2],
	},
	mapped : 'status'
};

const edit = {
	labels: {
		edit : [1, 2],
	},
	mapped : 'status'
};

const data = reactive<{time_offset_minutes:number}>({
	time_offset_minutes : 0
});

const handleAction = (action) : void => {
	console.log(action);
	const action_type = action.action.toLowerCase().trim();
	if(action_type === 'send' || action_type === 'mark_sent'){
		action.row.status.highlight = 'success';
		action.row.status.text = 'Sent';
		action.row.status.value = 2;
		const sql_datetime = common.toLocalSqlDatetime();
		action.row.sent_at = common.formatDate(sql_datetime, false);
		
		if(action_type === 'mark_sent'){
			
			makePaymentRequest(action.row.id, 'mark-sent');
		}else{
			makePaymentRequest(action.row.id, 'send');
		}
		
	}else if(action_type === 'cancel'){
		action.row.status.value = 3;
		action.row.status.highlight = 'error';
		action.row.status.text = 'Cancelled';
		makePaymentRequest(action.row.id, 'cancel');
	}
}

const makePaymentRequest = async (id : number, slug : string) : Promise<void> => {

	let patch_url = `manage-payment-requests/${slug}/${id}`;

	await api.patch(patch_url, {
		id:id
	});
}

onMounted(() => {
	const d = new Date();
	data.time_offset_minutes = -(d.getTimezoneOffset());
});

</script>