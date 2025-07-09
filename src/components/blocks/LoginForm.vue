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

					<form @submit.prevent="login" ref="blaform">
						<input-email v-model="email_address" field="Email Address" :required="true" @is-valid="validated_email = $event"></input-email>
						<input-password v-model="password" field="Password" :required="true" @is-valid="validated_password = $event"></input-password>
						<div class="form-group">
							<vue-turnstile :site-key="turnstile_key" :key="theme_name" :theme="theme_name" v-model="turnstile_token" size="flexible"></vue-turnstile>
						</div>
						<div class="form-group">
							<button>Submit</button>
						</div>
						
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
	import InputEmail from './../inputs/InputEmail.vue';
	import InputPassword from '../inputs/InputPassword.vue';

	import VueTurnstile from 'vue-turnstile';

	import { constants } from '../../constants';
	
	import { defineComponent } from 'vue';

	export interface myData{
		email_address: string,
		password: string,
		custom_error: string,
		validated_email: boolean,
		validated_password: boolean,
		error_trigger:number,
		turnstile_token:string
		turnstile_key:string
	}

	export default defineComponent({
		name : 'Login',
		components : {
			IconSun,
			IconMoon,
			InputEmail,
			InputPassword,
			VueTurnstile
		},
		data():myData
		{
			return {
				email_address: '',
				password: '',
				custom_error: 'Invalid email',
				validated_email: false,
				validated_password: false,
				error_trigger:0,
				turnstile_token:'',
				turnstile_key: constants.TURNSTILE_KEY
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

			setCurrentTheme() : void{

				const theme = useThemeOptions();
   			 	theme.set_theme(this.theme_name === 'light' ? 'dark' : 'light');
				
			},
			
			get_email_address(e:string) : void {
				this.email_address = e;
				console.log('==='+this.email_address+'===');
			},

			login() : void{

				
				/*setTimeout(() => {
					
					if(this.temp % 2 === 0){
						this.error_trigger++;
						this.custom_error = 'Email already exists.';
						this.temp += 1;
						console.log('temp=='+this.temp);
					}else{
						console.log('works');
						console.log(this.validated_email);
					}
					
					

				}, 200);*/

				console.log('this is test');
				console.log('email: '+this.validated_email);
				console.log('token: '+this.turnstile_token);
				console.log('pass: '+this.validated_password);
		
				
			}
		},
		mounted : function(){
			//this.$refs.blaform.setFieldError('email', 'dare?');
			
		}

	});

</script>