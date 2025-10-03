<template>
	<div>
		<form @submit.prevent="saveCompanyAddressData">
			<div class="lg:grid lg:grid-cols-12 gap-5">
				<div class="lg:col-span-4">
					<input-text label="Street" :required="false" v-model="data.street"  placeholder="Enter street"></input-text>
				</div>
				<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
					<input-text label="Apt/Suite" :required="false" v-model="data.apt" placeholder="Enter apt/suite"></input-text>
				</div>
				<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
					<input-text label="City" :required="false" v-model="data.city" placeholder="Enter city"></input-text>
				</div>
			</div>

			<div class="lg:grid lg:grid-cols-12 gap-5 mt-[20px]">
				<div class="lg:col-span-4">
					<input-text label="State" :required="false" v-model="data.state"  placeholder="Enter state"></input-text>
				</div>
				<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
					<input-text label="Postal code" :required="false" v-model="data.postal_code" placeholder="Enter postal code"></input-text>
				</div>
				<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
					<input-auto-complete label="Country" placeholder="Type to select a country" v-model="data.country_id" :options="data.countries" ref="company_address_country_autocomplete" @selected="countrySelected"></input-auto-complete>
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

	import { onMounted, reactive, ref } from 'vue';
	import api from '../../../../helpers/api';
	
	interface InputComponent{
  		validate: () => boolean
	}

	interface AddressCompanySettingsInterface{
		btn_disabled : boolean,
		street : string,
		apt : string,
		city : string,
		state : string,
		postal_code : string,
		country_id:string,
		country_selected_id:string,
		countries : Array<object>
	}

	const company_address_country_autocomplete = ref<InputComponent | null>(null);

	const data = reactive<AddressCompanySettingsInterface>({
		btn_disabled: false,
		street : '',
		apt : '',
		city : '',
		state : '',
		postal_code : '',
		country_id: '',
		country_selected_id: '',
		countries: []
	});	

	/* methods */
	const fetchCompanyAddressSettings = () : void => {
		api.get('manage-company-settings-address').then(response => {

			/* fill the fields */
			
			data.countries = response.data.countries;

			data.street = response.data.company.address_street;
			data.apt = response.data.company.apt;
			data.city = response.data.company.city;
			data.state = response.data.company.state;
			data.postal_code = response.data.company.postal_code;
			data.country_id = response.data.company.country_id+'';

		}).catch(error => {

		});
	}

	const countrySelected = (country_id:object) : void => {
		if(Object.keys(country_id).length > 0){
			data.country_selected_id = country_id?.value ?? '';
		}
	}

	const saveCompanyAddressData = () : void => {
		
		api.post('manage-company-settings-address', {
			address_street : data.street,
			apt : data.apt,
			city : data.city,
			state : data.state,
			postal_code : data.postal_code,
			country_id : data.country_selected_id,
		}).then(response => {
			
		}).catch(error => {

		});

	}


	/* hooks */
	onMounted(() : void => {
		fetchCompanyAddressSettings();
	});

</script>