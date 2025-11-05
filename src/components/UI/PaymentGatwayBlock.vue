<template>
	<div class="col-span-12 lg:col-span-3 bg-deskmint-cyan-light rounded-lg shadow-lg">
		<div class="payment-gateway-block p-10 flex flex-col justify-between h-full">
			<img :src="props.image" class="max-h-[150px] w-auto m-auto" alt="">
			<br>
			<br>
			<input-button label="Setup" :url="props.url" icon="IconRocket"></input-button>
		</div>
		
	</div>
</template>

<script lang="ts" setup>

	import InputButton from '../inputs/InputButton.vue';

	const props = defineProps(['image', 'url']);

</script>