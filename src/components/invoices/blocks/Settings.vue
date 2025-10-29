<template>
	<div>
		<form @submit.prevent="validateSettings">
			<input-select label="Payment method" :options="data.payment_methods" placeholder="Select payment method" :required="true" v-model="data.payment_method.value" :error="data.payment_method.error" ref="payment_method_ref"></input-select>
			<br>
			<span class="flex gap-5 items-center"><input-switch v-model="data.send_invoice_in_email"></input-switch><span @click.prevent="data.send_invoice_in_email = !data.send_invoice_in_email">Send email with invoice</span></span>
			<input-button btn_text="Save" icon="iconCheck" class="lg:float-end"></input-button>
			<div class="clear-both"></div>
		</form>
	</div>
</template>

<script lang="ts" setup>

	import { reactive, ref, watch } from 'vue';

	import InputButton from '../../inputs/InputButton.vue';
	import InputSwitch from '../../inputs/InputSwitch.vue';
	import InputSelect from '../../inputs/InputSelect.vue';

	interface InputComponent{
  		validate: () => boolean
	}

	interface SettingsInterface{
		payment_methods : Array<object>
		payment_method : object,
		send_invoice_in_email : boolean
	}

	const payment_method_ref = ref<InputComponent | null>(null);

	const data = reactive<SettingsInterface>({
		payment_methods : [ /* using hardcoded here , will change this after payment methods implemented */
			{
				text : 'Cash',
				value : 'cash'
			},
			{
				text : 'Net Banking',
				value : 'net_banking'
			},
			{
				text : 'PayPal',
				value : 'paypal'
			},
			{
				text : 'Stripe',
				value : 'stripe'
			}
		],
		payment_method : {
			value : 'cash',
			error : ''
		},
		send_invoice_in_email : true
	});

	watch(() => data.payment_method.value, () => {
		data.payment_method.error = '';
		if(!payment_method_ref.value.validate()){
			data.payment_method.error = 'Please select a payment method';
		}
	});

	const validateSettings = () : void => {
		
		data.payment_method.error = '';

		if(!payment_method_ref.value?.validate()){
			data.payment_method.error = 'Please select a payment method';
		}

		/* send request here */

	}

	// defineExpose(['validateSettings']);

</script>