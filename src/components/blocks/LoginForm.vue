<template>
	
	<div class="container mx-auto! pl-[10px]! pr-[10px]!">
		
		<br>
		<theme-changer></theme-changer>
		<br>
		<br>
		<div class="grid grid-cols-12 mt-[15px]!">
			<div class="col-span-12 lg:col-span-4"></div>
			<div class="col-span-12 lg:col-span-4">
				<div class="card p-12!">
					<div class="deskmint-logo flex justify-center">
						<img v-if="theme_name=='light'" src="./../../assets/images/deskmit-logo.svg" alt="">
						<img v-if="theme_name=='dark'" src="./../../assets/images/deskmit-logo-white.svg" alt="">
					</div>
					<br>
					
					<h3>Welcome to DeskMint! 👋</h3>
					<p>Please login to your account to manage your firm.</p>
					<br>

					<form @submit.prevent="login" class="form">
						<input-email v-model="email_address.value" :required="true" :error="email_address.error" ref="email_address"></input-email>
						<input-password v-model="password.value" :required="true" :error="password.error" ref="password"></input-password>
						<div class="form-group">
							<vue-turnstile :site-key="turnstile_key" ref="turnstile" :key="theme_name" :theme="theme_name" v-model="turnstile_token" size="flexible"></vue-turnstile>
						</div>
						<div class="flex flex-row items-center mt-[5px]!">
							<a href="" class="underline">Forgot Password?</a>
						</div>
						<input-button :disabled="btn_disabled" :icon="'IconLogin2'" btn_text="Login"></input-button>
					</form>
					
				</div>
			</div>
			<div class="col-span-12 lg:col-span-4"></div>
		</div>
		<br>
		<Footer></Footer>
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

	
	import { useThemeOptions } from '../../stores/theme';
	
	import { toastEvents } from '../../events/toastEvents';

	import InputButton from '../inputs/InputButton.vue';
	import InputEmail from '../inputs/InputEmail.vue';
	import InputPassword from '../inputs/InputPassword.vue';
	import InputCheckbox from '../inputs/InputCheckbox.vue';

	import VueTurnstile from 'vue-turnstile';

	import { env } from '../../env';
	import common from '../../helpers/common';

	import ThemeChanger from '../UI/ThemeChanger.vue';

	import Footer from './Footer.vue';
	
	
	import { defineComponent } from 'vue';
	import axios from 'axios';

	export interface myData{
		email_address: any,
		password: any,
		turnstile_token:string
		turnstile_key:string,
		remember_me:boolean,
		submit:boolean,
		custom_error: string,
		btn_disabled: boolean,
		pref_test_value: string,
		set_clicks:number,
		get_clicks:number
	}

	export default defineComponent({
		name : 'Login',
		components : {
			InputEmail,
			InputButton,
			InputPassword,
			VueTurnstile,
			InputCheckbox,
			ThemeChanger,
			Footer
		},
		data():myData
		{
			return {
				email_address: {
					value:'',
					error: '',
				},
				password: {
					input_type: 'password',
					value:'',
					error: ''
				},
				
				turnstile_token:'',
				turnstile_key: env.TURNSTILE_KEY,
				remember_me: false,
				submit: false,
				custom_error: '',
				btn_disabled : false,
				pref_test_value : '',
				set_clicks: 0,
				get_clicks: 0
			}
		},
		watch:{
			"email_address.value"() : void{
				this.$refs.email_address.validate();
			},
			"password.value"() : void{
				this.$refs.password.validate();
			}
		},
		computed: {
			theme_name() : string{
				return useThemeOptions().get_theme;
			}
		},
		methods : {

			is_email(email_add:string) : boolean{
				return common.is_email(email_add);
			},

			login() : void{

				
				console.log('submitted');
				this.btn_disabled = true;
				
				if(this.turnstile_token === ''){
					this.btn_disabled = false;
					toastEvents.emit('toast', {
						type:'error',
						message: 'Make sure the captcha checkbox is checked'
					});
				}else{

					let email_valid = this.$refs.email_address.validate();
					let password_valid = this.$refs.password.validate();

					if(email_valid === true && password_valid === true){

						console.log(this.email_address.value);
						console.log(this.password.value);
						
						common.getDeviceId((device:any) => {

							axios.post(env.API_URL+'login', {
								email_address : this.email_address.value,
								password: this.password.value,
								turnstile_token: this.turnstile_token,
								device: device.identifier
							}).then((response) => {
								this.btn_disabled = false;
								
								if(response.data.tfa === true){
									
									/* process for 2fa */
									toastEvents.emit('toast', {
										type:'success',
										message: response.data.message
									});
									this.$emit('two_factor_auth_event', response.data);

								}else{
									console.log(response);
								}

							}).catch((error) => {
								
								this.$refs.turnstile.reset();
								this.turnstile_token = '';
								this.btn_disabled = false;
								let error_message = 'Unknown error';

								if(error.response){
									
									let status = error.response.status;
									
									if(status === 422){
										error_message = error.response.data.message;
									}
								}else{

									error_message = 'Unable to connect to the server';

								}
								

								toastEvents.emit('toast', {
									type:'error',
									message: error_message
								});
							});

						


						});
			

					}else{
						this.btn_disabled = false;
					}
				}

				



			
				
				
				
			}
		}

	});

</script>