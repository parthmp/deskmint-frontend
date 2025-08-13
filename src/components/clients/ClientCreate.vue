<template>
	<section class="main-content">
    <div class="card">
        <h1 class="text-2xl!">Create a client</h1>
        <br>
       <!--<form @submit.prevent="createClient" class="form">

			<div class="grid grid-cols-12 gap-5">
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

			<input-button btn_text="Save" :disabled="btn_disabled" icon="IconCheck" class="lg:float-end"></input-button>
			<div class="clear-both"></div>

		</form>-->
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
	
	import { defineComponent } from 'vue';

	export interface ClientCreateInterface{
		data_loading:boolean,
		per_page:number,
		table_data:object,
		fields: Array<object>
	}
	
	export default defineComponent({
		name : 'ClientCreate',
		components : {

		},
		data(): ClientCreateInterface{
			return {
				data_loading : false,
				per_page: 15,
				table_data: {
					columns : [],
					rows: []
				},
				fields: []
			}
		},
		mixins: [RedirectToLoginForNoTokens],
		watch: {
			
		},
		methods : {
			
			fetchClientAreaFields() : void{

				api.get('manage-clients/fetch-clients-custom-fields').then((response) => {
					console.log(response);
				}).catch((error) => {});

			},

			createClient() : void{

			}
			
		},
		mounted : function(){
			
			this.fetchClientAreaFields();

		}

	});

</script>