<template>
	<div>
		<label>{{ props.label }}</label>
		<div :id="data.picker_id" class="p-[20px]! rounded-lg border-2 border-solid border-deskmint-cyan"></div>
	</div>
</template>

<style>
	
</style>

<script lang="ts" setup>
	import Picker from 'vanilla-picker';
	import { onMounted, reactive, watch } from 'vue';
	import common from '../../helpers/common';

	interface InputColorInterface{
		parent : object,
		picker : object,
		local_color : string,
		is_valid : boolean,
		picker_id: string
	}

	const data = reactive<InputColorInterface>({
		parent: null,
		picker: null,
		local_color: '',
		is_valid : false,
		picker_id : ''
	});

	const props = defineProps<{
		label?: string,
		modelValue: string,
		required?: boolean,
		alpha?: boolean,
		location?: string
	}>();

	const emit = defineEmits<{
		(e: "update:modelValue", value: string): void,
		(e: "is-valid", value: boolean): void
	}>();

	watch(() => props.modelValue, () : void => {
		setColor();
	});

	const getId = () : string => {
		let rand_number = common.random_number();
		return 'color_field_'+rand_number;
	}

	const validate = () : boolean => {
		
		data.is_valid = true;
		
		if(common.isset(props.required)){
			if(props.required === true && data.local_color.trim() === ''){
				data.is_valid = false;
			}
		}

		emit('is-valid', data.is_valid);

		return data.is_valid;
		
	}
	
	const PickerValueChange = () : void => {
		data.picker.onChange = function(color:any) {
			if(data.parent) {
				data.parent.style.background = color.rgbaString;
			}
			emit("update:modelValue", color.hex);	
		};
	}

	const setColor = () : void => {
		if(common.isset(props.modelValue) && data.picker){
			data.local_color = props.modelValue;
			data.picker.setColour(data.local_color);
		}
	}

	onMounted(() => {
		
		data.picker_id = getId();
		
		// Wait for next tick to ensure DOM is ready
		setTimeout(() => {
			// Use the unique ID to find the element
			data.parent = document.querySelector('#' + data.picker_id);
			
			if(data.parent) {
				data.picker = new Picker(data.parent);

				if(common.isset(props.alpha)){
					data.picker.setOptions({
						alpha:props.alpha
					});	
				}

				if(common.isset(props.location)){
					data.picker.setOptions({
						popup:props.location
					});
				}
				
				PickerValueChange();
				setColor();
			}
		}, 0);
	})

	defineExpose({
		validate
	});

</script>