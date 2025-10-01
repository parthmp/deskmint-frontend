<template>
	<div>
		<details-company-settings-skeleton v-if="data.loading"></details-company-settings-skeleton>
		<form @submit.prevent="saveCompanyDetails" v-if="!data.loading">

			<div class="lg:grid lg:grid-cols-12 gap-5">
				<div class="lg:col-span-6">
					<input-text label="Company name" :required="true" v-model="data.company_name.value" :error="data.company_name.error"  placeholder="Enter company name" ref="company_settings_company_name"></input-text>
				</div>
				<div class="lg:col-span-6 mt-[20px] lg:mt-[0px]">
					<input-select label="Size" :required="false" placeholder="Select" v-model="data.size" :options="data.size_options"></input-select>
				</div>
			</div>

			<div class="lg:grid lg:grid-cols-12 gap-5 mt-[20px]">
				<div class="lg:col-span-4">
					<input-text label="ID#" :required="false" v-model="data.company_id"  placeholder="Enter company id#"></input-text>
				</div>
				<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
					<input-text label="GST/Vat #" :required="false" v-model="data.gst" placeholder="Enter GST/Vat #"></input-text>
				</div>
				<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
					<input-select label="Classification" placeholder="Select" :required="false" v-model="data.classification" :options="data.classification_options"></input-select>
				</div>
			</div>

			<div class="lg:grid lg:grid-cols-12 gap-5 mt-[20px]">
				<div class="lg:col-span-4">
					<input-URL :label="'Website'" v-model="data.website" :required="false"  placeholder="Enter URL"></input-URL>
				</div>
				<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
					<input-email label="Email" v-model="data.email" :required="false" placeholder="Enter email address"></input-email>
				</div>
				<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
					<input-telephone label="Phone" v-model="data.phone" :required="false" placeholder="Enter phone #"></input-telephone>
				</div>
			</div>

			<input-button label="Save" icon="IconCheck" :disabled="data.btn_disabled" class="lg:float-end"></input-button>
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

	import DetailsCompanySettingsSkeleton from '../../../skeletons/DetailsCompanySettingsSkeleton.vue';
	
	import { nextTick, onMounted, reactive, ref, watch } from 'vue';
	import api from '../../../../helpers/api';
	import { toastEvents } from '../../../../events/toastEvents';


	interface DetailsCompanySettingsInterface{
		loading : boolean,
		btn_disabled:boolean,
		company_name: object,
		company_id: string,
		gst: string,
		classification: string,
		classification_options: Array<object>,
		website: string,
		email: string,
		phone: string,
		size: string,
		size_options: Array<object>
	}


	interface InputComponent{
  		validate: () => boolean
	}

	/* refs */
	const company_settings_company_name = ref<InputComponent | null>(null);

	/* data */
	const data = reactive<DetailsCompanySettingsInterface>({
		loading : false,
		btn_disabled : false,
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

	/* watchers */
	watch(() => data.company_name.value, () : void => {
		
		data.company_name.error = '';

		nextTick(() => {
			if(!company_settings_company_name?.value?.validate()){
				data.company_name.error = 'Please enter company name';
			}
		});
		
	})


	/* methods */
	const saveCompanyDetails = () : void => {
		data.btn_disabled = true;
		if(company_settings_company_name?.value?.validate()){

			api.post('manage-company-settings-details', {

				company_name : data.company_name.value,
				size : data.size,
				id_number : data.company_id,
				gst : data.gst,
				classification : data.classification,
				website : data.website,
				email : data.email,
				phone : data.phone
				
			}).then(response => {
				data.btn_disabled = false;
			}).catch(error => {
				data.btn_disabled = false;
			});

		}else{
			toastEvents.emit('toast', {
				type:'error',
				message : 'Please enter company name'
			});
		}

	}

	const fetchCompanyDetails = () : void => {
		data.loading = true;
		api.get('manage-company-settings-details').then(response => {
			data.company_name.value = response.data.company_name;
			data.size = response.data.size;
			data.company_id = response.data.id_number ?? '';
			data.gst = response.data.gst_vat_number ?? '';
			data.classification = response.data.classification ?? '';
			data.website = response.data.website ?? '';
			data.email = response.data.email ?? '';
			data.phone = response.data.phone ?? '';
			data.loading = false;
		}).catch(error => {

		});
	}

	/* hooks */
	onMounted(() => {
		fetchCompanyDetails();
	});

</script>