<template>
	<section class="main-content">
    	<div class="card">
			<h1 class="text-2xl!">Create payment type</h1>
			<form @submit.prevent="handleSubmit">
				<div class="grid grid-cols-12 mt-[25px]">
					<div class="col-span-12">
						<input-text label="Payment type" placeholder="Enter payment type" :required="true" v-model="data.payment_type.value" :error="data.payment_type.error" ref="payment_type_ref"></input-text>
					</div>
				</div>
				<input-button v-if="!data.disabled" :disabled="data.disabled" btn_text="Save" icon="iconCheck" class="lg:float-end" />
				<div class="clear-both"></div>
			</form>
		</div>
	</section>
</template>

<script lang="ts" setup>

import { reactive, ref, watch } from 'vue';
import InputText from '../../inputs/InputText.vue';
import InputButton from '../../inputs/InputButton.vue';
import api from '../../../helpers/api.ts';
import { toastEvents } from '../../../events/toastEvents.ts';
import { useRoute, useRouter } from 'vue-router';

import type { TextFieldType } from '../../../types/InputTypes.ts';

type PaymentTypeType = {
	payment_type : TextFieldType,
	mode : string,
	id : number,
	disabled:boolean
};

const route = useRoute();
const router = useRouter();


const data = reactive<PaymentTypeType>({
	mode : 'create',
	payment_type : {
		value : '',
		error: ''
	},
	disabled : false,
	id : 0
});

const payment_type_ref = ref();

watch(() : string => data.payment_type.value, () : void => {
	validateInputType();
});

const handleSubmit = async () : Promise<void> => {

	data.disabled = true;
	data.payment_type.error = '';

	try{
		
		if(!validateInputType()){
			toastEvents.emit('toast', {
				type : 'error',
				message : 'Please enter highlighted field(s)'
			});
			return ;
		}

		await api.post('manage-payment-types', {
			payment_type : data.payment_type.value
		});

		router.push('/payments/types');

	}finally{
		data.disabled = false;
	}

}


const validateInputType = () : boolean => {
	data.payment_type.error = '';
	const valid = payment_type_ref.value.validate();
	!valid ? data.payment_type.error = 'Please enter payment type' : '';
	return valid;
}



</script>