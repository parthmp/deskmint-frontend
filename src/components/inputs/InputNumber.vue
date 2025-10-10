<template>
	<div class="form-group">
		<label :for="random_field_id">{{ local_field_name }}</label>
		<input type="number" :step="local_step" :min="local_min" :max="local_max" :placeholder="local_placeholder" v-model="input_value" class="form-control" :id="random_field_id" @input="EmitModel" :class="{'red-input-order': highlight_error}">
		<span v-if="(!is_valid && local_error === '' && show_errors)" class="text-red-500! text-[14px]! block">Please enter valid number</span>
		<span v-if="(local_error !== '' && show_errors)" class="text-red-500! text-[14px]! block">{{ error }}</span>
	</div>
</template>

<script lang="ts">

	export interface InputNumberInterface{
		input_value: Number,
		input_required: boolean,
		is_valid: boolean,
		local_error: string,
		show_errors: boolean,
		local_allow_http:boolean,
		local_field_name: string,
		random_field_id: string,
		local_placeholder: string,
		local_min: number,
		local_max: number,
		local_step: number
	}

	import common from '../../helpers/common';

	import { defineComponent } from 'vue';

	export default defineComponent({

		name : 'InputNumber',
		props: ['modelValue', 'required', 'error', 'field_name', 'placeholder', 'min', 'max', 'step', 'label'],

		data() : InputNumberInterface {
			return {
				input_value: '',
				input_required: false,
				is_valid : true,
				local_error : '',
				show_errors: false,
				local_allow_http: true,
				local_field_name: '',
				random_field_id: '',
				local_placeholder: '',
				local_min: 0,
				local_max: 99999999999999,
				local_step : 1
			};
		},

		components: {

		},

		watch: {
			error() : void{

				this.local_error = '';
				if(common.isset(this.error)){
					this.local_error = this.error || '';
				}
			
			},
			modelValue() : void{
				this.fillMe();
			}
		},

		computed : {
			highlight_error() : boolean{
				return ((!this.is_valid && this.local_error === '' && this.show_errors) || (this.local_error !== '' && this.show_errors));
			}
		},

		methods: {
			fillMe() : void{
				this.input_value = parseFloat(this.modelValue);
				if(common.isset(this.step)){
					this.local_step = this.step;
				}
			},
			validate() : boolean{
				
				//this.show_errors = false;
				/* validate here */
				
				if(this.input_required === true){
					let temp_value = this.input_value;
					if(isNaN(temp_value)){
						this.is_valid = false;
						this.show_errors = true;
					}else{
						// this.input_value = common.stripTags(common.sanitize(this.input_value));
						// let temp_value = this.input_value.trim();
						if(temp_value !== '' && this.input_value !== null && typeof this.input_value !== 'undefined'){
							this.is_valid = true;
						}else{
							this.is_valid = false;
							this.show_errors = true;
						}
					}
					
				}else{
					this.is_valid = true;
				}
				
				//this.input_value = this.sanitizeInput(this.input_value);
				this.$emit('update:modelValue', this.input_value);
				
				this.$emit('is-valid', this.is_valid);
				return this.is_valid;
				
			},
			EmitModel(e:any) : void{
				// this.input_value = this.sanitizeInput(e.target.value).toLocaleLowerCase();
				// this.$emit('update:modelValue', this.input_value.toLocaleLowerCase());
				this.$emit('update:modelValue', this.input_value+'');
			},
			sanitizeInput(in_string:string) : string{
				return common.stripTags(common.sanitize(in_string));
			}
		},

		mounted(){
			if(common.isset(this.required)){
				this.input_required = this.required;
			}else{
				this.input_required = false;
			}

			if(this.input_required === false){
				this.is_valid = true;
			}else{
				this.is_valid = false;
				
			}

			this.fillMe();
			
			this.local_error = '';
			if(common.isset(this.error)){
				this.local_error = this.error || '';
			}

			this.random_field_id = 'number_'+common.random_number();

			if(common.isset(this.placeholder)){
				this.local_placeholder = this.placeholder+'';
			}

			if(common.isset(this.min)){
				this.local_min = this.min || 0;
			}

			if(common.isset(this.max)){
				this.local_max = this.max || 0;
			}

			if(common.isset(this.field_name)){
				this.local_field_name = this.field_name+'';
			}

			
			if(common.isset(this.label)){
				this.local_field_name = this.label+'';
			}
		
		}

	});

</script>