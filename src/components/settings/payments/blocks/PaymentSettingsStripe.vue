<template>

	<payment-settings-stripe-skeleton v-if="data.loading"></payment-settings-stripe-skeleton>
	<confirmation-popup confirm_text="Are you sure?" v-model:show_popup="data.integrated_disabled" :blocker="true" :scrollable="false" :close_outside="false" @closed="removeStripeIntegration"></confirmation-popup>
	<div v-if="!data.loading">
		<input-button class="lg:float-start" btn_text="Back" url="/settings/payments/integrations" icon="IconCaretLeft"></input-button>
		<input-button v-if="data.integrated" class="lg:float-end" style_type="error" btn_text="Remove Integration" icon="IconTrash" @click="data.integrated_disabled = true"></input-button>
		<div class="clear-both"></div>
		
		<br>
		<p class="font-bold text-red-600! dark:text-red-400!">Removing integration or changine API details will not stop any active subscriptions nor you will be able to manage any active subscriptions which are linked to removed/prev API key details. Please make sure you have either stopped/removed subscriptions, payment URLs and generate URLs & subsscriptions again with after new API keys added.</p>
		<br>
		<p>Click <a href="https://docs.stripe.com/keys" target="_blank">here</a> to know how to obtain your API key. Never share your API key with anyone.</p>
		<form @submit.prevent="handleStripeSettings">

			<input-password label="Secret key" placeholder="Secret key" v-model="data.secret.value" :error="data.secret.error" :required="true" ref="stripe_secret_ref"></input-password>
			
			<input-button btn_text="Save" :disabled="data.btn_disabled" icon="IconCheck" class="lg:float-end"></input-button>
			<div class="clear-both"></div>

		</form>
	</div>
</template>

<script lang="ts" setup>
	
	import { nextTick, onMounted, reactive, ref, watch } from 'vue';

	import InputPassword from '../../../inputs/InputPassword.vue';
	import InputButton from '../../../inputs/InputButton.vue';
	import api from '../../../../helpers/api';
	import { useRouter } from 'vue-router';
	import { toastEvents } from '../../../../events/toastEvents';

	import PaymentSettingsStripeSkeleton from '../../../skeletons/PaymentSettingsStripeSkeleton.vue';

	import ConfirmationPopup from '../../../UI/ConfirmationPopup.vue';

	type StripeSecretType = {
		error : string,
		value : string
	};

	interface PaymentSettingsStripeInterface{
		loading:boolean,
		btn_disabled:boolean
		integrated:boolean
		integrated_disabled:boolean
		secret : StripeSecretType
	}

	const emit = defineEmits(['remove_stripe']);

	const data = reactive<PaymentSettingsStripeInterface>({
		loading : false, 
		btn_disabled : false,
		integrated : false,
		integrated_disabled : false,
		secret : {
			error : 'Please enter stripe secret key',
			value : ''
		}
	});

	type StripeFieldvalidation = {
		validateText : () => {}
	};

	const stripe_secret_ref = ref<StripeFieldvalidation | null>(null);
	const router = useRouter();

	watch(() => data.secret.value, () : void => {
		nextTick(() => {
			data.secret.error = '';
			if(!stripe_secret_ref?.value?.validateText()){
				data.secret.error = 'Please enter stripe secret key';
			}
		});
	});

	const fetchStripeSettings = async () : Promise<void> => {

		data.loading = true;

		const response = await api.get('manage-stripe-settings');
		data.secret.value = response.data.secret;

		if(response.data.secret !== ''){
			data.integrated = true;
		}
		
		data.loading = false;
	}

	const handleStripeSettings = async () : Promise<void> => {

		data.secret.error = '';

		const valid_secret = stripe_secret_ref.value?.validateText() ?? false;
		
		data.btn_disabled = true;
		
		if(valid_secret){

			try{

				await api.post('manage-stripe-settings', {
					secret : data.secret.value
				});

				router.push('/settings/payments/integrations');

			}finally{
				data.btn_disabled = false;
			}


		}else{

			data.btn_disabled = false;

			data.secret.error = 'Please enter stripe secret key';

			toastEvents.emit('toast', {
				type : 'error',
				message : 'Please enter stripe secret key'
			});

		}
	}

	const removeStripeIntegration = async ({ closed, value } : {closed : boolean, value : boolean} ) : Promise<void> => {
		if(value){
			await api.delete('manage-stripe-settings');
			router.push('/settings/payments/integrations');
		}

		data.integrated_disabled = false;
	}

	onMounted(() : void => {
		fetchStripeSettings();
	});

</script>