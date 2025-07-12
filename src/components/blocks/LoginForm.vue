<template>
	
	<div class="container mx-auto! pl-[10px]! pr-[10px]!">
		<br>
		<br>
		<a href="javascript:;" @click="setCurrentTheme" class="absolute right-3 top-3">
			<icon-sun v-if="theme_name === 'light'" :size="32"></icon-sun>
			<icon-moon v-if="theme_name === 'dark'" :size="32"></icon-moon>
		</a>
	
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
							<vue-turnstile :site-key="turnstile_key" :key="theme_name" :theme="theme_name" v-model="turnstile_token" size="flexible"></vue-turnstile>
						</div>
						<div class="flex flex-row items-center mt-[5px]!">
							<a href="" class="underline">Forgot Password?</a>
							<label for="remember_me" class="grow">
								<span class="float-end">
									<input-checkbox ref="remember_me" v-model="remember_me"></input-checkbox>
								</span>
							</label>
							
						</div>
						<input-button :disabled="btn_disabled" :icon="'IconLogin2'"></input-button>
						
						
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

	import { IconSun, IconMoon } from '@tabler/icons-vue';
	import { useThemeOptions } from '../../stores/theme';
	
	import { toastEvents } from '../../events/toastEvents';

	import InputButton from '../inputs/InputButton.vue';
	import InputEmail from '../inputs/InputEmail.vue';
	import InputPassword from '../inputs/InputPassword.vue';
	import InputCheckbox from '../inputs/InputCheckbox.vue';

	import VueTurnstile from 'vue-turnstile';

	import { constants } from '../../constants';
	import common from '../../helpers/common';
	
	
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
		btn_disabled: boolean
	}

	export default defineComponent({
		name : 'Login',
		components : {
			IconSun,
			IconMoon,
			InputEmail,
			InputButton,
			InputPassword,
			VueTurnstile,
			InputCheckbox
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
				turnstile_key: constants.TURNSTILE_KEY,
				remember_me: false,
				submit: false,
				custom_error: '',
				btn_disabled : false
			}
		},
		computed: {
			theme_name(): string { return useThemeOptions().get_theme; }
		},
		watch:{
			"email_address.value"() : void{
				this.$refs.email_address.validate();
			},
			"password.value"() : void{
				this.$refs.password.validate();
			}
		},
		methods : {
			/*onFieldInput(meta:any) {
				
				if(meta.valid){
					console.log('validted');
					this.custom_error = 'your email is valid';
				}else{
					console.log('bad');
					this.custom_error = 'your email is NOT valid';
				}
      
    		}
			,*/

			

			is_email(email_add:string) : boolean{
				return common.is_email(email_add);
			},

			setCurrentTheme() : void{

				const theme = useThemeOptions();
   			 	theme.set_theme(this.theme_name === 'light' ? 'dark' : 'light');
				
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
						let that = this;


						
						


/*
axios.get('http://localhost:8000/sanctum/csrf-cookie').then((res) => {
	var token = decodeURIComponent(common.getCookie('XSRF-TOKEN')); 
	alert(token);
  axios.post('http://localhost:8000/api/some/thing', {
    email_address: 'test@example.com',
    password: 'dummy'
  },{
	headers: {
      'X-XSRF-TOKEN': token,
      'Accept': 'application/json',
    }
  }).then((res2) => {
	console.log('✅ Success:', res2.data);
  });
}).then(res => {
	
  
}).catch(err => {
  console.error('❌ Failed:', err.response?.status, err.response?.data);
});*/

						console.log(constants.CSRF_URL);
						console.log(constants.APIURL);
						axios.defaults.withCredentials = true;
						axios.get(constants.CSRF_URL).then(response => {

							var token = decodeURIComponent(common.getCookie('XSRF-TOKEN')); 
							
							axios.post(constants.APIURL+'some/thing', {
									email_address: that.email_address.value,
									password: that.password.value,
									turnstile_token: that.turnstile_token
								}, {
									headers: {
										'X-XSRF-TOKEN': token,
										'Accept': 'application/json',
									}
							}).then(function(response){
								console.log('response start');
								console.log(response);
								console.log('response end');
								that.btn_disabled = false;
							}).catch(function(error){
								console.log('error start');
								console.log(error);
								console.log('error end');
								that.btn_disabled = false;
							});

						}).then(function(){
							
						});
			

					}else{
						this.btn_disabled = false;
					}
				}

				



			
				
				
				
			}
		}

	});

</script>