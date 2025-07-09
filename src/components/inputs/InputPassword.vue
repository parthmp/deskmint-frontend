<template>
	
	<div class="form-group">
		<label for="password">{{ field }}</label>
		
		<div class="relative">
			<input :type="input_type" v-model="input_value" @input="$emit('update:modelValue', $event.target.value)" class="form-control" id="password" :class="{'red-input-order':!valid_status && !first_load}">
			
			<span class="absolute right-2 top-[20%]">
				<icon-eye v-if="!show_pass" @click="show_hide_pass" class="cursor-pointer"></icon-eye>
				<icon-eye-closed v-if="show_pass" @click="show_hide_pass" class="cursor-pointer"></icon-eye-closed>
			</span>
			
		</div>
		<p v-if="!valid_status && !first_load" class="text-red-500! text-[14px]!">{{ error_message }}</p>
	</div>
	
</template>

<style scoped>
	
</style>
<!--for test-->
<script lang="ts">

	import { defineComponent } from 'vue';

	import { IconEyeClosed, IconEye } from '@tabler/icons-vue';

	import common from '../../helpers/common';

	export interface InputEmailInterface{
		input_value: string,
		input_required: boolean,
		error_message: string,
		valid_status: boolean,
		frozen_error:string,
		first_load: boolean,
		show_pass: boolean,
		input_type: string
	}

	export default defineComponent({

		name: 'InputEmail',

		components: {
			IconEyeClosed:IconEyeClosed,
			IconEye:IconEye
		},

		props: {
			modelValue: {
				type: String,
				required: true
			},
			default_value: {
				type: String,
				default: '',
			},
			required: {
				type: Boolean,
				default: true,
			},
			error: {
				type: String
			},
			error_trigger : {
				type:Number
			},
			field:{
				type:String
			}
		},

		data() : InputEmailInterface {
			return {
				input_value: '',
				input_required: true,
				error_message: '',
				valid_status : false,
				frozen_error : '',
				first_load: false,
				show_pass: true,
				input_type: 'password'
				
			};
		},

		watch : {
			error_trigger(): void{

				if(common.isset(this.error)){
					this.error_message = this.error;
					this.valid_status = false;
				}else{
					this.error_message = this.field+' must be more than 7 characters';
				}
				
				if(this.error_trigger > 0){
					this.first_load = false;
				}
				
			},

			input_value() : void{
				this.first_load = false;
				if (this.input_required === false){
					this.valid_status =  true;
				}else{

					let tested_pass = false;
					if(this.input_value !== '' && this.input_value.length > 7){
						tested_pass = true;
					}
					
					this.valid_status = tested_pass;
					if(this.valid_status === false){
						this.error_message = this.frozen_error;
					}
				}

				this.emit_value(this.valid_status);
			},

		},

		computed: {
			
		},

		methods: {

			emit_value(validated:boolean): void {
				this.$emit('is-valid', validated);
			},

			show_hide_pass() : void{
				this.show_pass = !this.show_pass;
				if(this.input_type === 'password'){
					this.input_type = 'text';
				}else{
					this.input_type = 'password';
				}
			}
		},

		mounted(){
			
			this.input_value = common.sanitize(this.default_value);
			this.input_required = this.required;

			if(common.isset(this.error)){
				this.error_message = this.error;
				this.frozen_error = this.error;
			}else{
				this.error_message = this.field+' must be more than 7 characters';
				this.frozen_error = this.error_message;
			}

			if(common.isset(this.required)){
				if(this.required === false){
					this.valid_status = true;
				}
			}
			this.first_load = true;
			common.setupFormValidation(this);
			
		},
		beforeUnmount() {
			common.cleanupFormValidation(this);
		}
	});

</script>