<template>
	<section class="main-content">
	
		<div class="card">
			<h1 class="text-2xl!">Admins</h1>

			<br>
			<p>test</p>

		</div>
		
	</section>
</template>

<script lang="ts">


	import RedirectToLoginForNoTokens from '../mixins/RedirectToLoginForNoTokens';
	
	import { defineComponent } from 'vue';
	
	export default defineComponent({
		name : 'Admins',
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