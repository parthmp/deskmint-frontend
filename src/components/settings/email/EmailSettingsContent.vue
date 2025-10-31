<template>
	<div>
		
		<email-settings-content-skeleton v-if="data.loading"></email-settings-content-skeleton>
		<div v-if="!data.loading">
			<input-button class="lg:float-end" btn_text="View variables" icon="IconEye" @click.prevent="data.show_popup = true"></input-button>
			<div class="clear-both"></div>
			<form @submit.prevent="saveEmailSettingsContent">
				<input-textarea v-model="data.email_content_invoice" :rows="6" label="Email content to send with invoice"></input-textarea>
				<input-textarea v-model="data.email_content_reminder" :rows="6" label="Email content to send for payment reminders"></input-textarea>
				<input-textarea v-model="data.payment_details" :rows="3" label="Payment details text (This will be sent only if you have an online payment method set)"></input-textarea>
				<input-button class="lg:float-end" btn_text="Save" icon="IconCheck" :disabled="data.btn_disabled"></input-button>
				<div class="clear-both"></div>
			</form>
			<popup :show_popup="data.show_popup" @closed="data.show_popup = false">
				<h2 class="text-xl!">Available variables</h2>
				<ul class="mt-[10px]">
					<li>{$client_first_name}</li>
					<li class="mt-[5px]">{$client_last_name}</li>
					<li class="mt-[5px]">{$invoice_date}</li>
					<li class="mt-[5px]">{$due_date}</li>
					<li class="mt-[5px]">{$invoice_number}</li>
					<li class="mt-[5px]">{$invoice_total}</li>
					<li class="mt-[5px]">{$unpaid_balance}</li>
					<li class="mt-[5px]">{$payment_url}</li>
				</ul>
			</popup>
		</div>
	</div>
</template>

<script lang="ts" setup>

	import EmailSettingsContentSkeleton from '../../skeletons/EmailSettingsContentSkeleton.vue';

	import InputTextarea from '../../inputs/InputTextarea.vue';
	import InputButton from '../../inputs/InputButton.vue';
	import Popup from '../../UI/Popup.vue';
	import { onMounted, reactive } from 'vue';
	import api from '../../../helpers/api';
	
	interface EmailSettingsContentInterface{
		show_popup:boolean,
		email_content_invoice:string,
		email_content_reminder:string,
		payment_details:string,
		btn_disabled:boolean,
		loading:boolean
	}

	interface FetchedResponse{
		email_content_invoice : string,
		email_content_reminder : string,
		payment_details : string
	}

	const data = reactive<EmailSettingsContentInterface>({
		show_popup: false,
		email_content_invoice : '',
		email_content_reminder: '',
		payment_details: '',
		btn_disabled: false,
		loading: false
	});

	const saveEmailSettingsContent = async () : Promise<void> => {
		
		data.btn_disabled = true;

		try{
			await api.post('manage-email-settings-content', {
				email_content_invoice:data.email_content_invoice,
				email_content_reminder:data.email_content_reminder,
				payment_details:data.payment_details
			});
		}finally{
			data.btn_disabled = false;
		}
		
	}

	const fetchEmailSettingsContent = async () : Promise<void> => {

		data.loading = true;
		
		const response = await api.get<FetchedResponse>('manage-email-settings-content');
		
		data.email_content_invoice = response.data.email_content_invoice;
		data.email_content_reminder = response.data.email_content_reminder;
		data.payment_details = response.data.payment_details;

		data.loading = false;

	}

	onMounted(() : void => {
		fetchEmailSettingsContent();
	});

</script>