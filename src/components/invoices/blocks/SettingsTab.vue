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
			<input-button :disabled="data.btn_disabled_local" btn_text="Save" icon="iconCheck" class="lg:float-end" />
			<div class="clear-both"></div>
		</form>
	</div>
</template>

<script lang="ts" setup>

	import { onMounted, reactive, ref, watch } from 'vue';
	import InputButton from '../../inputs/InputButton.vue';
	import InputSwitch from '../../inputs/InputSwitch.vue';
	import InputSelect from '../../inputs/InputSelect.vue';

	interface InputComponent {
		validate: () => boolean
	}

	// Use defineModel for two-way binding
	const payment_method = defineModel('payment_method', { required: true });
	const gateways = defineModel('gateways', { required: false });
	const send_invoice_in_email = defineModel('send_invoice_in_email', { 
		default: true 
	});

	const data = reactive({
		btn_disabled_local : false
	});

	const props = defineProps({
		btn_disabled : {
			type:Boolean
		}
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
		...gateways.value
	];

	watch(() => props.btn_disabled, () => {
		data.btn_disabled_local = props.btn_disabled ?? false;
	});

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