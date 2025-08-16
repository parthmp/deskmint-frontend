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
				
		<tabs :options="tab_options" :active_tab_index="active_tab_index" @tab-changed="changeActiveTabValue" :disable_further="true">
			<template v-slot:tab-0>

				<div class="lg:grid lg:grid-cols-12 gap-5">
					<div class="lg:col-span-4">
						<input-text :required="true" label="Enter first name" prop_placeholder="First name" v-model="client_first_name.value" :error="client_first_name.error" ref="name"></input-text>
					</div>
					<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
						<input-text :required="true" label="Enter last name" prop_placeholder="Last name" v-model="client_last_name.value" :error="client_last_name.error" ref="name"></input-text>
					</div>
					<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
						<input-text :required="false" label="GST/Tax number" prop_placeholder="GST/Tax number" v-model="client_tax_id.value" :error="client_tax_id.error" ref="name"></input-text>
					</div>
				</div>

				<div class="lg:grid lg:grid-cols-12 gap-5">
					<div class="lg:col-span-6 mt-[20px]">
						<inputURL :required="false" label="Website" prop_placeholder="Enter website" v-model="client_first_name.value" :error="client_first_name.error" ref="name"></inputURL>
					</div>
					<div class="lg:col-span-6 mt-[20px]">
						<input-telephone v-model="client_phone.value" :required="false" label="Enter phone number" :error="client_phone.error" :prop_placeholder="'Enter phone'" ref="phone_input"></input-telephone>
					</div>
				</div>

				<input-button btn_text="Next" @click="active_tab_index = 1" icon="IconCaretRight" class="lg:float-end"></input-button>
				<div class="clear-both"></div>

			</template>
			<template v-slot:tab-1>
				<div>Tab 2 Content</div>
				<button @click="active_tab_index = 0">Set tab 1</button>
			</template>
			<template v-slot:tab-2>
				<div>Tab 3 Content</div>
				<button @click="active_tab_index = 3">Set tab 4</button>
			</template>
			<template v-slot:tab-3>
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
	import InputButton from '../inputs/InputButton.vue';
	import InputTelephone from '../inputs/InputTelephone.vue';
	import InputURL from '../inputs/InputURL.vue';

	import Tabs from '../UI/Tabs.vue';
	
	import { defineComponent } from 'vue';

	export interface ClientCreateInterface{
		btn_disabled:boolean,
		data_loading:boolean,
		per_page:number,
		table_data:object,
		fields: Array<object>,
		tab_options: Array<string>,
		active_tab_index: number,
		client_first_name: object,
		client_last_name: object,
		client_tax_id: object,
		client_phone: object,
	}
	
	export default defineComponent({
		name : 'ClientCreate',
		components : {
			InputButton,
			InputText,
			InputTelephone,
			InputURL,
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
				tab_options: ['Personal info', 'Contact info', 'Billing info', 'Custom fields', 'Settings'],
				active_tab_index: 0,
				client_first_name : {
					value: '',
					error: 'First name is required'
				},
				client_last_name : {
					value: '',
					error: 'Last name is required'
				},
				client_tax_id : {
					value: '',
					error: 'Last name is required'
				},
				client_phone : {
					value: '',
					error: 'Phone number is required'
				}
				
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
				
			},
			changeActiveTabValue(index:number) : void{
				this.active_tab_index = index;
			}
			
		},
		mounted : function(){
			
			this.fetchClientAreaFields();

		}

	});

</script>