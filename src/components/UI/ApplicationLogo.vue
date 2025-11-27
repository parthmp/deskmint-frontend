<template>
	<div class="deskmint-logo flex justify-center">
		<img v-if="theme_name=='light'" src="./../../assets/images/deskmit-logo.svg" alt="">
		<img v-if="theme_name=='dark'" src="./../../assets/images/deskmit-logo-white.svg" alt="">
	</div>
</template>

<script lang="ts">


	import { defineComponent } from 'vue';
	import { useThemeOptions } from '../../stores/theme';

	
	export default defineComponent({
		name : 'ApplicationLogo',
		components : {
		},
		data: function(){
			return {
				
			}
		},
		computed: {
			theme_name(): string { return useThemeOptions().get_theme ?? ''; }
		},
		methods : {
			setCurrentTheme() : void{
				const theme = useThemeOptions();
   			 	theme.set_theme(this.theme_name === 'light' ? 'dark' : 'light');
			}
		},
		mounted : function(){

			
		}

	});

</script>