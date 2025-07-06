<template>
  <div :data-theme="theme">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">

	import { useThemeOptions } from './stores/theme';

	export default{
		name : 'App',
		components : {
			
		},
		data: function(){
			return {
				
			}
		},
		methods : {

		},
		watch : {

		},
		computed: {
			theme() {
				return useThemeOptions().get_theme;
			}
		},
		mounted : function(){
			
		}

	}

</script>