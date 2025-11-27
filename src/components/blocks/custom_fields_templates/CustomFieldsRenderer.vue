<template>
	<div>
		<form class="form" @submit.prevent="handleSubmit">
			<div class="lg:grid lg:grid-cols-12 gap-5">
				<div v-for="(field, key) in custom_fields" :key="key" :class="{'lg:col-span-12' : (field.span === 12), 'lg:col-span-6' : (field.span === 6), 'lg:col-span-4' : (field.span === 4)}">
					
					<div v-if="field.custom_field_type.input_type === 'text'">
						<input-text :required="field.required" :label="field.label" :prop_placeholder="field.placeholder" v-model="field.value" :error="field.error" :ref="el => setFieldRef(field.ref, el)"></input-text>
					</div>
					<div v-if="field.custom_field_type.input_type === 'textarea'">
						<input-textarea :label="field.label" :required="field.required" :prop_placeholder="field.placeholder" v-model="field.value" :error="field.error" :ref="el => setFieldRef(field.ref, el)"></input-textarea>
					</div>
					<div v-if="field.custom_field_type.input_type === 'email'">
						<input-email :label="field.label" :required="field.required" :prop_placeholder="field.placeholder" v-model="field.value" :error="field.error" :ref="el => setFieldRef(field.ref, el)"></input-email>
					</div>
					<div v-if="field.custom_field_type.input_type === 'select'">
						<input-select :label="field.label" :options="field.type_params" :prop_placeholder="field.placeholder" :required="field.required" v-model="field.value" :error="field.error" :ref="el => setFieldRef(field.ref, el)"></input-select>
					</div>
					<div v-if="field.custom_field_type.input_type === 'number'">
						<input-number :field_name="field.label" :required="field.required" :placeholder="field.placeholder" v-model="field.value" :error="field.error" :ref="el => setFieldRef(field.ref, el)"></input-number>
					</div>
					<div v-if="field.custom_field_type.input_type === 'date'">
						<input-date-time mode="date" :label="field.label" :required="field.required" :prop_placeholder="field.placeholder" :error="field.error" v-model="field.value" :ref="el => setFieldRef(field.ref, el)"></input-date-time>
					</div>

					<div v-if="field.custom_field_type.input_type === 'time'">
						<input-date-time mode="time" :label="field.label" :required="field.required" :prop_placeholder="field.placeholder" :error="field.error" v-model="field.value" :ref="el => setFieldRef(field.ref, el)"></input-date-time>
					</div>

					<div v-if="field.custom_field_type.input_type === 'datetime'">
						<input-date-time mode="datetime" :label="field.label" :required="field.required" :prop_placeholder="field.placeholder" :error="field.error" v-model="field.value" :ref="el => setFieldRef(field.ref, el)"></input-date-time>
					</div>

					<div v-if="field.custom_field_type.input_type === 'telephone'">
						<input-telephone mode="telephone" :label="field.label" :required="field.required" :prop_placeholder="field.placeholder" :error="field.error" v-model="field.value" :ref="el => setFieldRef(field.ref, el)"></input-telephone>
					</div>

					<div v-if="field.custom_field_type.input_type === 'multiselect'">
						<input-multiselect :label="field.label" :options="field.type_params" :required="field.required" v-model="field.value" :error="field.error" :ref="el => setFieldRef(field.ref, el)"></input-multiselect>
					</div>
					
				</div>
				
			</div>
			<p v-if="custom_fields.length === 0">There are no custom fields added, click next.</p>
			<input-button btn_text="Next" icon="IconCaretRight" class="lg:float-end"></input-button>
			<div class="clear-both"></div>
		</form>

	</div>
</template>

<script lang="ts" setup>

	import { ref, watch, type Ref } from 'vue';
	import InputText from '../../inputs/InputText.vue';
	import InputTextarea from '../../inputs/InputTextarea.vue';
	import InputEmail from '../../inputs/InputEmail.vue';
	import InputSelect from '../../inputs/InputSelect.vue';
	import InputNumber from '../../inputs/InputNumber.vue';
	import InputDateTime from '../../inputs/InputDateTime.vue';
	import InputTelephone from '../../inputs/InputTelephone.vue';
	import InputMultiselect from '../../inputs/InputMultiselect.vue';
	import InputButton from '../../inputs/InputButton.vue';
	import common from '../../../helpers/common';
	import { toastEvents } from '../../../events/toastEvents';

	// Props - just receive the array directly, no duplication
	const custom_fields = defineModel<Array<any>>({ required: true });

	// Emit for validation result
	const emit = defineEmits<{
		(e: 'validated', is_valid: boolean): void
	}>();

	// Store refs for validation
	const field_refs: Ref<Record<string, any>> = ref({});

	const setFieldRef = (name: string, el: any | null) => {
		if (el) field_refs.value[name] = el;
	}

	// Watch field values for validation
	watch(() => custom_fields.value.map(f => f.value), (new_values, old_values) => {
		new_values.forEach((new_val, index) => {
			const old_val = old_values?.[index];
			if (new_val !== old_val) {
				const field = custom_fields.value[index];
				field.error = '';
				const ref_component = field_refs.value[field.ref];
				if(ref_component?.validate){
					if(!ref_component.validate()){
						field.error = common.formatKey(field.label)+" is required";
					}
				}
			}
		});
	}, { deep: false });

	// Validation method
	const validateFields = (): boolean => {
		let valid_custom_fields = true;

		custom_fields.value.forEach(field_name => {
				
			let temp_new_value = field_name.value;
			
			if(temp_new_value !== null){
				temp_new_value = temp_new_value.toString().trim();
			}

			const ref_component = field_refs.value[field_name.ref];
			
			if (ref_component?.validate) {
				ref_component.validate();
			}

			if(!temp_new_value && field_name.required){
				valid_custom_fields = false;
				field_name.error = common.formatKey(field_name.label)+" is required";
			}else{
				field_name.error = "";
			}
		});

		if(!valid_custom_fields){
			// toastEvents.emit('toast', {
			// 	type : 'error',
			// 	message : 'Please fill in highlighted fields'
			// });
		}

		return valid_custom_fields;
	}

	// Handle form submission
	const handleSubmit = () => {
		const is_valid = validateFields();
		emit('validated', is_valid);
	}

	// Expose validation method so parent can call it
	defineExpose({ 
		validateFields 
	});

</script>