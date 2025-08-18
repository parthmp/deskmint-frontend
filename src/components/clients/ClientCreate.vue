<template>
	<section class="main-content">
    <div class="card">
        <h1 class="text-2xl!">Create a client</h1>
        <br>
        <!--<br>
		<input-multiselect :options="input_fields_options" label="multiselect example" :required="true" v-model="multiselect_temp.value" :error="multiselect_temp.error" ref="multiselect_test"></input-multiselect>
        <br>
        <br>
		<input-telephone v-model="phone.value" :required="false" label="Enter phone number" :error="phone.error" :prop_placeholder="'Enter phone'" ref="phone_input"></input-telephone>
		<div class="col-span-12 lg:col-span-6">
					<input-date-time label="Choose date" mode="date" :range="true" :required="true" v-model="temp_date" :error="temp_error" ref="temp_date"></input-date-time>
				</div>
				<div class="col-span-12 lg:col-span-6">
					<input-text label="test" v-model="temp_date2" :required="true" :error="temp_error2" ref="temp_date2"></input-text>
				</div>
			</div>-->
       <form @submit.prevent="createClient" class="form">
				
		<tabs :options="tab_options" :active_tab_index="active_tab_index" @tab-changed="changeActiveTabValue" :disable_further="false">
			<template v-slot:tab-0>
				<div class="lg:grid lg:grid-cols-12 gap-5">
					<div class="lg:col-span-4">
						<input-text :required="true" label="Enter first name" prop_placeholder="First name" v-model="client_personal_info.first_name.value" :error="client_personal_info.first_name.error" ref="personal_info_first_name"></input-text>
					</div>
					<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
						<input-text :required="true" label="Enter last name" prop_placeholder="Last name" v-model="client_personal_info.last_name.value" :error="client_personal_info.last_name.error" ref="personal_info_last_name"></input-text>
					</div>
					<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
						<input-text :required="false" label="GST/Tax number" prop_placeholder="GST/Tax number" v-model="client_personal_info.tax_id.value" :error="client_personal_info.tax_id.error" ref="personal_info_tax_id"></input-text>
					</div>
				</div>

				<div class="lg:grid lg:grid-cols-12 gap-5">
					<div class="lg:col-span-4 mt-[20px]">
						<inputURL :required="false" label="Website" prop_placeholder="Enter website" v-model="client_personal_info.website.value" :error="client_personal_info.website.error" ref="personal_info_website"></inputURL>
					</div>
					<div class="lg:col-span-4 mt-[20px]">
						<input-email :required="true" v-model="client_personal_info.email.value" :error="client_personal_info.email.error" ref="name"></input-email>
					</div>
					<div class="lg:col-span-4 mt-[20px]">
						<input-telephone v-model="client_personal_info.phone.value" :required="false" label="Enter phone number" :error="client_personal_info.phone.error" :prop_placeholder="'Enter phone'" ref="phone_input"></input-telephone>
					</div>
				</div>

				<input-button btn_text="Next" @click="active_tab_index = 1" icon="IconCaretRight" class="lg:float-end"></input-button>
				<div class="clear-both"></div>
			</template>
			<template v-slot:tab-1>

				<span v-for="(contact_info, key) in client_contact_info" :key="contact_info.id">
					<a href="javascript:;" class="block mt-[20px]! mb-[10px] text-red-500!" @click="removeContactInfoFields(key)"><IconTrash></IconTrash></a>
					<div class="lg:grid lg:grid-cols-12 gap-5">
						<div class="lg:col-span-6">
							<input-text :required="true" label="Enter first name" prop_placeholder="First name" v-model="contact_info.first_name.value" :error="contact_info.first_name.error" :ref="'client_contact_info_'+key+'_first_name'"></input-text>
						</div>
						<div class="lg:col-span-6">
							<input-text :required="true" label="Enter last name" prop_placeholder="Last name" v-model="contact_info.last_name.value" :error="contact_info.last_name.error" :ref="'client_contact_info_'+key+'_last_name'"></input-text>
						</div>
						
					</div>

					<div class="lg:grid lg:grid-cols-12 gap-5 mb-[25px]">
						<div class="lg:col-span-6 mt-[20px]">
							<input-email :required="true" v-model="contact_info.email.value" :error="contact_info.email.error" :ref="'client_contact_info_'+key+'_email'"></input-email>
						</div>
						<div class="lg:col-span-6 mt-[20px]">
							<input-telephone v-model="contact_info.phone.value" :required="false" label="Enter phone number" :error="contact_info.phone.error" :prop_placeholder="'Enter phone'" :ref="'client_contact_info_'+key+'_phone'"></input-telephone>
						</div>
					</div>
					<hr>
				</span>

				<p v-if="client_contact_info.length === 0" class="text-red-500!">Please add a contact info to continue</p>

				
				<input-button btn_text="Add More" icon="IconPlus" class="lg:float-start" @click="addNewContactInfoFields"></input-button>
				<input-button btn_text="Next" @click="active_tab_index = 1" icon="IconCaretRight" class="lg:float-end"></input-button>
				<div class="clear-both"></div>

			</template>
			<template v-slot:tab-2>
				<p class="text-xl!">Billing information</p>
				<div class="lg:grid lg:grid-cols-12 gap-5">
					<div class="lg:col-span-4 mt-[5px]">
						<input-text :required="true" label="Street" prop_placeholder="Enter street" v-model="client_billing_info.street.value" :error="client_billing_info.street.error" ref="client_billing_info_street"></input-text>
					</div>
					<div class="lg:col-span-4 mt-[5px]">
						<input-text :required="true" label="Apt / Suite" prop_placeholder="Enter apt / suite" v-model="client_billing_info.apt.value" :error="client_billing_info.apt.error" ref="client_billing_info_apt"></input-text>
					</div>
					<div class="lg:col-span-4 mt-[5px]">
						<input-text :required="true" label="City" prop_placeholder="Enter city" v-model="client_billing_info.city.value" :error="client_billing_info.city.error" ref="client_billing_info_city"></input-text>
					</div>
				</div>
				<div class="lg:grid lg:grid-cols-12 gap-5">
					<div class="lg:col-span-4 mt-[20px]">
						<input-text :required="true" label="State" prop_placeholder="Enter state" v-model="client_billing_info.state.value" :error="client_billing_info.state.error" ref="client_billing_info_state"></input-text>
					</div>
					<div class="lg:col-span-4 mt-[20px]">
						<input-text :required="true" label="Postal code" prop_placeholder="Enter postal code" v-model="client_billing_info.postal_code.value" :error="client_billing_info.postal_code.error" ref="client_billing_info_postal_code"></input-text>
					</div>
					<div class="lg:col-span-4 mt-[20px]">
						<input-auto-complete label="Choose a country" :required="true" :error="client_billing_info.country.error" :options="countries" :prop_placeholder="'Type to select a country'" @selected="selectCountry" ref="client_billing_info_country"></input-auto-complete>
					</div>
				</div>
				<br>
				<input-checkbox label="Copy to shipping information" v-model="copy_to_shipping"></input-checkbox>
				<br>
				<span v-if="!copy_to_shipping">
					<p class="text-xl!">Shipping information</p>
					<div class="lg:grid lg:grid-cols-12 gap-5">
						<div class="lg:col-span-4 mt-[5px]">
							<input-text :required="true" label="Street" prop_placeholder="Enter street" v-model="client_shipping_info.street.value" :error="client_shipping_info.street.error" ref="client_shipping_info_street"></input-text>
						</div>
						<div class="lg:col-span-4 mt-[5px]">
							<input-text :required="true" label="Apt / Suite" prop_placeholder="Enter apt / suite" v-model="client_shipping_info.apt.value" :error="client_shipping_info.apt.error" ref="client_shipping_info_apt"></input-text>
						</div>
						<div class="lg:col-span-4 mt-[5px]">
							<input-text :required="true" label="City" prop_placeholder="Enter city" v-model="client_shipping_info.city.value" :error="client_shipping_info.city.error" ref="client_shipping_info_city"></input-text>
						</div>
					</div>
					<div class="lg:grid lg:grid-cols-12 gap-5">
						<div class="lg:col-span-4 mt-[20px]">
							<input-text :required="true" label="State" prop_placeholder="Enter state" v-model="client_shipping_info.state.value" :error="client_shipping_info.state.error" ref="client_shipping_info_state"></input-text>
						</div>
						<div class="lg:col-span-4 mt-[20px]">
							<input-text :required="true" label="Postal code" prop_placeholder="Enter postal code" v-model="client_shipping_info.postal_code.value" :error="client_shipping_info.postal_code.error" ref="client_shipping_info_postal_code"></input-text>
						</div>
						<div class="lg:col-span-4 mt-[20px]">
							<input-auto-complete label="Choose a country" :required="true" :error="client_shipping_info.country.error" :options="countries" :prop_placeholder="'Type to select a country'" @selected="selectShippingCountry" ref="client_shipping_info_country"></input-auto-complete>
						</div>
					</div>
				</span>
				<input-button btn_text="Next" @click="active_tab_index = 1" icon="IconCaretRight" class="lg:float-end"></input-button>
				<div class="clear-both"></div>
			</template>
			<template v-slot:tab-3>
				<div>Tab 4 Content</div>
				<!-- needs to handle refs on validation -->
				<div class="lg:grid lg:grid-cols-12 gap-5">
					<div v-for="(field, key) in custom_fields" :key="key" :class="{'lg:col-span-12' : (field.span === 12), 'lg:col-span-6' : (field.span === 6), 'lg:col-span-4' : (field.span === 4)}">
						
						<div v-if="field.custom_field_type.input_type === 'text'">
							<input-text :required="field.required" :label="field.label" :prop_placeholder="field.placeholder" v-model="field.value" :error="field.error" ref="name"></input-text>
						</div>
						<div v-if="field.custom_field_type.input_type === 'textarea'">
							<input-textarea :label="field.label" :required="field.required" :prop_placeholder="field.placeholder" v-model="field.value" :error="field.error" ref="select_options"></input-textarea>
						</div>
						<div v-if="field.custom_field_type.input_type === 'email'">
							<input-email :label="field.label" :required="field.required" :prop_placeholder="field.placeholder" v-model="field.value" :error="field.error" ref="select_options"></input-email>
						</div>
						<div v-if="field.custom_field_type.input_type === 'select'">
							<input-select :label="field.label" :options="field.type_params" :prop_placeholder="field.placeholder" :required="field.required" v-model="field.value" :error="field.error" ref="select_options"></input-select>
						</div>
						<div v-if="field.custom_field_type.input_type === 'number'">
							<input-number :field_name="field.label" :required="field.required" :placeholder="field.placeholder" v-model="field.value" :error="field.error" ref="select_options"></input-number>
						</div>
						<div v-if="field.custom_field_type.input_type === 'date'">
							<input-date-time mode="date" :label="field.label" :required="field.required" :prop_placeholder="field.placeholder" v-model="field.value" ref="date_range_datatable"></input-date-time>
						</div>

						<div v-if="field.custom_field_type.input_type === 'time'">
							<input-date-time mode="time" :label="field.label" :required="field.required" :prop_placeholder="field.placeholder" v-model="field.value" ref="date_range_datatable"></input-date-time>
						</div>

						<div v-if="field.custom_field_type.input_type === 'datetime'">
							<input-date-time mode="datetime" :label="field.label" :required="field.required" :prop_placeholder="field.placeholder" v-model="field.value" ref="date_range_datatable"></input-date-time>
						</div>

						<div v-if="field.custom_field_type.input_type === 'telephone'">
							<input-telephone mode="telephone" :label="field.label" :required="field.required" :prop_placeholder="field.placeholder" v-model="field.value" ref="date_range_datatable"></input-telephone>
						</div>

						<div v-if="field.custom_field_type.input_type === 'multiselect'">
							<input-multiselect :label="field.label" :options="field.type_params" :required="field.required" v-model="field.value" :error="field.error" ref="select_options"></input-multiselect>
						</div>
						
					</div>
					
				</div>

			</template>
			<template v-slot:tab-4>
				<div>Settings</div>
				<div class="lg:grid lg:grid-cols-12 gap-5">
					<div class="lg:col-span-4 mt-[5px]">
						<input-auto-complete label="Choose a currency" :required="true" v-model="client_settings.currency.value" :error="client_settings.currency.error" :options="currencies" :prop_placeholder="'Type to select a currency'" @selected="selectCurrency" ref="client_settings_currency"></input-auto-complete>
					</div>
					<div class="lg:col-span-4 mt-[5px]">
						<input-select :options="payment_terms" v-model="client_settings.payment_terms.value" :error="client_settings.payment_terms.error" label="Payment terms"></input-select>
					</div>
					<div class="lg:col-span-4 mt-[5px]">
						<input-select :options="payment_terms" v-model="client_settings.quote_valid.value" :error="client_settings.quote_valid.error" label="Quote valid till"></input-select>
					</div>
				</div>

				<div class="lg:grid lg:grid-cols-12 gap-5">
					<div class="lg:col-span-4 mt-[20px]">
						<input-select :options="reminder_options" v-model="client_settings.send_reminder.value" :error="client_settings.send_reminder.error" label="Send reminders"></input-select>
					</div>
					<div class="lg:col-span-4 mt-[20px]">
						<input-select :options="size_options" v-model="client_settings.size.value" :error="client_settings.size.error" label="Size"></input-select>
					</div>
					<div class="lg:col-span-4 mt-[20px]">
						<input-select :options="industries" v-model="client_settings.industry.value" :error="client_settings.industry.error" label="Industry"></input-select>
					</div>
				</div>
				
				<!-- <input-select :options="input_fields_options" @changed="changeEventFired" label="Input field" :required="true" prop_placeholder="Select" v-model="custom_field" ref="custom_field"></input-select> -->
			</template>
		</tabs>
		
		
			

		</form>
    </div>
	
</section>
</template>
<style scoped>
	
</style>
<script lang="ts">


	import api from '../../helpers/api';
	import RedirectToLoginForNoTokens from '../../mixins/RedirectToLoginForNoTokens';
	import InputText from '../inputs/InputText.vue';
	import InputButton from '../inputs/InputButton.vue';
	import InputTelephone from '../inputs/InputTelephone.vue';
	import InputURL from '../inputs/InputURL.vue';
	import InputEmail from '../inputs/InputEmail.vue';
	import { IconTrash } from '@tabler/icons-vue';
	import InputAutoComplete from '../inputs/InputAutoComplete.vue';
	import InputCheckbox from '../inputs/InputCheckbox.vue';
	import InputTextarea from '../inputs/InputTextarea.vue';
	import InputSelect from '../inputs/InputSelect.vue';
	import InputNumber from '../inputs/InputNumber.vue';
	import InputDateTime from '../inputs/InputDateTime.vue';
	import InputMultiselect from '../inputs/InputMultiselect.vue';

	import Tabs from '../UI/Tabs.vue';
	
	import { defineComponent } from 'vue';

	export interface ClientCreateInterface{
		btn_disabled:boolean,
		fields: Array<object>,
		countries: Array<object>,
		tab_options: Array<string>,
		active_tab_index: number,
		client_personal_info: object,
		client_contact_info: Array<object>
		client_billing_info: object,
		client_shipping_info: object,
		copy_to_shipping: boolean,
		custom_fields: Array<object>,
		client_settings:object,
		currencies: Array<object>
		reminder_options: Array<object>,
		size_options: Array<object>,
		industries: Array<object>,
		payment_terms: Array<object>
	}
	
	export default defineComponent({
		name : 'ClientCreate',
		components : {
			InputButton,
			InputText,
			InputTelephone,
			InputURL,
			Tabs,
			InputEmail,
			IconTrash,
			InputAutoComplete,
			InputCheckbox,
			InputTextarea,
			InputSelect,
			InputNumber,
			InputDateTime,
			InputMultiselect
		},
		data(): ClientCreateInterface{
			return {
				btn_disabled: false,
				fields: [],
				countries: [],
				tab_options: ['Personal info', 'Contact info', 'Billing & Shipping info', 'Custom fields', 'Settings'],
				active_tab_index: 4,
				client_personal_info: {
					first_name : {
						value: '',
						error: 'First name is required'
					},
					last_name : {
						value: '',
						error: 'Last name is required'
					},
					tax_id : {
						value: '',
						error: 'Last name is required'
					},
					website : {
						value: '',
						error: 'Last name is required'
					},
					email : {
						value: '',
						error: 'Phone number is required'
					},
					phone : {
						value: '',
						error: 'Phone number is required'
					}
				},
				client_contact_info : [],
				client_billing_info: {
					street: {
						value : '',
						error: ''
					},
					apt: {
						value : '',
						error: ''
					},
					city: {
						value : '',
						error: ''
					},
					state: {
						value : '',
						error: ''
					},
					postal_code: {
						value : '',
						error: ''
					},
					country: {
						value : '',
						error: 'Please select a country'
					}
				},
				client_shipping_info: {},
				copy_to_shipping: false,
				custom_fields: [],
				currencies: [],
				payment_terms: [
					{
						value: '',
						text: 'Select'
					},
					{
						value: 'Due on receipt',
						text: 'Due on receipt'
					},
					{
						value: '7 Days',
						text: '7 Days'
					},
					{
						value: '14 Days',
						text: '14 Days'
					},
					{
						value: '30 Days',
						text: '30 Days'
					},
					{
						value: '60 Days',
						text: '60 Days'
					},
					{
						value: '90 Days',
						text: '90 Days'
					}
					
				],
				reminder_options: [
					{
						value: '',
						text: 'Select'
					},
					{
						value: 'Yes',
						text: 'Yes'
					},
					{
						value: 'No',
						text: 'No'
					}
				],
				size_options: [
					{
						value: '',
						text: 'Select'
					},
					{
						value: '1 - 3',
						text: '1 - 3'
					},
					{
						value: '4 - 10',
						text:  '4 - 10'
					},
					{
						value: '11 - 50',
						text:  '11 - 50'
					},
					{
						value: '51 - 100',
						text:  '51 - 100'
					},
					{
						value: '101 - 500',
						text:  '101 - 500'
					},
					{
						value: '500+',
						text:  '500+'
					}
				],
				industries: [],
				client_settings: {
					currency : {
						value : '',
						error : ''
					},
					payment_terms: {
						value : '',
						error : ''
					},
					quote_valid: {
						value : '',
						error : ''
					},
					send_reminder: {
						value : '',
						error : ''
					},
					size: {
						value : '',
						error : ''
					},
					industry: {
						value : '',
						error : ''
					}
				}
				
			}
		},
		mixins: [RedirectToLoginForNoTokens],
		watch: {
			
		},
		methods : {
			fetchClientAreaFields() : void{

				api.get('manage-clients/fetch-clients-custom-fields').then((response) => {
					this.custom_fields = response.data;
				}).catch((error) => {});

			},
			createClient() : void{
				
			},
			changeActiveTabValue(index:number) : void{
				this.active_tab_index = index;
			},
			addNewContactInfoFields() : void{
				this.client_contact_info.push({
					id: Date.now(),
					first_name : {
						value: '',
						error: 'First name is required'
					},
					last_name : {
						value: '',
						error: 'Last name is required'
					},
					email : {
						value: '',
						error: 'Phone number is required'
					},
					phone : {
						value: '',
						error: 'Phone number is required'
					}
				});
			},
			removeContactInfoFields(index:number) : void{
				this.client_contact_info.splice(index, 1);
			},

			fetchCountries() : void{
				api.get('get-countries').then((response) => {
					this.countries = response.data;
				}).catch((error) => {});
			},
			fetchCurrencies() : void{
				api.get('get-currencies').then((response) => {
					this.currencies = response.data;
				}).catch((error) => {});
			},
			fetchIndustries() : void{
				this.industries.unshift({
					value: '',
					text: 'Select'
				});
				api.get('get-industries').then((response) => {
					this.industries = [];
					this.industries = response.data;
					this.industries.unshift({
						value: '',
						text: 'Select'
					});
					
				}).catch((error) => {});
			},
			selectCountry(country_object:object) : void{
				this.$refs.client_billing_info_country.validate();
				if(Object.keys(country_object).length === 0){
					this.client_billing_info.country.value = '';
				}else{
					this.client_billing_info.country.value = country_object.value+'';
				}
				console.log(this.client_billing_info.country);

			},

			selectShippingCountry(country_object:object) : void{
				this.$refs.client_shipping_info_country.validate();
				if(Object.keys(country_object).length === 0){
					this.client_shipping_info.country.value = '';
				}else{
					this.client_shipping_info.country.value = country_object.value+'';
				}
				console.log(this.client_shipping_info.country);
			},

			setShippingInfo(): void{
				this.client_shipping_info = {
					
					street: {
						value : '',
						error: ''
					},
					apt: {
						value : '',
						error: ''
					},
					city: {
						value : '',
						error: ''
					},
					state: {
						value : '',
						error: ''
					},
					postal_code: {
						value : '',
						error: ''
					},
					country: {
						value : '',
						error: 'Please select a country'
					}
					
				};
			}
			
		},
		mounted : function(){
			this.addNewContactInfoFields();
			this.fetchClientAreaFields();
			this.fetchCountries();
			this.setShippingInfo();
			this.fetchCurrencies();
			this.fetchIndustries();
		}

	});

</script>