<template>
	<confirmation-popup confirm_text="Are you sure?" v-model:show_popup="data.integrated_disabled" :blocker="true" :scrollable="false" :close_outside="false" @closed="removePaypalIntegration"></confirmation-popup>
	<payment-settings-paypal-seketon v-if="data.loading"></payment-settings-paypal-seketon>

	<div v-if="!data.loading">
		<input-button class="lg:float-start" btn_text="Back" url="/settings/payments/integrations" icon="IconCaretLeft"></input-button>
		<input-button :disabled="data.integrated_disabled" v-if="data.integrated" class="lg:float-end" style_type="error" btn_text="Remove Integration" icon="IconTrash" @click="data.integrated_disabled = true"></input-button>
		
		<div class="clear-both"></div>
		<br>
		<p class="font-bold text-red-600! dark:text-red-400!">Removing integration or changine API details will not stop any active subscriptions nor you will be able to manage any active subscriptions which are linked to removed/prev API key details. Please make sure you have either stopped/removed subscriptions, payment URLs and generate URLs & subsscriptions again with after new API keys added.</p>
		<br>
		<p>Note: to use PayPal, you must have a business PayPal account to receive payments. Click <a href="https://developer.paypal.com/api/rest/production/#obtain-your-live-paypal-credentials" target="_blank">here</a> to know how to obtain your API keys.</p>
		<p>Never share your API keys with anyone.</p>
		<br>
		<form @submit.prevent="handlePayPalSettings">

			<input-text label="Client ID" placeholder="Client ID" v-model="data.client_id.value" :error="data.client_id.error" :required="true" ref="paypal_client_id_ref"></input-text>
			<input-password label="Secret key" placeholder="Secret key" v-model="data.secret.value" :error="data.secret.error" :required="true" ref="paypal_secret_ref"></input-password>
			<input-select label="Mode" placeholder="Select mode" v-model="data.mode.value" :error="data.mode.error" :options="modes" :required="true" ref="paypal_mode_ref"></input-select>

			<input-button btn_text="Save" :disabled="data.btn_disabled" icon="IconCheck" class="lg:float-end"></input-button>
			<div class="clear-both"></div>

		</form>
	</div>
</template>

<script lang="ts" setup>

	import InputText from '../../../inputs/InputText.vue';
	import InputPassword from '../../../inputs/InputPassword.vue';

	import InputSelect from '../../../inputs/InputSelect.vue';

	import InputButton from '../../../inputs/InputButton.vue';
	import { nextTick, onMounted, reactive, ref, watch } from 'vue';
	import { toastEvents } from '../../../../events/toastEvents';
	import api from '../../../../helpers/api';
	import { useRouter } from 'vue-router';

	import PaymentSettingsPaypalSeketon from '../../../skeletons/PaymentSettingsPaypalSeketon.vue';
	import ConfirmationPopup from '../../../UI/ConfirmationPopup.vue';

	const router = useRouter();

	const emit = defineEmits(['remove_paypal']);

	type InputObject = {
		error : string,
		value : string
	};

	type RefType = {
		validate : () => {}
	};

	type RefTypePass = {
		validateText : () => {}
	};

	interface PaymentSettingsPayPalInterface{
		client_id : InputObject,
		secret : InputObject,
		mode : InputObject,
		btn_disabled: boolean,
		loading: boolean,
		integrated: boolean,
		integrated_disabled: boolean
	}

	const modes = [
		{
			text : 'Live',
			value : 'live'
		},
		{
			text : 'Sandbox',
			value: 'sandbox'
		}
	];

	const data = reactive<PaymentSettingsPayPalInterface>({
		client_id : {
			error : 'Please enter Client ID',
			value : ''
		},
		secret: {
			error : 'Please enter Secret key',
			value : ''
		},
		mode: {
			error : 'Please select a mode',
			value : ''
		},
		btn_disabled: false,
		loading : false,
		integrated : false,
		integrated_disabled : false
	});

	const paypal_client_id_ref = ref<RefType | null>(null);
	const paypal_secret_ref = ref<RefTypePass | null>(null);
	const paypal_mode_ref = ref<RefType | null>(null);

	watch(() => data.client_id.value, () : void => {
		
		nextTick(() => {
			data.client_id.error = '';
			if(!paypal_client_id_ref?.value?.validate()){
				data.client_id.error = 'Please enter Client ID';
			}
		});
		
	});

	watch(() => data.secret.value, () : void => {
		nextTick(() => {
			data.secret.error = '';
			if(!paypal_secret_ref?.value?.validateText()){
				data.secret.error = 'Please enter Secret key';
			}
		});
	});

	watch(() => data.mode.value, () : void => {
		nextTick(() => {
			data.mode.error = '';
			if(!paypal_mode_ref?.value?.validate()){
				data.mode.error = 'Please select a mode';
			}
		});
	});

	const fetchPaypalSettings = async () : Promise<void> => {

		data.loading = true;

		const response = await api.get('manage-paypal-settings');
		
		data.client_id.value = response.data.client_id;
		data.secret.value = response.data.secret;
		data.mode.value = response.data.mode;

		if(response.data.secret !== ''){
			data.integrated = true;
		}

		data.loading = false;
	}

	const handlePayPalSettings = async () : Promise<void> => {

		const valid_client_id = paypal_client_id_ref.value?.validate() ?? false;
		const valid_secret = paypal_secret_ref.value?.validateText() ?? false;
		const valid_mode = paypal_mode_ref.value?.validate() ?? false;

		data.btn_disabled = true;
		
		if(valid_client_id && valid_secret && valid_mode){

			try{

				const response = await api.post('manage-paypal-settings', {
					client_id : data.client_id.value,
					secret : data.secret.value,
					mode : data.mode.value
				});

				router.push('/settings/payments/integrations');

			}finally{
				data.btn_disabled = false;
			}


		}else{

			data.btn_disabled = false;

			data.client_id.error = 'Please enter Client ID';
			toastEvents.emit('toast', {
				type : 'error',
				message : 'Please fill in required fields'
			});

		}

	}

	const removePaypalIntegration = async ({ closed, value } : {closed : boolean, value : boolean} ) : Promise<void> => {
		
		if(value){
			await api.delete('manage-paypal-settings');
			router.push('/settings/payments/integrations');
		}

		data.integrated_disabled = false;

	}

	onMounted(() : void => {
		fetchPaypalSettings();
	});

</script>