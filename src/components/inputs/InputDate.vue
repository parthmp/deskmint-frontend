<template>
	<div class="form-group">
		<label :for="text_id">{{ local_label }}</label>
		<vue-date-picker :id="text_id" :left="true" v-model="input_value" :enable-time-picker="false" format="dd-MMM-yyyy" position="left" @update:model-value="EmitModel" :class="{'red-input-order-div': ((local_error !== '' && show_errors) || (!is_valid && local_error === '' && show_errors))}"></vue-date-picker>
		<span v-if="(local_error !== '' && show_errors)" class="text-red-500! text-[14px]! block">{{ error }}</span>
	</div>
</template>
<style scoped>

</style>
<script lang="ts">

	export interface InputDateInterface{
		input_value: string,
		input_required: boolean,
		is_valid: boolean,
		local_error: string,
		show_errors: boolean,
		local_label: string
		local_placeholder: string
	}

	import common from '../../helpers/common';

	import VueDatePicker from '@vuepic/vue-datepicker';
	import '@vuepic/vue-datepicker/dist/main.css';

	import { defineComponent } from 'vue';

	export default defineComponent({

		name : 'InputDate',

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
			}
		},

		data() : InputDateInterface {
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
			VueDatePicker
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
			/*highlight_error() : boolean{
				return ((!this.is_valid && this.local_error === '' && this.show_errors) || (this.local_error !== '' && this.show_errors));
			},*/
			text_id() : string{
				let rand_number = common.random_number();
				return 'date_field_'+rand_number;
			}
		},

		methods: {
			validate() : boolean{
				
				if(this.input_required === true){
					
					if(this.input_value instanceof Date && !isNaN(this.input_value.getTime())){
						this.is_valid = true;
					}else{
						this.show_errors = true;
						this.is_valid = false;
					}

				}else{
					this.is_valid = true;
				}
			
				if(this.input_value instanceof Date && !isNaN(this.input_value.getTime())){
					let temp_value2 = this.input_value.toISOString();
					this.$emit('update:modelValue', temp_value2);
				}else{
					this.$emit('update:modelValue', '');
				}
				
				this.$emit('is-valid', this.is_valid);
				return this.is_valid;
				
			},
			EmitModel(e:any) : void{
				if(e !== null && e !== ''){
					let utc_date = e.toISOString();
					this.$emit('update:modelValue', utc_date);
				}else{
					this.$emit('update:modelValue', '');
				}
				
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
			this.input_value = this.modelValue?.trim() || '';
			
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