<template>
	<section class="main-content">
		<p>Clients page</p>
	</section>
</template>

<script lang="ts">


	import RedirectToLoginForNoTokens from '../mixins/RedirectToLoginForNoTokens';
	
	import { defineComponent } from 'vue';
	
	export default defineComponent({
		name : 'Clients',
		components : {
		},
		data: function(){
			return {
				show_two_factor_auth: false,
				tfa_token : ''
			}
		},
		methods : {
			
		},
		mixins: [RedirectToLoginForNoTokens],
		mounted : function(){
			
		}

	});

</script>