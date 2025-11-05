<template>
	<div>

		<div class="grid grid-cols-12 gap-5 items-stretch">
				
			<payment-gatway-block v-for="(gateway, index) in payment_gateways" :key="index" :image="gateway.image" :url="gateway.url"></payment-gatway-block>
			
		</div>
		<br>
		<br>
	</div>
</template>

<script lang="ts" setup>

	
	import PaymentGatwayBlock from '../../../UI/PaymentGatwayBlock.vue';

	const payment_gateways : Array<{ image : string, url: string }> = [
		{
			image : '../../.././src/assets/images/paypal_logo.png',
			url: 'paypal url'
		},
		{
			image : '../../.././src/assets/images/stripe_logo.png',
			url: 'stripe url'
		}
	];

</script>