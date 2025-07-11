<template>
	<span class="">
		<span class="flex items-center gap-2">
			<div class="checkbox-wrapper">
				<label>
					<input type="checkbox" v-model="input_value" id="checkbox" @input="EmitModel" />
					<span class="checkbox" :class="{'border-red-500!':!is_valid && show_errors}"></span>
				</label>
			</div>
			<label for="checkbox">Remember me</label>
		</span>
	</span>
</template>

<script lang="ts">

	export interface InputEmailInterface{
		input_value: boolean,
		input_type: string,
		input_required: boolean,
		is_valid: boolean,
		show_errors: boolean
	}

	import common from '../../helpers/common';

	import { defineComponent } from 'vue';

	export default defineComponent({

		name : 'InputCheckboxOld',

		props : {
			modelValue : {
				type:Boolean
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