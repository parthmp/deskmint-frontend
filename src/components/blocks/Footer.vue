<template>
	<footer class="global-footer">
		<p class="font-medium!">DeskMint is a source available software</p>
		<p class="flex items-center justify-center font-medium!">Made with&nbsp;<IconHeartFilled class="text-red-500" :size="22"></IconHeartFilled>&nbsp;by&nbsp;<a href="https://parthparmar.dev" target="_blank" class="underline">Parth Parmar</a></p>
	</footer>
</template>

<script lang="ts">

	import { defineComponent } from 'vue';

	import { IconHeartFilled } from '@tabler/icons-vue';

	export default defineComponent({

		name: 'Footer',

		components: {
			IconHeartFilled
		}

	});

</script>