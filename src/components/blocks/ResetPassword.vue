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
					
					<br>
					<p class="text-center">Please enter password reset code below from sent email and the new password to reset the password for your account.</p>
					
					<form @submit.prevent="changePassword" class="form">
						<input-text label="Reset code" prop_placeholder="Enter reset code" :required="true" v-model="reset_code.value" :error="reset_code.error" ref="reset_code"></input-text>
						<input-password v-model="password.value" :required="true" :error="password.error" ref="password"></input-password>
						<input-password label="Retype Password" v-model="retype_password.value" :required="true" :error="retype_password.error" ref="retype_password"></input-password>
						<input-button :disabled="btn_disabled" :icon="'IconKey'" btn_text="Change Password"></input-button>
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
	import InputText from '../inputs/InputText.vue';
	import InputPassword from '../inputs/InputPassword.vue';
	import Footer from './Footer.vue';

	import { env } from '../../env';
	
	import { toastEvents } from '../../events/toastEvents';
	import common from '../../helpers/common';
	import ApplicationLogo from '../UI/ApplicationLogo.vue';
	import axios from 'axios';

	export interface ForgotPasswordBlockInterface{
		reset_code:object,
		password: object,
		retype_password: object,
		btn_disabled:boolean
	}

	export default defineComponent({
		name : 'ForgotPassword',
		components : {
			ThemeChanger,
			InputButton,
			InputPassword,
			InputText,
			ApplicationLogo,
			Footer
		},
		data() : ForgotPasswordBlockInterface{
			return {
				reset_code: {
					value: '',
					error: ''
				},
				password: {
					value: '',
					error: ''
				},
				retype_password: {
					value: '',
					error: ''
				},
				btn_disabled: false
			}
		},
		watch: {
			"reset_code.value"() : void{
				let temp = this.$refs.reset_code.validate();
				if(!temp){
					this.reset_code.error = 'Please enter reset code';
				}else{
					this.reset_code.error = '';
				}
			},
			"password.value"() : void{
				this.$refs.password.validate();
			},
			"retype_password.value"() : void{
				this.$refs.retype_password.validate();
			}
		},
		computed: {
			theme_name() : string{
				return useThemeOptions().get_theme;
			}
		},
		methods : {
			
			changePassword() : void{

				this.btn_disabled = true;

				let reset_code_valid = this.$refs.reset_code.validate();
				let password_valid = this.$refs.password.validate();
				let retype_password_valid = this.$refs.retype_password.validate();

				if(!reset_code_valid){
					this.reset_code.error = 'Please enter reset code';
				}
				
				if(reset_code_valid && password_valid && retype_password_valid){
					
					if(this.password.value !== this.retype_password.value){
						this.btn_disabled = false;
						toastEvents.emit('toast', {
							type:'error',
							message: 'Password and Retype passwords do not match'
						});

					}else{

						common.getDeviceId((device:any) => {
							axios.post(env.API_URL+'reset-password', {
								reset_code : this.reset_code.value,
								password: this.password.value,
								retype_password: this.retype_password.value,
								device: device.identifier
							}).then((response) => {

								this.btn_disabled = false;
								
								toastEvents.emit('toast', {
									type:'success',
									message: response.data.message
								});

								this.loadLoginForm();

							}).catch((error) => {
								
								
								this.btn_disabled = false;
								let error_message = 'Unknown error';

								if(error.response){
									
									let status = error.response.status;
									
									if(status === 422){
										error_message = error.response.data.message;
									}
									
									if(error.response.data.validity == 'reset_code_expired'){
										this.$emit('show_forgot_password', true);
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

					}

				}else{
					this.btn_disabled = false;
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