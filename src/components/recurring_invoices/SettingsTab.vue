<template>
	<div>
		<form @submit.prevent="handleSubmit">
			<input-select
				v-if="data.mode === 'create'"
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
			
			<input-select
				v-show="+data.payment_gateway.value === +data.none_gateway_value"
				label="Payment type" 
				:required="true"
				:options="data.payment_types" 
				placeholder="Select payment type"  
				:disabled="data.disabled"
				v-model="data.payment_type.value" 
				:error="data.payment_type.error"
				ref="payment_type_ref"
			/>
			
			<InputNumber v-if="data.show_custom" v-model="data.custom_frequency.value" :error="data.custom_frequency.error" label="Custom frequency in days" min="1" max="365" placeholder="Custom frequency in days" ref="custom_frequency_ref" :required="data.show_custom"></InputNumber>
			<br>
			<span v-if="!data.disabled" class="flex gap-5 items-center">
				<input-switch v-model="data.send_email" />
				<span @click.prevent="data.send_email = !data.send_email">
					Send email for recurring invoice (Notifying the client about recurring invoice creation/updation)
				</span>
			</span>
			<br>
			<span v-if="!data.disabled" class="flex gap-5 items-center">
				<input-switch v-model="data.send_email_for_invoice" />
				<span @click.prevent="data.send_email_for_invoice = !data.send_email_for_invoice">
					Send email for invoice generation (Sending an invoice when this recurring invoice entry creates invoices with frequencies/intervals)
				</span>
			</span>
			<br>
			<div v-if="(+data.payment_gateway.value !== +data.none_gateway_value) && data.modified">
				<div class="flex gap-5 items-center">
					<input-switch v-model="data.modified_charge_customer" />
					<span @click.prevent="data.modified_charge_customer = !data.modified_charge_customer">
						Charge customer now
					</span>
				</div>
			</div>
			<br>
			<span v-if="(!data.disabled && data.show_start_subscription) || ((!data.modified_charge_customer) && ((+data.payment_gateway.value !== +data.none_gateway_value) && data.modified))">
				<!-- <input-switch v-model="data.start_subscription" />
				<span @click.prevent="data.start_subscription = !data.start_subscription">
					Start subscription
				</span> -->
				<input-date-time mode="datetime" label="Generate invoice on/after" v-model="data.subscription_start_datetime.value" :error="data.subscription_start_datetime.error" :required="true" ref="subscription_start_datetime_ref" placeholder="Select start date"></input-date-time>
			</span>
			<br>
			<span v-if="!data.disabled && data.show_start_subscription" class="flex gap-5 items-center">
				<input-switch v-model="data.mark_invoices_paid" />
				<span @click.prevent="data.mark_invoices_paid = !data.mark_invoices_paid">
					Mark generated invoices paid automatically
				</span>
			</span>
			
			
			
			<p v-if="!data.show_start_subscription && data.payment_gateway.value !== '' && data.mode === 'create'">Subscription will start once client pays by the sent link.</p>
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
import InputDateTime from '../inputs/InputDateTime.vue';
import { reactive, ref, watch } from 'vue';

type DataType = {
	payment_gateway: { value: string; error: string };
	frequency: { value: string; error: string };
	custom_frequency: { value: string; error: string };
	payment_type: { value: string; error: string };
	subscription_start_datetime: { value: string | Date | null; error: string };
	payment_gateways: [];                          
	frequencies: [];                          
	payment_types: [];                          
	mode: string;
	none_gateway_value: string | number;
	disabled: boolean;
	show_custom: boolean;
	show_start_subscription: boolean;
	mark_invoices_paid: boolean;
	btn_disabled: boolean;
	send_email: boolean;
	original_frequency: number;
	send_email_for_invoice: boolean;
	modified_charge_customer: boolean;
	total_changed: boolean;
	modified: boolean;
};

const data = defineModel<DataType>({ required: true });


const emit = defineEmits<{
	(e: 'validated', is_valid: boolean): void
}>();

interface InputComponent {
	validate: () => boolean
}

const payment_method_ref = ref<InputComponent | null>(null);
const frequency_ref = ref<InputComponent | null>(null);
const custom_frequency_ref = ref<InputComponent | null>(null);
const payment_type_ref = ref<InputComponent | null>(null);
const subscription_start_datetime_ref = ref<InputComponent | null>(null);

watch(() => data.value.payment_gateway.value, () => {
	
	data.value.payment_gateway.error = '';

	if(!payment_method_ref.value?.validate()){
		data.value.payment_gateway.error = 'Please select a payment gateway';
	}

	// if(+data.value.payment_gateway.value === +data.value.none_gateway_value){
	// 	validatePaymentType();
	// }

});

watch(() => data.value.subscription_start_datetime.value, () => {
	data.value.subscription_start_datetime.error = '';
	if(subscription_start_datetime_ref.value){
		if(!subscription_start_datetime_ref.value.validate()){
			data.value.subscription_start_datetime.error = 'Please select start date';
		}
	}
});

watch(() => data?.value?.frequency.value, () => {
	
	data.value.frequency.error = '';

	if(!frequency_ref.value?.validate()){
		data.value.frequency.error = 'Please select frequency';
	}
});

watch(() => data?.value?.payment_type.value, () => {
	validatePaymentType();
});

watch(() => data.value.custom_frequency.value, () => {
	
	data.value.custom_frequency.error = '';

	if(!custom_frequency_ref.value?.validate()){
		data.value.custom_frequency.error = 'Please enter frequency days';
	}
});

const validatePaymentType = () => {
	
	data.value.payment_type.error = '';

	if(!payment_type_ref.value?.validate()){
		data.value.payment_type.error = 'Please select payment type';
	}
}

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

	if(+data.value?.payment_gateway.value === +data.value.none_gateway_value){
		if(!payment_type_ref.value?.validate()){
			data.value.payment_type.error = 'Please select payment type';
			valid = false;
		}

		if(!subscription_start_datetime_ref.value?.validate()){
			data.value.subscription_start_datetime.error = 'Please select start date';
			valid = false;
		}

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