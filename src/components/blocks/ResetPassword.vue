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
					<p class="text-center">Please enter password reset code below from sent email and the new password to reset the password for your account.</p>
					
					<form @submit.prevent="changePassword" class="form">
						
						<input-password></input-password>
						<input-password label="Retype Password"></input-password>
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
	
	import InputPassword from '../inputs/InputPassword.vue';
	import Footer from './Footer.vue';

	import { env } from '../../env';
	
	import { toastEvents } from '../../events/toastEvents';
	import common from '../../helpers/common';
	import axios from 'axios';

	export interface ForgotPasswordBlockInterface{
		email_address:object,
		btn_disabled:boolean
	}

	export default defineComponent({
		name : 'ForgotPassword',
		components : {
			ThemeChanger,
			InputButton,
			InputPassword,
			Footer
		},
		data() : ForgotPasswordBlockInterface{
			return {
				email_address: {
					value: '',
					error: ''
				},
				btn_disabled: false
			}
		},
		watch: {
			
		},
		computed: {
			theme_name() : string{
				return useThemeOptions().get_theme;
			}
		},
		methods : {
			
			changePassword() : void{

			},
			

			loadLoginForm() : void{
				this.$router.push('/');
			}
		},
		mounted : function(){

		}

	});

</script>