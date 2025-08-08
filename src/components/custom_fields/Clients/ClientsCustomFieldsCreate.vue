<template>
	<section class="main-content">
		<div class="card">
			<h1 class="text-2xl!">Create Clients Custom Field</h1>
			
				<input-button class="lg:float-start" btn_text="Back" url="/custom-fields/clients" icon="IconCaretLeft"></input-button>
				<div class="clear-both"></div>
				
			
			<br>
			
			<form @submit.prevent="createClientCustomField" class="form">

				
				<div class="lg:grid lg:grid-cols-12 gap-5">
					<div class="lg:col-span-4">
						<input-select :options="input_fields_options" @change="changeEventFired" label="Input field" :required="true" prop_placeholder="Select" v-model="custom_field" ref="input_field"></input-select>
					</div>
					<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
						<input-text label="Label" :required="true" prop_placeholder="Enter label text" v-model="label.value" :error="label.error" ref="label"></input-text>
					</div>
					<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
						<input-text label="Placeholder" prop_placeholder="Enter placeholder" :required="true" v-model="placeholder.value" :error="placeholder.error" ref="placeholder"></input-text>
					</div>
				</div>
				
				<div class="lg:grid lg:grid-cols-12 gap-5">
					<div class="lg:col-span-4 mt-[20px]">
						<input-select :options="required_options" label="Is required?" :required="false" prop_placeholder="Select" v-model="required_flag" ref="is_required"></input-select>
					</div>
					<div class="lg:col-span-4 mt-[20px]">
						<input-text label="Default value" :required="false" prop_placeholder="Default value" v-model="default_value.value" :error="default_value.error" ref="default_value"></input-text>
					</div>
					<div class="lg:col-span-4 mt-[20px]">
						<input-select :options="show_on_index_options" label="Show on index?" :required="false" prop_placeholder="Select" v-model="show_on_index" ref="show_on_index"></input-select>
					</div>
				</div>
			
				<div class="lg:grid lg:grid-cols-12 gap-5">
					<div class="lg:col-span-6 mt-[20px]">
						<input-number field_name="Add Edit page order" :required="false" prop_placeholder="Select" v-model="add_edit_page_order" ref="add_edit_page_order"></input-number>
					</div>
					<div class="lg:col-span-6 mt-[20px]">
						<input-number field_name="Index page column order" :required="false" prop_placeholder="Select" v-model="column_order" ref="column_order"></input-number>
					</div>
				</div>
				
				<div class="mt-[20px]">
					<input-textarea label="Add options seperated by comma" :required="false" v-model="select_options.value" :error="select_options.error" ref="select_options"></input-textarea>
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
		custom_field: number,
		label:object,
		placeholder:object,
		required_flag:boolean,
		required_options: Array<String>,
		default_value: object,
		show_on_index_options: Array<String>,
		show_on_index: boolean,
		add_edit_page_order: any,
		column_order: any
		select_options: object
	}

	import { defineComponent } from 'vue';

	import InputButton from '../../inputs/InputButton.vue';
	import InputSelect from '../../inputs/InputSelect.vue';
	import InputText from '../../inputs/InputText.vue';
	import InputNumber from '../../inputs/InputNumber.vue';
	import InputTextarea from '../../inputs/InputTextarea.vue';

	import api from '../../../helpers/api';
	
	export default defineComponent({

		name: 'ClientsCustomFieldsCreate',

		components: {
			InputButton,
			InputSelect,
			InputText,
			InputNumber,
			InputTextarea
		},

		data() : ClientsCustomFieldsCreateInterface {
			return {
				data_loading : false,
				btn_disabled: false,
				input_fields_options: [],
				custom_field: 0,
				label: {
					value : '',
					error: ''
				},
				placeholder: {
					value: '',
					error: ''
				},
				required_flag: false,
				required_options: [],
				default_value: {
					value : '',
					error: ''
				},
				show_on_index_options: [],
				show_on_index: true,
				add_edit_page_order: null,
				column_order: null,
				select_options: {
					value: '',
					error: ''
				}
			}
		},

		methods : {
			createClientCustomField() : void{

			},

			fetchFields() : void{
				api.get('clients-custom-fields/fetch-field-types').then((response) => {
					
					this.input_fields_options = response.data;
				}).catch((error) => {});
			},

			changeEventFired(val): void{
				console.log(val);
			}

		},

		mounted(){
			this.fetchFields();
		}

	});

</script>