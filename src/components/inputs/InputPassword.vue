<template>
	<div class="form-group">
		<label for="password">Password</label>
		<div class="relative">
			<input :type="input_type" v-model="input_value" class="form-control" @input="EmitModel" id="password" :class="{'red-input-order':highlight_error}">
			
			<span class="absolute right-2 top-[20%]">
				<icon-eye v-if="input_type == 'text'" @click="input_type = 'password'" class="cursor-pointer"></icon-eye>
				<icon-eye-closed v-if="input_type == 'password'" @click="input_type = 'text'" class="cursor-pointer"></icon-eye-closed>
			</span>
			
		</div>
		<span v-if="(!is_valid && local_error === '' && show_errors)" class="text-red-500! text-[14px]! block">Password must be at least 8 characters long</span>
		<span v-if="(local_error !== '' && show_errors)" class="text-red-500! text-[14px]! block">{{ error }}</span>
	</div>
</template>

<script lang="ts">

	export interface InputEmailInterface{
		input_value: string,
		input_type: string,
		input_required: boolean,
		is_valid: boolean,
		local_error: string,
		show_errors: boolean
	}

	import common from '../../helpers/common';

	import { IconEyeClosed, IconEye } from '@tabler/icons-vue';

	import { defineComponent } from 'vue';

	export default defineComponent({

		name : 'InputPassword',

		props : {
			modelValue : {
				type:String
			},
			required : {
				type:Boolean
			},
			error : {
				type :String
			}
		},

		data() : InputEmailInterface {
			return {
				input_value: '',
				input_type: 'password',
				input_required: false,
				is_valid : true,
				local_error : '',
				show_errors: false
			};
		},

		components: {
			IconEyeClosed,
			IconEye
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
			highlight_error() : boolean{
				return ((!this.is_valid && this.local_error === '' && this.show_errors) || (this.local_error !== '' && this.show_errors));
			}
		},

		methods: {
			validate() : boolean{
				
				//this.show_errors = false;
				/* validate here */
				
				if(this.input_required === true){
					
					if(this.input_value.length > 7){
						this.is_valid = true;
					}else{
						this.is_valid = false;
						this.show_errors = true;
					}
				}else{
					this.is_valid = true;
				}
			
				this.$emit('update:modelValue', this.input_value);
				this.$emit('is-valid', this.is_valid);
				return this.is_valid;
				
			},
			EmitModel(e:any) : void{	
				this.$emit('update:modelValue', this.input_value);
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
		}

	});

</script>