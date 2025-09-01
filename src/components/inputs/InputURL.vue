<template>
	<div class="form-group">
		<label for="url">{{ local_label }}</label>
		<input type="text" :placeholder="local_placeholder" v-model="input_value" class="form-control" id="url" @input="EmitModel" :class="{'red-input-order': highlight_error}">
		<span v-if="(!is_valid && local_error === '' && show_errors)" class="text-red-500! text-[14px]! block">Please enter valid URL with <span v-if="local_allow_http">http:// or https://</span><span v-if="!local_allow_http">https://</span></span>
		<span v-if="(local_error !== '' && show_errors)" class="text-red-500! text-[14px]! block">{{ error }}</span>
	</div>
</template>

<script lang="ts">

	export interface InputURLInterface{
		input_value: string,
		input_required: boolean,
		is_valid: boolean,
		local_error: string,
		show_errors: boolean,
		local_allow_http:boolean,
		local_placeholder:string,
		local_label:string
	}

	import common from '../../helpers/common';

	import { defineComponent } from 'vue';

	export default defineComponent({

		name : 'InputURL',

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
			allow_http:{
				type:Boolean
			},
			prop_placeholder:{
				type:String
			},
			label: {
				type:String
			}
		},

		data() : InputURLInterface {
			return {
				input_value: '',
				input_required: false,
				is_valid : true,
				local_error : '',
				show_errors: false,
				local_allow_http: true,
				local_placeholder : 'Enter URL',
				local_label: 'URL'
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
				this.input_value = this.modelValue.toLocaleLowerCase() || '';
			}
		},

		computed : {
			highlight_error() : boolean{
				return ((!this.is_valid && this.local_error === '' && this.show_errors) || (this.local_error !== '' && this.show_errors));
			}
		},

		methods: {
			validate() : boolean{
				
				//this.show_errors = false;
				/* validate here */
				
				if(this.input_required === true){
					
					this.input_value = common.stripTags(this.input_value);
					
					if(common.isValidURL(this.input_value.trim(), this.local_allow_http) === true){
						this.is_valid = true;
					}else{
						this.is_valid = false;
						this.show_errors = true;
					}
				}else{
					this.is_valid = true;
				}
				
				this.input_value = this.sanitizeInput(this.input_value);
				this.$emit('update:modelValue', this.input_value.toLocaleLowerCase());
				
				this.$emit('is-valid', this.is_valid);
				return this.is_valid;
				
			},
			EmitModel(e:any) : void{
				this.input_value = this.sanitizeInput(e.target.value).toLocaleLowerCase();
				this.$emit('update:modelValue', this.input_value.toLocaleLowerCase());
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
			this.input_value = this.modelValue.toLocaleLowerCase() || '';
			
			this.local_error = '';
			if(common.isset(this.error)){
				this.local_error = this.error || '';
			}

			if(common.isset(this.allow_http)){
				
				this.local_allow_http = this.allow_http;
				
			}
			if(common.isset(this.prop_placeholder)){
				this.local_placeholder = this.prop_placeholder;
			}

			if(common.isset(this.label)){
				this.local_label = this.label;
			}
		}

	});

</script>