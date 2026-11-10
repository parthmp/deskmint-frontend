<template>
	<section class="main-content">
    	<div class="card">
			<div>
				<h1 class="text-2xl!">Invoice refund</h1>
				<BackButton></BackButton>
				<div v-if="!data.loading">
					<p>test here!</p>
				</div>
				
				
			</div>
		</div>
	</section>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';
import BackButton from '../blocks/BackButton.vue';


const data = reactive({
	loading : false
});

</script>