<template>
	
	<div class="container mx-auto!">
		<br>
		<br>
		<a href="javascript:;" @click="setCurrentTheme" class="absolute right-3 top-3">
			<icon-sun v-if="theme_name === 'light'" :size="32"></icon-sun>
			<icon-moon v-if="theme_name === 'dark'" :size="32"></icon-moon>
		</a>
		<div class="grid grid-cols-12">
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
						<!--<input-email v-model="email_address" field="Email Address" :required="true" :show_errors="show_errors" @is-valid="validated_email = $event"></input-email>
						<input-password v-model="password" field="Password" :required="true" :show_errors="show_errors" @is-valid="validated_password = $event"></input-password>-->
						<!--<div class="form-group">
							<label for="email">Email Address</label>
							<input type="email" v-model="email_address" class="form-control" id="email" :class="{'red-input-order':(email_address.trim() == '' || !is_email(email_address)) && submit}">
							<span v-if="(email_address.trim() == '' || !is_email(email_address)) && submit" class="text-red-500! text-[14px]! block">Please enter valid email address</span>
						</div>-->
						<input-email v-model="email_address.value" :required="true" :error="email_address.error" ref="email_address"></input-email>
						<input-password v-model="password.value" :required="true" :error="password.error" ref="password"></input-password>
						
	
						<div class="form-group">
							<!--<vue-turnstile :site-key="turnstile_key" :key="theme_name" :theme="theme_name" v-model="turnstile_token" size="flexible"></vue-turnstile>-->
						</div>
						<div class="flex flex-row items-center mt-[5px]!">
							<a href="" class="underline">Forgot Password?</a>
							<label for="remember_me" class="grow">
								<span class="float-end">
									<input-checkbox ref="remember_me" v-model="remember_me"></input-checkbox>
								</span>
							</label>
							
						</div>
						<input-button></input-button>
						
						
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
	
	import InputButton from '../inputs/InputButton.vue';
	import InputEmail from '../inputs/InputEmail.vue';
	import InputPassword from '../inputs/InputPassword.vue';
	import InputCheckbox from '../inputs/InputCheckbox.vue';

	import VueTurnstile from 'vue-turnstile';

	import { constants } from '../../constants';
	import common from '../../helpers/common';
	
	import { defineComponent } from 'vue';

	export interface myData{
		email_address: any,
		password: any,
		
		turnstile_token:string
		turnstile_key:string,
		remember_me:boolean,
		submit:boolean,
		custom_error: string
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
				custom_error: ''
			}
		},
		computed: {
			theme_name(): string { return useThemeOptions().get_theme; }
		},
		watch:{
			/*"email_address.value"() : void{
				this.$refs.email_address.validate();
			}*/
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

				let check_valid = this.$refs.remember_me.validate();
				this.$refs.email_address.validate();
				this.$refs.password.validate();
				console.log(check_valid+'  validated bacsed on required');
				console.log(this.remember_me+' CHK Value');
				//this.error_trigger += 1;
				/*let temp2 = this.$refs.email_address.validate();
				let temp2_pass = this.$refs.password.validate();
				if(!temp2){
					this.email_address.error = '';
				}
				
				setTimeout(() => {
					
					if(temp2){
						//this.email_address.error = 'Email already exists.';
					}
				}, 1000);
				console.log(this.email_address.value+" VAL ==");
				console.log(this.password.value+" VAL pass ==");
				console.log(temp2+" TEMP2 ==");
				console.log(temp2_pass+" TEMP2 pass ==");*/
				//console.log(this.email_address);
				/*
				setTimeout(() => {
					console.log(this.email_address);
				}, 100);*/
				//this.submit = true;
				//console.log(this.email_address.valid);
				
				
				
			}
		}

	});

</script>