<template>
	<div>

		<address-company-settings-skeleton v-if="data.loading"></address-company-settings-skeleton>

		<form @submit.prevent="saveCompanyAddressData" v-if="!data.loading">
			<div class="lg:grid lg:grid-cols-12 gap-5">
				<div class="lg:col-span-4">
					<input-text label="Street" :required="true" v-model="data.street.value" :error="data.street.error" placeholder="Enter street" ref="company_address_street"></input-text>
				</div>
				<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
					<input-text label="Apt/Suite" :required="true" v-model="data.apt.value" :error="data.apt.error" placeholder="Enter apt/suite" ref="company_address_apt"></input-text>
				</div>
				<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
					<input-text label="City" :required="true" v-model="data.city.value" :error="data.city.error" placeholder="Enter city" ref="company_address_city"></input-text>
				</div>
			</div>

			<div class="lg:grid lg:grid-cols-12 gap-5 mt-[20px]">
				<div class="lg:col-span-4">
					<input-text label="State" :required="true" v-model="data.state.value" :error="data.state.error" placeholder="Enter state" ref="company_address_state"></input-text>
				</div>
				<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
					<input-text label="Postal code" :required="true" v-model="data.postal_code.value" :error="data.postal_code.error" placeholder="Enter postal code" ref="company_address_postal_code"></input-text>
				</div>
				<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
					<input-auto-complete label="Country" placeholder="Type to select a country" :required="true" v-model="data.country_selected_id.value" :error="data.country_selected_id.error" :options="data.countries" ref="company_address_country_autocomplete" @selected="countrySelected"></input-auto-complete>
				</div>
			</div>

			<div class="lg:grid lg:grid-cols-12 gap-5 mt-[20px]">
				<div class="lg:col-span-6">
					<input-text label="Address identifier (Peppol)" :required="false" v-model="data.identifier"  placeholder="Enter address identifier"></input-text>
				</div>
				<div class="lg:col-span-6 mt-[20px] lg:mt-[0px]">
					<input-text label="Scheme (Peppol)" :required="false" v-model="data.scheme" placeholder="Enter scheme"></input-text>
				</div>
			</div>

			<input-button label="Save" icon="IconCheck" :disabled="data.btn_disabled" class="lg:float-end"></input-button>
			<div class="clear-both"></div>
		</form>
	</div>
</template>

<script lang="ts" setup>

	import InputText from '../../../inputs/InputText.vue';
	import InputAutoComplete from '../../../inputs/InputAutoComplete.vue';
	import InputButton from '../../../inputs/InputButton.vue';

	import { nextTick, onMounted, reactive, ref, watch } from 'vue';
	import api from '../../../../helpers/api';

	import AddressCompanySettingsSkeleton from '../../../skeletons/AddressCompanySettingsSkeleton.vue';
import { toastEvents } from '../../../../events/toastEvents.ts';
	
	interface InputComponent{
  		validate: () => boolean
	}

	type TextFieldType = {
		value : string,
		error : string
	};

	interface AddressCompanySettingsInterface{
		loading : boolean,
		btn_disabled : boolean,
		identifier : string,
		scheme : string,
		street : TextFieldType,
		apt : TextFieldType,
		city : TextFieldType,
		state : TextFieldType,
		postal_code : TextFieldType,
		country_id:string,
		country_selected_id:TextFieldType,
		countries : Array<object>
	}

	const company_address_country_autocomplete = ref<InputComponent | null>(null);
	const company_address_street = ref<InputComponent | null>(null);
	const company_address_apt = ref<InputComponent | null>(null);
	const company_address_city = ref<InputComponent | null>(null);
	const company_address_state = ref<InputComponent | null>(null);
	const company_address_postal_code = ref<InputComponent | null>(null);

	const data = reactive<AddressCompanySettingsInterface>({
		loading: false,
		btn_disabled: false,
		identifier : '',
		scheme : '',
		street : {
			value : '',
			error : 'Please enter street'
		},
		apt : {
			value : '',
			error : 'Please enter apt - suite'
		},
		city : {
			value : '',
			error : 'Please enter city'
		},
		state : {
			value : '',
			error : 'Please enter state'
		},
		postal_code : {
			value : '',
			error : 'Please enter postal code'
		},
		country_id: '',
		country_selected_id: {
			value : '',
			error : 'Select a country'
		},
		countries: []
	});

	/**
	 * watchers
	 */
	watch(() => data.street.value, () : void => {
		
		data.street.error = '';

		nextTick(() => {
			if(!company_address_street?.value?.validate()){
				data.street.error = 'Please enter street';
			}
		});
		
	});

	watch(() => data.apt.value, () : void => {
		
		data.apt.error = '';

		nextTick(() => {
			if(!company_address_apt?.value?.validate()){
				data.apt.error = 'Please enter apt - suite';
			}
		});
		
	});

	watch(() => data.city.value, () : void => {
		
		data.city.error = '';

		nextTick(() => {
			if(!company_address_city?.value?.validate()){
				data.city.error = 'Please enter city';
			}
		});
		
	});

	watch(() => data.state.value, () : void => {
		
		data.state.error = '';

		nextTick(() => {
			if(!company_address_state?.value?.validate()){
				data.state.error = 'Please enter state';
			}
		});
		
	});

	watch(() => data.postal_code.value, () : void => {
		
		data.postal_code.error = '';

		nextTick(() => {
			if(!company_address_postal_code?.value?.validate()){
				data.postal_code.error = 'Please enter postal code';
			}
		});
		
	});

	/* methods */
	const fetchCompanyAddressSettings = () : void => {
		data.loading = true;
		api.get('manage-company-settings-address').then(response => {
			
			/* fill the fields */
			
			data.countries = response.data.countries;

			data.street.value = response.data.company.address_street;
			data.apt.value = response.data.company.apt;
			data.city.value = response.data.company.city;
			data.state.value = response.data.company.state;
			data.postal_code.value = response.data.company.postal_code;
			data.country_selected_id.value = response.data.company.country_id+'';
			data.identifier = response.data.company.address_identifier;
			data.scheme = response.data.company.address_scheme;
			data.loading = false;

		}).catch(error => {

		});
	}

	const countrySelected = (country_id:{value : string, text: string}) : void => {
		
		if(!company_address_country_autocomplete?.value?.validate()){
			data.country_selected_id.error = 'Please select a country';
		}else{
			data.country_selected_id.error = '';
		}
		
		if(Object.keys(country_id).length > 0 && country_id.value){
			data.country_selected_id.value = country_id.value+'';
		}else{
			data.country_selected_id.value = '';
		}

	}

	const saveCompanyAddressData = async () : Promise<void> => {
		
		data.btn_disabled = true;
		
		if(
			company_address_country_autocomplete?.value?.validate() &&
			company_address_street?.value?.validate() &&
			company_address_apt?.value?.validate() &&
			company_address_city?.value?.validate() &&
			company_address_state?.value?.validate() &&
			company_address_postal_code?.value?.validate()
		){
			
			try{
				
				await api.post('manage-company-settings-address', {
										identifier : data.identifier,
										scheme : data.scheme,
										address_street : data.street.value,
										apt : data.apt.value,
										city : data.city.value,
										state : data.state.value,
										postal_code : data.postal_code.value,
										country_id : data.country_selected_id.value
									});


			}finally{
				data.btn_disabled = false;
			}

		}else{
							
			toastEvents.emit('toast', {
				type:'error',
				message : 'Please fill in required fields'
			});

		}

		data.btn_disabled = false;
		
	}


	/* hooks */
	onMounted(() : void => {
		fetchCompanyAddressSettings();
	});

</script>