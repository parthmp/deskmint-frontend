<template>
	<section class="main-content">
		<login-form v-if="!show_api_box"></login-form>
		<ApiURL v-if="show_api_box" @base_url_set="handle_show"></ApiURL>
		<!--<p>base url: {{ burl }}</p>-->
	</section>
</template>

<script lang="ts">

	import LoginForm from './blocks/LoginForm.vue';
	import ApiURL from './blocks/ApiURL.vue';

	import common from '../helpers/common';
	import { defineComponent } from 'vue';

	export default defineComponent({
		name : 'Login',
		components : {
			LoginForm,
			ApiURL
		},
		data: function(){
			return {
				show_api_box: false
			}
		},
		methods : {
			handle_show(show_bool:boolean) : void{
				this.show_api_box = show_bool;
			}
		},
		mounted : function(){
			
			/* lets check if URL is set or not */
			let that = this;
			common.fetchBaseUrl(function(base_url:string){
				if(base_url === ''){
					that.show_api_box = true;
				}
			});

		}

	});

</script>