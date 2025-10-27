<template>
	<div class="form-group relative">
		<label :for="text_id">{{ local_label }}</label>
		<input 
			type="text" 
			:placeholder="local_placeholder" 
			v-model="input_value" 
			class="form-control" 
			:id="text_id" 
			@input="filterOptions" 
			:class="{'red-input-order': (local_error !== '' && local_show_errors)}" 
			@keydown="handleKeydown"
			ref="inputRef"
			@focus="updateDropdownPosition"
			@blur="handleBlur">
		
		<span v-if="(local_error !== '' && local_show_errors)" class="text-red-500! text-[14px]! block">{{ error }}</span>
		<p v-if="endpoint && ajax_loading">{{ ajax_loading_text }}</p>
		
		<!-- Teleport dropdown to body to avoid overflow clipping -->
		<Teleport to="#autocomplete-portal">
			<div 
				v-show="show_dropdown" 
				class="autocomplete-area absolute bg-background-card w-full max-h-[300px] overflow-auto styled-scrollbar z-[9999]"
				:style="dropdown_style">
				<ul>
					<li 
						v-for="(option, key) in copy_options" 
						:key="key" 
						class="cursor-pointer pl-3 py-2 border-b-1 border-solid border-deskmint-green-light" 
						@mousedown.prevent="EmitModel(option)" 
						:class="{'bg-deskmint-cyan text-white!': (active_index === key)}" 
						:ref="el => option_refs[key] = el">
						{{ option.text }}
					</li>
				</ul>
			</div>
		</Teleport>
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
		local_show_errors: boolean,
		local_label: string
		local_placeholder: string,
		copy_options: Array<object>,
		show_dropdown:boolean,
		active_index:number,
		option_refs: Array<string>,
		current_selected : object,
		ajax_loading: boolean,
		ajax_loading_text: string,
		dropdown_style: object
	}

	import api from '../../helpers/api';
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
			placeholder: {
				type:String
			},
			options: {
				type: Array<object>
			},
			endpoint : {
				type:String
			},
			show_errors : {
				type: Boolean
			},
			addnew : {
				type:String
			}
		},

		data() : InputTextInterface {
			return {
				input_value: '',
				input_required: false,
				is_valid : true,
				local_error : '',
				local_show_errors: false,
				local_label: '',
				local_placeholder:'',
				copy_options: [],
				show_dropdown: false,
				active_index: 0,
				option_refs: [],
				current_selected: {},
				ajax_loading: false,
				ajax_loading_text: '',
				dropdown_style: {}
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
				this.setModelValue();
			},
			show_errors () : void {
				if(common.isset(this.show_errors)){
					this.local_show_errors = this.show_errors;
				}
			},
			show_dropdown(newVal) : void {
				if(newVal){
					this.updateDropdownPosition();
					window.addEventListener('scroll', this.updateDropdownPosition, true);
					window.addEventListener('resize', this.updateDropdownPosition);
				} else {
					window.removeEventListener('scroll', this.updateDropdownPosition, true);
					window.removeEventListener('resize', this.updateDropdownPosition);
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

			updateDropdownPosition() : void {
				this.$nextTick(() => {
					const input = this.$refs.inputRef as HTMLElement;
					if(input){
						const rect = input.getBoundingClientRect();
						this.dropdown_style = {
							top: `${rect.bottom + window.scrollY}px`,
							left: `${rect.left + window.scrollX}px`,
							width: `${rect.width}px`
						};
					}
				});
			},

			handleBlur() : void {
				// Delay to allow click events on dropdown items to fire
				setTimeout(() => {
					this.show_dropdown = false;
				}, 150);
			},

			setModelValue() : void{
				
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
			},

			validate() : boolean{
				
				if(this.input_required === true){
					
					if(Object.keys(this.current_selected).length === 0 || this.input_value === ''){
						this.local_show_errors = true;
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
				this.current_selected = e;
				this.emitSelected(e);
			},
			sanitizeInput(in_string:string) : string{
				return common.stripTags(in_string);
			},
			filterOptions() : void{

				if(common.isset(this.endpoint)){
					this.emitSelected({});
					this.ajax_loading = true;
					this.show_dropdown = false;
					if(this.input_value.trim().length < 3){
						this.ajax_loading_text = 'Please enter at least 3 characters to search';
					}else{
						this.ajax_loading_text = 'Loading...';
						api.get(this.endpoint+'', {
							params: {
								searched : this.input_value.trim()
							}
						}).then(response => {
							this.show_dropdown = true;
							//this.local_show_errors = false;
							this.copy_options = response.data;
							this.updateDropdownPosition();
						}).finally(() => {
							this.ajax_loading = false;
							this.ajax_loading_text = '';
							
						});
					}
				}else{
					this.show_dropdown = true;
					this.local_show_errors = false;
					if(this.input_value.trim() === ''){
						this.show_dropdown = false;
					}
					this.current_selected = {};
					this.emitSelected(this.current_selected);
					this.copy_options = this.options?.filter(option =>
						option.text.toLowerCase().includes(this.input_value.toLowerCase())
					);
					this.updateDropdownPosition();
				}
				
				//this.$emit('update:modelValue', this.input_value);
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
			
			this.setModelValue();
			
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

			if(common.isset(this.placeholder)){
				this.local_placeholder = this.placeholder+'';
			}

			if(common.isset(this.options)){
				this.copy_options = this.options;
			}

			if(common.isset(this.show_errors)){
				this.local_show_errors = this.show_errors;
			}
		},

		beforeUnmount() {
			// Clean up event listeners
			window.removeEventListener('scroll', this.updateDropdownPosition, true);
			window.removeEventListener('resize', this.updateDropdownPosition);
		}

	});

</script>