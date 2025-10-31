<template>
	<div>
		<input-button class="lg:float-end" btn_text="View variables" icon="IconEye" @click.prevent="data.show_popup = true"></input-button>
		<div class="clear-both"></div>
		<form @submit.prevent="saveEmailSettingsContent">
			<input-textarea :rows="6" label="Email content to send with invoice"></input-textarea>
			<input-textarea :rows="6" label="Email content to send for payment reminders"></input-textarea>
			<input-textarea :rows="3" label="Payment details text (This will be sent only if you have an online payment method set)"></input-textarea>
			<input-button class="lg:float-end" btn_text="Save" icon="IconCheck"></input-button>
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
</template>

<script lang="ts" setup>

	import InputTextarea from '../../inputs/InputTextarea.vue';
	import InputButton from '../../inputs/InputButton.vue';
	import Popup from '../../UI/Popup.vue';
	import { reactive } from 'vue';

	const data = reactive({
		show_popup: false
	});

	const saveEmailSettingsContent = () : void => {
		console.log('form submitted');
	}

</script>