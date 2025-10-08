<template>
	<div>
		<div v-if="data.loading">
			<client-details-invoice-settings-skeleton></client-details-invoice-settings-skeleton>
		</div>
		
		<div v-if="!data.loading">
			<p class="pl-1">Arrange how you want to display client details in the invoice</p>
		
			<input-select label="Add a field" v-model="data.dropdown_value" :options="data.dropdown_fields" prop_placeholder="Select" @changed="dropDownChanged"></input-select>
			<br>
			
			<p class="pl-1 pb-0">Drag and drop fields below to arrange</p>
			
			<draggable-list v-model="data.rows" :delete="true" @deleted="rowDeleted"></draggable-list>
			
			<input-button @click.prevent="saveDetailsSettings" btn_text="Save" :disabled="data.btn_disabled" icon="IconCheck" class="lg:float-end"></input-button>
			<div class="clear-both"></div>
		</div>
	</div>
	
</template>
<script lang="ts" setup>

	import { onMounted, reactive } from 'vue';
	import DraggableList from '../../UI/DraggableList.vue';
	import InputButton from '../../inputs/InputButton.vue';
	import InputSelect from '../../inputs/InputSelect.vue';
	import api from '../../../helpers/api';

	import ClientDetailsInvoiceSettingsSkeleton from '../../skeletons/ClientDetailsInvoiceSettingsSkeleton.vue';

	interface DetailsInvoiceSettingsInterface{
		rows : Array<object>,
		dropdown_fields : Array<object>,
		dropdown_value : string,
		btn_disabled : boolean
		loading : boolean
	}

	
	/* data */
	const data = reactive<DetailsInvoiceSettingsInterface>({
		rows : [],
		dropdown_fields : [],
		dropdown_value : '',
		btn_disabled: false,
		loading: false
	});

	/* props */
	const props = defineProps<{
		url?: string
	}>();

	/* methods */
	const fetchDetailsFields = () : void => {
		data.loading = true;
		api.get(props.url+'').then(response => {
			data.rows = response.data.rows;
			data.dropdown_fields = response.data.dropdown;
			data.loading = false;
		}).catch(error => {
			
		});
	}

	const rowDeleted = (deleted:object) : void => {
		deleted.id = data.dropdown_fields.length + 2;
		data.dropdown_fields.push(deleted);
		data.dropdown_value = '';
	}

	const dropDownChanged = (object:object) : void => {

		let temp_object = object;
		
		object.id = data.rows.length + 5;
		data.rows.push(object);
		data.dropdown_value = '';

		let temp_index = data.dropdown_fields.indexOf(temp_object);
		if(temp_index !== -1){
			data.dropdown_fields.splice(temp_index, 1);
		}

	}

	const saveDetailsSettings = () : void => {
		data.btn_disabled = true;
		api.post(props.url, {
			rows : data.rows	
		}).then(response => {
			data.btn_disabled = false;
		}).catch(error => {
			data.btn_disabled = false;
		});
	}

	/* hooks */
	onMounted(() : void => {
		fetchDetailsFields();
	});
	

</script>