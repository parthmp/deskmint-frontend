<template>
	<section class="main-content">
		<login-form></login-form>
	</section>
</template>

<script lang="ts">

	import LoginForm from './blocks/LoginForm.vue';

	
	import { defineComponent } from 'vue';

	export default defineComponent({
		name : 'Login',
		components : {
			LoginForm
		},
		data: function(){
			return {
				show_api_box: false
			}
		},
		methods : {
			
		},
		mounted : function(){
			
			

		}

	});

</script>