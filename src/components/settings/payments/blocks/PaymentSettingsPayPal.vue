<template>

	<payment-settings-paypal-seketon v-if="data.loading"></payment-settings-paypal-seketon>

	<div v-if="!data.loading">
		<p>Note: to use PayPal, you must have a business PayPal account to receive payments. Click <a href="https://developer.paypal.com/api/rest/production/#obtain-your-live-paypal-credentials" target="_blank">here</a> to know how to obtain your API keys.</p>
		<p>Never share your API keys with anyone.</p>
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

	const router = useRouter();

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
		loading: boolean
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
		loading : false
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

	onMounted(() : void => {
		fetchPaypalSettings();
	});

</script>