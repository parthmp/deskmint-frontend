<template>
	<div>
		<form @click.prevent="saveCompanyDetails">

			<div class="lg:grid lg:grid-cols-12 gap-5">
				<div class="lg:col-span-6">
					<input-text label="Company name" :required="true" v-model="data.company_name.value" :error="data.company_name.error"  placeholder="Enter company name"></input-text>
				</div>
				<div class="lg:col-span-6">
					<input-select label="Size" :required="false" placeholder="Select" v-model="data.size" :options="data.size_options"></input-select>
				</div>
			</div>

			<div class="lg:grid lg:grid-cols-12 gap-5 mt-[20px]">
				<div class="lg:col-span-4">
					<input-text label="ID#" :required="false" v-model="data.company_id"  placeholder="Enter company id#"></input-text>
				</div>
				<div class="lg:col-span-4">
					<input-text label="GST/Vat #" :required="false" v-model="data.gst" placeholder="Enter GST/Vat #"></input-text>
				</div>
				<div class="lg:col-span-4">
					<input-select label="Classification" placeholder="Select" :required="false" v-model="data.classification" :options="data.classification_options"></input-select>
				</div>
			</div>

			<div class="lg:grid lg:grid-cols-12 gap-5 mt-[20px]">
				<div class="lg:col-span-4">
					<input-URL :label="'Website'" v-model="data.website" :required="false"  placeholder="Enter URL"></input-URL>
				</div>
				<div class="lg:col-span-4">
					<input-email label="Email" v-model="data.email" :required="false" placeholder="Enter email address"></input-email>
				</div>
				<div class="lg:col-span-4">
					<input-telephone label="Phone" v-model="data.phone" :required="false" placeholder="Enter phone #"></input-telephone>
				</div>
			</div>

			<input-button label="Save" icon="IconCheck" :full_width="false" class="lg:float-end"></input-button>
			<div class="clear-both"></div>

		</form>
	</div>
</template>

<script lang="ts" setup>

	import InputText from '../../../inputs/InputText.vue';
	import InputURL from '../../../inputs/InputURL.vue';
	import InputEmail from '../../../inputs/InputEmail.vue';
	import InputTelephone from '../../../inputs/InputTelephone.vue';
	import InputSelect from '../../../inputs/InputSelect.vue';
	import InputButton from '../../../inputs/InputButton.vue';
	
	import { reactive } from 'vue';

	/* data */
	const data = reactive({
		company_name : {
			value : '',
			error: 'Please enter company name'
		},
		company_id : '',
		gst : '',
		classification : '',
		classification_options : [
			{
				text : 'Individual',
				value : 'individual'
			},
			{
				text : 'Company',
				value : 'company'
			},
			{
				text : 'Partnership',
				value : 'partnership'
			},
			{
				text : 'Trust',
				value : 'trust'
			},
			{
				text : 'Charity',
				value : 'charity'
			},
			{
				text : 'Government',
				value : 'government'
			},
			{
				text : 'Other',
				value : 'other'
			}
		],
		website: '',
		email : '',
		phone : '',
		size: '',
		size_options : [
			{
				text : '1-3',		
				value : '1-3'
			},
			{
				text : '4-10',		
				value : '4-10'
			},
			{
				text : '11-50',		
				value : '11-50'
			},
			{
				text : '101-500',		
				value : '101-500'
			},
			{
				text : '500+',		
				value : '500+'
			}
		]
	});


	/* methods */
	const saveCompanyDetails = () : void => {
		console.log('works');
	}

</script>