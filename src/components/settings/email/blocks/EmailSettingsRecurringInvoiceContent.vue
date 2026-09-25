<template>
	<div>
		
		<email-settings-content-skeleton v-if="data.loading"></email-settings-content-skeleton>
		<div v-if="!data.loading">
			
			<form @submit.prevent="saveEmailSettingsContent">
				<p>Place online gateway content between [{online-payment-start}] and [{online-payment-end}] tags, that content will only been displayed in email for invoices that has online gateways set.</p>
				<input-textarea v-model="data.recurring_invoice_email_content" :rows="6" :label="`Email content to send for recurring invoice (${available_tags})`" :placeholder="`Email content to send with invoice`"></input-textarea>
				
				<input-button class="lg:float-end" btn_text="Save" icon="IconCheck" :disabled="data.btn_disabled"></input-button>
				<div class="clear-both"></div>
			</form>
		</div>
	</div>
</template>

<script lang="ts" setup>

	import EmailSettingsContentSkeleton from '../../../skeletons/EmailSettingsContentSkeleton.vue';

	import InputTextarea from '../../../inputs/InputTextarea.vue';
	import InputButton from '../../../inputs/InputButton.vue';
	
	import { onMounted, reactive } from 'vue';
	import api from '../../../../helpers/api';
	
	interface EmailSettingsContentInterface{
		show_popup:boolean,
		recurring_invoice_email_content:string,
		btn_disabled:boolean,
		loading:boolean
	}

	interface FetchedResponse{
		recurring_invoice_email_content : string,
		payment_details : string
	}

	const data = reactive<EmailSettingsContentInterface>({
		show_popup: false,
		recurring_invoice_email_content : '',
		btn_disabled: false,
		loading: false
	});

	const available_tags = 'Available tags are: {$client_first_name} ,  {$client_last_name} , {$frequency} , {$total} , {$subscription_url}';

	const saveEmailSettingsContent = async () : Promise<void> => {
		
		data.btn_disabled = true;

		try{
			await api.post('manage-email-settings-content', {
				data : {
					recurring_invoice_email_content:data.recurring_invoice_email_content,
				},
				key: 'recurring_invoices_email_content'
			});
		}finally{
			data.btn_disabled = false;
		}
		
	}

	const fetchEmailSettingsContent = async () : Promise<void> => {

		data.loading = true;
		
		const response = await api.get<FetchedResponse>('manage-email-settings-content', {
			params : {
				key: 'recurring_invoices_email_content'
			}
		});
		
		data.recurring_invoice_email_content = response.data.recurring_invoice_email_content;
		
		data.loading = false;

	}

	onMounted(() : void => {
		fetchEmailSettingsContent();
	});

</script>