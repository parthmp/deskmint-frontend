<template>
	<div>
		
		<email-settings-content-skeleton v-if="data.loading"></email-settings-content-skeleton>
		<div v-if="!data.loading">
			
			<form @submit.prevent="saveEmailSettingsContent">
				<p>Place online gateway content between [{online-payment-start}] and [{online-payment-end}] tags, that content will only been displayed in email for invoices that has online gateways set.</p>
				<input-textarea v-model="data.email_content_payment_request" :rows="6" :label="`Email content to send for payment requests (${available_tags})`" placeholder="Email content to send for payment requests"></input-textarea>
				<input-textarea v-model="data.email_content_reminder_payment_request" :rows="6" :label="`Email content to send for payment requests reminders (${available_tags})`" placeholder="Email content to send for payment requests reminders"></input-textarea>
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
		email_content_payment_request:string,
		email_content_reminder_payment_request:string,
		btn_disabled:boolean,
		loading:boolean
	}

	interface FetchedResponse{
		email_content_payment_request : string,
		email_content_reminder_payment_request : string,
		payment_details : string
	}

	const data = reactive<EmailSettingsContentInterface>({
		show_popup: false,
		email_content_payment_request : '',
		email_content_reminder_payment_request: '',
		btn_disabled: false,
		loading: false
	});

	const available_tags = 'Available tags are: {$client_first_name} , {$client_last_name} , {$unpaid_balance} and {$payment_url}';

	const saveEmailSettingsContent = async () : Promise<void> => {
		
		data.btn_disabled = true;

		try{
			await api.post('manage-email-settings-content', {
				data : {
					email_content_payment_request:data.email_content_payment_request,
					email_content_reminder_payment_request:data.email_content_reminder_payment_request
				},
				key: 'payment_requests_email_content'
			});
		}finally{
			data.btn_disabled = false;
		}
		
	}

	const fetchEmailSettingsContent = async () : Promise<void> => {

		data.loading = true;
		
		const response = await api.get<FetchedResponse>('manage-email-settings-content', {
			params : {
				key: 'payment_requests_email_content'
			}
		});
		
		data.email_content_payment_request = response.data.email_content_payment_request;
		data.email_content_reminder_payment_request = response.data.email_content_reminder_payment_request;
		
		data.loading = false;

	}

	onMounted(() : void => {
		fetchEmailSettingsContent();
	});

</script>