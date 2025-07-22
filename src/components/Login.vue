<template>
	<section class="main-content">
		<login-form v-if="!show_two_factor_auth" @two_factor_auth_event="handle2FA"></login-form>
		<two-factor-auth v-if="show_two_factor_auth" @load_login_form="show_two_factor_auth = false" :token="tfa_token"></two-factor-auth>
	</section>
</template>

<script lang="ts">

	import LoginForm from './blocks/LoginForm.vue';

	import TwoFactorAuth from './blocks/TwoFactorAuth.vue';

	import { getAccessToken, getRefreshToken } from '../services/TokenService';

	import TokenRedirections from '../mixins/TokenRedirections';

	
	import { defineComponent } from 'vue';
	import common from '../helpers/common';

	export default defineComponent({
		name : 'Login',
		components : {
			LoginForm,
			TwoFactorAuth
		},
		data: function(){
			return {
				show_two_factor_auth: false,
				tfa_token : ''
			}
		},
		methods : {
			handle2FA(obj:any) : void{
				this.show_two_factor_auth = true;
				this.tfa_token = obj.token;
			}
		},
		mixins: [TokenRedirections],
		mounted : function(){

			this.tfa_token = '';

			
				
			
				
			

		}

	});

</script>