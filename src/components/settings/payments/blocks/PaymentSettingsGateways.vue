<template>
	<div>
		<PaymentSettingsGatewaysSkeleton v-if="loading"></PaymentSettingsGatewaysSkeleton>
		<div class="grid grid-cols-12 gap-5 items-stretch" v-if="!loading">
			
			<payment-gatway-block v-for="(gateway, index) in payment_gateways" :key="index" :image="gateway.image" :url="gateway.url" :active="gateway.active"></payment-gatway-block>
			
		</div>
		<br>
		<br>
	</div>
</template>

<script lang="ts" setup>

	
	import { onMounted, reactive, ref } from 'vue';
	import PaymentGatwayBlock from '../../../UI/PaymentGatwayBlock.vue';
	import api from '../../../../helpers/api';

	import PaymentSettingsGatewaysSkeleton from '../../../skeletons/PaymentSettingsGatewaysSkeleton.vue';
	

	const loading = ref<boolean>(true);

	const payment_gateways : Array<{ image : string, url: string, active : boolean }> = reactive([
		{
			image : '../../.././src/assets/images/paypal_logo.png',
			url: 'integrations/paypal',
			active : false
		},
		{
			image : '../../.././src/assets/images/stripe_logo.png',
			url: 'integrations/stripe',
			active : false
		}
	]);

	const fetchPaymentGatewayStatus = async () : Promise<void> => {

		try{

			const response = await api.get('manage-payments-settings');
			if(response.data.includes('paypal')){
				payment_gateways[0].active = true;
			}
			if(response.data.includes('stripe')){
				payment_gateways[1].active = true;
			}

		}finally{
			loading.value = false;
		}

	}

	onMounted(() : void => {
		fetchPaymentGatewayStatus();
	})

</script>