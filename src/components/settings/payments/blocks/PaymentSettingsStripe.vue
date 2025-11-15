<template>

	<payment-settings-stripe-skeleton v-if="data.loading"></payment-settings-stripe-skeleton>

	<div v-if="!data.loading">
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

	const data = reactive({
		loading : false, 
		btn_disabled : false,
		secret : {
			error : 'Please enter stripe secret key',
			value : ''
		}
	});

	const stripe_secret_ref = ref(null);
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

	onMounted(() : void => {
		fetchStripeSettings();
	});

</script>