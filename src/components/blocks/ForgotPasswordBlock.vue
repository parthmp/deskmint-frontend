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
					<p class="text-center">Please enter the email address below to reset the password.</p>
					
					<form @submit.prevent="sendForgotPasswordLink" class="form">
						<input-email :required="true" ref="forgot_pass_email" v-model="email_address.value"></input-email>
						<div class="form-group">
							<vue-turnstile :site-key="turnstile_key" ref="turnstile" :key="theme_name" :theme="theme_name" v-model="turnstile_token" size="flexible"></vue-turnstile>
						</div>
						<input-button :disabled="btn_disabled" :icon="'IconSend'" btn_text="Send"></input-button>
					</form>
					<input-button :disabled="false" @submit="loadLoginForm" :icon="'IconCaretLeft'" btn_text="Back to login"></input-button>
					
				</div>
			</div>
			<div class="col-span-12 lg:col-span-4"></div>
		</div>
		<br>
		<Footer></Footer>
	</div>
</template>

<script lang="ts">


	import { defineComponent } from 'vue';

	import ThemeChanger from '../UI/ThemeChanger.vue';
	import { useThemeOptions } from '../../stores/theme';
	import InputButton from '../inputs/InputButton.vue';
	import InputEmail from '../inputs/InputEmail.vue';
	import Footer from './Footer.vue';

	import { env } from '../../env';
	import VueTurnstile from 'vue-turnstile';
	import { toastEvents } from '../../events/toastEvents';
	import common from '../../helpers/common';
	import axios from 'axios';

	export interface ForgotPasswordBlockInterface{
		email_address:object,
		btn_disabled:boolean,
		turnstile_token:string,
		turnstile_key:string
	}

	export default defineComponent({
		name : 'ForgotPassword',
		components : {
			ThemeChanger,
			InputButton,
			InputEmail,
			VueTurnstile,
			Footer
		},
		data() : ForgotPasswordBlockInterface{
			return {
				email_address: {
					value: '',
					error: ''
				},
				btn_disabled: false,
				turnstile_token:'',
				turnstile_key: env.TURNSTILE_KEY,
			}
		},
		watch: {
			"email_address.value"() : void{
				this.$refs.forgot_pass_email.validate();
			}
		},
		computed: {
			theme_name() : string{
				return useThemeOptions().get_theme;
			}
		},
		methods : {
			sendForgotPasswordLink() : void{

				let valid_email = this.$refs.forgot_pass_email.validate();
				this.btn_disabled = true;
				if(this.turnstile_token === ''){
					this.btn_disabled = false;
					toastEvents.emit('toast', {
						type:'error',
						message: 'Make sure the captcha checkbox is checked'
					});
				}else{

					if(valid_email === true){

						common.getDeviceId((device:any) => {
							axios.post(env.API_URL+'send-reset-password-code', {
								email_address : this.email_address.value,
								turnstile_token: this.turnstile_token,
								device: device.identifier
							}).then((response) => {

								this.btn_disabled = false;
								this.$refs.turnstile.reset();
								this.turnstile_token = '';
								this.$emit('show_forgot_password', false);
								toastEvents.emit('toast', {
									type:'success',
									message: response.data.message
								});

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
						toastEvents.emit('toast', {
							type:'error',
							message: 'Invalid email entered'
						});
					}

				}

				



			},

			loadLoginForm() : void{
				this.$router.push('/');
			}
		},
		mounted : function(){

		}

	});

</script>