<template>
	<section class="main-content">
    <div class="card">
        <h1 class="text-2xl!" v-if="(mode === 'create')">Create a client</h1>
        <h1 class="text-2xl!" v-if="(mode === 'edit')">Edit client</h1>
		<input-button class="lg:float-start" btn_text="Back" url="/clients" icon="IconCaretLeft"></input-button>
			<div class="clear-both"></div>
        <br>
			<client-create-edit-skeleton v-if="data_loading_for_edit"></client-create-edit-skeleton>
			<tabs v-if="!data_loading_for_edit" :options="tab_options" :active_tab_index="active_tab_index" @tab-changed="changeActiveTabValue" :disable_further="(mode === 'create')">
				<template v-slot:tab-0>
			
					<form @submit.prevent="validateTab1" class="form">
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
								<input-email :required="true" v-model="client_personal_info.email.value" :error="client_personal_info.email.error" ref="personal_info_email"></input-email>
							</div>
							<div class="lg:col-span-4 mt-[20px]">
								<input-telephone v-model="client_personal_info.phone.value" :required="false" label="Enter phone number" :error="client_personal_info.phone.error" :prop_placeholder="'Enter phone'" ref="personal_info_phone"></input-telephone>
							</div>
						</div>

						<input-button btn_text="Next" icon="IconCaretRight" class="lg:float-end"></input-button>
						<div class="clear-both"></div>
					</form>
					
				</template>
				<template v-slot:tab-1>
					<form @submit.prevent="validateTab2" class="form">
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
						<input-button btn_text="Next" icon="IconCaretRight" class="lg:float-end"></input-button>
					</form>
					<input-button btn_text="Add More" icon="IconPlus" class="lg:float-start" @click="addNewContactInfoFields()"></input-button>
					
					<div class="clear-both"></div>

				</template>
				<template v-slot:tab-2>
					<p class="text-xl!">Billing information</p>
					<form @submit.prevent="validateTab3" class="form">
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
								<input-auto-complete label="Choose a country" :required="true" :error="client_billing_info.country.error" v-model="client_billing_info.country.value" :options="countries" :prop_placeholder="'Type to select a country'" @selected="selectCountry" ref="client_billing_info_country"></input-auto-complete>
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
									<input-auto-complete label="Choose a country" :required="true" :error="client_shipping_info.country.error" v-model="client_shipping_info.country.value" :options="countries" :prop_placeholder="'Type to select a country'" @selected="selectShippingCountry" ref="client_shipping_info_country"></input-auto-complete>
								</div>
							</div>
						</span>
						<input-button btn_text="Next" icon="IconCaretRight" class="lg:float-end"></input-button>
						<div class="clear-both"></div>
					</form>
				</template>
				<template v-slot:tab-3>
					
					<!-- needs to handle refs on validation -->
					<form @submit.prevent="validateTab4" class="form">
						<div class="lg:grid lg:grid-cols-12 gap-5">
							<div v-for="(field, key) in custom_fields" :key="key" :class="{'lg:col-span-12' : (field.span === 12), 'lg:col-span-6' : (field.span === 6), 'lg:col-span-4' : (field.span === 4)}">
								
								<div v-if="field.custom_field_type.input_type === 'text'">
									<input-text :required="field.required" :label="field.label" :prop_placeholder="field.placeholder" v-model="field.value" :error="field.error" :ref="field.ref"></input-text>
								</div>
								<div v-if="field.custom_field_type.input_type === 'textarea'">
									<input-textarea :label="field.label" :required="field.required" :prop_placeholder="field.placeholder" v-model="field.value" :error="field.error" :ref="field.ref"></input-textarea>
								</div>
								<div v-if="field.custom_field_type.input_type === 'email'">
									<input-email :label="field.label" :required="field.required" :prop_placeholder="field.placeholder" v-model="field.value" :error="field.error" :ref="field.ref"></input-email>
								</div>
								<div v-if="field.custom_field_type.input_type === 'select'">
									<input-select :label="field.label" :options="field.type_params" :prop_placeholder="field.placeholder" :required="field.required" v-model="field.value" :error="field.error" :ref="field.ref"></input-select>
								</div>
								<div v-if="field.custom_field_type.input_type === 'number'">
									<input-number :field_name="field.label" :required="field.required" :placeholder="field.placeholder" v-model="field.value" :error="field.error" :ref="field.ref"></input-number>
								</div>
								<div v-if="field.custom_field_type.input_type === 'date'">
									<input-date-time mode="date" :label="field.label" :required="field.required" :prop_placeholder="field.placeholder" :error="field.error" v-model="field.value" :ref="field.ref"></input-date-time>
								</div>

								<div v-if="field.custom_field_type.input_type === 'time'">
									<input-date-time mode="time" :label="field.label" :required="field.required" :prop_placeholder="field.placeholder" :error="field.error" v-model="field.value" :ref="field.ref"></input-date-time>
								</div>

								<div v-if="field.custom_field_type.input_type === 'datetime'">
									<input-date-time mode="datetime" :label="field.label" :required="field.required" :prop_placeholder="field.placeholder" :error="field.error" v-model="field.value" :ref="field.ref"></input-date-time>
								</div>

								<div v-if="field.custom_field_type.input_type === 'telephone'">
									<input-telephone mode="telephone" :label="field.label" :required="field.required" :prop_placeholder="field.placeholder" :error="field.error" v-model="field.value" :ref="field.ref"></input-telephone>
								</div>

								<div v-if="field.custom_field_type.input_type === 'multiselect'">
									<input-multiselect :label="field.label" :options="field.type_params" :required="field.required" v-model="field.value" :error="field.error" :ref="field.ref"></input-multiselect>
								</div>
								
							</div>
							
						</div>
						<input-button btn_text="Next" icon="IconCaretRight" class="lg:float-end"></input-button>
						<div class="clear-both"></div>
					</form>

				</template>
				<template v-slot:tab-4>
					<form @submit.prevent="validateTab5" class="form">
						<div class="lg:grid lg:grid-cols-12 gap-5">
							<div class="lg:col-span-4 mt-[5px]">
								<input-auto-complete label="Choose a currency" :required="true" v-model="client_settings.currency.value" :error="client_settings.currency.error" :options="currencies" :prop_placeholder="'Type to select a currency'" @selected="selectCurrency" ref="client_settings_currency"></input-auto-complete>
							</div>
							<div class="lg:col-span-4 mt-[5px]">
								<input-select :options="payment_terms" :required="true" v-model="client_settings.payment_terms.value" :error="client_settings.payment_terms.error" label="Payment terms" ref="client_settings_payment_terms"></input-select>
							</div>
							<div class="lg:col-span-4 mt-[5px]">
								<input-select :options="payment_terms" :required="true" v-model="client_settings.quote_valid.value" :error="client_settings.quote_valid.error" label="Quote valid till" ref="client_settings_quote_valid"></input-select>
							</div>
						</div>

						<div class="lg:grid lg:grid-cols-12 gap-5">
							<div class="lg:col-span-4 mt-[20px]">
								<input-select :options="reminder_options" :required="true" v-model="client_settings.send_reminder.value" :error="client_settings.send_reminder.error" label="Send reminders" ref="client_settings_send_reminder"></input-select>
							</div>
							<div class="lg:col-span-4 mt-[20px]">
								<input-select :options="size_options" :required="true" v-model="client_settings.size.value" :error="client_settings.size.error" label="Size" ref="client_settings_size"></input-select>
							</div>
							<div class="lg:col-span-4 mt-[20px]">
								<input-select :options="industries" :required="true" v-model="client_settings.industry.value" :error="client_settings.industry.error" label="Industry" ref="client_settings_industry"></input-select>
							</div>
						</div>
						<input-button btn_text="Save" :disabled="btn_disabled" icon="IconCheck" class="lg:float-end"></input-button>
						<div class="clear-both"></div>
					</form>
				</template>
			</tabs>
		
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
	import { reactive, watch } from 'vue'

	import { toastEvents } from '../../events/toastEvents';
	import common from '../../helpers/common';

	import ClientCreateEditSkeleton from '../skeletons/ClientCreateEditSkeleton.vue';

	export interface ClientCreateInterface{
		data_loading_for_edit:boolean,
		btn_disabled:boolean,
		fields: Array<object>,
		countries: Array<object>,
		tab_options: Array<string>,
		active_tab_index: number,
		client_personal_info: object,
		client_contact_info: Array<object>
		client_contact_info_validation_fields: Array<string>
		client_billing_info: object,
		client_shipping_info: object,
		copy_to_shipping: boolean,
		custom_fields: Array<object>,
		client_settings:object,
		currencies: Array<object>
		reminder_options: Array<object>,
		size_options: Array<object>,
		industries: Array<object>,
		payment_terms: Array<object>,
		mode:string,
		edit_loaded: boolean
	}
	
	export default defineComponent({
		name : 'ClientCreateEdit',
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
			InputMultiselect,
			ClientCreateEditSkeleton
		},
		data(): ClientCreateInterface{
			return {
				data_loading_for_edit:false,
				btn_disabled: false,
				fields: [],
				countries: [],
				tab_options: ['Personal info', 'Contact info', 'Billing & Shipping info', 'Custom fields', 'Settings'],
				active_tab_index: 0,
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
				client_contact_info_validation_fields : [
					'first_name',
					'last_name',
					'email'
				],
				client_billing_info: {
					street: {
						value : '',
						error: 'Street is required'
					},
					apt: {
						value : '',
						error: 'Apt / Suite is required'
					},
					city: {
						value : '',
						error: 'City is required'
					},
					state: {
						value : '',
						error: 'State is required'
					},
					postal_code: {
						value : '',
						error: 'Postal code is required'
					},
					country: {
						value : '',
						error: 'Please select a country'
					}
				},
				client_shipping_info: {
					street: {
						value : '',
						error: 'Street is required'
					},
					apt: {
						value : '',
						error: 'Apt / Suite is required'
					},
					city: {
						value : '',
						error: 'City is required'
					},
					state: {
						value : '',
						error: 'State is required'
					},
					postal_code: {
						value : '',
						error: 'Postal code is required'
					},
					country: {
						value : '',
						error: 'Please select a country'
					}
				},
				copy_to_shipping: false,
				custom_fields: [],
				currencies: [],
				payment_terms: [
					{
						value: '',
						text: 'Select'
					},
					{
						value: 0,
						text: 'Due on receipt'
					},
					{
						value: 7,
						text: '7 Days'
					},
					{
						value: 14,
						text: '14 Days'
					},
					{
						value: 30,
						text: '30 Days'
					},
					{
						value: 60,
						text: '60 Days'
					},
					{
						value: 90,
						text: '90 Days'
					}
					
				],
				reminder_options: [
					{
						value: '',
						text: 'Select'
					},
					{
						value: 1,
						text: 'Yes'
					},
					{
						value: 0,
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
						error : 'Please select a currency'
					},
					payment_terms: {
						value : '',
						error : 'Please select a payment term'
					},
					quote_valid: {
						value : '',
						error : 'Please select quote validity'
					},
					send_reminder: {
						value : '',
						error : 'Send reminders is required field'
					},
					size: {
						value : '',
						error : 'Size is required field'
					},
					industry: {
						value : '',
						error : 'Industry is required field'
					}
				},
				mode: 'create',
				edit_loaded : false
				
			}
		},
		mixins: [RedirectToLoginForNoTokens],
		computed: {
			allowWatchers() : boolean{
			
				if(this.mode === 'create'){
					return true;
				}

				if(this.mode === 'edit'){
					if(this.edit_loaded){
						return true;
					}
				}

				return false;
			}
		},
		watch: {
			"client_personal_info.first_name.value"() : void{
				this.tab1FieldsValidations('client_personal_info', 'personal_info_first_name', 'first_name', 'First name is required');
			},
			"client_personal_info.last_name.value"() : void{
				this.tab1FieldsValidations('client_personal_info', 'personal_info_last_name', 'last_name', 'Last name is required');
			},
			"client_personal_info.email.value"() : void{
				this.tab1FieldsValidations('client_personal_info', 'personal_info_email', 'email', 'Invalid email provided');
			},
			"client_billing_info.street.value"() : void{
				this.tab1FieldsValidations('client_billing_info', 'client_billing_info_street', 'street', 'Street is required');
			},
			"client_billing_info.apt.value"() : void{
				this.tab1FieldsValidations('client_billing_info', 'client_billing_info_apt', 'apt', 'Apt / Suite is required');
			},
			"client_billing_info.city.value"() : void{
				this.tab1FieldsValidations('client_billing_info', 'client_billing_info_city', 'city', 'City is required');
			},
			"client_billing_info.state.value"() : void{
				this.tab1FieldsValidations('client_billing_info', 'client_billing_info_state', 'state', 'State is required');
			},
			"client_billing_info.postal_code.value"() : void{
				this.tab1FieldsValidations('client_billing_info', 'client_billing_info_postal_code', 'postal_code', 'Postal code is required');
			},
			"client_billing_info.country.value"() : void{
				this.tab1FieldsValidations('client_billing_info', 'client_billing_info_country', 'country', 'Country is required');
			},

			"client_shipping_info.street.value"() : void{
				if(!this.copy_to_shipping){
					this.tab1FieldsValidations('client_shipping_info', 'client_shipping_info_street', 'street', 'Street is required');
				}
			},
			"client_shipping_info.apt.value"() : void{
				if(!this.copy_to_shipping){
					this.tab1FieldsValidations('client_shipping_info', 'client_shipping_info_apt', 'apt', 'Apt / Suite is required');
				}
			},
			"client_shipping_info.city.value"() : void{
				if(!this.copy_to_shipping){
					this.tab1FieldsValidations('client_shipping_info', 'client_shipping_info_city', 'city', 'City is required');
				}
			},
			"client_shipping_info.state.value"() : void{
				if(!this.copy_to_shipping){
					this.tab1FieldsValidations('client_shipping_info', 'client_shipping_info_state', 'state', 'State is required');
				}
			},
			"client_shipping_info.postal_code.value"() : void{
				if(!this.copy_to_shipping){
					this.tab1FieldsValidations('client_shipping_info', 'client_shipping_info_postal_code', 'postal_code', 'Postal code is required');
				}
			},
			"client_shipping_info.country.value"() : void{
				if(!this.copy_to_shipping){
					this.tab1FieldsValidations('client_shipping_info', 'client_shipping_info_country', 'country', 'Country is required');
				}
			},

			"client_settings.currency.value"() : void{
				this.tab1FieldsValidations('client_settings', 'client_settings_currency', 'currency', 'Please select a currency');
			},
			"client_settings.payment_terms.value"() : void{
				this.tab1FieldsValidations('client_settings', 'client_settings_payment_terms', 'payment_terms', 'Please select a payment term');
			},
			"client_settings.quote_valid.value"() : void{
				this.tab1FieldsValidations('client_settings', 'client_settings_quote_valid', 'quote_valid', 'Please select quote validity');
			},
			"client_settings.send_reminder.value"() : void{
				this.tab1FieldsValidations('client_settings', 'client_settings_send_reminder', 'send_reminder', 'Send reminders is required field');
			},
			"client_settings.size.value"() : void{
				this.tab1FieldsValidations('client_settings', 'client_settings_size', 'size', 'Size is required field');
			},
			"client_settings.industry.value"() : void{
				this.tab1FieldsValidations('client_settings', 'client_settings_industry', 'industry', 'Industry is required field');
			},

			active_tab_index() : void{
				this.changeActiveTabValue(this.active_tab_index, false);
			}
		},
		methods : {

			tab1FieldsValidations(tab_info, ref, field, error) : void{
				if(this.allowWatchers){
					if(this.$refs[ref].validate()){
						this[tab_info][field].error = '';
					}else{
						this[tab_info][field].error = error;
					}
				}
				
			},

			fetchClientAreaFields(fillers:Array<object> = []) : void{
				
				api.get('manage-clients/fetch-clients-custom-fields').then((response) => {
					this.custom_fields = response.data;
					
					/**/
					if(fillers.length !== 0){
						
						for(let z = 0 ; z < this.custom_fields.length ; z++){

							for(let x = 0 ; x < fillers.length ; x++){
								if(fillers[x].clients_custom_field_id === this.custom_fields[z].id){
									this.custom_fields[z].value_id = fillers[x].id;
									if(fillers[x].clients_custom_field.custom_field_type.input_type === 'multiselect'){
										this.custom_fields[z].value = JSON.parse(fillers[x].field_value);
									}else{
										if(fillers[x].clients_custom_field.custom_field_type.input_type === 'time'){
											this.custom_fields[z].value = common.parseTimeString(fillers[x].field_value);
										}else if(fillers[x].clients_custom_field.custom_field_type.input_type === 'select'){
											this.custom_fields[z].value = fillers[x].field_value+'';
										}else{
											this.custom_fields[z].value = fillers[x].field_value;
										}
										
									}
									
								}
							}

						}
					}else{
						/* handle date edge case for timezone conversions */
						for(let z = 0 ; z < this.custom_fields.length ; z++){
							this.custom_fields[z].value_id = null;
							if(this.custom_fields[z].custom_field_type.input_type === 'date'){
								this.custom_fields[z].value = new Date(this.custom_fields[z].value);
								let now_date_time = new Date();
								this.custom_fields[z].value.setHours(now_date_time.getHours(), now_date_time.getMinutes(), now_date_time.getSeconds());
								
							}
						}
					}
					/**/


					/**/

					this.custom_fields.forEach(field_name => {
						
						this.$watch(
						
							() => field_name.value,

							(newVal) => {
								
								let temp_new_value = newVal;
								
								if(temp_new_value !== null){
									temp_new_value = temp_new_value.toString().trim();
								}

								this.$refs[field_name.ref][0].validate();
								
								if(!temp_new_value){
									
									field_name.error = common.formatKey(field_name.label)+" is required";
								}else{
									field_name.error = "";
								}
							}

						);

					});

					/**/

					this.fetchCountries();
				}).catch((error) => {});

			},

			saveClient() : void{

				this.btn_disabled = true;

				/* send server request */

				let client_data = {
					personal_info:this.client_personal_info,
					contact_info:this.client_contact_info,
					billing_info: this.client_billing_info,
					shipping_info: this.client_shipping_info,
					custom_fields: this.custom_fields,
					settings: this.client_settings,
					copy_to_shipping: this.copy_to_shipping
				};

				if(this.mode === 'create'){

					api.post('manage-clients', client_data).then((response) => {
						this.$router.push('/clients');
					}).catch((error) => {
						
						if(error.response?.data?.tab_switch !== undefined){
							this.active_tab_index = error.response.data.tab_switch;
						}
						
					}).finally(() => {
						this.btn_disabled = false;
					});
				

				}else{

					api.patch('manage-clients/'+this.$route.params.id, client_data).then((response) => {
						this.$router.push('/clients');
					}).catch((error) => {
						
						if(error.response?.data?.tab_switch !== undefined){
							this.active_tab_index = error.response.data.tab_switch;
						}
						
					}).finally(() => {
						this.btn_disabled = false;
					});
				

				}
				
			},
			changeActiveTabValue(index:number, locked:boolean) : void{
				this.active_tab_index = index;
				this.$nextTick(() => {
					if(!locked){
						if(this.active_tab_index === 0){
	
							this.tab1FieldsValidations('client_personal_info', 'personal_info_first_name', 'first_name', 'First name is required');
							this.tab1FieldsValidations('client_personal_info', 'personal_info_last_name', 'last_name', 'Last name is required');
							this.tab1FieldsValidations('client_personal_info', 'personal_info_email', 'email', 'Invalid email provided');
							
						}else if(this.active_tab_index === 1){
							this.validateTab2();
							this.active_tab_index = 1;
						}else if(this.active_tab_index === 2){
							this.validateTab3();
							this.active_tab_index = 2;
						}else if(this.active_tab_index === 3){
							this.validateTab4();
							this.active_tab_index = 3;
						}else if(this.active_tab_index === 4){
							this.validateClientSettings((valid:boolean) => {

							});
						}
					}
				});
			},
			addNewContactInfoFields(id:number = 0, first_name_value:string = '', last_name_value:string = '', email_value:string = '', phone_value:string = '') : void{
				
				let use_id = Date.now();

				if(id !== 0){
					use_id = id;
				}

				const new_contact = reactive({
					id: use_id,
					first_name: { value: first_name_value, error: "First name is required" },
					last_name: { value: last_name_value, error: "Last name is required" },
					email: { value: email_value, error: "Email is required" },
					phone: { value: phone_value, error: "" }
				});

				this.client_contact_info.push(new_contact);
				
				let index = (this.client_contact_info.length-1);
				
				this.client_contact_info_validation_fields.forEach(field_name => {
					const contact = new_contact;
					this.$watch(
					
						() => contact[field_name].value,

						(newVal) => {
							let dynamic_ref = 'client_contact_info_'+index+'_'+field_name;
							this.$refs[dynamic_ref][0].validate();

							let temp_val = newVal;

							if(temp_val !== null){
								temp_val = newVal.toString().trim();
							}

							if(!temp_val){
								this.client_contact_info[index][field_name].error = common.formatKey(field_name)+" is required";
							}else{
								this.client_contact_info[index][field_name].error = "";
							}
						}

					);

				});


			},
			removeContactInfoFields(index:number) : void{
				this.client_contact_info.splice(index, 1);
			},

			fetchCountries() : void{
				api.get('get-countries').then((response) => {
					this.countries = response.data;
					this.fetchCurrencies();
				}).catch((error) => {});
			},
			fetchCurrencies() : void{
				api.get('get-currencies').then((response) => {
					this.currencies = response.data;
					this.fetchIndustries();
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
					this.data_loading_for_edit = false;
				}).catch((error) => {});
			},
			selectCountry(country_object:object) : void{
				this.$refs.client_billing_info_country.validate();
				if(Object.keys(country_object).length === 0){
					this.client_billing_info.country.value = '';
				}else{
					this.client_billing_info.country.value = country_object.value+'';
				}
				
			},

			selectShippingCountry(country_object:object) : void{
				this.$refs.client_shipping_info_country.validate();
				if(Object.keys(country_object).length === 0){
					this.client_shipping_info.country.value = '';
				}else{
					this.client_shipping_info.country.value = country_object.value+'';
				}
				
			},

			setShippingInfo(): void{
				this.client_shipping_info = {
					street: {
						value : '',
						error: 'Street is required'
					},
					apt: {
						value : '',
						error: 'Apt / Suite is required'
					},
					city: {
						value : '',
						error: 'City is required'
					},
					state: {
						value : '',
						error: 'State is required'
					},
					postal_code: {
						value : '',
						error: 'Postal code is required'
					},
					country: {
						value : '',
						error: 'Please select a country'
					}
				};
			},

			selectCurrency(selected_currency:any) : void{
				this.$refs.client_settings_currency.validate();
				if(Object.keys(selected_currency).length === 0){
					this.client_settings.currency.value = '';
				}else{
					this.client_settings.currency.value = selected_currency.value+'';
				}
			},

			validateTab1() : void{

				let tab1_is_valid = true;

				for(let key in this.client_personal_info){
				
					const ref_name = 'personal_info_'+key; 
					const ref_to_check = this.$refs[ref_name];

					if(ref_to_check && typeof ref_to_check.validate === 'function'){
						if(!ref_to_check.validate()){
							tab1_is_valid = false;
							
						}
					}
					
				}
				
				if(tab1_is_valid){
					this.active_tab_index = 1;
				}	

			},
			validateTab2() : void{

				if(this.client_contact_info.length === 0){
					toastEvents.emit('toast', {
						type: 'error',
						message: 'Please enter at least one contact info'
					});
				}else{

					
					let tab2_is_valid = true;

					for(let z = 0 ; z < this.client_contact_info.length; z++){

						this.client_contact_info_validation_fields.forEach((field_name) => {

							let dynamic_ref = 'client_contact_info_'+z+'_'+field_name;
							
							if(!this.$refs[dynamic_ref][0].validate()){
								tab2_is_valid = false;
								this.client_contact_info[z][field_name].error = common.formatKey(field_name)+" is required";
							}else{
								this.client_contact_info[z][field_name].error = "";
							}

						});

						

					}


					if(tab2_is_valid){
						this.active_tab_index = 2;
					}

				}
			},

			validateTab3() : void{
				let valid_billing_info = this.validateClientBillingInfo();
				let valid_shipping_info = this.validateClientShippingInfo();
				if(valid_billing_info && valid_shipping_info){
					this.active_tab_index = 3;
				}

			},

			validateClientBillingInfo() : boolean{
				
				let valid_billing_info = true;

				for(let key in this.client_billing_info){
					
					const ref_name = 'client_billing_info_'+key; 
					const ref_to_check = this.$refs[ref_name];
					
					if(ref_to_check && typeof ref_to_check.validate === 'function'){
						if(!ref_to_check.validate()){
							valid_billing_info = false;
						}
					}
					
				}
				
				return valid_billing_info;
						
			},
			validateClientShippingInfo() : boolean{
				
				if(this.copy_to_shipping){
					return true;
				}

				let valid_shipping_info = true;

				for(let key in this.client_shipping_info){
					
					const ref_name = 'client_shipping_info_'+key; 
					const ref_to_check = this.$refs[ref_name];
					
					if(ref_to_check && typeof ref_to_check.validate === 'function'){
						if(!ref_to_check.validate()){
							valid_shipping_info = false;
						}
					}
					
				}
				
				return valid_shipping_info;
						
			},

			validateTab4() : void{

				let valid_tab_4 = true;

				this.custom_fields.forEach(field_name => {
						
					let temp_new_value = field_name.value;
					
					if(temp_new_value !== null){
						temp_new_value = temp_new_value.toString().trim();
					}

					this.$refs[field_name.ref][0].validate();
					
					if(!temp_new_value && field_name.required){
						valid_tab_4 = false;
						field_name.error = common.formatKey(field_name.label)+" is required";
					}else{
						field_name.error = "";
					}
						
				});

				
				if(valid_tab_4){
					this.active_tab_index = 4;
				}

			},

			validateClientSettings(callback:any) : void{

				let valid_settings = true;

				for(let key in this.client_settings){
					
					const ref_name = 'client_settings_'+key; 
					const ref_to_check = this.$refs[ref_name];
					
					if(ref_to_check && typeof ref_to_check.validate === 'function'){
						if(!ref_to_check.validate()){
							valid_settings = false;
						}
					}
					
				}

				callback(valid_settings);

			},

			validateTab5() : void{

				this.validateClientSettings((valid_settings:boolean) => {
					if(valid_settings){
						this.saveClient();
					}
				});

				
			},

			fetchClientInfo() : void{
				api.get('manage-clients/'+this.$route.params.id).then((response) => {

					let client_info = response.data.client_info;
					let contact_info = response.data.contact_info;
					let custom_fields = response.data.custom_fields;

					/* fill tab 1 */
					this.client_personal_info.first_name.value = client_info.first_name;
					this.client_personal_info.last_name.value = client_info.last_name;
					this.client_personal_info.tax_id.value = client_info.tax_number;
					this.client_personal_info.website.value = client_info.website;
					this.client_personal_info.email.value = client_info.email;
					this.client_personal_info.phone.value = client_info.phone;

					/* fill tab 2 */
					for(let z = 0 ; z < contact_info.length ; z++){
						this.addNewContactInfoFields(contact_info[z].id, contact_info[z].first_name, contact_info[z].last_name, contact_info[z].email, contact_info[z].phone);
					}
					
					/* fill tab 3 */
					this.client_billing_info.street.value = client_info.billing_street;
					this.client_billing_info.apt.value = client_info.billing_apt;
					this.client_billing_info.city.value = client_info.billing_city;
					this.client_billing_info.state.value = client_info.billing_state;
					this.client_billing_info.postal_code.value = client_info.billing_postal_code;
					this.client_billing_info.country.value = client_info.billing_country_id+'';

					this.client_shipping_info.street.value = client_info.shipping_street;
					this.client_shipping_info.apt.value = client_info.shipping_apt;
					this.client_shipping_info.city.value = client_info.shipping_city;
					this.client_shipping_info.state.value = client_info.shipping_state;
					this.client_shipping_info.postal_code.value = client_info.shipping_postal_code;
					this.client_shipping_info.country.value = client_info.shipping_country_id+'';
					
					/* fill tab 4 */
					this.fetchClientAreaFields(custom_fields);

					/* fill tab 5 */
					this.client_settings.currency.value = client_info.currency_id+'';
					this.client_settings.payment_terms.value = client_info.payment_terms+'';
					this.client_settings.quote_valid.value = client_info.quote_valid_days+'';
					this.client_settings.send_reminder.value = client_info.send_reminders+'';
					this.client_settings.size.value = client_info.size+'';
					this.client_settings.industry.value = client_info.industry_id+'';

					this.$nextTick(() => {
						this.edit_loaded = true;
					});


				}).catch((errors) => {

				});
			}
			
		},
		mounted : function(){

			if(this.$route.params.id){
				this.mode = 'edit';
				this.data_loading_for_edit = true;
				this.fetchClientInfo();
			}else{
				this.addNewContactInfoFields();
				this.setShippingInfo();
				this.fetchClientAreaFields();
			}
			
		}

	});

</script>