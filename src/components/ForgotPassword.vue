<template>
	<section class="main-content">
		<forgot-password-block v-if="show_forgot_password"></forgot-password-block>
		<reset-password v-if="!show_forgot_password"></reset-password>
	</section>
</template>

<script lang="ts">

	import ForgotPasswordBlock from './blocks/ForgotPasswordBlock.vue';
	import ResetPassword from './blocks/ResetPassword.vue';

	
	import { defineComponent } from 'vue';

	export default defineComponent({
		name : 'Login',
		components : {
			ForgotPasswordBlock,
			ResetPassword
		},
		data: function(){
			return {
				show_forgot_password: false
			}
		},
		methods : {

		},
		mounted : function(){

		}

	});

</script>