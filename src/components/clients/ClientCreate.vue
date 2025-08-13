<template>
	<section class="main-content">
    <div class="card">
        <h1 class="text-2xl!">Create a client</h1>
        <br>
		
       <form @submit.prevent="createClient" class="form">
		<div class="grid grid-cols-12 gap-5">
				<div class="col-span-12 lg:col-span-6">
					<input-date-time label="Choose date" mode="date" :required="true" v-model="temp_date" :error="temp_error" ref="temp_date"></input-date-time>
				</div>
				<div class="col-span-12 lg:col-span-6">
					<input-text label="test" v-model="temp_date2" :required="true" :error="temp_error2" ref="temp_date2"></input-text>
				</div>
			</div>
		
		
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
	
	import { defineComponent } from 'vue';

	export interface ClientCreateInterface{
		btn_disabled:boolean,
		data_loading:boolean,
		per_page:number,
		table_data:object,
		fields: Array<object>,
		temp_date: string,
		temp_date2: string,
		temp_error: string,
		temp_error2: string
	}
	
	export default defineComponent({
		name : 'ClientCreate',
		components : {
			InputDateTime,
			InputButton,
			InputText
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
				temp_date: '2025-06-15T00:00:00Z',
				temp_date2: '',
				temp_error: 'Test here',
				temp_error2: 'Test here'
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
			}
		},
		methods : {
			
			fetchClientAreaFields() : void{

				api.get('manage-clients/fetch-clients-custom-fields').then((response) => {
					console.log(response);
				}).catch((error) => {});

			},

			createClient() : void{
				let validdate = this.$refs.temp_date.validate();
				console.log("=="+validdate+" START ==");
				console.log(this.temp_date);
				console.log("=="+validdate+" END ==");
			}
			
		},
		mounted : function(){
			
			this.fetchClientAreaFields();

		}

	});

</script>