<template>
	<div>

		<general-invoice-settings-skeleton v-if="data.data_loading"></general-invoice-settings-skeleton>

		<div v-if="!data.data_loading">

			<form @submit.prevent="saveInvoiceGeneralSettings">

				<div>
					<input-select label="Template" v-model="data.template.value" :error="data.template.error" :required="true" prop_placeholder="Select Template" :options="data.invoice_templates" ref="gid_invoice_template"></input-select>
				</div>
				
				<div class="lg:grid lg:grid-cols-12 gap-5 mt-[20px]">
					<div class="lg:col-span-6">
						<input-select label="Font size" v-model="data.font_size.value" :error="data.font_size.error" :required="true" prop_placeholder="Select Font size" :options="data.font_sizes" ref="gid_invoice_font_size"></input-select>
					</div>
					<div class="lg:col-span-6 mt-[20px] lg:mt-[0px]">
						<input-number field_name="Logo size in %" :step="1" v-model="data.logo_size.value" :error="data.logo_size.error" :required="true" placeholder="Enter % number" ref="gid_invoice_logo_size"></input-number>
					</div>
				</div>

				<div class="lg:grid lg:grid-cols-12 gap-5 mt-[20px]">
					<div class="lg:col-span-6">
						<input-color label="Primary color" :required="true" v-model="data.primary_color" :alpha="false" :location="'bottom'" ref="gid_primacy_color"></input-color>
					</div>
					<div class="lg:col-span-6 mt-[20px] lg:mt-[0px]">
						<input-color label="Secondry color" :required="true" v-model="data.secondary_color" :alpha="false" :location="'bottom'" ref="gid_secondary_color"></input-color>
					</div>
				</div>

				<input-button btn_text="Save" :disabled="data.btn_disabled" icon="IconCheck" class="lg:float-end"></input-button>
				<div class="clear-both"></div>
			</form>

		</div>
	</div>
</template>
<script lang="ts" setup>
	
	import { nextTick, onMounted, reactive, ref, watch } from 'vue';
	import InputSelect from '../../../inputs/InputSelect.vue';
	import InputNumber from '../../../inputs/InputNumber.vue';
	import InputColor from '../../../inputs/InputColor.vue';
	import InputButton from '../../../inputs/InputButton.vue';
	import api from '../../../../helpers/api';
	import common from '../../../../helpers/common';
	import { toastEvents } from '../../../../events/toastEvents';

	import GeneralInvoiceSettingsSkeleton from '../../../skeletons/GeneralInvoiceSettingsSkeleton.vue';
	import type { TextFieldType } from '../../../../types/InputTypes.ts';

	/* intarfaces */
	interface GeneralInvoiceSettingsInterface{
		invoice_templates: Array<object>,
		template: TextFieldType,
		font_sizes: Array<object>,
		font_size: TextFieldType,
		logo_size: TextFieldType,
		primary_color:string,
		secondary_color:string,
		btn_disabled:boolean,
		data_loading:boolean
	}

	interface InputComponent{
  		validate: () => boolean
	}
	

	/* refs */
	const gid_invoice_template = ref<InputComponent | null>(null);
	const gid_invoice_font_size = ref<InputComponent | null>(null);
	const gid_invoice_logo_size = ref<InputComponent | null>(null);
	const gid_primacy_color = ref<InputComponent | null>(null);
	const gid_secondary_color = ref<InputComponent | null>(null);

	/* data */
	const data = reactive<GeneralInvoiceSettingsInterface>({
		invoice_templates : [],
		template : {
			value : '',
			error: 'Please select a template'
		},
		font_sizes : [],
		font_size : {
			value : '',
			error: 'Please select font size'
		},
		logo_size : {
			value: '',
			error: 'Please enter logo size'
		},
		primary_color: '#e7e7e7',
		secondary_color: '#118B65',
		btn_disabled: false,
		data_loading: false
		
	});

	/* watchers */
	watch(() => [data.template.value, data.font_size.value, data.logo_size.value], () => {
		
		data.template.error = '';
		data.font_size.error = '';

		nextTick(() => {
			isValid();
		});
		
	});

	/* methods */

	const isValid = () : boolean => {

		let valid = true;

		if(!gid_invoice_template.value?.validate()){
			valid = false;
			data.template.error = 'Please select a template';
		}
		if(!gid_invoice_font_size.value?.validate()){
			valid = false;
			data.font_size.error = 'Please select font size';
		}
		if(!gid_invoice_logo_size.value?.validate()){
			valid = false;
			data.logo_size.error = 'Please enter logo size';
		}

		return valid;
	}

	const fetchInvoiceGeneralSettings = () : void => {
		data.data_loading = true;
		api.get('manage-invoice-settings').then(response => {
			response.data.templates.forEach((file:string) => {
				data.invoice_templates.push({
					text: common.capitalizeFirstLetter(file),
					value: file
				});
			});
			
			data.template.value = response.data.settings.template;
			data.font_size.value = response.data.settings.font_size+'';
			data.logo_size.value = response.data.settings.logo_size+'';
			data.primary_color = response.data.settings.primary_color;
			data.secondary_color = response.data.settings.secondary_color;
			data.data_loading = false;
		}).catch(error => {

		});
	}

	const saveInvoiceGeneralSettings = () : void => {
		data.btn_disabled = true;

		if(isValid()){

			api.post('manage-invoice-settings', {
				template : data.template.value,
				font_size : data.font_size.value,
				logo_size : data.logo_size.value,
				primary_color : data.primary_color,
				secondary_color : data.secondary_color,
			}).then(response => {
				
			}).catch(error => {

			}).finally(() => {
				data.btn_disabled = false;
			});

		}else{
			data.btn_disabled = false;
			toastEvents.emit('toast', {
				type:'error',
				message: 'Please fill/select highlighted fields'
			});

		}

		
	}

	/* hooks */
	onMounted(() => {
		for(let z = 6 ; z < 40 ; z++){
			if(z%2 === 0){
				data.font_sizes.push({
					'text':z+'px',
					value: z
				});
			}
		}

		fetchInvoiceGeneralSettings();
	});

</script>