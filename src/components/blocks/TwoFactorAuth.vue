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
				
					<input-button :disabled="btn_disabled" :icon="'IconCaretLeft'" @submit="loadLoginForm" btn_text="Back to Login"></input-button>
					<br>
					<p class="text-center">Please enter the OTP below.</p>
					
					<form @submit.prevent="validateOTP" class="form">
						<input-number ref="otpinput" placeholder="Enter OTP" :min="100000" :max="999999" v-model="entered_otp.value" :error="entered_otp.error" :required="true"  field_name="Enter OTP"></input-number>
						<input-button :disabled="btn_disabled" :icon="'IconLogin2'" btn_text="Login"></input-button>
					</form>
					<input-button :disabled="btn_disabled" :icon="'IconRepeat'" @submit="resendOTP" btn_text="Resend OTP"></input-button>
					
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

	export interface TwoFactorAuthInterFace{
		btn_disabled:boolean,
		entered_otp: object
	}

	export default defineComponent({
		name : 'TwoFactorAuth',
		components : {
			ThemeChanger,
			InputButton,
			Footer,
			InputNumber
		},
		data(): TwoFactorAuthInterFace {
			return {
				btn_disabled: false,
				entered_otp: {
					value: null,
					error: 'Please enter valid OTP'
				}
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
			}
		},
		methods : {

			validateOTP() : void{
				console.log('submitted');

				let validotp = this.$refs.otpinput.validate();

				if(validotp === true){
					this.entered_otp.error = '';
				}

			},

			loadLoginForm() : void{
				this.$emit('load_login_form', true);
			},

			resendOTP() : void{
				console.log('resend');
			}
			
		},
		mounted : function(){
			
			

		}

	});

</script>