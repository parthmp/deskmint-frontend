<template>
	<section class="main-content">
    <div class="card">
        <h1 class="text-2xl!">Create a client</h1>
        <br>
        <!--<br>
		<input-multiselect :options="input_fields_options" label="multiselect example" :required="true" v-model="multiselect_temp.value" :error="multiselect_temp.error" ref="multiselect_test"></input-multiselect>
        <br>
        <br>
		<input-telephone v-model="phone.value" :required="false" label="Enter phone number" :error="phone.error" :prop_placeholder="'Enter phone'" ref="phone_input"></input-telephone>
		<div class="col-span-12 lg:col-span-6">
					<input-date-time label="Choose date" mode="date" :range="true" :required="true" v-model="temp_date" :error="temp_error" ref="temp_date"></input-date-time>
				</div>
				<div class="col-span-12 lg:col-span-6">
					<input-text label="test" v-model="temp_date2" :required="true" :error="temp_error2" ref="temp_date2"></input-text>
				</div>
			</div>-->
       <form @submit.prevent="createClient" class="form">
				
		<tabs :options="tab_options" :active_tab_index="active_tab_index">
			<template #tab-0>
				<div>Tab 1 Content</div>
				<br>
				<a href="javascript:;" @click="active_tab_index = 1">Set tab 2</a>
			</template>
			<template #tab-1>
				<div>Tab 2 Content</div>
				<button @click="active_tab_index = 0">Set tab 1</button>
			</template>
			<template #tab-2>
				<div>Tab 3 Content</div>
				<button @click="active_tab_index = 3">Set tab 4</button>
			</template>
			<template #tab-3>
				<div>Tab 4 Content</div>
				<button @click="active_tab_index = 2">Set tab 3</button>
			</template>
		</tabs>
		
		<!--	<div class="grid grid-cols-12 gap-5">
				<div class="col-span-12 lg:col-span-6">
					<input-text :required="true" label="Enter name" prop_placeholder="Enter name" v-model="name.value" :error="name.error" ref="name"></input-text>
				</div>
				<div class="col-span-12 lg:col-span-6">
					<input-email :required="true" v-model="email" ref="email"></input-email>
				</div>
			</div>
			
			<div class="grid grid-cols-12 gap-5 mt-[20px]">
				<div class="col-span-12 lg:col-span-6">
					<input-password :required="true" v-model="password" ref="password"></input-password>
				</div>
				<div class="col-span-12 lg:col-span-6">
					<input-password :required="true" v-model="confirm_password" ref="confirm_password" label="Confirm Password"></input-password>
				</div>
			</div>
		-->
			<input-button btn_text="Save" :disabled="btn_disabled" icon="IconCheck" class="lg:float-end"></input-button>
			<div class="clear-both"></div>

		</form>
    </div>
	
</section>
</template>
<style scoped>
	
</style>
<script lang="ts">


	import api from '../../helpers/api';
	import RedirectToLoginForNoTokens from '../../mixins/RedirectToLoginForNoTokens';
	import InputText from '../inputs/InputText.vue';
	import InputTextarea from '../inputs/InputTextarea.vue';
	import InputEmail from '../inputs/InputEmail.vue';
	import InputSelect from '../inputs/InputSelect.vue';
	import InputNumber from '../inputs/InputNumber.vue';
	import InputDateTime from '../inputs/InputDateTime.vue';
	import InputButton from '../inputs/InputButton.vue';
	import InputTelephone from '../inputs/InputTelephone.vue';
	import InputMultiselect from '../inputs/InputMultiselect.vue';
	import Tabs from '../UI/Tabs.vue';
	
	import { defineComponent } from 'vue';

	export interface ClientCreateInterface{
		btn_disabled:boolean,
		data_loading:boolean,
		per_page:number,
		table_data:object,
		fields: Array<object>,
		temp_date: any,
		temp_date2: string,
		temp_error: string,
		temp_error2: string,
		phone: object,
		input_fields_options: Array<object>,
		multiselect_temp : any,
		tab_options: Array<string>,
		active_tab_index: number
	}
	
	export default defineComponent({
		name : 'ClientCreate',
		components : {
			InputDateTime,
			InputButton,
			InputText,
			InputTelephone,
			InputMultiselect,
			Tabs
		},
		data(): ClientCreateInterface{
			return {
				btn_disabled: false,
				data_loading : false,
				per_page: 15,
				table_data: {
					columns : [],
					rows: []
				},
				fields: [],
				temp_date: '',
				temp_date2: '',
				temp_error: 'Test here',
				temp_error2: 'Test here',
				phone: {
					error: '',
					value: '+91852545122'
				},
				tab_options: ['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4'],
				active_tab_index: 0,
				input_fields_options: [
					{
						value : 'temp',
						text: 'display text 1'
					},
					{
						value : 'temp 2',
						text: 'display text 2'
					},
					{
						value : 'temp 3',
						text: 'display text 3'
					},
					{
						value : 'temp',
						text: 'display text 1'
					},
					{
						value : 'temp 2',
						text: 'display text 2'
					},
					{
						value : 'temp 3',
						text: 'display text 3'
					},
					{
						value : 'temp',
						text: 'display text 1'
					},
					{
						value : 'temp 2',
						text: 'display text 2'
					},
					{
						value : 'temp 3',
						text: 'display text 3'
					},
					{
						value : 'temp',
						text: 'display text 1'
					},
					{
						value : 'temp 2',
						text: 'display text 2'
					},
					{
						value : 'temp 3',
						text: 'display text 3'
					}
				],
				multiselect_temp : {
					value: [],
					error: '',
				}
				
			}
		},
		mixins: [RedirectToLoginForNoTokens],
		watch: {
			temp_date() : void{
				let validdate = this.$refs.temp_date.validate();
				console.log("=="+validdate+"==");
				if(validdate){
					this.temp_error = '';
				}else{
					this.temp_error = 'modified';
				}
			},

			"phone.value"() : void{

				let valid_phone = this.$refs.phone_input.validate();
				if(!valid_phone){
					this.phone.error = 'Enter valid phone number';
				}else{
					this.phone.error = '';
				}

			},

			
			"multiselect_temp.value"() : void{

				let valid_phone = this.$refs.multiselect_test.validate();
				if(!valid_phone){
					this.multiselect_temp.error = 'Select the fields';
				}else{
					this.multiselect_temp.error = '';
				}

			}
		},
		methods : {
			setTab(index:number) : void{
				this.active_tab_index = index;
			},
			fetchClientAreaFields() : void{

				api.get('manage-clients/fetch-clients-custom-fields').then((response) => {
					console.log(response);
				}).catch((error) => {});

			},
			createClient() : void{
				let validdate = this.$refs.temp_date.validate();
				console.log("==multiselect START ==");
				console.log(this.multiselect_temp);
				console.log("==multiselect END ==");

				let valid_ms = this.$refs.multiselect_test.validate();
				console.log(valid_ms);
				if(!valid_ms){
					this.multiselect_temp.error = 'Select the fields';
				}else{
					this.multiselect_temp.error = '';
				}
			}
			
		},
		mounted : function(){
			
			this.fetchClientAreaFields();

		}

	});

</script>