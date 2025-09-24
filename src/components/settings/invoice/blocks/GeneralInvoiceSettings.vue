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
				primary color
			</div>
			<div class="lg:col-span-6 mt-[20px] lg:mt-[0px]">
				secondary color
			</div>
		</div>

		<div class="mt-[20px]">
			<div class="flex gap-2">
				<span><input-switch v-model="data.e_invoice_value"></input-switch></span>
				<span @click="data.e_invoice_value = !data.e_invoice_value">&nbsp;E invoice on/off</span>
			</div>
			
		</div>

	</div>
</template>
<script lang="ts" setup>
	
	import { onMounted, reactive } from 'vue';
	import InputSelect from '../../../inputs/InputSelect.vue';
	import InputNumber from '../../../inputs/InputNumber.vue';
	import InputSwitch from '../../../inputs/InputSwitch.vue';

	interface GeneralInvoiceSettingsInterface{
		invoice_templates: Array<object>,
		template_value: string,
		font_sizes: Array<object>,
		font_size_value: string,
		logo_size_value: string,
		e_invoice_value:boolean
	}

	const data = reactive<GeneralInvoiceSettingsInterface>({
		invoice_templates : [ /* fetch this from the backend */
			{
				text: 'Plain',
				value: 'plain'
			},
			{
				text: 'Stylish',
				value: 'stylish'
			}
		],
		template_value : '',
		font_sizes : [],
		font_size_value : '',
		logo_size_value : '',
		e_invoice_value : false
		
	});

	onMounted(() => {
		for(let z = 6 ; z < 40 ; z++){
			if(z%2 === 0){
				data.font_sizes.push({
					'text':z+'px',
					value: z
				});
			}
		}
	});

</script>