<template>
	<div class="form-group relative">
		<label :for="text_id">{{ local_label }}</label>
		<input type="text" :placeholder="local_placeholder" v-model="input_value" class="form-control" :id="text_id" @input="filterOptions" :class="{'red-input-order': (local_error !== '' && show_errors)}" @keydown="handleKeydown">
		<span v-if="(local_error !== '' && show_errors)" class="text-red-500! text-[14px]! block">{{ error }}</span>
		<div v-show="show_dropdown" class="autocomplete-area absolute top-16 bg-background-card w-full max-h-[300px] overflow-auto styled-scrollbar z-10">
			<ul>
				<li v-for="(option, key) in copy_options" :key="key" class="cursor-pointer pl-3 py-2 border-b-1 border-solid border-deskmint-green-light" @click="EmitModel(option)" :class="{'bg-deskmint-cyan text-white!': (active_index === key)}" :ref="el => option_refs[key] = el">{{ option.text }}</li>
			</ul>
		</div>
	</div>
</template>

<style scoped>


</style>

<script lang="ts">

	export interface InputTextInterface{
		input_value: string,
		input_required: boolean,
		is_valid: boolean,
		local_error: string,
		show_errors: boolean,
		local_label: string
		local_placeholder: string,
		copy_options: Array<object>,
		show_dropdown:boolean,
		active_index:number,
		option_refs: Array<string>,
		current_selected : object
	}

	import common from '../../helpers/common';

	import { defineComponent } from 'vue';

	export default defineComponent({

		name : 'InputAutoComplete',

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
			options: {
				type: Array<object>
			}
		},

		data() : InputTextInterface {
			return {
				input_value: '',
				input_required: false,
				is_valid : true,
				local_error : '',
				show_errors: false,
				local_label: '',
				local_placeholder:'',
				copy_options: [],
				show_dropdown: false,
				active_index: 0,
				option_refs: [],
				current_selected: {}
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
				return 'autocomplete_field_'+rand_number;
			}
		},

		methods: {
			validate() : boolean{
				
				//this.show_errors = false;
				/* validate here */
				
				if(this.input_required === true){
					
					/* test if value was selected or not */

					if(Object.keys(this.current_selected).length === 0 || this.input_value === ''){
						this.show_errors = true;
						this.is_valid = false;
					}else{
						this.is_valid = true;
					}
					
				}else{
					this.is_valid = true;
				}
				

				return this.is_valid;
				
			},
			EmitModel(e:any) : void{
				this.show_dropdown = false;
				this.input_value = e.text;
				this.$emit('update:modelValue', e);
				this.current_selected = e;
				this.emitSelected(e);
			},
			sanitizeInput(in_string:string) : string{
				return common.stripTags(in_string);
			},
			filterOptions() : void{
				this.show_dropdown = true;
				this.show_errors = false;
				if(this.input_value.trim() === ''){
					this.show_dropdown = false;
				}
				this.current_selected = {};
				this.emitSelected(this.current_selected);
				this.copy_options = this.options?.filter(option =>
					option.text.toLowerCase().includes(this.input_value.toLowerCase())
				);
				
			},
			emitSelected(obj:object) : void{
				this.current_selected = obj;
				this.$emit('selected', obj);
			},
			handleKeydown(e) : void{

				if(e.key === "ArrowDown"){
					e.preventDefault();
					if(this.active_index < this.copy_options.length - 1){
						this.active_index++;
					}
					this.scrollToActive();
				}else if(e.key === "ArrowUp"){
					e.preventDefault();
					if(this.active_index > 0){
						this.active_index--;
					}
					this.scrollToActive();
				}else if (e.key === "Enter"){
					e.preventDefault();
					if(this.active_index >= 0){
						this.selectOption(this.copy_options[this.active_index]);
					}
				}

			},
			selectOption(option:object) {
				this.input_value = option.text;
				this.copy_options = [];
				this.active_index = -1;
				this.emitSelected(option);
			},
			scrollToActive() {
				const el = this.option_refs[this.active_index]
				if(el){
					el.scrollIntoView({ block: 'nearest' })
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

			if(this.input_value !== ''){
				let option_id = parseInt(this.input_value);
				for(let z = 0 ; z < this.options?.length ; z++){
					if(this.options[z].value === option_id){
						this.current_selected = this.options[z];
						this.input_value = this.options[z].text;
						break;
					}
				}
			}
			
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
			if(common.isset(this.options)){
				this.copy_options = this.options;
			}
		}

	});

</script>