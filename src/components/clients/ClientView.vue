<template>
	<section class="main-content">
		<div class="card">
			
			<h1 class="text-2xl!">View Client</h1>
			<input-button class="lg:float-start" btn_text="Back" url="/clients" icon="IconCaretLeft"></input-button>
			<div class="clear-both"></div>
       
			<br>
			<tabs :horizontal="tabs_horizontal" :options="tab_options">
				<template v-slot:tab-0>
					<client-view-info-skeleton v-if="data_loading"></client-view-info-skeleton>
					<div v-if="!data_loading">
						<div>
							<h2 class="text-xl!">Personal info</h2>
							<br>
							<div class="lg:grid lg:grid-cols-12 gap-5">
								<div class="lg:col-span-4">
									<p>First name: {{ client_data?.client_info?.first_name }}</p>
								</div>
								<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
									<p>Last name: {{ client_data?.client_info?.last_name }}</p>
								</div>
								<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
									<p>GST/Tax #: {{ client_data?.client_info?.tax_number }}</p>
								</div>
							</div>

							<div class="lg:grid lg:grid-cols-12 gap-5">
								<div class="lg:col-span-4 mt-[20px]">
									<p>Website: {{ client_data?.client_info?.website }}</p>
								</div>
								<div class="lg:col-span-4 mt-[20px]">
									<p>Email: {{ client_data?.client_info?.email }}</p>
								</div>
								<div class="lg:col-span-4 mt-[20px]">
									<p>Phone: {{ client_data?.client_info?.phone }}</p>
								</div>
							</div>
							<br>
							<br>
						</div>
						<div>
							<h2 class="text-xl!">Contact info</h2>
							<br>
							<span v-for="(contact_info, key) in client_data?.contact_info" :key="contact_info.id">
								<div class="lg:grid lg:grid-cols-12 gap-5">
									<div class="lg:col-span-6">
										<p>First name: {{ contact_info?.first_name }}</p>
									</div>
									<div class="lg:col-span-6">
										<p>Last name: {{ contact_info?.last_name }}</p>
									</div>
									
								</div>

								<div class="lg:grid lg:grid-cols-12 gap-5 mb-[25px]">
									<div class="lg:col-span-6 mt-[20px]">
										<p>Email: {{ contact_info?.email }}</p>
									</div>
									<div class="lg:col-span-6 mt-[20px]">
										<p>Phone: {{ contact_info?.phone }}</p>
									</div>
								</div>
							</span>
							<br>
							<br>
						</div>
						<div>
							<h2 class="text-xl!">Billing info</h2>
							<br>
							<div class="lg:grid lg:grid-cols-12 gap-5">
								<div class="lg:col-span-4 mt-[5px]">
									<p>Street: {{ client_data?.client_info?.billing_street }}</p>
								</div>
								<div class="lg:col-span-4 mt-[5px]">
									<p>Apt: {{ client_data?.client_info?.billing_apt }}</p>
								</div>
								<div class="lg:col-span-4 mt-[5px]">
									<p>City: {{ client_data?.client_info?.billing_city }}</p>
								</div>
							</div>
							<div class="lg:grid lg:grid-cols-12 gap-5">
								<div class="lg:col-span-4 mt-[20px]">
									<p>State: {{ client_data?.client_info?.billing_state }}</p>
								</div>
								<div class="lg:col-span-4 mt-[20px]">
									<p>Postal code: {{ client_data?.client_info?.billing_postal_code }}</p>
								</div>
								<div class="lg:col-span-4 mt-[20px]">
									<p>Country: {{ client_data?.client_info?.billing_country?.country_name }}</p>
								</div>
							</div>
							<br>
							<br>
						</div>
						<div>
							<h2 class="text-xl!">Shipping info</h2>
							<br>
							<div class="lg:grid lg:grid-cols-12 gap-5">
								<div class="lg:col-span-4 mt-[5px]">
									<p>Street: {{ client_data?.client_info?.shipping_street }}</p>
								</div>
								<div class="lg:col-span-4 mt-[5px]">
									<p>Apt: {{ client_data?.client_info?.shipping_apt }}</p>
								</div>
								<div class="lg:col-span-4 mt-[5px]">
									<p>City: {{ client_data?.client_info?.shipping_city }}</p>
								</div>
							</div>
							<div class="lg:grid lg:grid-cols-12 gap-5">
								<div class="lg:col-span-4 mt-[20px]">
									<p>State: {{ client_data?.client_info?.shipping_state }}</p>
								</div>
								<div class="lg:col-span-4 mt-[20px]">
									<p>Postal code: {{ client_data?.client_info?.shipping_postal_code }}</p>
								</div>
								<div class="lg:col-span-4 mt-[20px]">
									<p>Country: {{ client_data?.client_info?.shipping_country?.country_name }}</p>
								</div>
							</div>
							<br>
							<br>
						</div>
						<div>
							<h2 class="text-xl!">Custom fields</h2>
							<br>
							<div class="lg:grid lg:grid-cols-12 gap-5">
								<div v-for="(field, key) in custom_fields" :key="key" :class="{'lg:col-span-12' : (field.span === 12), 'lg:col-span-6' : (field.span === 6), 'lg:col-span-4' : (field.span === 4)}">
									<div>
										<p>{{ field.label }}: {{ field.value }}</p>
									</div>
								</div>
								
							</div>
							<br>
							<br>
						</div>
						<div>
							<h2 class="text-xl!">Settings</h2>
							<br>
							<div class="lg:grid lg:grid-cols-12 gap-5">
								<div class="lg:col-span-4 mt-[5px]">
									<p>Currency: {{ client_data?.client_info?.currency?.currency }} - {{ client_data?.client_info?.currency?.code }}</p>
								</div>
								<div class="lg:col-span-4 mt-[5px]">
									<p>Payment terms: {{ client_data?.client_info?.payment_terms }} Days</p>
								</div>
								<div class="lg:col-span-4 mt-[5px]">
									<p>Quote valid till: {{ client_data?.client_info?.quote_valid_days }} Days</p>
								</div>
							</div>

							<div class="lg:grid lg:grid-cols-12 gap-5">
								<div class="lg:col-span-4 mt-[20px]">
									<p>Send reminders:  {{ client_data?.client_info?.send_reminders === 1 ? 'Yes' : 'No' }}</p>
								</div>
								<div class="lg:col-span-4 mt-[20px]">
									<p>Size:  {{ client_data?.client_info?.size }}</p>
								</div>
								<div class="lg:col-span-4 mt-[20px]">
									<p>Industry:  {{ client_data?.client_info?.industry?.industry_name }}</p>
								</div>
							</div>
							<br>
							<br>
						</div>
					</div>
				</template>
				<template v-slot:tab-1>
					<div>Client invoices goes here</div>
				</template>
			</tabs>
		</div>
	</section>
</template>

<script lang="ts">


	import { defineComponent } from 'vue';
	
	import RedirectToLoginForNoTokens from '../../mixins/RedirectToLoginForNoTokens';
	import Tabs from '../UI/Tabs.vue';
	import api from '../../helpers/api';
	import common from '../../helpers/common';
	import ClientViewInfoSkeleton from '../skeletons/ClientViewInfoSkeleton.vue';
	import InputButton from '../inputs/InputButton.vue';


	export interface ClientViewInterface{
		tab_options: Array<string>,
		tabs_horizontal: boolean,
		client_data: object,
		data_loading:boolean,
		custom_fields: Array<object>
	}

	export default defineComponent({
		name : 'ClientView',
		mixins: [RedirectToLoginForNoTokens],
		components : {
			Tabs,
			ClientViewInfoSkeleton,
			InputButton
		},
		data(): ClientViewInterface{
			return {
				tab_options: ['Client Info', 'Invoices'],
				tabs_horizontal: false,
				client_data: {},
				data_loading: false,
				custom_fields: []
			}
		},
		methods : {

			fetchClientData(id:number) : void{
				this.data_loading = true;
				api.get('manage-clients/'+id).then((response) => {
					this.client_data = response.data;
					console.log(this.client_data);
					this.fetchClientAreaFields(this.client_data.custom_fields);
				}).catch((error) => {

				});

			},

			fetchClientAreaFields(fillers:Array<object> = []) : void{
				
				api.get('manage-clients/fetch-clients-custom-fields').then((response) => {

					this.custom_fields = response.data;
					
					for(let z = 0 ; z < this.custom_fields.length ; z++){
						
							for(let x = 0 ; x < fillers.length ; x++){
								if(fillers[x].clients_custom_field_id === this.custom_fields[z].id){
									this.custom_fields[z].value_id = fillers[x].id;
									if(fillers[x].clients_custom_field.custom_field_type.input_type === 'multiselect'){
										this.custom_fields[z].value = JSON.parse(fillers[x].field_value).join(', ');
									}else{
										if(fillers[x].clients_custom_field.custom_field_type.input_type === 'time'){
											this.custom_fields[z].value = fillers[x].field_value;
										}else if(fillers[x].clients_custom_field.custom_field_type.input_type === 'select'){
											this.custom_fields[z].value = fillers[x].field_value+'';
										}else if(fillers[x].clients_custom_field.custom_field_type.input_type === 'datetime'){
											this.custom_fields[z].value = common.formatDate(fillers[x].field_value+'');
										}else if(fillers[x].clients_custom_field.custom_field_type.input_type === 'date'){
											this.custom_fields[z].value = common.formatDate(fillers[x].field_value+'', true);
										}else{
											this.custom_fields[z].value = fillers[x].field_value;
										}
										
									}
									
								}
							}

					}
					console.log(this.custom_fields);
					this.data_loading = false;
				}).catch((error) => {});

			}
			
		},
		mounted : function(){
			this.fetchClientData(this.$route.params.id);
		}

	});

</script>