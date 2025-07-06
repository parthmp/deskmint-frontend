<template>
	<section class="main-content">
		<login-form></login-form>
	</section>
</template>

<script lang="ts">

	import LoginForm from './blocks/LoginForm.vue';

	export default{
		name : 'Login',
		components : {
			LoginForm
		},
		data: function(){
			return {

			}
		},
		methods : {

		},
		mounted : function(){

		}

	}

</script>