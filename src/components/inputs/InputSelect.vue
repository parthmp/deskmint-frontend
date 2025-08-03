<template>
	<div class="form-group">
		<label :for="text_id">{{ local_label }}</label>
		<select :id="text_id" v-model="input_value" @input="EmitModel" :class="{'red-input-order': ((local_error !== '' && show_errors) || (!is_valid && local_error === '' && show_errors))}">
			<option v-if="local_placeholder !== ''" value="">{{ local_placeholder }}</option>
			<option v-for="(option, z) in options" :key="z" :value="option.value+''">{{ option.text+'' }}</option>
		</select>
		<span v-if="(!is_valid && local_error === '' && show_errors)" class="text-red-500! text-[14px]! block">{{ local_label }} is a required field.</span>
		<span v-if="(local_error !== '' && show_errors)" class="text-red-500! text-[14px]! block">{{ error }}</span>
	</div>
</template>

<script lang="ts">

	export interface InputSelectInterface{
		input_value: any,
		input_required: boolean,
		is_valid: boolean,
		local_error: string,
		show_errors: boolean,
		local_label: string
		local_placeholder: string
	}

	import common from '../../helpers/common';

	import { defineComponent } from 'vue';

	export default defineComponent({

		name : 'InputEmail',

		props : {
			modelValue : {
				type:String
			},
			required : {
				type:Boolean
			},
			error : {
				type :String
			},
			label: {
				type:String
			},
			prop_placeholder: {
				type:String
			},
			options:{
				type:Array<Object>
			}
		},

		data() : InputSelectInterface {
			return {
				input_value: '',
				input_required: false,
				is_valid : true,
				local_error : '',
				show_errors: false,
				local_label: '',
				local_placeholder:''
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
			
			}
		},

		computed : {
			
			text_id() : string{
				let rand_number = Math.floor(Math.random() * 500) + 1;
				return 'text_field_'+rand_number;
			}
		},

		methods: {
			validate() : boolean{
				
				//this.show_errors = false;
				/* validate here */
				
				if(this.input_required === true){
					
					this.input_value = this.sanitizeInput(this.input_value+'');
					
					if(this.input_value !== ''){
						this.is_valid = true;
					}else{
						this.is_valid = false;
						this.show_errors = true;
					}
				}else{
					this.is_valid = true;
				}
				
				this.input_value = this.sanitizeInput(this.input_value+'');
				this.$emit('update:modelValue', this.input_value+'');
				
				this.$emit('is-valid', this.is_valid);
				return this.is_valid;
				
			},
			EmitModel(e:any) : void{
				this.input_value = this.sanitizeInput(e.target.value);
				this.$emit('update:modelValue', this.input_value);
			},
			sanitizeInput(in_string:string) : string{
				return common.stripTags(in_string);
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
			this.input_value = this.modelValue || '';
			
			this.local_error = '';
			if(common.isset(this.error)){
				this.local_error = this.error || '';
			}

			if(common.isset(this.label)){
				this.local_label = this.label+'';
			}

			if(common.isset(this.prop_placeholder)){
				this.local_placeholder = this.prop_placeholder+'';
			}
		}

	});

</script>