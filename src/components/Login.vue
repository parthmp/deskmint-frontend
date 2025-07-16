<template>
	<section class="main-content">
		<login-form v-if="!show_two_factor_auth" @two_factor_auth_event="handle2FA"></login-form>
		<two-factor-auth v-if="show_two_factor_auth" @load_login_form="show_two_factor_auth = false"></two-factor-auth>
	</section>
</template>

<script lang="ts">

	import LoginForm from './blocks/LoginForm.vue';

	import TwoFactorAuth from './blocks/TwoFactorAuth.vue';

	
	import { defineComponent } from 'vue';

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
				console.log(obj);
			}
		},
		mounted : function(){

			this.tfa_token = '';

		}

	});

</script>