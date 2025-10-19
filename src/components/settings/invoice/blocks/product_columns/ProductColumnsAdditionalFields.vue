<template>
	<div>
		
		<input-button url="../product-columns" label="Back" icon="IconCaretLeft" class="lg:float-start"></input-button>
		<div class="clear-both"></div>
		
		<br>
		<div class="clear-both"></div>

		<product-columns-additional-fields-skeleton v-if="data.loading"></product-columns-additional-fields-skeleton>
		<div v-if="!data.loading">
			<div v-for="(field, key) in data.fields_labels" :key="key">
				<hr class="mt-[40px] mb-[20px]">
				<icon-trash class="float-end cursor-pointer text-red-500!" @click.prevent="removeField(key)"></icon-trash>
				<div class="clear-both"></div>
				<div class="grid lg:grid-cols-12 gap-5">
					<div class="lg:col-span-6">
						<input-text @keydown.enter.prevent="saveFields" label="Field label" v-model="data.fields_labels[key].value" :error="data.fields_labels[key].error" :show_errors_prop="data.fields_labels[key].show_errors" :required="true" ref="new_field_label" placeholder="Enter label"></input-text>
					</div>
					<div class="lg:col-span-6">
						<input-select label="Field type" :options="data.field_type_options" v-model="data.fields_types[key].value" :error="data.fields_types[key].error" :required="true"></input-select>
					</div>
				</div>
				<input-number v-show="data.fields_types[key].value === 'tax'" @keydown.enter.prevent="saveFields" :step="0.01" label="Tax rate %" v-model="data.fields_taxes[key].value" placeholder="Enter tax rate in %"></input-number>
			</div>
			<br>
			<input-button @click.prevent="addNewField" label="Add new" icon="IconPlus" class="lg:mt-[0px]! lg:float-start"></input-button>
			<div class="clear-both"></div>
			<input-button :disabled="data.btn_disabled" @click.prevent="saveFields" label="Save" icon="IconCheck" class="lg:float-end"></input-button>
			<div class="clear-both"></div>
		</div>
	</div>
</template>


<script lang="ts" setup>

	import { onMounted, reactive, watch } from 'vue';
	import InputButton from '../../../../inputs/InputButton.vue';
	import InputText from '../../../../inputs/InputText.vue';
	import InputSelect from '../../../../inputs/InputSelect.vue';
	import InputNumber from '../../../../inputs/InputNumber.vue';

	import { IconTrash } from '@tabler/icons-vue';
	import { toastEvents } from '../../../../../events/toastEvents';
	import api from '../../../../../helpers/api';

	import ProductColumnsAdditionalFieldsSkeleton from '../../../../skeletons/ProductColumnsAdditionalFieldsSkeleton.vue';

	interface ProductColumnsAFInterface{
		loading:boolean
		btn_disabled:boolean
		fields_labels : Array<object>,
		fields_types : Array<object>,
		fields_taxes : Array<object>,
		field_type_options : Array<object>
	}

	const data = reactive<ProductColumnsAFInterface>({
		loading : false,
		btn_disabled : false,
		fields_labels : [
			
		],
		fields_types : [

		],
		fields_taxes : [

		],
		field_type_options : [
			{
				text : 'Tax',
				value : 'tax'
			},
			{
				text : 'Normal',
				value : 'normal'
			}
		]
	});

	watch(() => data.fields_labels.map(field => field.value), (newValues:Array<object>, oldValues:Array<object>) : void => {
    
		if(!oldValues || newValues.length !== oldValues.length){
			return;
		}
		newValues.forEach((value, index) => {
			if (value !== oldValues[index]){
				if (!value || value.trim() === '') {
					data.fields_labels[index].error = 'Please enter the field label';
					data.fields_labels[index].show_errors = true;
				}else{
					data.fields_labels[index].error = '';
					data.fields_labels[index].show_errors = false;
				}
			}
		});
  	});

	const addNewField = () : void => {
		
		if(data.fields_labels.length >= 3){
			toastEvents.emit('toast', {
				type: 'error',
				message : 'Only 3 additional fields are allowed'
			});
		}else{
			data.fields_labels.push({
				id: null,
				value : '',
				error : 'Please enter the field label',
				show_errors: false
			});

			data.fields_types.push({
				id: null,
				value : 'normal',
				error : ''
			});

			data.fields_taxes.push({
				id: null,
				value: '0'
			});
		}

		
		
	}

	const saveFields = () : void => {
		
		let labels_validated = true;
		data.btn_disabled = true;

		/* validate labels, not using refs for simplicity here */
		data.fields_labels.forEach(field_label => {
			if(!field_label.value || field_label.value.trim() === ''){
				field_label.error = 'Please enter the field label';
				field_label.show_errors = true;
				labels_validated = false;
			}
		});

		if(data.fields_labels.length === 0){
			toastEvents.emit('toast', {
				type: 'error',
				message : 'Please add at least one field to save'
			});
			data.btn_disabled = false;
		}else{

			if(labels_validated){

				/* api call */
				api.post('manage-invoice-settings-additional-product-fields', {
					labels : data.fields_labels,
					taxes : data.fields_taxes,
					types: data.fields_types
				}).then(response => {
					fetchFields();
				}).catch(error => {
					
				}).finally(() => {
					data.btn_disabled = false;
				});

			}else{
				data.btn_disabled = false;
				toastEvents.emit('toast', {
					type: 'error',
					message : 'Please enter field label(s)'
				});
			}

		 }

		

	}

	const fetchFields = () : void => {
		data.loading = true;
		api.get('manage-invoice-settings-additional-product-fields').then(response => {
			data.fields_labels = response.data.labels;
			data.fields_types = response.data.types;
			data.fields_taxes = response.data.taxes;
			data.loading = false;
		}).catch(error => {
			
		});
	}

	const removeField = (index:number) : void => {

		const additional_field_id = data.fields_labels[index].id;

		data.fields_labels.splice(index, 1);
		data.fields_types.splice(index, 1);
		data.fields_taxes.splice(index, 1);

		if(additional_field_id){
			api.delete(`manage-invoice-settings-additional-product-fields/${additional_field_id}`);
		}
		

	}

	onMounted(() : void => {
		fetchFields();
	})

</script>