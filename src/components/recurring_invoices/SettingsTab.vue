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
				ref="payment_method_ref"
			/>
			
			<InputNumber v-if="data.show_custom" label="Custom frequency in days" min="1" max="365" placeholder="Custom frequency in days"></InputNumber>
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
import { reactive, watch } from 'vue';

const data = defineModel();


</script>