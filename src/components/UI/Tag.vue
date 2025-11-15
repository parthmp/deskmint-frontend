<template>
	<span :class="`${props.type}-tag`" class="block w-fit">
		<slot></slot>
	</span>
</template>

<style scoped>
	
	
</style>

<script lang="ts" setup>

	const props = defineProps({
		type : String
	});

</script>