<template>
	<div class="container mx-auto! pl-[10px]! pr-[10px]!">
		
		<br>
		<a href="javascript:;" @click="setCurrentTheme" class="absolute right-3 top-3">
			<icon-sun v-if="theme_name === 'light'" :size="32"></icon-sun>
			<icon-moon v-if="theme_name === 'dark'" :size="32"></icon-moon>
		</a>
		<br>
		
		<div class="grid grid-cols-12 mt-[15px]!">
			<div class="col-span-12 lg:col-span-4"></div>
			<div class="col-span-12 lg:col-span-4">
				<div class="card p-12!">
					<application-logo></application-logo>
					<br>
					
					<h3>Welcome to DeskMint! 👋</h3>
					<p>Please enter backend URL to connect to the API</p>
					<p class="text-red-400!">Note: You must run API over https://</p>
					<br>

					<form @submit.prevent="saveApiURL" class="form">
						
						<InputURL :required="true" ref="inputurl" v-model="input_url" :allow_http="true"></InputURL>
						
						<input-button :disabled="btn_disabled" :icon="'IconLink'" btn_text="Set URL"></input-button>
						
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

	import { defineComponent } from 'vue';
	import { useThemeOptions } from '../../stores/theme';

	import ApplicationLogo from '../UI/ApplicationLogo.vue';

	import { IconSun, IconMoon } from '@tabler/icons-vue';

	import InputURL from '../inputs/InputURL.vue';
	import InputButton from '../inputs/InputButton.vue';
	
	import axios from 'axios';
	import { env } from '../../env';
	import common from '../../helpers/common';

	import { toastEvents } from '../../events/toastEvents';

	export interface ApiURLInterface{
		input_url: string,
		btn_disabled: boolean
	}

	export default defineComponent({

		name: 'ApiURL',

		data(): ApiURLInterface {
			return {
				input_url: '',
				btn_disabled: false
			}
		},

		components:{
			IconSun,
			IconMoon,
			InputButton,
			InputURL,
			ApplicationLogo
		},

		computed : {
			
			theme_name(): string { return useThemeOptions().get_theme; }
		
		},

		watch: {
			input_url() : void{
				this.$refs.inputurl.validate();
			}
		},

		methods : {
			setCurrentTheme() : void{

				const theme = useThemeOptions();
   			 	theme.set_theme(this.theme_name === 'light' ? 'dark' : 'light');
				
			},

			saveApiURL() : void{
				this.btn_disabled = true;
				let valid_url = this.$refs.inputurl.validate();
				
				if(valid_url){
					let entered_url = common.removeTrailingSlash(this.input_url);
					entered_url = entered_url+'/';
					
					axios.post(entered_url+env.APIURL_POSTFIX+'handshake', {
						handshake: true
					}).then((response) => {
						
						if(response.data.required_client_version+'' === env.BUILD+''){

							common.setBaseUrl(entered_url);
							this.btn_disabled = false;
							this.$emit('base_url_set', false);
							toastEvents.emit('toast', {
								type: 'success',
								message: 'API URL has set successfully'
							});
						}else{
							this.btn_disabled = false;
							toastEvents.emit('toast', {
								type: 'error',
								message: 'Version mismatch: update your app'
							});
						}
					}).catch((error) => {
						this.btn_disabled = false;
						
						toastEvents.emit('toast', {
							type: 'error',
							message: 'Unable to connect, please check server configuration, URLs and SSL support'
						});
					});
					
				}else{
					this.btn_disabled = false;
				}

			}
		}	


	});


</script>