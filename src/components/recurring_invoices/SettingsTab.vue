<template>
	<div>
		<form @submit.prevent="handleSubmit">
			<input-select
				label="Payment gateway" 
				:options="data.payment_gateways" 
				placeholder="Select payment gateway" 
				:required="true" 
				:disabled="data.disabled"
				v-model="data.payment_gateway.value" 
				:error="data.payment_gateway.error"
				ref="payment_method_ref"
			/>
			
			<input-select
				label="Frequency" 
				:options="data.frequencies" 
				placeholder="Select frequency" 
				:required="true" 
				:disabled="data.disabled"
				v-model="data.frequency.value" 
				:error="data.frequency.error"
				ref="frequency_ref"
			/>
			
			<InputNumber v-if="data.show_custom" v-model="data.custom_frequency.value" :error="data.custom_frequency.error" label="Custom frequency in days" min="1" max="365" placeholder="Custom frequency in days" ref="custom_frequency_ref" :required="data.show_custom"></InputNumber>
			<br>
			<span v-if="!data.disabled" class="flex gap-5 items-center">
				<input-switch v-model="data.send_email" />
				<span @click.prevent="data.send_email = !data.send_email">
					Send email
				</span>
			</span>
			<br>
			<span v-if="!data.disabled && data.show_start_subscription" class="flex gap-5 items-center">
				<input-switch v-model="data.start_subscription" />
				<span @click.prevent="data.start_subscription = !data.start_subscription">
					Start subscription
				</span>
			</span>
			<br>
			<span v-if="!data.disabled && data.show_start_subscription" class="flex gap-5 items-center">
				<input-switch v-model="data.mark_invoices_paid" />
				<span @click.prevent="data.mark_invoices_paid = !data.mark_invoices_paid">
					Mark generated invoices paid automatically
				</span>
			</span>
			<p v-if="!data.show_start_subscription && data.payment_gateway.value !== ''">Subscription will start once client pays by the sent link.</p>
			<input-button v-if="!data.disabled" :disabled="data.btn_disabled" btn_text="Save" icon="iconCheck" class="lg:float-end" />
			<div class="clear-both"></div>
		</form>
	</div>
</template>
<script lang="ts" setup>

import InputButton from '../inputs/InputButton.vue';
import InputSelect from '../inputs/InputSelect.vue';
import InputSwitch from '../inputs/InputSwitch.vue';
import InputNumber from '../inputs/InputNumber.vue';
import { reactive, ref, watch } from 'vue';

type DataType = {
	
	payment_gateway: {
		value : string,
		error : string
	},
	frequency: {
		value : string,
		error : string
	}
	
};

const data = defineModel<DataType>();

const emit = defineEmits<{
	(e: 'validated', is_valid: boolean): void
}>();

interface InputComponent {
	validate: () => boolean
}

const payment_method_ref = ref<InputComponent | null>(null);
const frequency_ref = ref<InputComponent | null>(null);
const custom_frequency_ref = ref<InputComponent | null>(null);

watch(() => data.value.payment_gateway.value, () => {
	
	data.value.payment_gateway.error = '';

	if(!payment_method_ref.value?.validate()){
		data.value.payment_gateway.error = 'Please select a payment gateway';
	}
});

watch(() => data?.value?.frequency.value, () => {
	
	data.value.frequency.error = '';

	if(!frequency_ref.value?.validate()){
		data.value.frequency.error = 'Please select frequency';
	}
});

watch(() => data.value.custom_frequency.value, () => {
	
	data.value.custom_frequency.error = '';

	if(!custom_frequency_ref.value?.validate()){
		data.value.custom_frequency.error = 'Please enter frequency days';
	}
});

const validateSettings = (): boolean => {

	let valid = true;

	data.value.payment_gateway.error = '';
	data.value.frequency.error = '';
	data.value.custom_frequency.error = '';
	
	if(!payment_method_ref.value?.validate()){
		data.value.payment_gateway.error = 'Please select a payment gateway';
		valid = false;
	}

	if(!frequency_ref.value?.validate()){
		data.value.frequency.error = 'Please select frequency';
		valid = false;
	}

	if(!custom_frequency_ref.value?.validate()){
		data.value.custom_frequency.error = 'Please enter frequency days';
		valid = false;
	}

	return valid;

}

const handleSubmit = () => {
	const is_valid = validateSettings();
	emit('validated', is_valid);
}

defineExpose({ 
	validateSettings 
});

</script>