<template>
  <div :data-theme="theme">
	
    <router-view></router-view>
  </div>
</template>

<script lang="ts">

	import { useThemeOptions } from './stores/theme';
	
	import { useToast } from 'vue-toastification';
	import { toastEvents } from './events/toastEvents';

	export default{
		name : 'App',
		components : {
			
		},
		data: function(){
			return {
				toast:useToast()
			}
		},
		methods : {
			handleToast(payload:any) {
				this.toast[payload.type](payload.message, {
					toastClassName: "my-custom-toast-class"
				});
			}
		},
		watch : {
			
		},
		computed: {
			theme() {
				return useThemeOptions().get_theme;
			}
		},
		created(){
			toastEvents.on('toast', this.handleToast);
		},
		beforeUnmount(){
			toastEvents.off('toast', this.handleToast);
		},
		mounted : function(){
			

		}

	}

</script>