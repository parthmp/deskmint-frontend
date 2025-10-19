<template>
	<div>
			<numbers-invoice-settings-skeleton v-if="data.data_loading"></numbers-invoice-settings-skeleton>
			<p v-if="!data.data_loading">Note: Resetting invoice number means your next invoice number would start from 1 with padding that you select in the below settings.</p>
			<input-button v-if="!data.data_loading" @click.prevent="resetInvoiceNumber" btn_text="Reset invoice number" :disabled="data.btn_disabled_reset_invoice_numbers" icon="IconRefresh" class="lg:float-end"></input-button>
			<div class="clear-both"></div>
			<form @submit.prevent="saveSettings" v-if="!data.data_loading">
				<div class="lg:grid lg:grid-cols-12 gap-5">
					<div class="lg:col-span-6">
						<input-select label="Number padding" v-model="data.number_padding.value" :error="data.number_padding.error" :required="true" prop_placeholder="Select" :options="data.number_padding_options" ref="nis_number_padding"></input-select>
					</div>
					<div class="lg:col-span-6 mt-[20px] lg:mt-[0px]">
						<input-select label="Reset counter" v-model="data.reset_counter.value" :error="data.reset_counter.error" :required="true" prop_placeholder="Select" :options="data.reset_counter_options" ref="nis_reset_counter"></input-select>
					</div>
				</div>
				
				<div class="mt-[20px]">
					<input-text label="Number pattern" v-model="data.number_pattern" :required="false" prop_placeholder="Define pattern" ref="nis_number_pattern"></input-text>
				</div>

				<div class="mt-[20px]">
					<p>Please click below to add into number pattern</p>
					<div class="mt-[10px] p-[15px] border-1 border-solid border-deskmint-cyan rounded-lg max-h-[350px] overflow-x-hidden overflow-y-auto styled-scrollbar">
						<ul>
							<li v-for="(pattern, key) in data.patterns" :key="key" class="border-b-1 border-b-solid border-b-deskmint-green-light hover:bg-deskmint-green-light rounded-lg transition-all duration-300"><a href="javascript:;" class="block p-[10px]" @click.prevent="concatenatePattern(pattern)">{{ pattern }}</a></li>
						</ul>
					</div>
				</div>

				<input-button btn_text="Save" :disabled="data.btn_disabled" icon="IconCheck" class="lg:float-end"></input-button>
				<div class="clear-both"></div>
			</form>

		</div>
</template>

<script lang="ts" setup>

	import InputSelect from '../../../inputs/InputSelect.vue';
	import InputText from '../../../inputs/InputText.vue';
	import InputButton from '../../../inputs/InputButton.vue';

	import { nextTick, onMounted, reactive, ref, watch } from 'vue';
	import api from '../../../../helpers/api';
	import { toastEvents } from '../../../../events/toastEvents';

	import NumbersInvoiceSettingsSkeleton from '../../../skeletons/NumbersInvoiceSettingsSkeleton.vue';

	/* interfaces */
	interface NumbersInvoiceSettingsInterface{
		btn_disabled: boolean,
		btn_disabled_reset_invoice_numbers: boolean,
		number_padding_options: Array<object>,
		number_padding: object,
		reset_counter_options: Array<object>,
		reset_counter : object,
		number_pattern : string,
		patterns : Array<string>,
		data_loading : boolean
	}

	interface InputComponent{
		validate : () => boolean
	}

	/* refs */
	const nis_number_padding = ref<InputComponent | null>(null);
	const nis_reset_counter = ref<InputComponent | null>(null);
	const nis_number_pattern = ref<InputComponent | null>(null);

	/* data */
	const data = reactive<NumbersInvoiceSettingsInterface>({
		btn_disabled : false,
		btn_disabled_reset_invoice_numbers : false,
		number_padding_options : [
			{
				text : '1',
				value: '1'
			},
			{
				text : '0001',
				value: '0001'
			},
			{
				text : '00001',
				value: '00001'
			},
			{
				text : '000001',
				value: '000001'
			},
			{
				text : '0000001',
				value: '0000001'
			},
			{
				text : '00000001',
				value: '00000001'
			},
		],
		number_padding : {
			value: '',
			error: 'Please select number padding'
		},
		reset_counter_options : [
			{
				text : 'Never',
				value: 'never'
			},
			{
				text : 'Daily',
				value: 'daily'
			},
			{
				text : 'Weekly',
				value: 'weekly'
			},
			{
				text : 'Two Weeks',
				value: 'two_weeks'
			},
			{
				text : 'Monthly',
				value: 'monthly'
			},
			{
				text : 'Two Months',
				value: 'two_months'
			},
			{
				text : 'Three months',
				value: 'three_months'
			},
			{
				text : 'Four Months',
				value: 'four_months'
			},
			{
				text : 'Six Months',
				value: 'six_months'
			},
			{
				text : 'Yearly',
				value: 'yearly'
			},
		],
		reset_counter : {
			value: '',
			error: 'Please select reset counter'
		},
		number_pattern : '',
		patterns : [
			'{$year}', '{$day_number}', '{$day_name}', '{$month_number}', '{$month_short_name}', '{$month_full_name}'
		],
		data_loading : false
	});

	/* watchers */
	watch(() => [data.number_padding.value, data.reset_counter.value], () => {
		nextTick(() => {
			isValid();
		});
	});

	/* methods */
	const isValid = () : boolean => {

		let valid = true;

		data.number_padding.error = '';
		data.reset_counter.error = '';

		
		if(!nis_number_padding.value?.validate()){
			data.number_padding.error = 'Please select number padding';
			valid = false;
		}

		
		if(!nis_reset_counter.value?.validate()){
			data.reset_counter.error = 'Please select reset counter';
			valid = false;
		}
	

		return valid;

	}


	const saveSettings = () : void => {
		
		if(isValid()){
			data.btn_disabled = true;
			api.post('manage-invoice-settings-numbers', {
				number_padding : data.number_padding.value,
				reset_counter : data.reset_counter.value,
				number_pattern : data.number_pattern
			}).then(response => {
				data.btn_disabled = false;
			}).catch(error => {
				data.btn_disabled = false;
			}).finally(() => {
				
			});
		}else{
			toastEvents.emit('toast', {
				type:'error',
				message: 'Please fill/select highlighted fields'
			});
		}
	}

	const concatenatePattern = (pattern:string) : void => {
		data.number_pattern += pattern;
	}

	const fetchDefaultValues = () : void => {
		data.data_loading = true;
		api.get('manage-invoice-settings-numbers').then(response => {
			data.number_padding.value = response.data.number_padding;
			data.reset_counter.value = response.data.reset_counter;
			data.number_pattern = response.data.number_pattern;
			data.data_loading = false;
		}).catch(error => {
			data.data_loading = false;
		});
	}

	const resetInvoiceNumber = () : void => {

		data.btn_disabled_reset_invoice_numbers = true;
		api.get('manage-invoice-settings-numbers/reset-number').finally(() => {
			data.btn_disabled_reset_invoice_numbers = false;
		});

	}

	/* lifecycle hooks */
	onMounted(() : void => {
		fetchDefaultValues();
	});


</script>