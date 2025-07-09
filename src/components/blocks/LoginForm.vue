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
						<div class="form-group">
							<label for="email">Email Address</label>
							<input type="email" v-model="email_address" class="form-control" id="email" :class="{'red-input-order':(email_address.trim() == '' || !is_email(email_address)) && submit}">
							<span v-if="(email_address.trim() == '' || !is_email(email_address)) && submit" class="text-red-500! text-[14px]! block">Please enter valid email address</span>
						</div>
						<div class="form-group">
							<label for="password">Password</label>
							
							<div class="relative">
								<input :type="password.input_type" v-model="password.value" class="form-control" id="password" :class="{'red-input-order':(password.value == '' || password.value.length < 8) && submit}">
								
								<span class="absolute right-2 top-[20%]">
									<icon-eye v-if="password.input_type == 'text'" @click="password.input_type = 'password'" class="cursor-pointer"></icon-eye>
									<icon-eye-closed v-if="password.input_type == 'password'" @click="password.input_type = 'text'" class="cursor-pointer"></icon-eye-closed>
								</span>
								
							</div>
							<span v-if="(password.value == '' || password.value.length < 8) && submit" class="text-red-500! text-[14px]! block">Password must be at least 8 characters long</span>
						</div>
	
						<div class="form-group">
							<!--<vue-turnstile :site-key="turnstile_key" :key="theme_name" :theme="theme_name" v-model="turnstile_token" size="flexible"></vue-turnstile>-->
						</div>
						<div class="flex flex-row items-center mt-[5px]!">
							<a href="" class="underline">Forgot Password?</a>
							<label for="remember_me" class="grow">
								<span class="float-end">
									<span class="flex items-center gap-2">
										<div class="checkbox-wrapper">
											<label>
												<input type="checkbox" v-model="remember_me" id="checkbox" />
												<span class="checkbox"></span>
											</label>
										</div>
										<label for="checkbox">Remember me</label>
									</span>
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
	
	import { IconEyeClosed, IconEye } from '@tabler/icons-vue';

	import VueTurnstile from 'vue-turnstile';

	import { constants } from '../../constants';
	import common from '../../helpers/common';
	
	import { defineComponent } from 'vue';

	export interface myData{
		email_address: string,
		password: any,
		
		turnstile_token:string
		turnstile_key:string,
		
		remember_me:boolean,
		submit:boolean
	}

	export default defineComponent({
		name : 'Login',
		components : {
			IconSun,
			IconMoon,
			
			InputButton,
			
			VueTurnstile,
			IconEyeClosed,
			IconEye
		},
		data():myData
		{
			return {
				email_address: '',
				password: {
					input_type: 'password',
					value:''
				},
				
				turnstile_token:'',
				turnstile_key: constants.TURNSTILE_KEY,
				remember_me: false,
				submit: false
			}
		},
		computed: {
			theme_name(): string { return useThemeOptions().get_theme; }
		},
		watch:{},
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
			
			get_email_address(e:string) : void {
				this.email_address = e;
				console.log('==='+this.email_address+'===');
			},

			login() : void{

				
				this.submit = true;
				console.log(this.remember_me);
				
			}
		}

	});

</script>