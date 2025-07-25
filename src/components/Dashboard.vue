<template>
	<section class="main-content">
		<div class="card">Dashboard</div>
	</section>
</template>

<script lang="ts">


	import RedirectToLoginForNoTokens from '../mixins/RedirectToLoginForNoTokens';
	
	import { defineComponent } from 'vue';
	
	export default defineComponent({
		name : 'Dashboard',
		components : {
		},
		data: function(){
			return {

			}
		},
		methods : {
			
		},
		mixins: [RedirectToLoginForNoTokens],
		mounted : function(){
			
		}

	});

</script>