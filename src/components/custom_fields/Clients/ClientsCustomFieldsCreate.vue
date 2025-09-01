<template>
	<section class="main-content">
		<div class="card">
			<h1 class="text-2xl!">Create Clients Custom Field</h1>
			
			<input-button class="lg:float-start" btn_text="Back" url="/custom-fields/clients" icon="IconCaretLeft"></input-button>
			<div class="clear-both"></div>
				
			
			<br>

			<clients-custom-fields-create-skeleton v-if="data_loading"></clients-custom-fields-create-skeleton>
			
			<form v-if="!data_loading" @submit.prevent="createClientCustomField" class="form">

				
				<div class="lg:grid lg:grid-cols-12 gap-5">
					<div class="lg:col-span-4">
						<input-select :options="input_fields_options" @changed="changeEventFired" label="Input field" :required="true" prop_placeholder="Select" v-model="custom_field" ref="custom_field"></input-select>
					</div>
					<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
						<input-text label="Label" :required="true" prop_placeholder="Enter label text" v-model="label.value" :error="label.error" ref="label"></input-text>
					</div>
					<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
						<input-text label="Placeholder" prop_placeholder="Enter placeholder" :required="false" v-model="placeholder.value" :error="placeholder.error" ref="placeholder"></input-text>
					</div>
				</div>
				
				<div class="lg:grid lg:grid-cols-12 gap-5">
					<div class="lg:col-span-4 mt-[20px]">
						<input-select :options="required_options" label="Is required?" :required="true" prop_placeholder="Select" v-model="required_flag" ref="required_flag"></input-select>
					</div>
					<div class="lg:col-span-4 mt-[20px]">
						<input-text label="Default value" :required="false" prop_placeholder="Default value" v-model="default_value.value" :error="default_value.error" ref="default_value"></input-text>
					</div>
					<div class="lg:col-span-4 mt-[20px]">
						<input-number :min="0" :max="999999" field_name="Add Edit page order" :required="true" placeholder="Enter field order number" v-model="add_edit_page_order.value" :error="add_edit_page_order.error" ref="add_edit_page_order"></input-number>
					</div>
				</div>
				
				<div class="mt-[20px]" v-show="show_options_textarea">
					<input-textarea label="Add options seperated by comma" :required="show_options_textarea_required" v-model="select_options.value" :error="select_options.error" ref="select_options"></input-textarea>
				</div>
				<input-button btn_text="Save" :disabled="btn_disabled" icon="IconCheck" class="lg:float-end"></input-button>
				<div class="clear-both"></div>

			</form>
			
		</div>
	</section>
</template>

<script lang="ts">

	export interface ClientsCustomFieldsCreateInterface{
		data_loading:boolean,
		btn_disabled:boolean,
		input_fields_options: Array<any>,
		custom_field: string,
		label:object,
		placeholder:object,
		required_flag:string,
		required_options: Array<String>,
		default_value: object,
		add_edit_page_order: any,
		select_options: object,
		show_options_textarea: boolean,
		show_options_textarea_required: boolean
	}

	import { defineComponent } from 'vue';

	import InputButton from '../../inputs/InputButton.vue';
	import InputSelect from '../../inputs/InputSelect.vue';
	import InputText from '../../inputs/InputText.vue';
	import InputNumber from '../../inputs/InputNumber.vue';
	import InputTextarea from '../../inputs/InputTextarea.vue';

	import ClientsCustomFieldsCreateSkeleton from '../../skeletons/ClientsCustomFieldsCreateSkeleton.vue';

	import api from '../../../helpers/api';
	import common from '../../../helpers/common';
	import { toastEvents } from '../../../events/toastEvents';
	import RedirectToLoginForNoTokens from '../../../mixins/RedirectToLoginForNoTokens';
	
	export default defineComponent({

		name: 'ClientsCustomFieldsCreate',

		components: {
			InputButton,
			InputSelect,
			InputText,
			InputNumber,
			InputTextarea,
			ClientsCustomFieldsCreateSkeleton
		},

		data() : ClientsCustomFieldsCreateInterface {
			return {
				data_loading : false,
				btn_disabled: false,
				input_fields_options: [],
				custom_field: '',
				label: {
					value : '',
					error: 'Label is a required field'
				},
				placeholder: {
					value: '',
					error: ''
				},
				required_flag: '',
				required_options: [
					{
						value: 'true',
						text: 'Yes'
					},
					{
						value: 'false',
						text: 'No'
					}
				],
				default_value: {
					value : '',
					error: ''
				},
				add_edit_page_order: {
					value: '0',
					error: 'Please enter a valid number for add Edit page order'
				},
				select_options: {
					value: '',
					error: 'Please enter options seperated by comma'
				},
				show_options_textarea: false,
				show_options_textarea_required: true
			}
		},

		mixins: [RedirectToLoginForNoTokens],

		watch: {
			custom_field() : void{
				this.$refs.custom_field.validate();
			},
			"label.value"(): void{
				if(this.label.value.trim() !== ''){
					this.label.error = '';
					if(this.label.value.trim().length > 50){
						this.$refs.label.showErrorsExplicitly();
						this.label.error = 'Label must not have more than 50 characters';
					}
				}else{
					this.label.error = 'Label is a required field'
				}

				this.$refs.label.validate();
				
			},
			required_flag() : void{
				this.$refs.required_flag.validate();
			},
			"add_edit_page_order.value"() : void{

				if(this.add_edit_page_order.value.trim() !== ''){
					this.add_edit_page_order.error = '';
				}else{
					this.add_edit_page_order.error = 'Please enter a valid number for add Edit page order';
				}

				this.$refs.add_edit_page_order.validate();
			},
			"select_options.value"() : void{

				if(this.select_options.value.trim() !== ''){
					this.select_options.error = '';
				}else{
					this.select_options.error = 'Please enter options seperated by comma';
				}

				this.$refs.select_options.validate();
			}
		},

		methods : {
			createClientCustomField() : void{
				
				this.btn_disabled = true;

				let input_field_validated = this.$refs.custom_field.validate();
				let label_validated = this.$refs.label.validate();
				let is_required_validated = this.$refs.required_flag.validate();
				let add_edit_page_order_validated = this.$refs.add_edit_page_order.validate();
				let select_options_validated = this.$refs.select_options.validate();


				if(input_field_validated && label_validated && is_required_validated && add_edit_page_order_validated && select_options_validated){
					this.label.error = '';
					let label_trimmed = this.label.value.trim();
					if(label_trimmed.length > 50){
						this.$refs.label.showErrorsExplicitly();
						this.label.error = 'Label must not have more than 50 characters';
						this.btn_disabled = false;
						toastEvents.emit('toast', {
							type: 'error',
							message: 'Label must not have more than 50 characters'
						});
					}else{

						api.post('clients-custom-fields', {
							input_field: this.custom_field,
							label:this.label.value,
							placeholder: this.placeholder.value,
							is_required: this.required_flag,
							default_value: this.default_value.value,
							add_edit_page_order: this.add_edit_page_order.value,
							select_options: this.select_options.value
						}).then((response) => {
							this.btn_disabled = false;
							this.$router.push('/custom-fields/clients');
						}).catch((error) => {
							this.btn_disabled = false;
						});

					}

					

				}else{

					this.btn_disabled = false;
					toastEvents.emit('toast', {
						type: 'error',
						message: 'Please fill in highlighted fields'
					});

				}


				
			},

			fetchFields() : void{
				this.data_loading = true;
				api.get('clients-custom-fields/fetch-field-types').then((response) => {
					this.input_fields_options = response.data;
					this.data_loading = false;
				}).catch((error) => {});
			},

			changeEventFired(val:object): void{
				
				this.show_options_textarea = false;
				this.show_options_textarea_required = false;
				if(common.isset(val?.input_type)){
					if(val?.input_type.toLowerCase() === 'select' || val?.input_type.toLowerCase() === 'multiselect'){
						this.show_options_textarea = true;
						this.show_options_textarea_required = true;
					}
				}
				
			}

		},

		mounted(){
			this.fetchFields();
		}

	});

</script>