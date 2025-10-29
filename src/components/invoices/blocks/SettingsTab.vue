<template>
	<div>
		<form @submit.prevent="handleSubmit">
			<input-select 
				label="Payment method" 
				:options="payment_methods" 
				placeholder="Select payment method" 
				:required="true" 
				v-model="payment_method.value" 
				:error="payment_method.error" 
				ref="payment_method_ref"
			/>
			<br>
			<span class="flex gap-5 items-center">
				<input-switch v-model="send_invoice_in_email" />
				<span @click.prevent="send_invoice_in_email = !send_invoice_in_email">
					Send email with invoice
				</span>
			</span>
			<input-button btn_text="Save" icon="iconCheck" class="lg:float-end" />
			<div class="clear-both"></div>
		</form>
	</div>
</template>

<script lang="ts" setup>

	import { ref } from 'vue';
	import InputButton from '../../inputs/InputButton.vue';
	import InputSwitch from '../../inputs/InputSwitch.vue';
	import InputSelect from '../../inputs/InputSelect.vue';

	interface InputComponent {
		validate: () => boolean
	}

	// Use defineModel for two-way binding
	const payment_method = defineModel('payment_method', { required: true });
	const send_invoice_in_email = defineModel('send_invoice_in_email', { 
		default: true 
	});

	// Emit for validation result
	const emit = defineEmits<{
		(e: 'validated', is_valid: boolean): void
	}>();

	const payment_method_ref = ref<InputComponent | null>(null);

	const payment_methods = [
		{
			text: 'Cash',
			value: 'cash'
		},
		{
			text: 'Net Banking',
			value: 'net_banking'
		},
		{
			text: 'PayPal',
			value: 'paypal'
		},
		{
			text: 'Stripe',
			value: 'stripe'
		}
	];

	const validateSettings = (): boolean => {
		payment_method.value.error = '';
		
		if(!payment_method_ref.value?.validate()){
			payment_method.value.error = 'Please select a payment method';
			return false;
		}
		
		return true;
	}

	const handleSubmit = () => {
		const is_valid = validateSettings();
		emit('validated', is_valid);
	}

	// Expose validation method so parent can call it
	defineExpose({ 
		validateSettings 
	});
</script>