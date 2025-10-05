<template>
	<form @submit.prevent="addNewField">
		<input-text label="Field label" v-model="data.field_label.value" :error="data.field_label.error" :required="true" ref="new_field_label"></input-text>
		<div class="clear-both"></div>
		<input-button label="Add" icon="IconPlus" class="lg:float-end"></input-button>
		<div class="clear-both"></div>
	</form>

	<div v-for="(field,index) in data.all_fields" :key="field.key" class="mt-[20px] flex gap-5 items-center">
		<input-text :label="field.label" v-model="field.value" :required="false" class="grow"></input-text>
		<a href="javascript:;" class="text-red-500! block mt-[15px]" @click.prevent="deleteField(index)"><IconTrash></IconTrash></a>
	</div>

	<form @submit.prevent="saveFields">
		<div v-if="data.all_fields.length > 0" class="mt-[25px]">
			<input-button label="Save" icon="IconCheck" :disabled="data.btn_disabled" class="lg:float-end"></input-button>
			<div class="clear-both"></div>
		</div>
	</form>
	
</template>

<script lang="ts" setup>

	import { reactive, ref } from 'vue';
	import InputText from '../../../inputs/InputText.vue';
	import InputButton from '../../../inputs/InputButton.vue';
	import { toastEvents } from '../../../../events/toastEvents';

	import { IconTrash } from '@tabler/icons-vue';
import api from '../../../../helpers/api';

	const new_field_label = ref(null);

	const data = reactive({
		btn_disabled : false,
		field_label : {
			value : '',
			error: ''
		},
		all_fields : [],
		field_key_count : 0
	});

	/* methods */
	const addNewField = () : void => {
		data.field_label.value = '';
		data.field_key_count++;
		
		if(new_field_label.value.validate()){
			
			data.all_fields.push({
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
		data.all_fields.splice(index, 1) ;
	}

	const saveFields = () : void => {

		api.post('manage-company-settings-additional-fields', {
			all_fields : data.all_fields
		}).then(response => {

		}).catch(error => {});

	}


</script>