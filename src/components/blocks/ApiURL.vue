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
					<div class="deskmint-logo flex justify-center">
						<img v-if="theme_name=='light'" src="./../../assets/images/deskmit-logo.svg" alt="">
						<img v-if="theme_name=='dark'" src="./../../assets/images/deskmit-logo-white.svg" alt="">
					</div>
					<br>
					
					<h3>Welcome to DeskMint! 👋</h3>
					<p>Please enter backend URL to connect to the API</p>
					<p class="text-red-400!">Warning: DO NOT run API over http://, you must run API over https://</p>
					<br>

					<form @submit.prevent="saveApiURL" class="form">
						
						<InputURL :required="true" ref="inputurl" v-model="input_url"></InputURL>
						
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

	import { IconSun, IconMoon } from '@tabler/icons-vue';

	import InputURL from '../inputs/InputURL.vue';
	import InputButton from '../inputs/InputButton.vue';
	
	import axios from 'axios';
	import { constants } from '../../constants';
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
			InputURL
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
				
				if(true){
					let entered_url = common.removeTrailingSlash(this.input_url);
					entered_url = entered_url+'/';
					
					axios.post(entered_url+constants.APIURL_POSTFIX+'handshake', {
						handshake: true
					}).then((response) => {
						if(response.data.required_client_version === constants.BUILD){

							common.setBaseUrl(entered_url);
							this.btn_disabled = false;
							this.$emit('base_url_set', false);

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
							message: JSON.stringify(error)
						});
					});
					
				}else{
					this.btn_disabled = false;
				}

			}
		}	


	});


</script>