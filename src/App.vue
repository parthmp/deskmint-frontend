<template>
  <div :data-theme="theme">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">

	import { useThemeOptions } from './stores/theme';
	
	import { useToast } from 'vue-toastification';
	import { toastEvents } from './events/toastEvents';

	import { Capacitor } from '@capacitor/core';
	import { PushNotifications } from '@capacitor/push-notifications';
	import { Preferences } from '@capacitor/preferences';

	import { Device } from '@capacitor/device';


	export default{
		name : 'App',
		components : {
			
		},
		data: function(){
			return {
				toast:useToast(),
				device_id: ''
			}
		},
		methods : {
			handleToast(payload:any) {
				this.toast[payload.type](payload.message, {
					toastClassName: "my-custom-toast-class"
				});
			},

			getFCMToken : function(){
				
				if(Capacitor.getPlatform() !== 'web'){

					PushNotifications.requestPermissions().then(result => {
						if (result.receive === 'granted') {
							PushNotifications.register();
						}
					});
					
					PushNotifications.addListener('registration', (token) => {
						Preferences.set({ key: 'android_token', value: token.value });
					});
					
				}else{
					Preferences.set({ key: 'android_token', value: 'web' });
				}

			},
			updateTheme(event): void{
				if(event.matches === true){
					useThemeOptions().set_theme('dark');
				}else{
					useThemeOptions().set_theme('light');
				}
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
			this.getFCMToken();
		},
		beforeUnmount(){
			toastEvents.off('toast', this.handleToast);
		},
		mounted : async function(){
			const info = await JSON.stringify(Device.getInfo());
			this.device_id = (await Device.getId()).identifier;

			const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
			mediaQuery.addEventListener('change', this.updateTheme);
			
			if(mediaQuery.matches === true && this.theme === null){
				useThemeOptions().set_theme('dark');
			}else if(mediaQuery.matches === false && this.theme === null){
				useThemeOptions().set_theme('light');
			}
			
			
		}

	}

</script>