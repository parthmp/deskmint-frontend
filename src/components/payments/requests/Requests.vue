<template>
	<general-index-page page_title="Manage payment requests" :add_new="true" :enable_arranged_columns="true" base_url="manage-payment-requests" slug="payments/requests" :actions="['Edit', 'Delete', cancel, send, mark_sent, mark_completed]" :checkbox_actions="['Delete', 'Export CSV']" @action="handleAction"></general-index-page>
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

const data = reactive<{time_offset_minutes:number}>({
	time_offset_minutes : 0
});

const handleAction = (action) : void => {
	console.log(action);
	const action_type = action.action.toLowerCase().trim();
	if(action_type === 'send' || action_type === 'mark_sent'){
		action.row.status.highlight = 'success';
		action.row.status.text = 'Sent';
		const sql_datetime = common.toLocalSqlDatetime();
		action.row.sent_at = common.formatDate(sql_datetime, false);
		let mark_sent = false;
		if(action_type === 'mark_sent'){
			mark_sent = true;
		}
		sendPaymentRequest(action.row.id, mark_sent);
	}
}

const sendPaymentRequest = async (id : number, mark_sent : boolean) : Promise<void> => {

	let patch_url = `manage-payment-requests/send/${id}`;

	if(mark_sent){
		patch_url = `manage-payment-requests/mark-sent/${id}`;
	}

	await api.patch(patch_url, {
		id:id
	});
}

onMounted(() => {
	const d = new Date();
	data.time_offset_minutes = -(d.getTimezoneOffset());
});

</script>