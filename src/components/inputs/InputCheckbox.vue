<template>
	<span class="">
		<span class="flex items-center gap-2">
			<div class="inline-flex items-center">
				<label class="flex items-center cursor-pointer relative">
					<br>
					<input type="checkbox" class="peer h-5 w-5 cursor-pointer transition-all border-1  hover:border-input-border-hover appearance-none rounded shadow " id="checkbox" v-model="input_value" @input="EmitModel" :class="{'border-red-500!':!is_valid && show_errors, 'border-white':border_white, 'checked:bg-transparent':!border_white, 'checked:bg-white':border_white,'border-deskmint-green':!border_white}" />
					<span class="absolute text-deskmint-green-dark opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" stroke-width="1">
						<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
					</svg>
					</span>
				</label>
			</div> 
			<label v-if="show_text" for="checkbox">Remember me</label>
		</span>
	</span>
</template>

<script lang="ts">

	export interface InputCheckboxInterface{
		input_value: boolean,
		input_type: string,
		input_required: boolean,
		is_valid: boolean,
		show_errors: boolean
	}

	import common from '../../helpers/common';

	import { defineComponent } from 'vue';

	export default defineComponent({

		name : 'InputCheckbox',

		props : {
			modelValue : {
				type:Boolean
			},
			required : {
				type:Boolean
			},
			error : {
				type :String
			},
			show_text: {
				type:Boolean
			},
			border_white: {
				type:Boolean
			}
		},

		data() : InputCheckboxInterface {
			return {
				input_value: false,
				input_type: 'password',
				input_required: false,
				is_valid : true,
				show_errors: false
			};
		},

		components: {
			
		},

		watch: {
			modelValue(newValue) {
        		this.input_value = newValue;
    		}
		},

		computed : {
			
		},

		methods: {
			validate() : boolean{
				
				
				
				if(this.input_required === true){
					
					if(this.input_value === true){
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
				this.input_value = e.target.checked;
				if(this.input_value){
					this.show_errors = false;
				}
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
			this.input_value = this.modelValue || false;
			
			
		}

	});

</script>