<template>
	<div class="form-group">
		<button class="text-white cursor-pointer text-base text-center font-bold 
 outline-none border-none transition-all duration-300 ease-linear relative z-0 
 bg-gradient-to-r from-deskmint-green-dark to-deskmint-green rounded-[5px] hover:after:w-full after:content-[''] after:absolute 
 after:z-[-1] after:transition-all after:duration-300 after:ease-linear after:right-0 
 after:top-0 after:w-0 after:h-full after:rounded-[5px] p-[15px] hover:shadow-lg w-full flex flex-col items-center"
>
  Login
  <IconRotateClockwise class="animate-spin" :size="30"></IconRotateClockwise>
</button>
	</div>
</template>

<script lang="ts">

	import { IconRotateClockwise } from '@tabler/icons-vue';

	import { defineComponent } from 'vue';

	export default defineComponent({

		name : 'InputButton',

		props : ['full_width'],

		data() : any {
			return {};
		},

		components: {
			IconRotateClockwise
		},

		methods: {

		}

	});

</script>