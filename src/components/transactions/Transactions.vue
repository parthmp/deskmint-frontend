<template>
	<general-index-page page_title="Manage Transactions" :enable_arranged_columns="true" base_url="manage-transactions" slug="transactions" :actions="['view','edit', 'delete']" @action="handleAction"></general-index-page>
</template>

<script lang="ts" setup>
	
/* using compositon API */
import { onMounted, reactive } from 'vue';
import GeneralIndexPage from '../blocks/GeneralIndexPage.vue';
import api from '../../helpers/api.ts';
import { toastEvents } from '../../events/toastEvents.ts';
import { useRouter } from 'vue-router';

const router = useRouter();



const data = reactive<{time_offset_minutes:number}>({
	time_offset_minutes : 0
});

// const cancel_data = {

// 	labels: {
// 		cancel : 1,
// 		uncancel : 2,
// 	},
// 	mapped : 'status'

// };


const handleAction = (obj:actionObject) => {
	//console.log(obj);
	// if(obj.action.toLowerCase() === 'send invoice'){
	// 	sendInvoice(obj.row.company_id, obj.row.id);
	// }else if(obj.action.toLowerCase() === 'download pdf'){
	// 	downloadPDF(obj.row.company_id, obj.row.id);
	// }else if(obj.action.toLowerCase() === 'add payment'){
	// 	//TODO: redirect to the transactions module.
	// }else if(obj.action.toLowerCase() === 'cancel'){
	// 	obj.row.status.value = 2;
	// 	obj.row.status.highlight = 'error';
	// 	obj.row.status.text = 'Cancelled';
	// 	toggleInvoiceCancel(obj.row.id, 2);
	// }else if(obj.action.toLowerCase() === 'uncancel'){
	// 	obj.row.status.value = 1;
	// 	obj.row.status.highlight = 'info';
	// 	obj.row.status.text = 'Pending';
	// 	toggleInvoiceCancel(obj.row.id, 1);
	// }
}



onMounted(() => {
	const d = new Date();
	data.time_offset_minutes = -(d.getTimezoneOffset());
});

</script>