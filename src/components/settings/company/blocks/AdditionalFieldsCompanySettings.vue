<template>
	<input-button label="Add new field" icon="IconPlus" class="lg:float-end" @click.prevent="data.add_new_field_toggle = !data.add_new_field_toggle"></input-button>
	<div class="clear-both"></div>

	<additional-fields-company-settings-skeleton v-if="data.loading"></additional-fields-company-settings-skeleton>
	<div v-if="!data.loading">
		<form v-if="data.add_new_field_toggle" @submit.prevent="addNewField">
			<input-text label="Field label" v-model="data.field_label.value" :error="data.field_label.error" :required="true" ref="new_field_label"></input-text>
			<div class="clear-both"></div>
			<input-button label="Add" icon="IconPlus" class="lg:float-end"></input-button>
			<div class="clear-both"></div>
		</form>

		<form @submit.prevent="saveFields">
			<div v-for="(field,index) in data.all_fields" :key="field.key" class="mt-[20px] flex gap-5 items-center">
				<input-text :label="field.label" v-model="field.value" :required="false" class="grow"></input-text>
				<a href="javascript:;" class="text-red-500! block mt-[15px]" @click.prevent="deleteField(index)"><IconTrash></IconTrash></a>
			</div>
		
			<div v-if="data.all_fields.length > 0" class="mt-[25px]">
				<input-button label="Save" icon="IconCheck" :disabled="data.btn_disabled" class="lg:float-end"></input-button>
				<div class="clear-both"></div>
			</div>
		</form>
	</div>
	
</template>

<script lang="ts" setup>

	import { onMounted, reactive, ref } from 'vue';
	import InputText from '../../../inputs/InputText.vue';
	import InputButton from '../../../inputs/InputButton.vue';
	import { toastEvents } from '../../../../events/toastEvents';

	import { IconTrash } from '@tabler/icons-vue';
	import api from '../../../../helpers/api';

	import AdditionalFieldsCompanySettingsSkeleton from '../../../skeletons/AdditionalFieldsCompanySettingsSkeleton.vue';

	interface InputComponent{
  		validate: () => boolean
	}

	interface AdditionalFieldsCompanySettingsInterface{
		loading:boolean,
		btn_disabled:boolean,
		field_label:object,
		all_fields:Array<object>,
		field_key_count:number,
		add_new_field_toggle:boolean
	}

	const new_field_label = ref<InputComponent | null>(null);

	const data = reactive<AdditionalFieldsCompanySettingsInterface>({
		loading : false,
		btn_disabled : false,
		field_label : {
			value : '',
			error: ''
		},
		all_fields : [],
		field_key_count : 0,
		add_new_field_toggle: false
	});

	/* methods */
	const addNewField = () : void => {
		data.field_label.value = '';
		data.field_key_count++;
		
		if(new_field_label.value.validate()){
			
			data.all_fields.unshift({
				id : '',
				key :data.field_key_count,
				label : data.field_label.value,
				value : ''
			});

			data.field_label.value = '';

		}else{
			toastEvents.emit('toast', {
				type : 'error',
				message: 'Please enter field label'
			});
		}
		
	}

	const deleteField = (index:number) : void => {

		let temp = data.all_fields[index];

		data.all_fields.splice(index, 1);

		if(temp.id !== '' && temp.id !== null){
			
			api.delete('manage-company-settings-additional-fields', {
				data : { id: temp.id }
			}).then(response => {
				
			}).catch(error => {});
		}
		
	}

	const saveFields = () : void => {
		data.btn_disabled = true;
		api.post('manage-company-settings-additional-fields', {
			all_fields : data.all_fields
		}).then(response => {
			fetchAllFields();
		}).catch(error => {}).finally(() => { data.btn_disabled = false; });

	}

	const fetchAllFields = () : void => {
		data.loading = true;
		api.get('manage-company-settings-additional-fields').then(response => {
			data.all_fields = response.data;
			data.loading = false;
		}).catch(error => {});
	}

	/* hooks */
	onMounted(() => {
		fetchAllFields();
	})


</script>