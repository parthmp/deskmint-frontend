<template>
	
	<div class="form-group">
		<label for="email">Email Address</label>
		<input type="text" v-model="input_value" @input="$emit('update:modelValue', $event.target.value)" class="form-control" id="email" :class="{'red-input-order':!valid_status && !first_load}">
		<p v-if="!valid_status && !first_load" class="text-red-600">{{ error_message }}</p>
	</div>
	
</template>

<style scoped>
	
</style>
<!--for test-->
<script lang="ts">

	import { defineComponent } from 'vue';

	import common from '../../helpers/common';

	export interface InputEmailInterface{
		input_value: string,
		input_required: boolean,
		error_message: string,
		valid_status: boolean,
		frozen_error:string,
		first_load: boolean
	}

	export default defineComponent({

		name: 'InputEmail',

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
			}
		},

		data() : InputEmailInterface {
			return {
				input_value: '',
				input_required: true,
				error_message: '',
				valid_status : false,
				frozen_error : '',
				first_load: false
			};
		},

		watch : {
			error_trigger(): void{

				if(common.isset(this.error)){
					this.error_message = this.error;
					//this.valid_status = false;
				}else{
					this.error_message = 'Please enter a valid email address';
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

					const email = String(common.sanitize(this.input_value)).toLowerCase();
					const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
					let tested_email = regex.test(email);
					
					this.valid_status = tested_email;
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
			}
		},

		mounted(){
			
			this.input_value = common.sanitize(this.default_value);
			this.input_required = this.required;

			if(common.isset(this.error)){
				this.error_message = this.error;
				this.frozen_error = this.error;
			}else{
				this.error_message = 'Please enter a valid email address';
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