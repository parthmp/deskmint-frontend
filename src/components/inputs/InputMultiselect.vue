<template>
	<div class="form-group">
		<label :for="text_id">{{ local_label }}</label>
		<select multiple="true" :id="text_id" v-model="input_value" @change="EmitModel" class="styled-scrollbar" :class="{'red-input-order': ((local_error !== '' && show_errors) || (!is_valid && local_error === '' && show_errors))}">
			<option v-for="(option, z) in options" :key="z" :value="option.value+''">{{ option.text+'' }}</option>
		</select>
		<span v-if="(!is_valid && local_error === '' && show_errors)" class="text-red-500! text-[14px]! block">{{ local_label }} is a required field.</span>
		<span v-if="(local_error !== '' && show_errors)" class="text-red-500! text-[14px]! block">{{ error }}</span>
	</div>
</template>

<script lang="ts">

	export interface InputMultiselectInterface{
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

		name : 'InputMultiselect',

		props : {
			modelValue : {
				type:Array
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
			options:{
				type:Array<Object>
			}
		},

		data() : InputMultiselectInterface {
			return {
				input_value: [],
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
				let rand_number = common.random_number();
				return 'text_field_'+rand_number;
			}
		},

		methods: {
			validate() : boolean{
			
				/* validate here */

				if(this.input_required === false){
					this.is_valid = true;
					return this.is_valid;
				}

				this.is_valid = false;
				this.show_errors = true;

				for(let z = 0 ; z < this.input_value.length ; z++){

					let temp = this.sanitizeInput(this.input_value[z]).trim();
					if(temp !== ''){
						this.is_valid = true;
						this.show_errors = false;
						break;
					}

				}

				return this.is_valid;
				
			},
			EmitModel(e:any) : void{
				this.sanitizeMultiple((temp_input_value:any) => {
					this.$emit('update:modelValue', temp_input_value);
				});
			},
			sanitizeInput(in_string:string) : string{
				return common.stripTags(in_string);
			},

			sanitizeMultiple(callback:any) : void{
				for(let z = 0 ; z < this.input_value.lenghth ; z++){
					this.input_value[z] = this.sanitizeInput(this.input_value[z]);
				}
				callback(this.input_value);
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

		}

	});

</script>