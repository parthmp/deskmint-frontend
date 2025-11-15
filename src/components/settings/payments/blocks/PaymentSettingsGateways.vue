<template>
	<div>

		<div class="grid grid-cols-12 gap-5 items-stretch">
				
			<payment-gatway-block v-for="(gateway, index) in payment_gateways" :key="index" :image="gateway.image" :url="gateway.url" :active="gateway.active"></payment-gatway-block>
			
		</div>
		<br>
		<br>
	</div>
</template>

<script lang="ts" setup>

	
	import PaymentGatwayBlock from '../../../UI/PaymentGatwayBlock.vue';

	const payment_gateways : Array<{ image : string, url: string, active : boolean }> = [
		{
			image : '../../.././src/assets/images/paypal_logo.png',
			url: 'integrations/paypal',
			active : true
		},
		{
			image : '../../.././src/assets/images/stripe_logo.png',
			url: 'integrations/stripe',
			active : false
		}
	];

</script>