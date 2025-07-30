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
					
					<application-logo></application-logo>
				
					<input-button :disabled="false" :icon="'IconCaretLeft'" @submit="loadLoginForm" btn_text="Back to Login"></input-button>
					<br>
					<p class="text-center">Please enter the OTP below.</p>
					
					<form @submit.prevent="validateOTP" class="form">
						<input-number ref="otpinput" placeholder="Enter OTP" :min="100000" :max="999999" v-model="entered_otp.value" :error="entered_otp.error" :required="true"  field_name="Enter OTP"></input-number>
						<input-button :disabled="btn_disabled" :icon="'IconLogin2'" btn_text="Login"></input-button>
					</form>
					<input-button :disabled="btn_disabled_resent_otp" :icon="'IconRepeat'" @submit="resendOTP" btn_text="Resend OTP"></input-button>
					
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
	import Footer from './Footer.vue';

	import InputNumber from '../inputs/InputNumber.vue';
	import axios from 'axios';
	import { env } from '../../env';
	import common from '../../helpers/common';
	import { toastEvents } from '../../events/toastEvents';

	
	import ApplicationLogo from '../UI/ApplicationLogo.vue';

	import LoginService from '../../services/LoginService';

	import { setAccessToken, setRefreshToken } from './../../services/TokenService';
	import { getCompanyId, setCompanyId } from '../../services/CompanyService';

	export interface TwoFactorAuthInterFace{
		btn_disabled:boolean,
		entered_otp: object,
		local_token: string,
		btn_disabled_resent_otp:boolean
	}

	export default defineComponent({
		name : 'TwoFactorAuth',
		components : {
			ThemeChanger,
			InputButton,
			Footer,
			ApplicationLogo,
			InputNumber
		},
		data(): TwoFactorAuthInterFace {
			return {
				btn_disabled: false,
				entered_otp: {
					value: null,
					error: 'Please enter valid OTP'
				},
				local_token: '',
				btn_disabled_resent_otp: false
			}
		},
		props: {
			token : {
				type:String
			}
		},
		computed: {
			theme_name() : string{
				return useThemeOptions().get_theme;
			}
		},
		watch: {
			"entered_otp.value"() : void{
				let validotp = this.$refs.otpinput.validate();
				if(validotp){
					this.entered_otp.error = '';
				}
			},
			token() : void{
				this.local_token = this.token+'';
			}
		},
		methods : {

			validateOTP() : void{
				
				this.btn_disabled = true;

				let validotp = this.$refs.otpinput.validate();

				if(validotp === true){
					
					this.entered_otp.error = '';

					common.getDeviceId((device:any) => {

						axios.post(env.API_URL+'validate-otp', {
							token: this.local_token,
							device: device.identifier,
							otp:this.entered_otp.value
						}).then((response) => {
							
							this.btn_disabled = false;
							/*
							let key = 'access_token';
							let value = response.data.token;
							SecureStoragePlugin.set({ key, value });

							key = 'refresh_token';
							value = response.data.refresh_token;
							SecureStoragePlugin.set({ key, value });
							*/
							(async () => {
							try {
									await setAccessToken(response.data.token);
									await setRefreshToken(response.data.refresh_token);

									toastEvents.emit('toast', {
										type: 'success',
										message: 'Login successful'
									});

									LoginService.ifUserHasCompanyAdded((response: any) => {
										if(response.data.company_exists === true){

											

											/* set default company */
											setCompanyId(response.data.company_id).then(() => {
												this.$router.push('/panel');
											});
											

										}else{
											this.$router.push('/add-company');
										}
									});

								} catch (e) {
									console.error('Token storage failed:', e);
								}
							})();
							

							

						}).catch((error) => {
							this.btn_disabled = false;
							let error_message = 'Unknown error';

							if(error.response){

								error_message = error.response.data.message;
								
								if(error.response.status == 500){
									
									this.loadLoginForm();
								}

							}else{
								error_message = 'Unable to connect to the server'
							}
							
							toastEvents.emit('toast', {
								type: 'error',
								message: error_message
							});

						});

					})

				}else{
					this.btn_disabled = false;
				}

			},

			loadLoginForm() : void{
				this.$emit('load_login_form', true);
			},

			resendOTP() : void{
				this.btn_disabled_resent_otp = true;
				common.getDeviceId((device:any) => {

					axios.post(env.API_URL+'resend-otp', {
						token: this.local_token,
						device: device.identifier
					}).then((response) => {
						
						this.btn_disabled_resent_otp = false;
						
						this.local_token = response.data.token;
						
						toastEvents.emit('toast', {
							type: 'success',
							message: response.data.message
						});

					}).catch((error) => {
						this.btn_disabled_resent_otp = false;
						let error_message = 'Unknown error';

						if(error.response){
							error_message = error.response.data.message;
							

							if(error.response.status == 500){
								this.loadLoginForm();
							}
						}else{
							error_message = 'Unable to connect to the server'
						}
						
						toastEvents.emit('toast', {
							type: 'error',
							message: error_message
						});

					});

				});

				
			}
			
		},
		mounted : function(){
			
			if(common.isset(this.token)){
				this.local_token = this.token+'';
			}

		}

	});

</script>