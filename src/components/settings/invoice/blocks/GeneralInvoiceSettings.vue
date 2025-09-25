<template>
	<div>

		<div>
			<input-select label="Template" v-model="data.template_value" :required="true" prop_placeholder="Select Template" :options="data.invoice_templates" ref="gid_invoice_template"></input-select>
		</div>
		<div class="mt-[20px]">
			
		</div>
		<div class="lg:grid lg:grid-cols-12 gap-5 mt-[20px]">
			<div class="lg:col-span-6">
				<input-select label="Font size" v-model="data.font_size_value" :required="true" prop_placeholder="Select Font size" :options="data.font_sizes" ref="gid_invoice_font_size"></input-select>
			</div>
			<div class="lg:col-span-6 mt-[20px] lg:mt-[0px]">
				<input-number field_name="Logo size in %" :step="1" v-model="data.logo_size_value" :required="true" placeholder="Enter % number" ref="gid_invoice_logo_size"></input-number>
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

		<div class="mt-[20px]">
			<div class="flex gap-2">
				<span><input-switch v-model="data.e_invoice_value"></input-switch></span>
				<span @click="data.e_invoice_value = !data.e_invoice_value">&nbsp;E invoice on/off</span>
			</div>
		</div>

		<input-button btn_text="Save" :disabled="data.btn_disabled" icon="IconCheck" class="lg:float-end"></input-button>
		<div class="clear-both"></div>

	</div>
</template>
<script lang="ts" setup>
	
	import { onMounted, reactive, ref } from 'vue';
	import InputSelect from '../../../inputs/InputSelect.vue';
	import InputNumber from '../../../inputs/InputNumber.vue';
	import InputSwitch from '../../../inputs/InputSwitch.vue';
	import InputColor from '../../../inputs/InputColor.vue';
	import InputButton from '../../../inputs/InputButton.vue';
	import api from '../../../../helpers/api';
	import common from '../../../../helpers/common';

	/* intarfaces */
	interface GeneralInvoiceSettingsInterface{
		invoice_templates: Array<object>,
		template_value: string,
		font_sizes: Array<object>,
		font_size_value: string,
		logo_size_value: string,
		e_invoice_value:boolean,
		primary_color:string,
		secondary_color:string,
		btn_disabled:boolean
	}

	interface InputComponent{
  		validate: () => boolean
	}
	

	/* refs */
	const gid_primacy_color = ref<InputComponent | null>(null);

	/* data */
	const data = reactive<GeneralInvoiceSettingsInterface>({
		invoice_templates : [],
		template_value : '',
		font_sizes : [],
		font_size_value : '',
		logo_size_value : '',
		e_invoice_value : false,
		primary_color: '#e7e7e7',
		secondary_color: '#118B65',
		btn_disabled: false
		
	});

	/* methods */
	const fetchInvoiceGeneralSettings = () : void => {
		api.get('manage-invoice-settings').then(response => {
			response.data.templates.forEach((file:string) => {
				data.invoice_templates.push({
					text: common.capitalizeFirstLetter(file),
					value: file
				});
			});
			data.template_value = response.data.settings.template;
			data.font_size_value = response.data.settings.font_size;
			data.logo_size_value = response.data.settings.logo_size;
			data.primary_color = response.data.settings.primary_color;
			data.secondary_color = response.data.settings.secondary_color;
		}).catch(error => {

		});
	}

	const saveInvoiceGeneralSettings = () : void => {
		data.btn_disabled = true;
		api.post('manage-invoice-settings', {
			template : data.template_value,
			font_size : data.font_size_value,
			logo_size : data.logo_size_value,
			primary_color : data.primary_color,
			secondary_color : data.secondary_color,
		}).then(response => {
			
		}).catch(error => {

		}).finally(() => {
			data.btn_disabled = false;
		});
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