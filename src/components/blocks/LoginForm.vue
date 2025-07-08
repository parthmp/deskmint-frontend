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

					<form @submit.prevent="login">
						<input-email @email-input="get_email_address" :required="false"></input-email>
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

	import { defineComponent } from 'vue';

	export interface myData{
		email_address: string
	}

	export default defineComponent({
		name : 'Login',
		components : {
			IconSun : IconSun,
			IconMoon : IconMoon,
			InputEmail : InputEmail
		},
		data():myData
		{
			return {
				email_address: ''
			}
		},
		computed: {
			theme_name(): string { return useThemeOptions().get_theme; }
		},
		methods : {
			setCurrentTheme() : void{

				const theme = useThemeOptions();
   			 	theme.set_theme(this.theme_name === 'light' ? 'dark' : 'light');
				
				
			},
			get_email_address(e:string) : void {
				this.email_address = e;
				console.log('==='+this.email_address+'===');
			},

			login() : void{
				console.log('form submitted');
			}
		},
		mounted : function(){
			
		}

	});

</script>