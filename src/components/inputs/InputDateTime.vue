<template>
	<div class="form-group">
		<label :for="text_id">{{ local_label }}</label>
		<vue-date-picker :id="text_id" :left="true" v-model="input_value" :time-picker="time_picker_only" :enable-time-picker="time_picker" :is-24="false" :format="datetime_format" position="left" @update:model-value="EmitModel" :class="{'red-input-order-div': ((local_error !== '' && show_errors) || (!is_valid && local_error === '' && show_errors))}"></vue-date-picker>
		<span v-if="(local_error !== '' && show_errors)" class="text-red-500! text-[14px]! block">{{ error }}</span>
	</div>
</template>
<style scoped>

</style>
<script lang="ts">

	export interface InputDateTimeInterface{
		input_value: object,
		input_required: boolean,
		is_valid: boolean,
		local_error: string,
		show_errors: boolean,
		local_label: string
		local_placeholder: string,
		time_picker:boolean,
		time_picker_only:boolean,
		datetime_format: string
	}

	import common from '../../helpers/common';

	import VueDatePicker from '@vuepic/vue-datepicker';
	import '@vuepic/vue-datepicker/dist/main.css';

	import { defineComponent } from 'vue';

	export default defineComponent({

		name : 'InputDateTime',

		props : ['modelValue', 'required', 'error', 'label', 'mode'],

		data() : InputDateTimeInterface{
			return {
				input_value: {},
				input_required: false,
				is_valid : true,
				local_error : '',
				show_errors: false,
				local_label: '',
				local_placeholder:'',
				time_picker: true,
				time_picker_only: true,
				datetime_format: 'dd-MMM-yyyy p'
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
			
			},
			mode(): void{
				this.modding();
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
			
				if(this.input_value instanceof Date && !isNaN(this.input_value.getTime()) && (this.mode === 'date' || this.mode === 'datetime')){
					this.is_valid = true;
					let temp_value2 = this.input_value.toString();
					this.$emit('update:modelValue', temp_value2);
				}else{
					
					if(this.mode === 'time' && this.isValidTimeFormat(this.input_value)){

						this.is_valid = true;
						this.$emit('update:modelValue', this.input_value);

					}else{
						this.show_errors = true;
						this.is_valid = false;
						this.$emit('update:modelValue', '');
					}

					
				}
				
				this.$emit('is-valid', this.is_valid);
				return this.is_valid;
				
			},
			EmitModel(e:any) : void{
				if(e !== null && e !== '' && (this.mode === 'date' || this.mode === 'datetime')){
					let utc_date = e.toISOString();
					this.$emit('update:modelValue', utc_date);
				}else{
					this.$emit('update:modelValue', '');
				}
				
			},
			modding() : void{
				this.time_picker_only = false;
				if(this.mode === 'date'){
					this.time_picker = false;
					this.datetime_format = 'dd-MMM-yyyy';
				}else if(this.mode === 'datetime'){
					this.time_picker = true;
					this.datetime_format = 'dd-MMM-yyyy p';
				}else if(this.mode === 'time'){
					this.datetime_format = 'p';
					this.time_picker_only = true;
				}
			
			},
			isValidTimeFormat(obj:object) : boolean {
				if (!obj || typeof obj.hours !== 'number' || typeof obj.minutes !== 'number') return false;
  				return obj.hours >= 0 && obj.hours <= 23 && obj.minutes >= 0 && obj.minutes <= 59;
			},
			parseTimeString(time:string) : any{

				const match = time.match(/^(\d{1,2}):(\d{2}):(\d{2})$/);

				if(!match){
					return null;
				}

				const hours = parseInt(match[1], 10);
				const minutes = parseInt(match[2], 10);
				const seconds = parseInt(match[3], 10);

				if(hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59 && seconds >= 0 && seconds <= 59) {
					return { hours, minutes, seconds };
				}

				return null;

			},
			stringJsDate(str:string) : any{
				if(str === ''){ return ''; }
				const [datePart, timePart] = str.split(' ');
				const [year, month, day] = datePart.split('-').map(Number);

				if(this.mode === 'datetime'){
					const [hours, minutes, seconds] = timePart.split(':').map(Number);
					return new Date(year, month - 1, day, hours, minutes, seconds);
				}else{
					return new Date(year, month - 1, day);
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

			if(this.mode === 'time'){
				this.input_value = this.parseTimeString(this.modelValue) || '';
			}else{
				this.input_value = new Date(this.modelValue) || '';
			}
			
			
			this.local_error = '';
			if(common.isset(this.error)){
				this.local_error = this.error || '';
			}

			if(common.isset(this.label)){
				this.local_label = this.label+'';
			}

			this.modding();
		}

	});

</script>