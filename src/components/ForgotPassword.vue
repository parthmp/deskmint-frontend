<template>
	<section class="main-content">
		<forgot-password-block v-if="show_forgot_password" @show_forgot_password="handleForgotPassEventBlock"></forgot-password-block>
		<reset-password v-if="!show_forgot_password" @show_forgot_password="handleForgotPassEvent"></reset-password>
	</section>
</template>

<script lang="ts">

	import api from '../helpers/api';
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
				show_forgot_password: true
			}
		},
		methods : {
			handleForgotPassEvent(showme:boolean): void{
				this.show_forgot_password = showme;
			},
			handleForgotPassEventBlock(showme:boolean): void{
				this.show_forgot_password = showme;
			}
		},
		mounted : function(){
			
		}

	});

</script>