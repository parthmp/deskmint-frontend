<template>
	<section class="main-content">
    <div class="card">
        <h1 class="text-2xl!">Admins</h1>
        <br>
        
        <div class="overflow-x-auto w-full">
            
        </div>
    </div>
	<br>
	<div class="card">
		Test card
	</div>
</section>
</template>
<style scoped>

</style>
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