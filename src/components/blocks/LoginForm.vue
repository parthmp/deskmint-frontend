<template>
	
	<div class="container mx-auto!">
		<br>
		<br>
		<a href="javascript:;" @click="setCurrentTheme()" class="absolute right-3 top-3">
			<icon-sun v-if="theme_name == 'light'" :size="32"></icon-sun>
			<icon-moon v-if="theme_name == 'dark'" :size="32"></icon-moon>
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

					<form action="javascript:;" method="POST">
						<input-email @email-input="get_email_address" default_value="44"></input-email>
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

	export default{
		name : 'Login',
		components : {
			IconSun,
			IconMoon,
			InputEmail
		},
		data: function(){
			return {
				system_theme_name : 'light',
				theme_icon : 'IconSun',
				current_theme_name: 'light',
				email_address: ''
			}
		},
		computed: {
			theme_name: () => { return useThemeOptions().get_theme; }
		},
		methods : {
			setCurrentTheme : function(){

				if(this.theme_name == 'light'){
					useThemeOptions().set_theme('dark');
				}else{
					useThemeOptions().set_theme('light');
				}
				
				
			},
			get_email_address : function(e:string){
				this.email_address = e;
			}
		},
		mounted : function(){
			
		}

	}

</script>