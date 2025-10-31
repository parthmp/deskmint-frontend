<template>
	<div>
		<div v-if="data.loading">
			<email-settings-reminders-skeleton></email-settings-reminders-skeleton>
		</div>
		<div v-if="!data.loading">
			<p>Email reminders will be sent if it is turned on for the specific client and until the invoice is paid or has overpaid amount.</p>
			<br>
			<form @submit.prevent="saveEmailSettingsReminders">
				
				<input-number label="Send reminders n times" v-model="data.send_n_times" placeholder="Send reminders n times"></input-number>

				<input-number label="Gap (days) between each reminder email" v-model="data.days_gap" placeholder="Gap (days) between each reminder email"></input-number>

				<input-button class="lg:float-end" btn_text="Save" icon="IconCheck" :disabled="data.btn_disabled"></input-button>
				<div class="clear-both"></div>

			</form>

		</div>
	</div>
</template>

<script lang="ts" setup>

	import EmailSettingsRemindersSkeleton from '../../../skeletons/EmailSettingsRemindersSkeleton.vue';

	import { onMounted, reactive } from 'vue';
	import InputNumber from '../../../inputs/InputNumber.vue';
	import InputButton from '../../../inputs/InputButton.vue';
	import api from '../../../../helpers/api';

	interface EmailSettingsRemindersInterface{
		btn_disabled:boolean,
		loading:boolean,
		send_n_times:number,
		days_gap:number
	}

	interface FetchedResponse{
		send_n_times:number,
		days_gap:number,
	}

	const data = reactive<EmailSettingsRemindersInterface>({
		btn_disabled : false,
		loading: false,
		send_n_times : 0,
		days_gap : 0
	});

	const saveEmailSettingsReminders = async () : Promise<void> => {

		data.btn_disabled = true;

		try{

			await api.post('manage-email-settings-reminders', {
				send_n_times : data.send_n_times,
				days_gap : data.days_gap
			});

		}finally{
			data.btn_disabled = false;
		}

	}

	const fetchEmailSettingsReminders = async () : Promise<void> => {

		data.loading = true;

		const response = await api.get<FetchedResponse>('manage-email-settings-reminders');

		data.send_n_times = response.data.send_n_times;
		data.days_gap = response.data.days_gap;

		data.loading = false;

	}

	onMounted(() : void => {
		fetchEmailSettingsReminders();
	});


</script>