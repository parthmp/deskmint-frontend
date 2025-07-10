<template>
	<div class="form-group">
		<button class="flex flex-col items-center w-full bg-deskmint-original-dark hover:hover:bg-deskmint-original-dark-plus shadow-lg p-[8px] px-[30px]  m-auto active:scale-[0.97] text-white rounded-[5px] cursor-pointer transition-all duration-300">
  		<span class="flex gap-1 items-center"><component is="IconSend" :size="17"></component>&nbsp;Login</span>
  		<IconRotateClockwise v-if="false" class="animate-spin" :size="30"></IconRotateClockwise>
</button>
	</div>
</template>

<style>

</style>

<script lang="ts">

	import { IconRotateClockwise, IconSend } from '@tabler/icons-vue';

	import { defineComponent } from 'vue';

	export default defineComponent({

		name : 'InputButton',

		props : ['full_width'],

		data() : any {
			return {};
		},

		components: {
			IconRotateClockwise,
			IconSend
		},

		methods: {

		}

	});

</script>