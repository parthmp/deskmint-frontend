<template>
	
	<div class="container mx-auto!">
		<br>
		<br>
		<a href="javascript:;" @click="setCurrentTheme()" class="absolute right-5 top-5">
			<icon-sun :size="36"></icon-sun>
			<icon-moon :size="36"></icon-moon>
		</a>
		<div class="grid grid-cols-12">
			<div class="col-span-12 lg:col-span-4"></div>
			<div class="col-span-12 lg:col-span-4">
				<div class="card p-12!">
					<div class="deskmint-logo flex justify-center">
						<img src="./../../assets//images/deskmit-logo.svg" alt="">
					</div>
					<br>
					
					<h3>Welcome to DeskMint! 👋</h3>
					<p>Please login to your account to manage your firm.</p>
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

	export default{
		name : 'Login',
		components : {
			IconSun,
			IconMoon
		},
		data: function(){
			return {
				theme_name : 'light',
				system_theme_name : 'light',
				theme_icon : 'IconSun',
				current_theme_name: 'light'
			}
		},
		methods : {
			setCurrentTheme : function(){
			
				if(theme_name == 'system'){
					this.current_theme_name = this.system_theme_name;
					
				}else{
					this.current_theme_name = theme_name;
				}

				if(this.current_theme_name == 'dark'){
					this.theme_icon = 'IconMoon';
				}else{
					this.theme_icon = 'IconSun';
				}
			
			}
		},
		mounted : function(){

		}

	}

</script>