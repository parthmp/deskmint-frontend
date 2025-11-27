<template>
	<span>
		<a href="javascript:;" @click="setCurrentTheme" class="absolute right-3 top-3">
			<icon-sun v-if="theme_name === 'light'" :size="32"></icon-sun>
			<icon-moon v-if="theme_name === 'dark'" :size="32"></icon-moon>
		</a>
	</span>
</template>

<script lang="ts">


	import { defineComponent } from 'vue';
	import { useThemeOptions } from '../../stores/theme';

	import { IconSun, IconMoon } from '@tabler/icons-vue';

	export default defineComponent({
		name : 'ThemeChanger',
		components : {
			IconSun,
			IconMoon
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