<template>
	<general-index-page page_title="Manage invoices" :enable_arranged_columns="true" base_url="manage-invoices" slug="invoices" :actions="['view','edit', 'delete', 'download PDF', 'send invoice']" @action="handleAction"></general-index-page>
</template>

<script lang="ts" setup>
	
	/* using compositon API */
	import { onMounted, reactive } from 'vue';
	import GeneralIndexPage from '../blocks/GeneralIndexPage.vue';
import api from '../../helpers/api.ts';

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

	const handleAction = (obj:actionObject) => {
		console.log(obj);
		if(obj.action.toLowerCase() === 'send invoice'){
			sendInvoice(obj.row.company_id, obj.row.id);
		}
	}

	const sendInvoice = async (company_id : number, id : number) : Promise<void> => {

		await api.get('manage-invoices/send-invoice', {
			params : {
				company_id : company_id,
				invoice_id : id,
				time_offset_minutes : data.time_offset_minutes
			}
		});

	}

	onMounted(() => {
		const d = new Date();
		data.time_offset_minutes = d.getTimezoneOffset();
	});

</script>