<template>
	<div class="container mx-auto! pl-[10px]! pr-[10px]!">
		
		<br>
		<theme-changer></theme-changer>
		<br>
		
		<div class="grid grid-cols-12 mt-[15px]!">
			<div class="col-span-12 lg:col-span-4"></div>
			<div class="col-span-12 lg:col-span-4">
				<div class="card p-12!">
					<application-logo></application-logo>
					<br>
					
					
					<p>Please enter your company name to continue</p>
					<br>
					<form @submit.prevent="saveCompanyName" class="form">
						
						<input-text label="Company name" prop_placeholder="Enter company name" :required="true" v-model="company_name.value" :error="company_name.error" ref="company_name"></input-text>
						
						<input-button :disabled="btn_disabled" :icon="'IconCaretRight'" btn_text="Next"></input-button>
						
					</form>
					
					
				</div>
			</div>
			<div class="col-span-12 lg:col-span-4"></div>
		</div>
	</div>
</template>
<style scoped>

@reference "tailwindcss/theme";

h3{
	@apply text-2xl text-center font-medium;
}
p{
	@apply text-left font-medium mt-2;
}

</style>
<script lang="ts">

	import { defineComponent } from 'vue';
	
	import ApplicationLogo from '../UI/ApplicationLogo.vue';


	import InputButton from '../inputs/InputButton.vue';
	import ThemeChanger from '../UI/ThemeChanger.vue';
	import InputText from '../inputs/InputText.vue';

	import { env } from '../../env';
	import common from '../../helpers/common';

	import { toastEvents } from '../../events/toastEvents';
	import LoginService from '../../services/LoginService';
	import { setCompanyId } from '../../services/TokenService';
	import api from '../../helpers/api';
	
	
	export interface ApiURLInterface{
		input_url: string,
		btn_disabled: boolean,
		company_name: object
	}

	export default defineComponent({

		name: 'AddNewCompany',

		data(): ApiURLInterface {
			return {
				input_url: '',
				btn_disabled: false,
				company_name: {
					value: '',
					error: ''
				}
			}
		},

		components:{
			ThemeChanger,
			InputButton,
			InputText,
			ApplicationLogo
		},

		computed : {
			
			
		
		},

		watch: {
			"company_name.value"() : void{
				let temp = this.$refs.company_name.validate();
				if(!temp){
					this.company_name.error = 'Please enter company name';
				}else{
					this.company_name.error = '';
				}
			}
		},

		methods : {
			
			saveCompanyName() : void{
				this.btn_disabled = true;
				let company_name_validity = this.$refs.company_name.validate();

				this.company_name.error = 'Please enter company name';

				if(!company_name_validity){
					this.btn_disabled = false;
					this.company_name.error = 'Please enter company name';
				}else{

					api.post('set-default-company', {
						'company_name':this.company_name.value
					}).then(response => {
						this.btn_disabled = false;
						setCompanyId(response.data.company_id).then(() => {
							this.$router.push('/panel');
						});
					}).catch((error) => {
						this.btn_disabled = false;
					});

				}
				
			}	
		},

		mounted(){
			LoginService.ifUserHasCompanyAdded((response: any) => {
				if(response.data.company_exists === true){

					this.$router.push('/panel');
					

				}
			});
		}


	});


</script>